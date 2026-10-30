import test from 'node:test';
import assert from 'node:assert/strict';
import { appendInstitutionalTasks, institutionalTasks, INSTITUTIONAL_PHASES, initialInstitutionalLog } from '../src/institutionalPlan.js';
import { createDefaultOsState } from '../src/osSeed.js';

test('ruta institucional tiene tres fases y tareas con identificadores estables',()=>{
  assert.equal(INSTITUTIONAL_PHASES.length,3);
  assert.equal(institutionalTasks.length,12);
  assert.equal(new Set(institutionalTasks.map(t=>t.id)).size,institutionalTasks.length);
  assert.ok(institutionalTasks.every(t=>t.status==='pending' && t.confirmed===false));
});

test('sumar tareas institucionales es aditivo, no duplica ni altera registros guardados',()=>{
  const existing=[{id:'a1',title:'Tarea original',status:'done'}, {...institutionalTasks[0],status:'progress',progressNote:'Contrato en revisión'}];
  const updated=appendInstitutionalTasks(existing);
  assert.equal(updated.length,13);
  assert.equal(updated[0],existing[0]);
  assert.equal(updated[1],existing[1]);
  assert.equal(appendInstitutionalTasks(updated).length,updated.length);
});

test('la base nueva contempla programa e historial y no inventa gestiones completadas',()=>{
  const state=createDefaultOsState();
  assert.equal(state.tasks.filter(t=>t.program==='institucional-2026').length,12);
  assert.deepEqual(state.institutionalLog,initialInstitutionalLog);
  assert.ok(state.tasks.filter(t=>t.program==='institucional-2026').every(t=>t.status!=='done'));
});
