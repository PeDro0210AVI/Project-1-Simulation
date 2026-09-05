"use client";
import { motion } from "motion/react";
import type { Simulacion } from "@/lib/tipos";
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
const sumar = (dias: { ganancia: number }[]) =>
  dias.reduce((total, dia) => total + dia.ganancia, 0);
/**
 * Cierre del mes animado. Muestra el resultado del mes que se acaba de ver y,
 * al lado, en cuantos de los 1000 meses simulados gana la politica optima.
 *
 * Las dos cifras hacen falta: un mes puntual puede favorecer a la base (pasa en
 * ~1 de cada 7), y sin la tasa de exito ese mes parecerìa desmentir la
 * recomendacion en vez de ilustrar su varianza.
 */
export function ResumenMes({ datos }: { datos: Simulacion }) {
  const filas = datos.franquicias.map((franquicia) => {
    const base = sumar(franquicia.dias_base);
    const optima = sumar(franquicia.dias_optima);
    return { franquicia, base, optima, diferencia: optima - base };
  });
  const totalBase = filas.reduce((total, fila) => total + fila.base, 0);
  const totalOptima = filas.reduce((total, fila) => total + fila.optima, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 rounded-lg border bg-card p-5"
    >
      <div>
        <h3 className="text-lg font-semibold">Cierre del mes</h3>
        <p className="text-sm text-muted-foreground">
          Resultado de los 30 días que acabás de ver, con la frecuencia con que
          la política óptima gana en las {datos.meta.replicas.toLocaleString("es-GT")} réplicas.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {filas.map(({ franquicia, base, optima, diferencia }) => {
          const gano = diferencia > 0;
          return (
            <div
              key={franquicia.id}
              className="grid items-center gap-2 rounded-md bg-muted px-3 py-2 sm:grid-cols-[8rem_1fr_1fr_7rem_9rem]"
            >
              <span className="font-medium">{franquicia.nombre}</span>
              <span className="numeric text-sm text-muted-foreground">
                base {quetzales.format(base)}
              </span>
              <span className="numeric text-sm text-muted-foreground">
                óptima {quetzales.format(optima)}
              </span>
              <span
                className={`numeric text-sm font-semibold ${gano ? "text-profit" : "text-unmet-demand"}`}
              >
                {gano ? "+" : ""}
                {quetzales.format(diferencia)}
              </span>
              <span className="numeric text-xs text-muted-foreground">
                gana {franquicia.meses_ganados} de {franquicia.meses_totales} meses
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-baseline justify-between border-t pt-3">
        <span className="font-medium">Total del mes</span>
        <span className="numeric text-xl font-semibold text-profit">
          {totalOptima > totalBase ? "+" : ""}
          {quetzales.format(totalOptima - totalBase)}
        </span>
      </div>
    </motion.div>
  );
}
