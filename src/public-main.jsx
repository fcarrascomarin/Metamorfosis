import React from 'react';
import { createRoot } from 'react-dom/client';
import PublicApp from './PublicApp.jsx';
import './styles/legacy-01-foundations.css';
import './styles/legacy-02-components.css';
import './styles/legacy-03-scenes.css';
import './styles/legacy-04-iterations.css';
import './styles/public-editorial.css';
import './styles/public-enhancements.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PublicApp />
  </React.StrictMode>
);
