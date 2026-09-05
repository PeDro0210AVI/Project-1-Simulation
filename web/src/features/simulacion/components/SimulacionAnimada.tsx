"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import type { Simulacion } from "@/lib/tipos";
import { useReproduccionDias } from "../hooks/useReproduccionDias";
import { DefinicionBrownie } from "./BrownieSprite";
import { ControlesReproduccion } from "./ControlesReproduccion";
import { FilaFranquicia } from "./FilaFranquicia";
import { GraficoGanancia } from "./GraficoGanancia";
import { MetricasAcumuladas } from "./MetricasAcumuladas";
import { ResumenMes } from "./ResumenMes";
/**
 * Seccion 2: los 30 dias, con la politica base y la optima sobre la misma demanda.
 *
 * El orden de los bloques es deliberado. Los controles van pegados a la
 * animacion porque es lo que mueven: separados por el gráfico quedaban a 417px
 * de las bandejas y avanzar un dia no mostraba nada sin hacer scroll. Y la
 * animacion va primero porque es el sujeto de esta pantalla; los KPIs y el
 * grafico se derivan de ella, son el marcador y no el partido.
 */
export function SimulacionAnimada({ datos }: { datos: Simulacion }) {
  const totalDias = datos.meta.dias;
  const reproduccion = useReproduccionDias(totalDias);
  const cierre = useRef<HTMLDivElement>(null);
  // Al terminar el mes, el cierre queda ~1100px abajo. Se lo trae a la vista
  // para no tener que buscarlo a mano en plena presentacion.
  useEffect(() => {
    if (reproduccion.terminado) {
      cierre.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [reproduccion.terminado]);
  return (
    <div className="flex flex-col gap-4">
      <DefinicionBrownie />
      <ControlesReproduccion
        dia={reproduccion.dia}
        totalDias={totalDias}
        reproduciendo={reproduccion.reproduciendo}
        terminado={reproduccion.terminado}
        alternarReproduccion={reproduccion.alternarReproduccion}
        anterior={reproduccion.anterior}
        siguiente={reproduccion.siguiente}
        reiniciar={reproduccion.reiniciar}
      />
      <div className="flex flex-col gap-3">
        {datos.franquicias.map((franquicia) => (
          <FilaFranquicia
            key={franquicia.id}
            franquicia={franquicia}
            dia={reproduccion.dia}
            progreso={reproduccion.progreso}
          />
        ))}
      </div>
      <MetricasAcumuladas datos={datos} dia={reproduccion.dia} />
      <GraficoGanancia datos={datos} dia={reproduccion.dia} />
      <div ref={cierre}>
        <AnimatePresence>
          {reproduccion.terminado && <ResumenMes datos={datos} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
