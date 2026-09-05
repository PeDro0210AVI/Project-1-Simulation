"use client";
import { useEffect, useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
/**
 * Camion de reabastecimiento del dia.
 *
 * `src` recibe la URL y no el JSON importado: pesa 118 KB y no tiene por que
 * viajar dentro del bundle de JavaScript.
 *
 * No corre solo (`autoplay={false}`): se posiciona por porcentaje desde
 * `progreso`, el mismo reloj que mueve el dia. Asi queda sincronizado con la
 * descarga de bandejas y respeta la pausa y el paso a paso, en lugar de ir por
 * su cuenta y desfasarse.
 *
 * Es decision visual, no de modelado: el sistema simulado es temporal, no
 * espacial. El camion ilustra el reabastecimiento diario, no posiciones
 * geograficas.
 */
export function CamionEntrega({ progreso }: { progreso: number }) {
  const camion = useRef<LottieHandle>(null);
  useEffect(() => {
    camion.current?.seek({ percent: Math.min(100, progreso * 100) });
  }, [progreso]);
  return (
    <Lottie
      lottieRef={camion}
      src="/lottie/camion.json"
      autoplay={false}
      loop={false}
      // La clase .lottie-display de la libreria gana sobre las utilidades de
      // Tailwind, asi que el tamano va inline.
      style={{ width: 76, height: 76 }}
      className="shrink-0"
    />
  );
}
