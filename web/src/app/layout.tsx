import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

// Display para titulos. Fraunces trae ejes de SOFT y WONK que le dan un aire
// artesanal, acorde a una panaderia, y ocupa el hueco --font-heading que el
// sistema de diseno ya tenia previsto. No reemplaza la fuente de interfaz.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Punto · Simulación de inventario",
  description:
    "Análisis de políticas de inventario para franquicias de brownies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-GT" className={`${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
