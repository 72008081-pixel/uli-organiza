import type { Metadata } from 'next';import './globals.css';
export const metadata:Metadata={title:'Uli · Mi espacio',description:'Anota una vez. Organiza tu día, tu semana y tu mes.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>;}