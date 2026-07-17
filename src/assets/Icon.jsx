import React from 'react';

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

const icons = {
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  daily: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
  calendar_month: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M7 14h2v2H7zM11 14h2v2h-2zM15 14h2v2h-2zM7 18h2v2H7zM11 18h2v2h-2z"/></>,
  today: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><circle cx="12" cy="15.5" r="2.5"/></>,
  inbox: <><path d="M4 4h16v13H4z"/><path d="m4 13 4-4h8l4 4M8 17v3h8v-3"/></>,
  account_tree: <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v4h12V7M12 11v6"/></>,
  payments: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/></>,
  inventory_2: <><path d="M4 7h16v14H4zM3 3h18v4H3zM9 11h6"/></>,
  local_shipping: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  copyright: <><circle cx="12" cy="12" r="9"/><path d="M15 9.5a4 4 0 1 0 0 5"/></>,
  query_stats: <><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6"/><circle cx="19" cy="7" r="1"/></>,
  folder_open: <><path d="M3 6h6l2 2h10v11H3z"/><path d="m3 11 3-3h15"/></>,
  library_books: <><rect x="4" y="5" width="12" height="15" rx="1"/><path d="M8 3h12v15M7 9h6M7 13h6"/></>,
  conversion_path: <><path d="M4 7h11M12 4l3 3-3 3M20 17H9M12 14l-3 3 3 3"/></>,
  handshake: <><path d="m8 11 3 3a2 2 0 0 0 3 0l4-4"/><path d="m3 9 4-4 4 2 2-1 8 7-4 5-3-2-2 2-9-9z"/></>,
  request_quote: <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 12h6M9 16h4"/><path d="M12 10v8"/></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></>,
  design_services: <><path d="m4 20 5-1 10-10-4-4L5 15z"/><path d="m13 7 4 4M3 4l5 5M6 2l2 2M2 6l2 2"/></>,
  verified_user: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
  visibility: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></>,
  sort: <><path d="M4 6h16M4 12h11M4 18h6"/></>,
  architecture: <><path d="M4 21V8l8-5 8 5v13M9 21v-7h6v7"/><path d="M8 9h.01M12 9h.01M16 9h.01"/></>,
  schema: <><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v5M6 17v-5h12v5"/></>,
  shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/></>,
  trending_up: <><path d="m3 17 6-6 4 4 7-8"/><path d="M15 7h5v5"/></>,
  arrow_back: <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
  arrow_forward: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  chevron_left: <><path d="m15 18-6-6 6-6"/></>,
  chevron_right: <><path d="m9 18 6-6-6-6"/></>,
  expand_more: <><path d="m6 9 6 6 6-6"/></>,
  expand_less: <><path d="m6 15 6-6 6 6"/></>,
  check_circle: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  task_alt: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 6-7"/></>,
  construction: <><path d="m14 6 4-4 4 4-4 4zM3 21l8-8M8 3l13 13M3 8l5-5 4 4-5 5z"/></>,
  description: <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 12h6M9 16h6"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  phone: <><path d="M6 3h4l2 5-3 2a15 15 0 0 0 5 5l2-3 5 2v4c0 2-2 3-4 3C9 20 4 15 3 7c0-2 1-4 3-4z"/></>,
  public: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
  location_on: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></>,
  login: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M13 3h8v18h-8"/></>,
  logout: <><path d="m14 8 4 4-4 4M18 12H7"/><path d="M10 4H4v16h6"/></>,
  notifications_none: <><path d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3zM10 20h4"/></>,
  schedule: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  send: <><path d="m3 4 18 8-18 8 4-8zM7 12h14"/></>,
  videocam: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,
  add: <><path d="M12 5v14M5 12h14"/></>,
  edit: <><path d="m4 20 5-1 11-11-4-4L5 15zM14 6l4 4"/></>,
  delete: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></>,
  save: <><path d="M5 3h12l3 3v15H4V3zM8 3v6h8V3M8 21v-7h8v7"/></>,
  refresh: <><path d="M20 6v5h-5M4 18v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 4M18 15a7 7 0 0 1-12 2l-2-4"/></>,
  more_vert: <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>,
  warning: <><path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18h.01"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
  attach_money: <><path d="M12 3v18M16 7h-6a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7"/></>,
  savings: <><path d="M5 10a7 7 0 0 1 14 0v7H5z"/><path d="M9 10V8h6v2M8 17v3M16 17v3M19 12h2v3h-2"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  group: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 3-7 6-7s6 3 6 7M15 14c3 0 6 2 6 6"/></>,
  filter_alt: <><path d="M3 5h18l-7 8v6l-4 2v-8z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
  open_in_new: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v7H4V6h7"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1-2-4-2 1a8 8 0 0 0-2-1l-.3-2h-5l-.3 2a8 8 0 0 0-2 1l-2-1-2 4 2 1a7 7 0 0 0 0 2l-2 1 2 4 2-1a8 8 0 0 0 2 1l.3 2h5l.3-2a8 8 0 0 0 2-1l2 1 2-4-2-1a7 7 0 0 0 .1-1z"/></>,
  menu_book: <><path d="M3 5a8 8 0 0 1 9 2v14a8 8 0 0 0-9-2zM21 5a8 8 0 0 0-9 2v14a8 8 0 0 1 9-2z"/></>,
  timeline: <><path d="M4 18h4V8H4zM10 18h4V3h-4zM16 18h4v-7h-4z"/></>,
  rule: <><path d="M4 6h10M4 12h10M4 18h10"/><path d="m17 6 2 2 3-4M17 18l5-5"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2"/></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 2 4 3 8 3s8-1 8-3V5M4 11v6c0 2 4 3 8 3s8-1 8-3v-6"/></>,
  menu_open: <><path d="M4 6h16M4 12h10M4 18h16M18 9l-3 3 3 3"/></>
};

export default function Icon({ name, title, className = '' }) {
  const content = icons[name] || icons.info;
  return (
    <svg
      className={`app-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
      {...common}
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
  );
}
