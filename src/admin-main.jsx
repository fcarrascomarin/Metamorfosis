import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

function BootstrapFallback({ error }) {
  const detail = error?.message || 'La interfaz no pudo iniciar correctamente.';
  return (
    <div className="admin-bootstrap-error" role="alert">
      <div className="admin-bootstrap-error__card">
        <img src="/logo-metamorfosis-transparente.png" alt="Metamorfosis Lab" width="78" height="78" />
        <span>Recuperación del sistema</span>
        <h1>Metamorfosis OS no pudo iniciar</h1>
        <p>{detail}</p>
        <div className="admin-bootstrap-error__actions">
          <button type="button" onClick={() => window.location.reload()}>Recargar OS</button>
          <a href="/api/health" target="_blank" rel="noreferrer">Ver diagnóstico técnico</a>
        </div>
      </div>
    </div>
  );
}

root.render(
  <div className="app-loading app-loading--bootstrap">
    <img src="/logo-metamorfosis-transparente.png" alt="" width="64" height="64" />
    <strong>Iniciando Metamorfosis OS</strong>
    <span>Comprobando la interfaz privada…</span>
  </div>
);

import('./AdminApp.jsx')
  .then(({ default: AdminApp }) => {
    root.render(
      <React.StrictMode>
        <AdminApp />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('No fue posible cargar Metamorfosis OS:', error);
    root.render(<BootstrapFallback error={error} />);
  });
