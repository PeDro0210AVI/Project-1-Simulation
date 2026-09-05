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
      <SidebarInset>
        <header className="flex h-14 items-center border-b px-2">
          <SidebarTrigger
            aria-label="Abrir o cerrar navegación"
            className="cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
          />
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
