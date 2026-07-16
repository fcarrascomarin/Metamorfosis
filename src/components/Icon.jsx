import React from 'react';

const paths = {
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['m6 6 12 12', 'M18 6 6 18'],
  arrow_forward: ['M5 12h14', 'm14 0-5-5', 'm5 5-5 5'],
  arrow_back: ['M19 12H5', 'm5 0 5-5', 'm-5 5 5 5'],
  check_circle: ['M20 11a8 8 0 1 1-3-6.2', 'm8 12 3 3 7-8'],
  description: ['M7 3h7l4 4v14H7z', 'M14 3v5h5', 'M10 12h5', 'M10 16h5'],
  schema: ['M12 5v4', 'M6 15v-2h12v2', 'M5 15h2v4H3v-4z', 'M11 15h2v4h-4v-4z', 'M17 15h2v4h-4v-4z', 'M9 3h6v4H9z'],
  query_stats: ['M4 19V9', 'M10 19V5', 'M16 19v-7', 'M3 19h18', 'm4 11 4-4 4 2 5-5'],
  send: ['m3 11 18-8-7 18-3-7z', 'm11 14 4-4'],
  mail: ['M3 6h18v12H3z', 'm3 8 6 5 6-5'],
  location_on: ['M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z', 'M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  public: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M3.5 9h17', 'M3.5 15h17', 'M12 3c2.2 2.5 3.2 5.5 3 9-.2 3.6-1.2 6.5-3 9', 'M12 3c-2.2 2.5-3.2 5.5-3 9 .2 3.6 1.2 6.5 3 9'],
  schedule: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7v5l3 2'],
  videocam: ['M3 7h12v10H3z', 'm15 3 3-2v8l-3-2z'],
  login: ['M10 5H5v14h5', 'M13 8l4 4-4 4', 'M17 12H9'],
  logout: ['M14 5h5v14h-5', 'M11 8l-4 4 4 4', 'M7 12h9'],
  home: ['m3 11 9-8 9 8', 'M5 10v10h14V10', 'M9 20v-6h6v6'],
  task_alt: ['M4 12a8 8 0 1 0 4-7', 'm9 4 3 3 6-7'],
  notifications_none: ['M6 16h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v4z', 'M10 19h4'],
  construction: ['m4 20 7-7', 'm13 4-4 4 3 3 4-4', 'M5 4l6 6', 'M4 4h4v4'],
  map: ['M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z', 'M9 4v14', 'M15 6v14'],
  account_tree: ['M6 4h5v4H6z', 'M13 16h5v4h-5z', 'M6 16h5v4H6z', 'M8.5 8v3h7v5', 'M8.5 11v5'],
  design_services: ['m4 20 5-1 10-10-4-4L5 15z', 'm13-13 2-2 4 4-2 2', 'M7 14l4 4'],
  verified_user: ['M12 3 5 6v5c0 4.5 3 7 7 8 4-1 7-3.5 7-8V6z', 'm9 12 2 2 4-5'],
  visibility: ['M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  sort: ['M4 7h12', 'M4 12h9', 'M4 17h6'],
  architecture: ['M8 21h8', 'M12 3l4 7-4 4-4-4z', 'M12 14v7'],
  shield: ['M12 3 5 6v5c0 4.5 3 7 7 8 4-1 7-3.5 7-8V6z'],
  trending_up: ['M3 17l6-6 4 4 7-8', 'M15 7h5v5'],
  request_quote: ['M6 3h10l3 3v15H6z', 'M16 3v4h4', 'M9 11h6', 'M12 9v6', 'M9 17h6'],
  payments: ['M3 7h18v10H3z', 'M3 10h18', 'M7 14h4'],
  inventory_2: ['M4 7h16v14H4z', 'M3 3h18v4H3z', 'M9 11h6'],
  feedback: ['M4 4h16v13H8l-4 4z', 'M8 9h8', 'M8 13h5'],
  event_busy: ['M5 5h14v15H5z', 'M8 3v4', 'M16 3v4', 'M5 9h14', 'm9 13 4 4', 'm4-4-4 4'],
  today: ['M5 5h14v15H5z', 'M8 3v4', 'M16 3v4', 'M5 9h14', 'M9 13h6'],
  dashboard: ['M4 4h7v7H4z', 'M13 4h7v4h-7z', 'M13 10h7v10h-7z', 'M4 13h7v7H4z'],
  handshake: ['m3 12 4-4 4 2 2-1 4 4', 'm21 8-4-3-4 2', 'm7 17 2 2 3-1', 'm12 18 2 2 4-4', 'M3 8l3-3 3 2'],
  local_shipping: ['M3 6h12v11H3z', 'M15 10h4l2 3v4h-6z', 'M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  copyright: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M15 9a4 4 0 1 0 0 6'],
  folder_open: ['M3 6h7l2 2h9l-2 11H3z', 'M3 9h18'],
  folder: ['M3 6h7l2 2h9v11H3z'],
  library_books: ['M5 4h14v15H5z', 'M8 8h8', 'M8 12h8', 'M8 16h5', 'M3 7v14h13'],
  conversion_path: ['M5 7h12', 'm14 7-3-3', 'm3 3-3 3', 'M19 17H7', 'm5 17 3-3', 'm-3 3 3 3'],
  science: ['M9 3h6', 'M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3', 'M8 15h8'],
  business_center: ['M4 7h16v13H4z', 'M9 7V4h6v3', 'M4 12h16', 'M10 12v2h4v-2'],
  warning: ['M12 3 2 21h20z', 'M12 9v5', 'M12 18h.01'],
  chevron_right: ['m9 6 6 6-6 6'],
  edit: ['M4 20h4L19 9l-4-4L4 16z', 'm13-13 4 4'],
  delete: ['M5 7h14', 'M9 7V4h6v3', 'M7 7l1 13h8l1-13', 'M10 11v5', 'M14 11v5'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm17 17 4 4'],
  storefront: ['M4 9h16v11H4z', 'M3 4h18l-1 5H4z', 'M8 20v-6h4v6', 'M15 13h3'],
  settings: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M19 13.5v-3l2-1-2-3.5-2.2.7-2.5-1.5L14 3h-4l-.3 2.2-2.5 1.5L5 6 3 9.5l2 1v3l-2 1L5 18l2.2-.7 2.5 1.5L10 21h4l.3-2.2 2.5-1.5 2.2.7 2-3.5z'],
  database: ['M5 6c0-2 14-2 14 0s-14 2-14 0Z', 'M5 6v6c0 2 14 2 14 0V6', 'M5 12v6c0 2 14 2 14 0v-6'],
  recycling: ['m8 5 2-3 2 3', 'M10 3a7 7 0 0 1 7 4', 'm19 9 3 1-2 2', 'M21 10a7 7 0 0 1-4 8', 'm14 20-2 2-2-2', 'M12 21a7 7 0 0 1-6-4'],
  route: ['M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M19 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M7 19h3a4 4 0 0 0 4-4V9a2 2 0 0 1 2-2h1'],
  play_arrow: ['m8 5 11 7-11 7z']
};

export default function Icon({ name, className = '', title }) {
  const iconPaths = paths[name] || paths.description;
  return (
    <svg
      className={`app-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {iconPaths.map((path, index) => <path d={path} key={`${name}-${index}`} />)}
    </svg>
  );
}
