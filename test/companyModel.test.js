import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCompanyIndex, companyKey, nextExpedienteIndex, organizationFromContact, mergeRepositories } from '../src/features/companies/companyModel.js';

test('una empresa integra expediente, campo y solicitud sin duplicarse', () => {
  const state = {
    expedientes: [{ id: 'EXP-001', name: 'Club Vegan', status: 'Cerrado sin conversión' }],
    fieldRegister: [{ id: 'CAMPO-010', actor: 'Club Vegan / Emporio', organization: 'Concepción', type: 'Piloto comercial' }],
    quotes: [{ id: 'Q-1', company: 'Club Vegan', contact_name: 'Contacto web' }]
  };
  const copy = structuredClone(state);
  const companies = buildCompanyIndex(state);
  assert.equal(companies.length, 1);
  assert.equal(companies[0].name, 'Club Vegan');
  assert.equal(companies[0].contacts.length, 1);
  assert.equal(companies[0].quotes.length, 1);
  assert.equal(companies[0].stage, 'Cerrada');
  assert.deepEqual(state, copy, 'el adaptador de lectura no muta ni pierde registros');
});

test('agrupa por organización y no por cada persona', () => {
  const companies = buildCompanyIndex({ fieldRegister: [
    { id: 'A', actor: 'Juan', organization: 'CMPC · zona costa', type: 'Informante' },
    { id: 'B', actor: 'María', organization: 'CMPC', type: 'Discovery' },
    { id: 'C', actor: 'Pedro', organization: 'RUDEL', type: 'Informante' }
  ] });
  assert.deepEqual(companies.map((c) => c.name), ['CMPC', 'RUDEL']);
  assert.equal(companies[0].contacts.length, 2);
});

test('organizaciones registradas como ciudad se identifican por el nombre del actor', () => {
  assert.equal(organizationFromContact({ actor: 'Panadería Nietos', organization: 'Laja' }), 'Panadería Nietos');
  assert.equal(companyKey('Con Criterio'), 'con criterio');
});

test('companyId explícito tiene precedencia sobre el nombre anterior', () => {
  const companies = buildCompanyIndex({
    expedientes: [{ id: 'EXP-003', name: 'Empresa Renovada' }],
    fieldRegister: [{ id: 'A', actor: 'Paula', organization: 'Nombre Anterior', companyId: 'EXP-003' }]
  });
  assert.equal(companies.length, 1);
  assert.equal(companies[0].contacts[0].actor, 'Paula');
});

test('identificador siguiente evita colisiones con expedientes históricos', () => {
  assert.equal(nextExpedienteIndex([{ id: 'EXP-002' }, { id: 'EXP-020' }, { id: 'custom' }]), 21);
  assert.equal(nextExpedienteIndex([]), 1);
});

test('solicitudes sin organización no se atribuyen a una empresa imaginaria', () => {
  const companies = buildCompanyIndex({ quotes: [{ id: 'Q1', company: '', contact_name: 'Anónimo' }] });
  assert.equal(companies.length, 1);
  assert.equal(companies[0].unassigned, true);
  assert.equal(companies[0].quotes[0].contact_name, 'Anónimo');
});

test('documentos editados y limpiezas intencionales no se sobrescriben con el seed', () => {
  const defaults = { documentsByExpediente: { 'EXP-001': { a: { content: 'Anterior' }, b: { content: 'Inicial' } } } };
  const updated = mergeRepositories(defaults, { documentsByExpediente: { 'EXP-001': { a: { content: 'Revisado' } } } });
  assert.deepEqual(updated.documentsByExpediente['EXP-001'], { a: { content: 'Revisado' } });
  const cleared = mergeRepositories(defaults, { documentsByExpediente: { 'EXP-001': {} } });
  assert.deepEqual(cleared.documentsByExpediente['EXP-001'], {});
});

test('un contacto cerrado no marca cerrada a una organización con otra conversación activa', () => {
  const org = buildCompanyIndex({ fieldRegister: [
    { id: 'c1', actor: 'Persona 1', organization: 'Empresa X', status: 'Descartado', type: 'Informante' },
    { id: 'c2', actor: 'Persona 2', organization: 'Empresa X', status: 'En espera', type: 'Discovery' }
  ] });
  assert.equal(org.length, 1);
  assert.notEqual(org[0].stage, 'Cerrada');
});
