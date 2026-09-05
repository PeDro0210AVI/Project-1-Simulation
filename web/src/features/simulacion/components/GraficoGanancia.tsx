"use client";
import { memo, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Simulacion } from "@/lib/tipos";
import { serieVentaja } from "../acumulado";
const miles = (valor: number) =>
  Math.abs(valor) >= 1000 ? `Q${Math.round(valor / 1000)}k` : `Q${valor}`;
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
/**
 * Cuanto lleva ganado de mas la politica optima, dia a dia.
 *
 * Grafica la DIFERENCIA y no las dos ganancias: en absoluto las curvas se
 * superponen, porque la ventaja es ~2% del total. Asi se ve crecer, y se ven
 * los dias en que la base gana, que son parte honesta de la historia.
 *
 * Memoizado sobre `dia`: recharts redibuja un SVG completo en cada render y la
 * simulacion re-renderiza ~60 veces por segundo.
 */
export const GraficoGanancia = memo(function GraficoGanancia({
  datos,
  dia,
}: {
  datos: Simulacion;
  dia: number;
}) {
  const serie = useMemo(() => serieVentaja(datos), [datos]);
  const hastaHoy = useMemo(
    () => serie.map((punto) => (punto.dia <= dia ? punto : { ...punto, ventaja: null })),
    [serie, dia],
  );
  const limites = useMemo(() => {
    const valores = serie.map((punto) => punto.ventaja);
    const techo = Math.max(0, ...valores);
    const piso = Math.min(0, ...valores);
    const margen = Math.max(500, (techo - piso) * 0.12);
    return [Math.floor(piso - margen), Math.ceil(techo + margen)] as [number, number];
  }, [serie]);
  const hoy = serie[dia - 1];
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">Ventaja acumulada de la política óptima</h3>
        <span className="numeric text-sm font-semibold text-profit">
          {hoy.ventaja > 0 ? "+" : ""}
          {quetzales.format(hoy.ventaja)} al día {dia}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={hastaHoy} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="degradadoVentaja" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--profit)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--profit)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            domain={limites}
            tickFormatter={miles}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            formatter={(valor) => [
              typeof valor === "number" ? quetzales.format(valor) : "",
              "Ventaja acumulada",
            ]}
            labelFormatter={(etiqueta) => `Día ${etiqueta}`}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          {/* El cero: por debajo de esta linea la politica base va ganando. */}
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="ventaja"
            stroke="var(--profit)"
            strokeWidth={2.5}
            fill="url(#degradadoVentaja)"
            isAnimationActive={false}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
