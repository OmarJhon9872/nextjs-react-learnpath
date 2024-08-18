import SideNav from '@/app/ui/dashboard/sidenav';

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