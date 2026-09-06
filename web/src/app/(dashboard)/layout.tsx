import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      defaultOpen
      style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
    >
      <AppSidebar />
      {/* min-w-0: sin esto el contenedor no puede encogerse por debajo del ancho
          de su contenido, y max-w-6xl (1152px) mas la barra lateral (256px)
          desbordaban la ventana, provocando scroll horizontal en las 4 secciones. */}
      <SidebarInset className="min-w-0">
        <header className="flex h-14 items-center border-b px-2">
          <SidebarTrigger
            aria-label="Abrir o cerrar navegación"
            className="cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
          />
        </header>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
