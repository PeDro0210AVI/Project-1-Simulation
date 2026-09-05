"use client";
import type { Simulacion } from "@/lib/tipos";
import { acumularHasta } from "../acumulado";
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
const enteros = new Intl.NumberFormat("es-GT");
/**
 * Saldo de las tres franquicias juntas, del dia 1 al dia en curso.
 *
 * Se actualiza por dia y no por cuadro: recalcular sobre 90 dias sesenta veces
 * por segundo no aporta nada, y el numero solo cambia al cerrar cada dia.
 */
export function MetricasAcumuladas({
  datos,
  dia,
}: {
  datos: Simulacion;
  dia: number;
}) {
  const base = acumularHasta(datos, dia, "base");
  const optima = acumularHasta(datos, dia, "optima");
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Metrica
        titulo="Ganancia"
        base={quetzales.format(base.ganancia)}
        optima={quetzales.format(optima.ganancia)}
        delta={optima.ganancia - base.ganancia}
        formatoDelta={(valor) => quetzales.format(valor)}
        mejorSiSube
      />
      <Metrica
        titulo="Desperdicio"
        base={`${enteros.format(base.desperdicio)} brownies`}
        optima={`${enteros.format(optima.desperdicio)} brownies`}
        delta={optima.desperdicio - base.desperdicio}
        formatoDelta={(valor) => `${enteros.format(valor)} brownies`}
        mejorSiSube={false}
      />
      <Metrica
        titulo="Ventas perdidas"
        base={`${enteros.format(base.demandaNoSatisfecha)} brownies`}
        optima={`${enteros.format(optima.demandaNoSatisfecha)} brownies`}
        delta={optima.demandaNoSatisfecha - base.demandaNoSatisfecha}
        formatoDelta={(valor) => `${enteros.format(valor)} brownies`}
        mejorSiSube={false}
      />
    </div>
  );
}
function Metrica({
  titulo,
  base,
  optima,
  delta,
  formatoDelta,
  mejorSiSube,
}: {
  titulo: string;
  base: string;
  optima: string;
  delta: number;
  formatoDelta: (valor: number) => string;
  mejorSiSube: boolean;
}) {
  // Un delta positivo no siempre es bueno: mas ganancia si, mas desperdicio no.
  const favorable = mejorSiSube ? delta > 0 : delta < 0;
  const signo = delta > 0 ? "+" : "";
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {titulo}
      </span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">base</span>
        <span className="numeric text-sm">{base}</span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">óptima</span>
        <span className="numeric text-sm font-semibold">{optima}</span>
      </div>
      <div
        className={`numeric border-t pt-1 text-right text-sm font-semibold ${
          delta === 0
            ? "text-muted-foreground"
            : favorable
              ? "text-profit"
              : "text-unmet-demand"
        }`}
      >
        {signo}
        {formatoDelta(delta)}
      </div>
    </div>
  );
}
