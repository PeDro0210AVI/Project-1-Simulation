"use client";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Franquicia } from "@/lib/tipos";
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
const enteros = new Intl.NumberFormat("es-GT");
/**
 * La curva del Newsvendor de una franquicia: ganancia esperada contra nivel de
 * produccion, con el pico marcado.
 *
 * Una por franquicia y no las tres superpuestas: los rangos no coinciden
 * (Miraflores barre 110-798, UVG 185-1154) y las escalas de ganancia tampoco,
 * asi que compartir ejes las volveria ilegibles.
 */
export function CurvaGanancia({ franquicia }: { franquicia: Franquicia }) {
  const { barrido, politica_base: base, politica_optima: optima } = franquicia;
  // El barrido trae cientos de puntos y la curva es suave: se muestrea para
  // dibujar, conservando siempre el optimo y los extremos.
  const puntos = useMemo(() => {
    const paso = Math.max(1, Math.floor(barrido.length / 180));
    const muestra = barrido.filter(
      (punto, indice) =>
        indice % paso === 0 ||
        indice === barrido.length - 1 ||
        punto.produccion === optima.produccion ||
        punto.produccion === base.produccion,
    );
    return muestra.map((punto) => ({
      produccion: punto.produccion,
      ganancia: Math.round(punto.ganancia),
    }));
  }, [barrido, optima.produccion, base.produccion]);
  const diferencia = optima.produccion - base.produccion;
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">{franquicia.nombre}</h3>
        <p className="numeric text-sm text-muted-foreground">
          {enteros.format(barrido.length)} niveles evaluados, de{" "}
          {enteros.format(barrido[0].produccion)} a{" "}
          {enteros.format(barrido[barrido.length - 1].produccion)}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={puntos} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="produccion"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tickFormatter={(valor: number) => `Q${Math.round(valor / 1000)}k`}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            formatter={(valor) => [
              typeof valor === "number" ? quetzales.format(valor) : "",
              "Ganancia diaria",
            ]}
            labelFormatter={(etiqueta) => `Producir ${enteros.format(Number(etiqueta))}`}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <ReferenceLine
            x={base.produccion}
            stroke="var(--policy-base)"
            strokeDasharray="4 4"
            label={{ value: "hoy", position: "top", fontSize: 11, fill: "var(--policy-base)" }}
          />
          <Line
            type="monotone"
            dataKey="ganancia"
            stroke="var(--profit)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceDot
            x={optima.produccion}
            y={Math.round(optima.ganancia)}
            r={5}
            fill="var(--policy-optimal)"
            stroke="var(--card)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid gap-2 border-t pt-3 sm:grid-cols-3">
        <Dato etiqueta="Hoy produce" valor={enteros.format(base.produccion)} />
        <Dato
          etiqueta="El óptimo es"
          valor={enteros.format(optima.produccion)}
          destacado
        />
        <Dato
          etiqueta="Diferencia"
          valor={`${diferencia > 0 ? "+" : ""}${enteros.format(diferencia)} al día`}
        />
      </div>
    </div>
  );
}
function Dato({
  etiqueta,
  valor,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 sm:flex-col sm:items-start sm:gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {etiqueta}
      </span>
      <span
        className={`numeric text-lg font-semibold ${destacado ? "text-policy-optimal" : ""}`}
      >
        {valor}
      </span>
    </div>
  );
}
