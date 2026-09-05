import simulationData from "../../../../public/data/simulacion.json";
import type { Simulacion } from "@/lib/tipos";
import { SimulacionAnimada } from "@/features/simulacion/components/SimulacionAnimada";
const datos = simulationData as Simulacion;
export default function SimulacionBasePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1>Simulación</h1>
        <p className="max-w-3xl text-muted-foreground">
          Treinta días de operación, con la política actual y la óptima sobre la
          misma demanda. El ancho de cada bandeja es lo que se horneó ese día;
          cada brownie en pantalla son 40 de verdad.
        </p>
      </div>
      <SimulacionAnimada datos={datos} />
    </div>
  );
}
