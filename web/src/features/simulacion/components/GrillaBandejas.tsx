"use client";
import { cn } from "@/lib/utils";
import { avanceDescarga, avanceVenta } from "../fases-del-dia";
import { Brownie } from "./BrownieSprite";
/**
 * Cuantos brownies representa cada porcion del molde.
 *
 * 40 y no 12: con 12 salian mas de 40 porciones por molde y cada una quedaba en
 * 14px, tamano en el que ningun detalle del dibujo se lee. Con 40 son entre 5 y
 * 13 porciones y cada una llega a 32px, donde si se aprecian la corteza y los
 * trozos. Se pierde granularidad en el vaciado, a cambio de que se vea.
 */
export const BROWNIES_POR_PORCION = 40;
const FILAS = 2;
/**
 * El molde del dia: el camion lo trae lleno y los clientes lo vacian.
 *
 * Cada porcion vale BROWNIES_POR_PORCION brownies, asi que el ANCHO del molde
 * crece con la produccion: base contra optima se comparan de un vistazo, sin
 * leer un numero.
 *
 * El desenlace lo dice el MOLDE, no la porcion. Tenerlo en la porcion obligaba
 * a meter un tercer color entre el chocolate y el hueco, y los tres quedaban a
 * menos de 1.6:1 unos de otros. El molde, en cambio, es una superficie grande
 * que admite tinte sin pelearse con nada. Y asi el brownie siempre se ve
 * brownie.
 */
export function GrillaBandejas({
  produccion,
  vendidos,
  faltante,
  progreso,
}: {
  produccion: number;
  vendidos: number;
  faltante: number;
  progreso: number;
}) {
  const porciones = Math.max(1, Math.ceil(produccion / BROWNIES_POR_PORCION));
  const servidas = avanceDescarga(progreso) * porciones;
  const vendidosAhora = vendidos * avanceVenta(progreso);
  const cerrado = progreso >= 1;
  const sobro = cerrado && vendidos < produccion;
  const seAgoto = cerrado && faltante > 0;
  return (
    <div
      className={cn(
        // self-start: sin esto el contenedor flex padre lo estira a todo el ancho
        // y los dos moldes se ven iguales, que es justo lo que hay que comparar.
        "inline-flex self-start rounded-xl border-2 p-2 shadow-sm transition-colors duration-500",
        !cerrado && "border-[#c9b49c] bg-[#f2e7db]",
        sobro && "border-[#d9a441] bg-[#fbeacc]",
        seAgoto && "border-unmet-demand/70 bg-[#f7dcdc]",
      )}
    >
      {/* Dos filas y crecimiento hacia el costado: el ancho es proporcional a la produccion. */}
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateRows: `repeat(${Math.min(FILAS, porciones)}, 1fr)`,
          gridAutoFlow: "column",
        }}
      >
        {Array.from({ length: porciones }, (_, indice) => {
          const enElMolde = indice < servidas;
          const vendida = vendidosAhora > indice * BROWNIES_POR_PORCION;
          const conBrownie = enElMolde && !vendida;
          return (
            <span key={indice} className="grid size-9 place-items-center">
              {conBrownie ? (
                <Brownie className="size-9 drop-shadow-sm" />
              ) : (
                // hueco: el fondo del molde en sombra, la porcion ya servida
                <span className="size-6 rounded-[4px] bg-black/10 shadow-inner" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
