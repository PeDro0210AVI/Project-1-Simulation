"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const N_PUNTOS = 70;
const INTERVALO_MS = 90;
const PAUSA_AL_TERMINAR_MS = 1600;
const ANCHO = 460;
const ALTO = 200;
const MARGEN = { top: 12, right: 12, bottom: 12, left: 12 };

interface Candidato {
  x: number;
  alturaCandidata: number;
  aceptado: boolean;
}

/**
 * Un candidato de Aceptacion-Rechazo: y ~ Exp(mu) (la envolvente), altura
 * Uniforme(0, c*g(y)). Se acepta si esa altura cae bajo f(y). Misma formula
 * que engines::regular_quantity_accept_reject en Rust, evaluada en JS para
 * dibujar: esto es una ilustracion geometrica del metodo, no una medicion.
 */
function generarCandidatos(
  lambda: number,
  mu: number,
  xMax: number,
  n: number,
): Candidato[] {
  const candidatos: Candidato[] = [];
  let intentosRestantes = n * 20; // cota de seguridad, nunca deberia agotarse
  while (candidatos.length < n && intentosRestantes > 0) {
    intentosRestantes -= 1;
    const x = -Math.log(1 - Math.random()) / mu;
    if (x > xMax) continue; // cola invisible en el grafico, se resortea
    const alturaEnvolvente = lambda * Math.exp(-mu * x);
    const alturaCandidata = Math.random() * alturaEnvolvente;
    const alturaObjetivo = lambda * Math.exp(-lambda * x);
    candidatos.push({ x, alturaCandidata, aceptado: alturaCandidata <= alturaObjetivo });
  }
  return candidatos;
}

function curvaPath(fn: (x: number) => number, xMax: number, yMax: number): string {
  const pasos = 80;
  const ancho = ANCHO - MARGEN.left - MARGEN.right;
  const alto = ALTO - MARGEN.top - MARGEN.bottom;
  const puntos = Array.from({ length: pasos + 1 }, (_, i) => {
    const x = (i / pasos) * xMax;
    const y = Math.min(fn(x), yMax);
    const px = MARGEN.left + (x / xMax) * ancho;
    const py = MARGEN.top + alto - (y / yMax) * alto;
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  });
  return `M${puntos.join(" L")}`;
}

/**
 * Seccion 1: animacion comparativa de puntos aceptados/rechazados. Ilustra
 * geometricamente por que la tasa de aceptacion es ~50% (c = lambda/mu = 2):
 * la mitad del area bajo la envolvente cae fuera de la curva objetivo.
 */
export function AnimacionRechazo({ mediaRegular }: { mediaRegular: number }) {
  const lambda = 1 / mediaRegular; // TASA_REGULAR
  const mu = lambda / 2; // envolvente: la misma constante que usa el motor (rate / 2)
  const xMax = 6 / mu; // ~6 medias de la envolvente cubre >99.9% de la masa
  const yMax = lambda * 1.08;

  // "semilla" no se lee dentro de generarCandidatos: solo esta en las
  // dependencias para forzar un nuevo lote de candidatos al reiniciar.
  const [semilla, setSemilla] = useState(0);
  const candidatos = useMemo(
    () => generarCandidatos(lambda, mu, xMax, N_PUNTOS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [semilla, lambda, mu, xMax],
  );
  const [revelados, setRevelados] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);

  useEffect(() => {
    if (!reproduciendo || revelados >= candidatos.length) return;
    const id = setInterval(() => {
      setRevelados((actual) => Math.min(actual + 1, candidatos.length));
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [reproduciendo, revelados, candidatos.length]);

  useEffect(() => {
    if (!reproduciendo || revelados < candidatos.length) return;
    const id = setTimeout(() => {
      setSemilla((s) => s + 1);
      setRevelados(0);
    }, PAUSA_AL_TERMINAR_MS);
    return () => clearTimeout(id);
  }, [reproduciendo, revelados, candidatos.length]);

  const visibles = candidatos.slice(0, revelados);
  const aceptados = visibles.filter((c) => c.aceptado).length;

  const ancho = ANCHO - MARGEN.left - MARGEN.right;
  const alto = ALTO - MARGEN.top - MARGEN.bottom;
  const aPixel = (c: Candidato) => ({
    cx: MARGEN.left + (c.x / xMax) * ancho,
    cy: MARGEN.top + alto - (Math.min(c.alturaCandidata, yMax) / yMax) * alto,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Por qué se descarta la mitad</CardTitle>
        <CardDescription>
          Cada punto es un candidato de Aceptación-Rechazo: se acepta si cae bajo la curva
          objetivo (línea sólida) y se descarta si solo llega bajo la envolvente (línea
          punteada).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          className="w-full"
          role="img"
          aria-label="Puntos candidatos del metodo de Aceptacion-Rechazo, coloreados segun si fueron aceptados o descartados"
        >
          <path
            d={curvaPath((x) => lambda * Math.exp(-mu * x), xMax, yMax)}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <path
            d={curvaPath((x) => lambda * Math.exp(-lambda * x), xMax, yMax)}
            fill="none"
            stroke="var(--policy-optimal)"
            strokeWidth={2}
          />
          <AnimatePresence>
            {visibles.map((c, i) => {
              const { cx, cy } = aPixel(c);
              return (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={c.aceptado ? "var(--profit)" : "var(--waste)"}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: c.aceptado ? 0.9 : 0.55, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="numeric flex flex-wrap gap-4 text-sm">
            <span>
              <span className="font-semibold text-profit">{aceptados}</span> aceptados
            </span>
            <span>
              <span className="font-semibold text-waste">{visibles.length - aceptados}</span>{" "}
              descartados
            </span>
            <span className="text-muted-foreground">
              tasa: {visibles.length ? Math.round((100 * aceptados) / visibles.length) : 0}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              onClick={() => setReproduciendo((r) => !r)}
              aria-label={reproduciendo ? "Pausar" : "Reproducir"}
            >
              {reproduciendo ? <Pause /> : <Play />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              onClick={() => {
                setSemilla((s) => s + 1);
                setRevelados(0);
              }}
              aria-label="Reiniciar"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
