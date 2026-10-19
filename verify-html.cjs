const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('ULI-ORGANIZA.html','utf8'),script=html.match(/<script>([\s\S]*)<\/script>/)[1];
new vm.Script(script);
const store=new Map();let element={};
const context={console,assert,structuredClone,crypto:require('crypto'),localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:{querySelector:()=>element},window:{addEventListener:()=>{}},Intl,Date};
vm.runInNewContext(script.replace(/render\(\);\s*$/,'')+`
assert.equal(tasks.length,66);assert(tasks.every(valid));assert.equal(tasks.filter(active).length,57);
assert(!valid({...tasks[0],date:'no-fecha'}));assert(!valid({...tasks[0],title:''}));
assert.equal(monday('2026-10-25'),'2026-10-19');assert.equal(add('2026-10-31',1),'2026-11-01');
assert(esc('<script>').includes('&lt;script&gt;'));
view='Semana';anchor='2026-10-19';assert(content().includes('Practicar metrados'));view='Mes';assert(content().includes('month-grid'));
render=()=>{};const before=tasks.length;complete('foto-9');assert.equal(tasks.length,before+1);assert.equal(tasks.find(t=>t.id==='foto-9').status,'Hecho');assert(tasks.some(t=>t.title===tasks[8].title&&t.date==='2026-10-21'));
complete('foto-1');assert.equal(tasks[0].status,'Hecho');complete('foto-1');assert.equal(tasks[0].status,'Pendiente');
const persisted=JSON.parse(localStorage.getItem(KEY));assert.equal(persisted.tasks.length,67);assert(persisted.tasks.every(valid));
console.log('OK: 66 registros, validaci��n, fechas, escape HTML, vistas semanal/mensual, repetici��n y persistencia.');
`,context);