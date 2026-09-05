"use client";
import { useCallback, useEffect, useState } from "react";
const MS_POR_DIA = 2000;
/**
 * Motor de reproduccion del mes.
 *
 * Lleva UN solo reloj en milisegundos y deriva de ahi el dia y el progreso
 * dentro del dia. Tener un unico estado evita que el dia y el progreso queden
 * desincronizados, que es lo que pasa al intentar avanzarlos por separado.
 */
export function useReproduccionDias(totalDias: number) {
  const [tiempo, setTiempo] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const totalMs = totalDias * MS_POR_DIA;
  const terminado = tiempo >= totalMs;
  // Math.ceil y no floor+1: asi el instante exacto tiempo = n * MS_POR_DIA cae
  // en el CIERRE del dia n (progreso 1) y no en el arranque del n+1. De eso
  // dependen el desperdicio y el faltante, que solo existen al cerrar.
  const dia = Math.min(totalDias, Math.max(1, Math.ceil(tiempo / MS_POR_DIA)));
  const progreso =
    tiempo === 0 ? 0 : Math.min(1, (tiempo - (dia - 1) * MS_POR_DIA) / MS_POR_DIA);
  useEffect(() => {
    if (!reproduciendo) return;
    let ultimo = performance.now();
    let cuadro = 0;
    const paso = (ahora: number) => {
      // Se acota el salto por cuadro: requestAnimationFrame se congela cuando la
      // pestana pasa a segundo plano, y al volver el primer delta valdria varios
      // segundos y adelantaria la simulacion de golpe. Con el tope, alejarse de
      // la pestana solo pausa.
      const delta = Math.min(ahora - ultimo, 100);
      ultimo = ahora;
      setTiempo((anterior) => {
        const siguiente = anterior + delta;
        if (siguiente >= totalMs) {
          setReproduciendo(false);
          return totalMs;
        }
        return siguiente;
      });
      cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [reproduciendo, totalMs]);
  // Situarse al cierre del dia n: ahi es donde existen el desperdicio y el faltante.
  const irADia = useCallback(
    (numero: number) => {
      const acotado = Math.min(totalDias, Math.max(1, numero));
      setReproduciendo(false);
      setTiempo(acotado * MS_POR_DIA);
    },
    [totalDias],
  );
  return {
    dia,
    progreso,
    reproduciendo,
    terminado,
    alternarReproduccion: () => {
      if (terminado) setTiempo(0);
      setReproduciendo((valor) => !valor);
    },
    siguiente: () => irADia(dia + 1),
    anterior: () => irADia(dia - 1),
    reiniciar: () => {
      setTiempo(0);
      setReproduciendo(false);
    },
  };
}
