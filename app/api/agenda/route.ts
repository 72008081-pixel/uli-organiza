import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {agendas} from '../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {seedTasks,validTask} from '../../data';
export const dynamic='force-dynamic';
const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 const user=await getChatGPTUser();if(!user)return response({error:'Inicia sesión para abrir tu agenda.'},401);
 const db=getDb();await db.insert(agendas).values({owner:user.userId,data:JSON.stringify(seedTasks),revision:0}).onConflictDoNothing();
 const [row]=await db.select().from(agendas).where(eq(agendas.owner,user.userId));
 return response({tasks:JSON.parse(row.data),revision:row.revision});
}
export async function PUT(request:Request){
 const user=await getChatGPTUser();if(!user)return response({error:'Tu sesión expiró. Vuelve a iniciar sesión.'},401);
 if(request.headers.get('origin')!==new URL(request.url).origin)return response({error:'Origen no permitido.'},403);
 let body;try{const raw=await request.text();if(raw.length>2000000)return response({error:'Archivo demasiado grande.'},413);body=JSON.parse(raw);}catch{return response({error:'Datos inválidos.'},400);}
 if(!Number.isInteger(body.revision)||!Array.isArray(body.tasks)||body.tasks.length>2000||!body.tasks.every(validTask)||new Set(body.tasks.map((t:{id:string})=>t.id)).size!==body.tasks.length)return response({error:'Revisa el formato de tus tareas.'},400);
 const changed=await getDb().update(agendas).set({data:JSON.stringify(body.tasks),revision:body.revision+1}).where(and(eq(agendas.owner,user.userId),eq(agendas.revision,body.revision))).returning({revision:agendas.revision});
 if(!changed.length)return response({error:'Hay cambios de otro dispositivo. Pulsa Actualizar antes de guardar.'},409);
 return response({revision:changed[0].revision});
}