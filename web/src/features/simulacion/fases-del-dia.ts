/**
 * El dia se parte en dos: primero el camion descarga, despues se vende.
 *
 * Vive aparte porque la grilla y el contador de clientes tienen que usar el
 * MISMO avance de venta. Cuando cada uno derivaba lo suyo del progreso crudo,
 * el contador ya iba en 25% de clientes atendidos mientras no se habia vendido
 * una sola bandeja.
 */
export const FRACCION_DESCARGA = 0.25;
/** Cuanto de la descarga se completo, de 0 a 1. */
export function avanceDescarga(progreso: number): number {
  return Math.min(1, progreso / FRACCION_DESCARGA);
}
/** Cuanto de la jornada de venta se completo, de 0 a 1. */
export function avanceVenta(progreso: number): number {
  return Math.max(0, (progreso - FRACCION_DESCARGA) / (1 - FRACCION_DESCARGA));
}
