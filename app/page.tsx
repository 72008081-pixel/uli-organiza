import { requireChatGPTUser } from './chatgpt-auth';
import Agenda from './agenda';
export const dynamic='force-dynamic';
export default async function Home(){await requireChatGPTUser('/');return <Agenda/>;}