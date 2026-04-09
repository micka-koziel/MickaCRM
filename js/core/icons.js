/* js/core/icons.js — Bibliothèque d'icônes SVG
 * Dépendances : namespace.js
 * Expose : MickaCRM.core.icons.{NAV_ICONS, svgIcon}
 *
 * Backward-compat : expose window.NAV_ICONS et window.svgIcon.
 *
 * Extrait de nav.js — centralisé pour éviter la duplication entre modules.
 */
(function(){
  var NAV_ICONS = {
    dashboard:     'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z',
    leads:         'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z',
    accounts:      'M12 7V3H2v18h20V7H12Zm-6 12H4v-2h2v2Zm0-4H4v-2h2v2Zm0-4H4V9h2v2Zm0-4H4V5h2v2Zm4 12H8v-2h2v2Zm0-4H8v-2h2v2Zm0-4H8V9h2v2Zm0-4H8V5h2v2Zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10Zm-2-8h-2v2h2v-2Zm0 4h-2v2h2v-2Z',
    opportunities: 'M7 2v11h3v9l7-12h-4l4-8z',
    projects:      'M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm0 15L3 13.09V15l9 5 9-5v-1.91L12 18Z',
    quotes:        'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6Zm2 16H8v-2h8v2Zm0-4H8v-2h8v2Zm-3-5V3.5L18.5 9H13Z',
    claims:        'M12 2 1 21h22L12 2Zm1 14h-2v-2h2v2Zm0-4h-2v-4h2v4Z',
    activities:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7Z',
    products:      'M20 4H4v2h16V4Zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1Zm-9 4H6v-4h6v4Z',
    users:         'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z',
    agents:        'M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3ZM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5Zm4.5 5.5H8v-1h4v1Zm.75-4c-.83 0-1.5-.67-1.5-1.5S12.42 10 13.25 10s1.5.67 1.5 1.5S14.08 13 13.25 13Z',
    calendar:      'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V8h14v11Z',
    settings:      'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58ZM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6Z',
    logout:        'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
    search:        'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z',
    plus:          'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    chevronRight:  'M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41Z',
    chevronLeft:   'M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41Z',
    menu:          'M3 18h18v-2H3v2Zm0-5h18v-2H3v2Zm0-7v2h18V6H3Z',
    close:         'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z'
  };

  function svgIcon(name, size, color){
    var path = NAV_ICONS[name];
    if (!path) return '';
    var s = size || 20;
    var c = color || 'currentColor';
    return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="'+c+'" aria-hidden="true"><path d="'+path+'"/></svg>';
  }

  MickaCRM.core.icons = {
    NAV_ICONS: NAV_ICONS,
    svgIcon: svgIcon
  };

  // Backward-compat
  window.NAV_ICONS = NAV_ICONS;
  window.svgIcon = svgIcon;
})();
