/** Cálculos puros, independientes de React y de la persistencia. */
export const nonNegativeNumber = (value) => Math.max(0, Number(value) || 0);

export function cashSummary(finance = {}) {
  return {
    income: nonNegativeNumber(finance.recurringIncome) + nonNegativeNumber(finance.expectedIncome),
    costs: nonNegativeNumber(finance.fixedCosts) + nonNegativeNumber(finance.variableCosts),
    liquidity: nonNegativeNumber(finance.availableCash) - nonNegativeNumber(finance.committedPayments)
  };
}

export function hourSummary(tracking = {}) {
  const entries = tracking.entries || [];
  return {
    hours: entries.reduce((sum, entry) => sum + nonNegativeNumber(entry.hours), 0),
    billable: entries.filter((entry) => entry.billable).reduce((sum, entry) => sum + nonNegativeNumber(entry.hours), 0),
    fees: (tracking.projects || []).reduce((sum, project) => sum + nonNegativeNumber(project.fee), 0)
  };
}

export function projectHours(tracking, id) {
  return (tracking.entries || []).filter((entry) => entry.projectId === id)
    .reduce((sum, entry) => sum + nonNegativeNumber(entry.hours), 0);
}

export function todayISO() {
  const day = new Date();
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
}

export const moneyCLP = (amount) => new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0
}).format(Number(amount) || 0);
