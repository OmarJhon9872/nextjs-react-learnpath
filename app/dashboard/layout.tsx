import SideNav from '@/app/ui/dashboard/sidenav';

//Se importa para creacion de titles dinamicos
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: {
    template: '%s | OmarJhon9872 | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export const experimental_ppr = true; //Partial Prerendering, configurar archivo next 
 
export default function Layout({ children }:any) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}