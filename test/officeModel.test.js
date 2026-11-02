import test from 'node:test';
import assert from 'node:assert/strict';
import { createOfficeSeed, mergeOffice, officeSummary, OFFICE_STAGES } from '../src/features/office/officeModel.js';

test('el sistema institucional abre tres etapas y un control de documentos', () => {
  const seed=createOfficeSeed();
  assert.equal(OFFICE_STAGES.length,3);
  assert.equal(seed.tasks.length,12);
  assert.ok(seed.documents.length>=3);
  assert.ok(seed.tasks.every(task=>task.status!=='Completada'));
  assert.equal(officeSummary(seed).completed,0);
});
test('las fichas previamente guardadas prevalecen y no se duplican',()=>{
  const existing=createOfficeSeed();
  existing.tasks[0].status='Completada';
  existing.tasks[0].notes='Contrato comprobado';
  existing.documents[0].url='https://example.com/estatuto.pdf';
  const result=mergeOffice(existing);
  assert.equal(result.tasks.length,12);
  assert.equal(result.tasks[0].status,'Completada');
  assert.equal(result.tasks[0].notes,'Contrato comprobado');
  assert.equal(result.documents[0].url,'https://example.com/estatuto.pdf');
});
test('al migrar se agregan únicamente registros faltantes',()=>{
  const partial={tasks:[{id:'office-01',status:'En curso',title:'Trámite editado'}],projects:[{id:'custom',title:'Proyecto propio'}],documents:[],notes:[{id:'note1',text:'Acuerdo'}]};
  const result=mergeOffice(partial);
  assert.equal(result.tasks.filter(item=>item.id==='office-01').length,1);
  assert.equal(result.tasks.find(item=>item.id==='office-01').title,'Trámite editado');
  assert.ok(result.projects.some(item=>item.id==='custom'));
  assert.equal(result.notes.length,1);
});
