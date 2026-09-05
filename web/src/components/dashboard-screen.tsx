import simulationData from "../../public/data/simulacion.json";
import type { Simulacion } from "@/lib/tipos";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleAlert, FileSearch, TrendingUp } from "lucide-react";
const data = simulationData as Simulacion;
const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
export function DashboardScreen({
  screen,
}: {
  screen: "metodos" | "base" | "ajustada" | "hallazgos";
}) {
  const content = {
    metodos: [
      "Métodos",
      "Comparación entre Transformada Inversa y Aceptación-Rechazo.",
    ],
    base: [
      "Simulación base",
      "Política actual supuesta del cliente, por franquicia.",
    ],
    ajustada: [
      "Simulación ajustada",
      "Nivel de producción que maximiza la ganancia esperada.",
    ],
    hallazgos: [
      "Hallazgos",
      "La recomendación se deriva de las réplicas de Monte Carlo.",
    ],
  }[screen];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1>{content[0]}</h1>
        <p className="max-w-3xl text-muted-foreground">{content[1]}</p>
      </div>
      {data.meta.placeholder && (
        <Alert>
          <CircleAlert />
          <AlertTitle>Datos de ejemplo</AlertTitle>
          <AlertDescription>
            Estos números son ilustrativos y no deben presentarse como
            resultados medidos.
          </AlertDescription>
        </Alert>
      )}
      {screen === "metodos" && <Methods />}
      {screen === "base" && <PolicyTable policy="base" />}
      {screen === "ajustada" && <PolicyTable policy="optima" />}
      {screen === "hallazgos" && <Findings />}
    </div>
  );
}
function Methods() {
  const pending = data.comparacion_metodos.n_muestras === 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de generación</CardTitle>
        <CardDescription>Mediciones del Rol A.</CardDescription>
      </CardHeader>
      <CardContent>
        {pending ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileSearch />
              </EmptyMedia>
              <EmptyTitle>Pendiente</EmptyTitle>
              <EmptyDescription>
                Rol A todavía no ha entregado sus mediciones.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="numeric grid gap-3 sm:grid-cols-3">
            <Metric
              label="Muestras"
              value={data.comparacion_metodos.n_muestras.toLocaleString(
                "es-GT",
              )}
            />
            <Metric
              label="Inversa"
              value={`${data.comparacion_metodos.inversa.muestras_por_segundo.toLocaleString("es-GT")} / s`}
            />
            <Metric
              label="Rechazo"
              value={`${data.comparacion_metodos.rechazo.muestras_por_segundo.toLocaleString("es-GT")} / s`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function PolicyTable({ policy }: { policy: "base" | "optima" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultado por franquicia</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="numeric">
          <TableHeader>
            <TableRow>
              <TableHead>Franquicia</TableHead>
              <TableHead className="text-right">Producción</TableHead>
              <TableHead className="text-right">Ganancia</TableHead>
              <TableHead className="text-right">Desperdicio</TableHead>
              <TableHead className="text-right">Sin atender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.franquicias.map((f) => {
              const item =
                policy === "base" ? f.politica_base : f.politica_optima;
              return (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.nombre}</TableCell>
                  <TableCell className="text-right">
                    {item.produccion}
                  </TableCell>
                  <TableCell className="text-right">
                    {currency.format(item.ganancia)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.desperdicio.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.demanda_no_satisfecha.toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function Findings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {data.franquicias.map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-1 rounded-lg bg-muted p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3>{f.nombre}</h3>
                <Badge className="bg-profit text-profit-foreground">
                  <TrendingUp data-icon="inline-start" />
                  {f.delta.ganancia_pct.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-muted-foreground">{f.hallazgo}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <small className="text-muted-foreground">{label}</small>
      <p className="mt-1 font-mono text-xl font-semibold">{value}</p>
    </div>
  );
}
