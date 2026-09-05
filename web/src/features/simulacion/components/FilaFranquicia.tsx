"use client";
import { motion } from "motion/react";
import type { Franquicia } from "@/lib/tipos";
import { avanceVenta } from "../fases-del-dia";
import { CamionEntrega } from "./CamionEntrega";
import { GrillaBandejas } from "./GrillaBandejas";
const enteros = new Intl.NumberFormat("es-GT");
/** Una franquicia en un dia concreto, con sus dos politicas enfrentadas. */
export function FilaFranquicia({
  franquicia,
  dia,
  progreso,
}: {
  franquicia: Franquicia;
  dia: number;
  progreso: number;
}) {
  const base = franquicia.dias_base[dia - 1];
  const optima = franquicia.dias_optima[dia - 1];
  const clientesDelDia = Math.round(franquicia.lambda);
  // Mismo avance que consume la grilla: los clientes llegan durante la jornada
  // de venta, no mientras el camion descarga.
  const atendidos = Math.round(clientesDelDia * avanceVenta(progreso));
  return (
    <div className="grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-[11rem_1fr_1fr]">
      <div className="flex flex-col gap-1">
        <CamionEntrega progreso={progreso} />
        <h3 className="font-semibold">{franquicia.nombre}</h3>
        <motion.p
          key={dia}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="numeric text-sm text-muted-foreground"
        >
          demanda {enteros.format(base.demanda)}
        </motion.p>
        <p className="numeric text-xs text-muted-foreground">
          {enteros.format(atendidos)} / {enteros.format(clientesDelDia)} clientes
        </p>
      </div>
      <Panel titulo="Base" produccion={base} progreso={progreso} />
      <Panel titulo="Óptima" produccion={optima} progreso={progreso} />
    </div>
  );
}
function Panel({
  titulo,
  produccion,
  progreso,
}: {
  titulo: string;
  produccion: Franquicia["dias_base"][number];
  progreso: number;
}) {
  const cerrado = progreso >= 1;
  const horneados = produccion.vendidos + produccion.desperdicio;
  return (
    <div className="flex flex-col gap-2">
      {/* Etiqueta y cantidad juntas a la izquierda: con justify-between el numero
          se iba al borde del panel y quedaba lejos de su propio molde, que se
          ajusta al contenido. */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {titulo}
        </span>
        <span className="numeric text-sm font-semibold">{enteros.format(horneados)}</span>
      </div>
      <GrillaBandejas
        produccion={horneados}
        vendidos={produccion.vendidos}
        faltante={produccion.demanda_no_satisfecha}
        progreso={progreso}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: cerrado ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="numeric h-4 text-xs"
      >
        {produccion.desperdicio > 0 && (
          <span className="text-waste">sobraron {produccion.desperdicio}</span>
        )}
        {produccion.demanda_no_satisfecha > 0 && (
          <span className="text-unmet-demand">
            faltaron {produccion.demanda_no_satisfecha}
          </span>
        )}
      </motion.p>
    </div>
  );
}
