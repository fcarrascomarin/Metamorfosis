import { useState } from 'react';
import CashPanel from './CashPanel.jsx';
import HoursPanel from './HoursPanel.jsx';
import './management.css';

/** Una sola sección de gestión con herramientas anidadas, no pantallas duplicadas. */
export default function ManagementWorkspace({ osState, setOsState }) {
  const [tab, setTab] = useState('cash');

  const changeFinance = (key, value) => setOsState((state) => ({
    ...state, finance: { ...state.finance, [key]: value }
  }));
  const changeTracking = (updater) => setOsState((state) => ({
    ...state, timeTracking: updater(state.timeTracking)
  }));

  return <section className="mg-page">
    <header className="mg-bar">
      <h1>Gestión</h1>
      <nav aria-label="Tipo de gestión" className="mg-tabs">
        <button type="button" className={tab === 'cash' ? 'active' : ''}
          onClick={() => setTab('cash')}>Caja</button>
        <button type="button" className={tab === 'time' ? 'active' : ''}
          onClick={() => setTab('time')}>Horas y proyectos</button>
      </nav>
    </header>
    {tab === 'cash'
      ? <CashPanel finance={osState.finance} onChange={changeFinance} />
      : <HoursPanel tracking={osState.timeTracking} onChange={changeTracking} />}
  </section>;
}
