"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ComparacionMetodos } from "@/lib/tipos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const enteros = new Intl.NumberFormat("es-GT");
const porcentaje = new Intl.NumberFormat("es-GT", {
  style: "percent",
  maximumFractionDigits: 1,
});

/**
 * Seccion 1: el contraste medido entre Inversa y Rechazo generando la misma
 * variable (Exp(media 2 brownies), la cantidad del cliente regular). Punto 1
 * del encargo de Rol A: los numeros salen de comparacion_metodos, medidos por
 * simulation/comparacion.py, no inventados.
 */
export function ComparacionInversaRechazo({
  comparacion,
}: {
  comparacion: ComparacionMetodos;
}) {
  const { inversa, rechazo } = comparacion;

  const tiempos = [
    { metodo: "Inversa", segundos: inversa.segundos, color: "var(--profit)" },
    { metodo: "Rechazo", segundos: rechazo.segundos, color: "var(--waste)" },
  ];
  const candidatos = [
    { nombre: "Aceptados", valor: comparacion.n_muestras, color: "var(--profit)" },
    {
      nombre: "Descartados",
      valor: rechazo.candidatos_descartados,
      color: "var(--waste)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inversa vs. Aceptación-Rechazo</CardTitle>
        <CardDescription>
          {enteros.format(comparacion.n_muestras)} muestras de la cantidad del cliente regular,
          generadas de las dos formas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="numeric grid gap-3 sm:grid-cols-3">
          <Metric
            label="Tasa de aceptación"
            value={porcentaje.format(rechazo.tasa_aceptacion)}
            hint="teórica: 50% (c = lambda/mu = 2)"
          />
          <Metric
            label="Rechazo es"
            value={`${comparacion.veces_mas_lento.toFixed(1)}x`}
            hint="más lento que Inversa"
          />
          <Metric
            label="Candidatos descartados"
            value={enteros.format(rechazo.candidatos_descartados)}
            hint={`de ${enteros.format(rechazo.candidatos_generados)} generados`}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Tiempo para {enteros.format(comparacion.n_muestras)} muestras
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={tiempos} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="metodo"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tickFormatter={(v: number) => `${v.toFixed(2)}s`}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
                <Tooltip
                  formatter={(valor) => [`${Number(valor).toFixed(4)} s`, "Tiempo"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="segundos" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {tiempos.map((t) => (
                    <Cell key={t.metodo} fill={t.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Candidatos generados por Rechazo</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={candidatos} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="nombre"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tickFormatter={(v: number) => enteros.format(v)}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(valor) => [enteros.format(Number(valor)), "Candidatos"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {candidatos.map((c) => (
                    <Cell key={c.nombre} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          {comparacion.conclusion}
        </p>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <small className="text-muted-foreground">{label}</small>
      <p className="mt-1 font-mono text-xl font-semibold">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
