import { cashSummary, moneyCLP } from './managementModel.js';

const FIELDS = [
  ['recurringIncome', 'Ingresos recurrentes'],
  ['expectedIncome', 'Ingresos esperados'],
  ['fixedCosts', 'Costos fijos'],
  ['variableCosts', 'Costos variables'],
  ['availableCash', 'Caja disponible'],
  ['committedPayments', 'Pagos comprometidos']
];

export default function CashPanel({ finance, onChange }) {
  const summary = cashSummary(finance);

  return <div className="mg-content">
    <div className="mg-summary" aria-label="Resumen financiero">
      <span>Ingresos previstos <b>{moneyCLP(summary.income)}</b></span>
      <span>Costos previstos <b>{moneyCLP(summary.costs)}</b></span>
      <span>Liquidez después de compromisos <b>{moneyCLP(summary.liquidity)}</b></span>
    </div>
    <div className="mg-scroll">
      <div className="mg-table-head"><strong>Concepto</strong><strong>Importe (CLP)</strong></div>
      {FIELDS.map(([key, label]) => <label className="mg-line" key={key}>
        <span>{label}</span>
        <input type="number" min="0" aria-label={label}
          value={finance[key] ?? 0} onChange={(event) => onChange(key, event.target.value)} />
      </label>)}
      <details className="mg-fold">
        <summary>Notas sobre caja</summary>
        <textarea rows="4" aria-label="Notas sobre caja"
          value={finance.notes || ''} onChange={(event) => onChange('notes', event.target.value)} />
      </details>
      <p className="mg-note">Montos registrados manualmente. Los ingresos previstos no equivalen a pagos recibidos.</p>
    </div>
  </div>;
}
