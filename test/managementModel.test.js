import test from 'node:test';
import assert from 'node:assert/strict';
import { cashSummary, hourSummary, nonNegativeNumber, projectHours } from '../src/features/management/managementModel.js';

test('la caja presenta por separado ingresos previstos y liquidez', () => {
  assert.deepEqual(cashSummary({ recurringIncome: '100000', expectedIncome: 250000, fixedCosts: 120000,
    variableCosts: 20000, availableCash: 90000, committedPayments: 30000 }),
  { income: 350000, costs: 140000, liquidity: 60000 });
});
test('montos vacíos, negativos o inválidos nunca se suman como positivos', () => {
  assert.equal(nonNegativeNumber(''), 0);
  assert.equal(nonNegativeNumber(-10), 0);
  assert.equal(nonNegativeNumber('abc'), 0);
});
test('facturabilidad y proyectos no se confunden', () => {
  const tracking = { projects: [{id:'a',fee:180000},{id:'b',fee:0}], entries:[
    {projectId:'a',hours:2,billable:true}, {projectId:'a',hours:1.5,billable:false},
    {projectId:'b',hours:1,billable:false}] };
  assert.deepEqual(hourSummary(tracking), { hours:4.5, billable:2, fees:180000 });
  assert.equal(projectHours(tracking,'a'),3.5);
  assert.equal(projectHours(tracking,'b'),1);
});
