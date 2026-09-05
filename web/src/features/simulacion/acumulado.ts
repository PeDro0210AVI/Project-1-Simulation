import type { Dia, Simulacion } from "@/lib/tipos";
export type Totales = {
  ganancia: number;
  desperdicio: number;
  demandaNoSatisfecha: number;
  vendidos: number;
};
const VACIO: Totales = {
  ganancia: 0,
  desperdicio: 0,
  demandaNoSatisfecha: 0,
  vendidos: 0,
};
function sumar(totales: Totales, dia: Dia): Totales {
  return {
    ganancia: totales.ganancia + dia.ganancia,
    desperdicio: totales.desperdicio + dia.desperdicio,
    demandaNoSatisfecha: totales.demandaNoSatisfecha + dia.demanda_no_satisfecha,
    vendidos: totales.vendidos + dia.vendidos,
  };
}
/** Acumulado de las tres franquicias, del dia 1 al `hastaDia` inclusive. */
export function acumularHasta(
  datos: Simulacion,
  hastaDia: number,
  politica: "base" | "optima",
): Totales {
  const campo = politica === "base" ? "dias_base" : "dias_optima";
  return datos.franquicias.reduce(
    (total, franquicia) =>
      franquicia[campo].slice(0, hastaDia).reduce(sumar, total),
    VACIO,
  );
}
/**
 * Ventaja acumulada de la politica optima sobre la base, dia a dia.
 *
 * Se grafica la DIFERENCIA y no las dos ganancias absolutas: sobre Q170,000 de
 * ganancia la ventaja son Q3,000, o sea 1.9%, y las dos curvas quedan una
 * encima de la otra. La diferencia, en cambio, arranca en cero y se lee entera.
 *
 * Se calcula sobre los 30 dias completos y no hasta el dia actual, para que la
 * escala del eje no salte en cada avance.
 */
export function serieVentaja(datos: Simulacion) {
  let acumulada = 0;
  return Array.from({ length: datos.meta.dias }, (_, indice) => {
    let delDia = 0;
    for (const franquicia of datos.franquicias) {
      delDia +=
        franquicia.dias_optima[indice].ganancia - franquicia.dias_base[indice].ganancia;
    }
    acumulada += delDia;
    return {
      dia: indice + 1,
      ventaja: Math.round(acumulada),
      delDia: Math.round(delDia),
    };
  });
}
