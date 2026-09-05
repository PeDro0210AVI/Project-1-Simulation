"use client";
import { usePathname } from "next/navigation";
import {
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
const files = [
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Proyecto</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {files.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    render={<a href={href} />}
                    isActive={pathname === href}
                    tooltip={label}
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
