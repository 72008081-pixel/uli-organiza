(function(root){
 const FIELDS=['number','title','area','kind','date','deadline','priority','status','notes','source','repeat','cost','proposed'];
 const compare=(a=[0,''],b=[0,''])=>Number(a[0])-Number(b[0])||String(a[1]).localeCompare(String(b[1]));
 const clock=(t,k)=>t._clocks?.[k]||[0,''];
 const clean=t=>Object.fromEntries(FIELDS.map(k=>[k,t[k]]));
 function mark(next,previous,device,now){const before=new Map(previous.map(t=>[t.id,t]));return next.map(t=>{const old=before.get(t.id),n={...t,_clocks:{...(t._clocks||{})}};for(const k of FIELDS){if(!old||JSON.stringify(t[k])!==JSON.stringify(old[k]))n._clocks[k]=[Math.max(now,Number(clock(old||{},k)[0])+1),device];else if(old._clocks?.[k])n._clocks[k]=old._clocks[k];}return n;});}
 function bootstrap(tasks,seed,device,now){const seeds=new Map(seed.map(t=>[t.id,t]));return tasks.map(t=>{if(t._clocks)return t;const original=seeds.get(t.id);return mark([t],original?[original]:[],device,now)[0];});}
 function merge(local,remote){const map=new Map();for(const t of [...local,...remote]){const a=map.get(t.id);if(!a){map.set(t.id,{...structuredClone(t),_clocks:{...(t._clocks||{})}});continue;}const n={...a,_clocks:{...(a._clocks||{})}};for(const k of FIELDS){if(compare(clock(t,k),clock(a,k))>0){n[k]=t[k];n._clocks[k]=clock(t,k);}else if(compare(clock(t,k),clock(a,k))===0&&JSON.stringify(t[k])!==JSON.stringify(a[k])){if(JSON.stringify(t[k])>JSON.stringify(a[k]))n[k]=t[k];}}map.set(t.id,n);}
 let list=[...map.values()].sort((a,b)=>a.number-b.number||a.id.localeCompare(b.id));const seen=new Set();let max=Math.max(0,...list.map(t=>t.number));for(const t of list){if(seen.has(t.number)){t.number=++max;t._clocks={...(t._clocks||{}),number:[Math.max(...list.map(x=>Number(clock(x,'number')[0])))+1,'renumber']};}seen.add(t.number);}return list;
 }
 const api={FIELDS,compare,mark,bootstrap,merge,clean};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.UliSyncCore=api;
})(typeof window!=='undefined'?window:this);