/* =====================================================================
   MickaCRM — AI Assistant (js/ai-assistant.js)
   Floating bubble + chat panel + Google Gemini API integration
   Rich responses: text, KPIs, tables, clickable record links
   Auto-initializing — just add <script src="js/ai-assistant.js"> to index.html
   ===================================================================== */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────
  var API_KEY = null;
  var MODEL = 'gemini-2.0-flash-lite';
  var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';

  // ── Load API Key ────────────────────────────────────────────────────
  // Priority: Firestore → sessionStorage → prompt
  async function loadApiKey() {
    // Option 1: Firestore  config/ai  { geminiKey: "AIzaSy..." }
    try {
      if (window.firebase && typeof firebase.firestore === 'function') {
        var db = firebase.firestore();
        var doc = await db.collection('config').doc('ai').get();
        if (doc.exists) {
          var data = doc.data();
          if (data.geminiKey) {
            API_KEY = data.geminiKey;
            console.log('[AI Assistant] Gemini key loaded from Firestore');
            return;
          }
        }
      }
    } catch (e) {
      console.warn('[AI Assistant] Firestore not available:', e.message);
    }

    // Option 2: sessionStorage
    var stored = sessionStorage.getItem('mickacrm_gemini_key');
    if (stored) {
      API_KEY = stored;
      console.log('[AI Assistant] Gemini key loaded from session');
    }
  }

  function promptForKey() {
    var key = prompt('Enter your Google Gemini API key to enable the AI Assistant:\n\nGet one free at: https://aistudio.google.com/apikey');
    if (key && key.trim().startsWith('AIza')) {
      API_KEY = key.trim();
      sessionStorage.setItem('mickacrm_gemini_key', API_KEY);
      return true;
    }
    return false;
  }

  // ── CRM Data Snapshot Builder ───────────────────────────────────────
  function buildDataSnapshot() {
    var D = window.DATA || {};
    var snap = {};
    var accMap = {};

    if (D.accounts) {
      snap.accounts = D.accounts.map(function (a) {
        accMap[a.id] = a.name;
        return { id: a.id, name: a.name, industry: a.industry, revenue: a.revenue, pipeline: a.pipeline, city: a.city, status: a.status, opps: a.opps };
      });
    }
    if (D.contacts) {
      snap.contacts = D.contacts.map(function (c) {
        return { id: c.id, name: c.name, role: c.role, account: accMap[c.account] || c.account, accountId: c.account, email: c.email, phone: c.phone };
      });
    }
    if (D.opportunities) {
      snap.opportunities = D.opportunities.map(function (o) {
        return { id: o.id, name: o.name, account: accMap[o.account] || o.account, accountId: o.account, stage: o.stage, amount: o.amount, prob: o.prob, close: o.close, projectId: o.projectId };
      });
    }
    if (D.leads) {
      snap.leads = D.leads.map(function (l) {
        return { id: l.id, name: l.name, company: l.company, stage: l.stage, source: l.source, title: l.title };
      });
    }
    if (D.projects) {
      snap.projects = D.projects.map(function (p) {
        return { id: p.id, name: p.name, account: accMap[p.accountId] || p.accountId, accountId: p.accountId, phase: p.phase, health: p.health, value: p.value, start: p.start, end: p.end };
      });
    }
    if (D.claims) {
      snap.claims = D.claims.map(function (cl) {
        return { id: cl.id, title: cl.title, status: cl.status, priority: cl.priority, risk: cl.risk, projectId: cl.projectId, impact: cl.impact };
      });
    }
    if (D.activities) {
      snap.activities = D.activities.slice(0, 25).map(function (a) {
        return { id: a.id, type: a.type, subject: a.subject, date: a.date, status: a.status, accountId: a.accountId, contactId: a.contactId };
      });
    }
    if (D.quotes) {
      snap.quotes = D.quotes.map(function (q) {
        return { id: q.id, name: q.name, status: q.status, total: q.total, accountId: q.accountId, oppId: q.oppId };
      });
    }

    return snap;
  }

  // ── System Prompt ───────────────────────────────────────────────────
  function getSystemPrompt(snapshot) {
    return 'You are the MickaCRM AI Assistant — a smart CRM copilot for the construction/BTP sector (Saint-Gobain).\n'
      + 'You have access to the user\'s CRM data below. Answer questions by analyzing this data.\n\n'
      + 'RESPONSE FORMAT: Always respond with ONLY valid JSON (no markdown fences, no preamble, no explanation outside JSON) with this structure:\n'
      + '{\n'
      + '  "text": "Your main response text. Use **bold** for emphasis.",\n'
      + '  "kpis": [{"label": "Label", "value": "Value", "color": "#hex"}],\n'
      + '  "table": {"headers": ["Col1","Col2"], "rows": [["val1","val2"]]},\n'
      + '  "links": [{"label": "Display Name", "objectType": "accounts|contacts|opportunities|leads|projects|claims|activities|quotes", "id": "record_id"}]\n'
      + '}\n\n'
      + 'Rules:\n'
      + '- "text" is always required. "kpis", "table", "links" are optional — include only when relevant.\n'
      + '- Use KPIs for aggregated metrics (totals, counts, averages). Max 4 KPIs.\n'
      + '- Use tables for lists of records (max 10 rows). Keep headers short.\n'
      + '- Use links for every record you mention so the user can click to navigate directly.\n'
      + '- Amounts: format with € and K/M suffixes (e.g. €850K, €1.2M, €45M).\n'
      + '- Dates: "MMM DD, YYYY" format.\n'
      + '- Be concise but thorough. If the data doesn\'t contain an answer, say so clearly.\n'
      + '- Respond in the SAME LANGUAGE the user writes in (English or French).\n'
      + '- Never invent data that isn\'t in the snapshot.\n'
      + '- objectType must match exactly: accounts, contacts, opportunities, leads, projects, claims, activities, quotes.\n'
      + '- id must match the exact record id from the data.\n'
      + '- IMPORTANT: Output ONLY the JSON object. No text before or after it.\n\n'
      + 'CRM DATA SNAPSHOT:\n'
      + JSON.stringify(snapshot);
  }

  // ── Models to try (fallback chain) ───────────────────────────────
  var MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  // ── Single API call ─────────────────────────────────────────────
  async function callGemini(model, body) {
    var url = API_URL + model + ':generateContent?key=' + API_KEY;
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res;
  }

  // ── Gemini API Call (with retry + model fallback) ───────────────
  async function askGemini(userMessage, history) {
    if (!API_KEY) {
      if (!promptForKey()) {
        return { text: 'API key is required to use the AI Assistant. Get one free at https://aistudio.google.com/apikey' };
      }
    }

    var snapshot = buildDataSnapshot();

    // Build Gemini conversation contents
    var contents = [];
    var recent = history.slice(-12);
    for (var i = 0; i < recent.length; i++) {
      var msg = recent[i];
      if (msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'model' && msg.rawText) {
        contents.push({ role: 'model', parts: [{ text: msg.rawText }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    var body = {
      system_instruction: { parts: [{ text: getSystemPrompt(snapshot) }] },
      contents: contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    };

    // Try each model, with retries on 429
    for (var m = 0; m < MODELS.length; m++) {
      var model = MODELS[m];
      for (var attempt = 0; attempt < 3; attempt++) {
        try {
          console.log('[AI Assistant] Trying ' + model + ' (attempt ' + (attempt + 1) + ')');
          var res = await callGemini(model, body);

          if (res.ok) {
            var data = await res.json();
            var raw = '';
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
              for (var j = 0; j < data.candidates[0].content.parts.length; j++) {
                if (data.candidates[0].content.parts[j].text) {
                  raw += data.candidates[0].content.parts[j].text;
                }
              }
            }
            if (!raw) {
              return { text: 'No response received. Please try rephrasing your question.' };
            }
            try {
              var cleaned = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
              var parsed = JSON.parse(cleaned);
              parsed.rawText = raw;
              return parsed;
            } catch (e) {
              return { text: raw, rawText: raw };
            }
          }

          if (res.status === 400) {
            var errText = await res.text();
            if (errText.indexOf('API_KEY') !== -1) {
              API_KEY = null;
              sessionStorage.removeItem('mickacrm_gemini_key');
              return { text: 'Invalid API key. Please reload and try again.' };
            }
          }

          if (res.status === 429) {
            console.warn('[AI Assistant] Rate limited on ' + model + ', waiting before retry...');
            // Wait 5s then retry, or move to next model on last attempt
            if (attempt < 2) {
              await new Promise(function (r) { setTimeout(r, 5000); });
            }
            continue;
          }

          // Other error — try next model
          console.warn('[AI Assistant] ' + model + ' returned HTTP ' + res.status);
          break;

        } catch (err) {
          console.error('[AI Assistant] Network error with ' + model + ':', err);
          break;
        }
      }
    }

    return { text: 'All models are currently rate-limited. This usually resolves within a few minutes — please try again shortly.' };
  }

  // ── Inject Styles ───────────────────────────────────────────────────
  function injectAIStyles() {
    if (document.getElementById('ai-assistant-styles')) return;
    var style = document.createElement('style');
    style.id = 'ai-assistant-styles';
    style.textContent = '\
.ai-bubble {\
  position: fixed; bottom: 24px; right: 24px;\
  width: 56px; height: 56px; border-radius: 16px;\
  background: linear-gradient(135deg, #2563eb, #1d4ed8);\
  border: none; color: #fff; cursor: pointer;\
  display: flex; align-items: center; justify-content: center;\
  box-shadow: 0 4px 20px rgba(37,99,235,0.35);\
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);\
  z-index: 10000;\
  animation: ai-pulse 3s ease-in-out infinite;\
}\
.ai-bubble:hover {\
  transform: scale(1.08);\
  box-shadow: 0 6px 28px rgba(37,99,235,0.5);\
}\
.ai-bubble.open {\
  background: linear-gradient(135deg, #64748b, #475569);\
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);\
  animation: none;\
}\
.ai-bubble svg {\
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);\
}\
.ai-bubble.open svg {\
  transform: rotate(90deg) scale(0.9);\
}\
@keyframes ai-pulse {\
  0% { box-shadow: 0 4px 20px rgba(37,99,235,0.3); }\
  50% { box-shadow: 0 4px 30px rgba(37,99,235,0.55), 0 0 0 8px rgba(37,99,235,0.1); }\
  100% { box-shadow: 0 4px 20px rgba(37,99,235,0.3); }\
}\
.ai-panel {\
  position: fixed; bottom: 90px; right: 24px;\
  width: 400px; height: 560px;\
  background: #f8f9fb;\
  border-radius: 20px;\
  box-shadow: 0 12px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);\
  display: none; flex-direction: column;\
  overflow: hidden;\
  font-family: "DM Sans", sans-serif;\
  z-index: 9999;\
}\
.ai-panel.visible {\
  display: flex;\
  animation: ai-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);\
}\
@keyframes ai-slideUp {\
  from { opacity: 0; transform: translateY(20px) scale(0.95); }\
  to { opacity: 1; transform: translateY(0) scale(1); }\
}\
@keyframes ai-fadeIn {\
  from { opacity: 0; transform: translateY(6px); }\
  to { opacity: 1; transform: translateY(0); }\
}\
.ai-header {\
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);\
  padding: 16px 18px;\
  display: flex; align-items: center; justify-content: space-between;\
  border-bottom: 1px solid rgba(255,255,255,0.06);\
  flex-shrink: 0;\
}\
.ai-header-left { display: flex; align-items: center; gap: 10px; }\
.ai-header-icon {\
  width: 34px; height: 34px; border-radius: 10px;\
  background: linear-gradient(135deg, #2563eb, #7c3aed);\
  display: flex; align-items: center; justify-content: center;\
  color: #fff; box-shadow: 0 2px 8px rgba(37,99,235,0.4);\
}\
.ai-header-icon svg { width: 18px; height: 18px; }\
.ai-header-title { color: #fff; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }\
.ai-header-sub { color: #94a3b8; font-size: 10px; font-weight: 500; }\
.ai-header-btn {\
  background: rgba(255,255,255,0.08); border: none; color: #94a3b8;\
  width: 30px; height: 30px; border-radius: 8px; cursor: pointer;\
  display: flex; align-items: center; justify-content: center;\
  transition: all 0.15s;\
}\
.ai-header-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }\
.ai-messages {\
  flex: 1; overflow-y: auto; padding: 16px 14px;\
  scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;\
}\
.ai-messages::-webkit-scrollbar { width: 5px; }\
.ai-messages::-webkit-scrollbar-track { background: transparent; }\
.ai-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }\
.ai-welcome { text-align: center; padding: 20px 10px 16px; animation: ai-fadeIn 0.4s ease; }\
.ai-welcome-icon {\
  width: 52px; height: 52px; border-radius: 14px; margin: 0 auto 12px;\
  background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08));\
  display: flex; align-items: center; justify-content: center;\
  color: #2563eb;\
}\
.ai-welcome-icon svg { width: 24px; height: 24px; }\
.ai-welcome h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 4px; }\
.ai-welcome p { font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; }\
.ai-suggestions { display: flex; flex-direction: column; gap: 6px; padding: 0 4px; }\
.ai-suggest-btn {\
  background: #fff; border: 1px solid #e2e8f0;\
  border-radius: 10px; padding: 9px 13px;\
  font-size: 12px; font-weight: 500; color: #475569;\
  cursor: pointer; text-align: left; transition: all 0.15s;\
  font-family: "DM Sans", sans-serif;\
  animation: ai-fadeIn 0.3s ease both;\
}\
.ai-suggest-btn:nth-child(1) { animation-delay: 0s; }\
.ai-suggest-btn:nth-child(2) { animation-delay: 0.05s; }\
.ai-suggest-btn:nth-child(3) { animation-delay: 0.1s; }\
.ai-suggest-btn:nth-child(4) { animation-delay: 0.15s; }\
.ai-suggest-btn:nth-child(5) { animation-delay: 0.2s; }\
.ai-suggest-btn:hover { border-color: #2563eb; color: #2563eb; background: #f8faff; }\
.ai-msg-user {\
  display: flex; justify-content: flex-end; margin-bottom: 12px;\
  animation: ai-fadeIn 0.25s ease;\
}\
.ai-msg-user-inner {\
  background: linear-gradient(135deg, #2563eb, #1d4ed8);\
  color: #fff; border-radius: 16px 16px 4px 16px;\
  padding: 10px 14px; max-width: 85%; font-size: 13px; font-weight: 500;\
  line-height: 1.5; box-shadow: 0 2px 8px rgba(37,99,235,0.25);\
  word-break: break-word;\
}\
.ai-msg-bot {\
  display: flex; justify-content: flex-start; margin-bottom: 12px;\
  animation: ai-fadeIn 0.25s ease;\
}\
.ai-msg-bot-inner {\
  background: #fff; border-radius: 16px 16px 16px 4px;\
  padding: 12px 14px; max-width: 92%; font-size: 13px;\
  line-height: 1.55; color: #334155;\
  box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9;\
  word-break: break-word;\
}\
.ai-msg-bot-inner strong { font-weight: 700; color: #1e293b; }\
.ai-kpis { display: grid; gap: 8px; margin: 10px 0; }\
.ai-kpi {\
  border-radius: 10px; padding: 10px 12px; text-align: center;\
}\
.ai-kpi-value { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }\
.ai-kpi-label {\
  font-size: 10px; font-weight: 600; color: #64748b;\
  text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px;\
}\
.ai-table-wrap {\
  margin: 10px 0; border-radius: 10px; overflow: hidden;\
  border: 1px solid #e2e8f0; overflow-x: auto;\
}\
.ai-table { width: 100%; border-collapse: collapse; font-size: 12px; }\
.ai-table th {\
  padding: 8px 10px; text-align: left; font-weight: 700;\
  color: #475569; font-size: 10px; text-transform: uppercase;\
  letter-spacing: 0.04em; background: #f8fafc;\
  border-bottom: 2px solid #e2e8f0; white-space: nowrap;\
}\
.ai-table td {\
  padding: 7px 10px; color: #334155; border-bottom: 1px solid #f1f5f9;\
}\
.ai-table tr:nth-child(even) td { background: #f8fafc; }\
.ai-table td:first-child { font-weight: 600; }\
.ai-links { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }\
.ai-link-chip {\
  display: inline-flex; align-items: center; gap: 4px;\
  background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;\
  border-radius: 7px; padding: 4px 10px; font-size: 11px; font-weight: 600;\
  cursor: pointer; transition: all 0.15s;\
  font-family: "DM Sans", sans-serif; border: 1px solid #bfdbfe;\
}\
.ai-link-chip:hover { background: #dbeafe; border-color: #93c5fd; }\
.ai-link-chip svg { flex-shrink: 0; }\
.ai-typing {\
  display: flex; justify-content: flex-start; margin-bottom: 12px;\
}\
.ai-typing-inner {\
  background: #fff; border-radius: 16px 16px 16px 4px;\
  padding: 12px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);\
  border: 1px solid #f1f5f9; display: flex; gap: 5px; align-items: center;\
}\
.ai-typing-dot {\
  width: 7px; height: 7px; border-radius: 50%; background: #94a3b8;\
  animation: ai-bounce 1.2s ease-in-out infinite;\
}\
.ai-typing-dot:nth-child(2) { animation-delay: 0.15s; }\
.ai-typing-dot:nth-child(3) { animation-delay: 0.3s; }\
@keyframes ai-bounce {\
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }\
  30% { transform: translateY(-5px); opacity: 1; }\
}\
.ai-input-area {\
  padding: 12px 14px 14px;\
  border-top: 1px solid #e8eaed;\
  background: #fff;\
  flex-shrink: 0;\
}\
.ai-input-row {\
  display: flex; align-items: center; gap: 8px;\
  background: #f8f9fb; border-radius: 12px;\
  padding: 4px 4px 4px 14px;\
  border: 1px solid #e2e8f0;\
  transition: border-color 0.2s;\
}\
.ai-input-row:focus-within { border-color: #2563eb; }\
.ai-input {\
  flex: 1; border: none; outline: none; background: transparent;\
  font-size: 13px; font-weight: 500; color: #1e293b;\
  font-family: "DM Sans", sans-serif;\
  min-width: 0;\
}\
.ai-input::placeholder { color: #94a3b8; }\
.ai-send-btn {\
  width: 34px; height: 34px; border-radius: 10px;\
  background: #e2e8f0; border: none; color: #94a3b8;\
  cursor: default; display: flex; align-items: center; justify-content: center;\
  transition: all 0.2s;\
  flex-shrink: 0;\
}\
.ai-send-btn.active {\
  background: linear-gradient(135deg, #2563eb, #1d4ed8);\
  color: #fff; cursor: pointer;\
  box-shadow: 0 2px 8px rgba(37,99,235,0.3);\
}\
.ai-send-btn.active:hover {\
  box-shadow: 0 4px 12px rgba(37,99,235,0.45);\
}\
@media (max-width: 480px) {\
  .ai-panel {\
    width: calc(100vw - 16px); right: 8px; bottom: 80px;\
    height: calc(100vh - 120px); border-radius: 16px;\
  }\
  .ai-bubble { bottom: 16px; right: 16px; width: 50px; height: 50px; border-radius: 14px; }\
}';
    document.head.appendChild(style);
  }

  // ── SVG Icons ───────────────────────────────────────────────────────
  var SVG_SPARKLES = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>';
  var SVG_CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var SVG_SEND = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  var SVG_MINIMIZE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  var SVG_LINK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  // ── Suggestions ─────────────────────────────────────────────────────
  var SUGGESTIONS = [
    'What deals are in negotiation?',
    'Show me the full pipeline',
    'List all leads',
    'Who are my contacts?',
    'Any high-risk claims?'
  ];

  // ── State ───────────────────────────────────────────────────────────
  var isOpen = false;
  var isTyping = false;
  var chatHistory = [];
  var panelEl, messagesEl, inputEl, sendBtn, bubbleEl;

  // ── Helpers ─────────────────────────────────────────────────────────
  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function renderBold(text) {
    return esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function scrollToBottom() {
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ── Build DOM ───────────────────────────────────────────────────────
  function buildUI() {
    bubbleEl = document.createElement('button');
    bubbleEl.className = 'ai-bubble';
    bubbleEl.setAttribute('title', 'AI Assistant');
    bubbleEl.innerHTML = SVG_SPARKLES;
    bubbleEl.addEventListener('click', togglePanel);
    document.body.appendChild(bubbleEl);

    panelEl = document.createElement('div');
    panelEl.className = 'ai-panel';
    panelEl.innerHTML = ''
      + '<div class="ai-header">'
      + '  <div class="ai-header-left">'
      + '    <div class="ai-header-icon">' + SVG_SPARKLES + '</div>'
      + '    <div>'
      + '      <div class="ai-header-title">CRM Assistant</div>'
      + '      <div class="ai-header-sub">Powered by Gemini AI</div>'
      + '    </div>'
      + '  </div>'
      + '  <button class="ai-header-btn ai-minimize-btn" title="Minimize">' + SVG_MINIMIZE + '</button>'
      + '</div>'
      + '<div class="ai-messages"></div>'
      + '<div class="ai-input-area">'
      + '  <div class="ai-input-row">'
      + '    <input class="ai-input" type="text" placeholder="Ask about your CRM data..." />'
      + '    <button class="ai-send-btn" title="Send">' + SVG_SEND + '</button>'
      + '  </div>'
      + '</div>';
    document.body.appendChild(panelEl);

    messagesEl = panelEl.querySelector('.ai-messages');
    inputEl = panelEl.querySelector('.ai-input');
    sendBtn = panelEl.querySelector('.ai-send-btn');
    var minBtn = panelEl.querySelector('.ai-minimize-btn');

    minBtn.addEventListener('click', togglePanel);
    inputEl.addEventListener('input', updateSendBtn);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    sendBtn.addEventListener('click', sendMessage);

    renderWelcome();
  }

  function togglePanel() {
    isOpen = !isOpen;
    if (isOpen) {
      panelEl.classList.add('visible');
      bubbleEl.classList.add('open');
      bubbleEl.innerHTML = SVG_CLOSE;
      setTimeout(function () { inputEl.focus(); }, 150);
    } else {
      panelEl.classList.remove('visible');
      bubbleEl.classList.remove('open');
      bubbleEl.innerHTML = SVG_SPARKLES;
    }
  }

  function updateSendBtn() {
    if (inputEl.value.trim()) {
      sendBtn.classList.add('active');
    } else {
      sendBtn.classList.remove('active');
    }
  }

  // ── Render Welcome ──────────────────────────────────────────────────
  function renderWelcome() {
    var html = ''
      + '<div class="ai-welcome">'
      + '  <div class="ai-welcome-icon">' + SVG_SPARKLES + '</div>'
      + '  <h3>Ask me anything about your CRM</h3>'
      + '  <p>I can search accounts, contacts, opportunities, leads, projects, claims and give you instant insights.</p>'
      + '</div>'
      + '<div class="ai-suggestions">';
    for (var i = 0; i < SUGGESTIONS.length; i++) {
      html += '<button class="ai-suggest-btn" data-query="' + esc(SUGGESTIONS[i]) + '">' + esc(SUGGESTIONS[i]) + '</button>';
    }
    html += '</div>';
    messagesEl.innerHTML = html;

    messagesEl.addEventListener('click', function handler(e) {
      var btn = e.target.closest('.ai-suggest-btn');
      if (btn) {
        var q = btn.getAttribute('data-query');
        inputEl.value = q;
        updateSendBtn();
        sendMessage();
        messagesEl.removeEventListener('click', handler);
      }
    });
  }

  // ── Render Messages ─────────────────────────────────────────────────
  function appendUserBubble(text) {
    var div = document.createElement('div');
    div.className = 'ai-msg-user';
    div.innerHTML = '<div class="ai-msg-user-inner">' + esc(text) + '</div>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    isTyping = true;
    var div = document.createElement('div');
    div.className = 'ai-typing';
    div.id = 'ai-typing-indicator';
    div.innerHTML = '<div class="ai-typing-inner"><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div></div>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    isTyping = false;
    var el = document.getElementById('ai-typing-indicator');
    if (el) el.remove();
  }

  function renderAssistantMessage(data) {
    var div = document.createElement('div');
    div.className = 'ai-msg-bot';
    var inner = document.createElement('div');
    inner.className = 'ai-msg-bot-inner';

    if (data.text) {
      var p = document.createElement('div');
      p.innerHTML = renderBold(data.text);
      inner.appendChild(p);
    }

    if (data.kpis && data.kpis.length > 0) {
      var kpiGrid = document.createElement('div');
      kpiGrid.className = 'ai-kpis';
      kpiGrid.style.gridTemplateColumns = 'repeat(' + Math.min(data.kpis.length, 4) + ', 1fr)';
      for (var k = 0; k < data.kpis.length; k++) {
        var kpi = data.kpis[k];
        var c = kpi.color || '#2563eb';
        var cell = document.createElement('div');
        cell.className = 'ai-kpi';
        cell.style.background = c + '0d';
        cell.style.border = '1px solid ' + c + '25';
        cell.innerHTML = '<div class="ai-kpi-value" style="color:' + esc(c) + '">' + esc(String(kpi.value)) + '</div>'
          + '<div class="ai-kpi-label">' + esc(kpi.label) + '</div>';
        kpiGrid.appendChild(cell);
      }
      inner.appendChild(kpiGrid);
    }

    if (data.table && data.table.headers && data.table.rows) {
      var wrap = document.createElement('div');
      wrap.className = 'ai-table-wrap';
      var tbl = '<table class="ai-table"><thead><tr>';
      for (var h = 0; h < data.table.headers.length; h++) {
        tbl += '<th>' + esc(data.table.headers[h]) + '</th>';
      }
      tbl += '</tr></thead><tbody>';
      for (var r = 0; r < data.table.rows.length; r++) {
        tbl += '<tr>';
        for (var ci = 0; ci < data.table.rows[r].length; ci++) {
          tbl += '<td>' + esc(String(data.table.rows[r][ci])) + '</td>';
        }
        tbl += '</tr>';
      }
      tbl += '</tbody></table>';
      wrap.innerHTML = tbl;
      inner.appendChild(wrap);
    }

    if (data.links && data.links.length > 0) {
      var linksDiv = document.createElement('div');
      linksDiv.className = 'ai-links';
      for (var li = 0; li < data.links.length; li++) {
        (function (link) {
          var chip = document.createElement('button');
          chip.className = 'ai-link-chip';
          chip.innerHTML = esc(link.label) + ' ' + SVG_LINK;
          chip.addEventListener('click', function () {
            if (typeof window.navigate === 'function') {
              var objType = link.objectType;
              var recId = link.id;
              var D = window.DATA || {};
              var arr = D[objType];
              var rec = arr ? arr.find(function (r) { return r.id === recId; }) : null;
              window.navigate(objType, rec, recId);
              if (isOpen) togglePanel();
            }
          });
          linksDiv.appendChild(chip);
        })(data.links[li]);
      }
      inner.appendChild(linksDiv);
    }

    div.appendChild(inner);
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  // ── Send Message ────────────────────────────────────────────────────
  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isTyping) return;

    var welcome = messagesEl.querySelector('.ai-welcome');
    if (welcome) messagesEl.innerHTML = '';

    inputEl.value = '';
    updateSendBtn();

    chatHistory.push({ role: 'user', content: text });
    appendUserBubble(text);
    showTyping();

    var response = await askGemini(text, chatHistory);

    hideTyping();
    chatHistory.push({ role: 'model', data: response, rawText: response.rawText || '' });
    renderAssistantMessage(response);
    inputEl.focus();
  }

  // ── Init ────────────────────────────────────────────────────────────
  async function initAIAssistant() {
    injectAIStyles();
    await loadApiKey();
    buildUI();
    console.log('[AI Assistant] Ready — Gemini' + (API_KEY ? ' (key loaded)' : ' (key will be requested on first use)'));
  }

  window.initAIAssistant = initAIAssistant;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
  } else {
    initAIAssistant();
  }

})();
