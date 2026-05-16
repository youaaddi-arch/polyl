// Create 3 Kanban views on testOpportunite + delete the auto TABLE INDEX
// Card shows: name (labelIdentifier) + apprenant + formation
import fs from 'node:fs';
const env = Object.fromEntries(
  fs.readFileSync('.env','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];})
);
const BASE = env.TWENTY_API_BASE;
const H = { Authorization: 'Bearer '+env.TWENTY_API_KEY, 'Content-Type':'application/json' };

async function api(method, path, body) {
  const r = await fetch(BASE+path, { method, headers: H, body: body?JSON.stringify(body):undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw new Error(method+' '+path+' → '+r.status+' '+t.slice(0,500));
  return j;
}

const objs = (await api('GET','/rest/metadata/objects')).data;
const opp = objs.find(o => o.nameSingular === 'testOpportunite');

// Paginate all fields
async function pagedFields() {
  let all=[], cursor=null;
  while(true){
    const r = await api('GET','/rest/metadata/fields'+(cursor?'?starting_after='+cursor:''));
    const arr = r.data||r;
    if(!arr.length) break;
    all = all.concat(arr);
    if(arr.length<60) break;
    cursor = arr[arr.length-1].id;
  }
  return all;
}
const fields = (await pagedFields()).filter(f => f.objectMetadataId === opp.id);
const fid = name => fields.find(f => f.name === name).id;

const FIELDS = {
  name: fid('name'),
  apprenant: fid('apprenant'),
  formation: fid('formation'),
  typePipeline: fid('typePipeline'),
  stageApprentissage: fid('stageApprentissage'),
  stageFormationPro: fid('stageFormationPro'),
  stageFormationContinue: fid('stageFormationContinue'),
  dateOuverture: fid('dateOuverture'),
};

// Delete ALL existing non-system views on testOpportunite (re-runs cleanly)
const allViews = await api('GET','/rest/metadata/views');
const oppViews = allViews.filter(v => v.objectMetadataId === opp.id && v.type !== 'FIELDS_WIDGET');
for (const v of oppViews) {
  await api('DELETE','/rest/metadata/views/'+v.id);
  console.log('- deleted view:', v.name, '('+v.type+')');
}

// Helper: create a view with kanban + filter + visible fields
async function createKanbanView({ name, icon, stageField, pipelineValue, isIndex, position }) {
  const view = await api('POST','/rest/metadata/views', {
    name,
    icon,
    objectMetadataId: opp.id,
    type: 'KANBAN',
    key: isIndex ? 'INDEX' : null,
    position,
    mainGroupByFieldMetadataId: FIELDS[stageField],
    isCompact: false,
    openRecordIn: 'SIDE_PANEL',
    visibility: 'WORKSPACE',
  });
  console.log('+ view:', name, '(id', view.id+')');

  // Add visible fields (shown on cards)
  const visibleFields = [
    { fieldMetadataId: FIELDS.name,          position: 0, isVisible: true,  size: 200 },
    { fieldMetadataId: FIELDS.apprenant,     position: 1, isVisible: true,  size: 180 },
    { fieldMetadataId: FIELDS.formation,     position: 2, isVisible: true,  size: 180 },
    { fieldMetadataId: FIELDS.dateOuverture, position: 3, isVisible: true,  size: 140 },
  ];
  for (const vf of visibleFields) {
    await api('POST','/rest/metadata/viewFields', { ...vf, viewId: view.id });
  }
  console.log('   + 4 visible fields');

  // Add filter typePipeline = pipelineValue
  await api('POST','/rest/metadata/viewFilters', {
    viewId: view.id,
    fieldMetadataId: FIELDS.typePipeline,
    operand: 'IS',
    value: JSON.stringify([pipelineValue]),
  });
  console.log('   + filter typePipeline =', pipelineValue);

  return view;
}

await createKanbanView({
  name: 'Pipeline Apprentissage',
  icon: 'IconBriefcase',
  stageField: 'stageApprentissage',
  pipelineValue: 'APPRENTISSAGE',
  isIndex: true,
  position: 0,
});
await createKanbanView({
  name: 'Pipeline Formation pro',
  icon: 'IconCertificate',
  stageField: 'stageFormationPro',
  pipelineValue: 'FORMATION_PRO',
  isIndex: false,
  position: 1,
});
await createKanbanView({
  name: 'Pipeline Formation continue',
  icon: 'IconBook',
  stageField: 'stageFormationContinue',
  pipelineValue: 'FORMATION_CONTINUE',
  isIndex: false,
  position: 2,
});

console.log('\n=== DONE ===');
