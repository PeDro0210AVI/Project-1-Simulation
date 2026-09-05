import simulationData from "../../../../public/data/simulacion.json";
import type { Simulacion } from "@/lib/tipos";
import { CurvaGanancia } from "@/features/optimo/components/CurvaGanancia";
const datos = simulationData as Simulacion;
export default function OptimoPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1>El óptimo</h1>
        <p className="max-w-3xl text-muted-foreground">
          Para cada franquicia se evaluó todo nivel de producción posible, del
          peor día simulado al mejor. La curva sube mientras producir más gana
          ventas, y baja cuando lo que sobra empieza a costar más de lo que
          aporta. El pico es la recomendación.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {datos.franquicias.map((franquicia) => (
          <CurvaGanancia key={franquicia.id} franquicia={franquicia} />
        ))}
      </div>
    </div>
  );
}
