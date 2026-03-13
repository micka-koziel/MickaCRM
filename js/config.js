/* config.js — Stages, Colors, Formatters */
var COLORS = {
  accent:'#2563eb',accentLight:'#dbeafe',accentHover:'#1d4ed8',dark:'#0f172a',
  bg:'#f0f2f5',card:'#ffffff',border:'#e8eaed',text:'#1e293b',
  textMuted:'#64748b',textLight:'#94a3b8',success:'#10b981',
  warning:'#f59e0b',danger:'#ef4444',purple:'#8b5cf6'
};

/* ── Global formatter — used by pipeline, dashboard, record, etc. ── */
function fmtAmount(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  n = Number(n);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M€';
  if (n >= 1000) return Math.round(n / 1000) + 'K€';
  if (n > 0) return n.toLocaleString('en-US') + '€';
  return '0€';
}
var STAGES = {
  opportunities: [
    {key:'lead',label:'Lead',color:'#94a3b8'},
    {key:'study',label:'Study',color:'#3b82f6'},
    {key:'tender',label:'Tender',color:'#3b82f6'},
    {key:'proposal',label:'Proposal',color:'#ec4899'},
    {key:'negotiation',label:'Negot.',color:'#f97316'},
    {key:'closed_won',label:'Won',color:'#10b981'},
    {key:'launched',label:'Launched',color:'#6366f1'}
  ],
  leads: [
    {key:'new',label:'New',color:'#10b981'},
    {key:'contacted',label:'Contacted',color:'#3b82f6'},
    {key:'qualified',label:'Qualified',color:'#8b5cf6'},
    {key:'proposal',label:'Proposal',color:'#06b6d4'},
    {key:'converted',label:'Converted',color:'#10b981'}
  ],
  projects: [
    {key:'prestudy',label:'Pre-study',color:'#94a3b8'},
    {key:'tender',label:'Tender',color:'#f59e0b'},
    {key:'contracting',label:'Contract.',color:'#3b82f6'},
    {key:'construction',label:'Construction',color:'#f97316'},
    {key:'delivered',label:'Delivered',color:'#10b981'}
  ]
};
