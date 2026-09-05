"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cookie,
  FlaskConical,
  Lightbulb,
  PackageSearch,
  SlidersHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
const secciones = [
  { href: "/metodos", label: "Métodos", icon: FlaskConical },
  { href: "/simulacion-base", label: "Simulación base", icon: PackageSearch },
  {
    href: "/simulacion-ajustada",
    label: "Simulación ajustada",
    icon: SlidersHorizontal,
  },
  { href: "/hallazgos", label: "Hallazgos", icon: Lightbulb },
];
export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Cookie className="size-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">A Punto</span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              3 franquicias · Guatemala
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Análisis de inventario</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secciones.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    render={<Link href={href} />}
                    isActive={pathname === href}
                    tooltip={label}
                    className="cursor-pointer group-data-[collapsible=icon]:mx-auto"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
