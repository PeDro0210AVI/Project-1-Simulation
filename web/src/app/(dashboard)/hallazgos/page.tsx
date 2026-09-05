import simulationData from "../../../../public/data/simulacion.json";
import type { Simulacion } from "@/lib/tipos";
import { RecomendacionFranquicia } from "@/features/hallazgos/components/RecomendacionFranquicia";
const datos = simulationData as Simulacion;
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
export default function HallazgosPage() {
  const dias = datos.meta.dias;
  const porMes = datos.resumen.mejora * dias;
  // Se ordenan por lo que valen, no por como vienen en el JSON: la primera es
  // por donde conviene empezar.
  const porImpacto = [...datos.franquicias].sort(
    (a, b) => b.delta.ganancia - a.delta.ganancia,
  );
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1>Hallazgos</h1>
        <p className="max-w-3xl text-muted-foreground">
          Las tres franquicias están produciendo por debajo de su punto óptimo.
          Ajustar la producción diaria no requiere invertir nada: es hornear una
          cantidad distinta.
        </p>
      </div>

      <section className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Ganancia adicional esperada si las tres ajustan su producción
        </p>
        <p className="numeric mt-1 text-4xl font-semibold text-profit">
          {quetzales.format(porMes)}
          <span className="ml-2 text-base font-normal text-muted-foreground">
            al mes en promedio
          </span>
        </p>
        <p className="numeric mt-1 text-sm text-muted-foreground">
          unos {quetzales.format(porMes * 12)} al año, sin cambiar precios ni
          abrir locales. Es un promedio: hay meses mejores y meses peores
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Por franquicia</h2>
        <p className="-mt-1 text-sm text-muted-foreground">
          Ordenadas por lo que vale el ajuste. Conviene empezar por la primera.
        </p>
        {porImpacto.map((franquicia, indice) => (
          <RecomendacionFranquicia
            key={franquicia.id}
            franquicia={franquicia}
            dias={dias}
            prioridad={indice + 1}
          />
        ))}
      </section>

    </div>
  );
}
