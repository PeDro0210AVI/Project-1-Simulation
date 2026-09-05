import simulationData from "../../../../public/data/simulacion.json";
import type { Simulacion } from "@/lib/tipos";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import { MetodosAplicados } from "@/features/metodos/components/MetodosAplicados";
import { ComparacionInversaRechazo } from "@/features/metodos/components/ComparacionInversaRechazo";
import { AnimacionRechazo } from "@/features/metodos/components/AnimacionRechazo";
import { MetodosDescartados } from "@/features/metodos/components/MetodosDescartados";

const datos = simulationData as Simulacion;

export default function MetodosPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1>Métodos</h1>
        <p className="max-w-3xl text-muted-foreground">
          Qué genera cada variable del sistema, con qué método, y por qué ese método y no otro.
          El caso central: la cantidad del cliente regular se generó de dos formas distintas para
          demostrar el criterio, no solo aplicarlo.
        </p>
      </div>
      {datos.meta.placeholder && (
        <Alert>
          <CircleAlert />
          <AlertTitle>Datos de ejemplo</AlertTitle>
          <AlertDescription>
            Estos números son ilustrativos y no deben presentarse como resultados medidos.
          </AlertDescription>
        </Alert>
      )}
      <MetodosAplicados />
      <ComparacionInversaRechazo comparacion={datos.comparacion_metodos} />
      <AnimacionRechazo mediaRegular={datos.parametros.composicion.media_regular} />
      <MetodosDescartados />
    </div>
  );
}
