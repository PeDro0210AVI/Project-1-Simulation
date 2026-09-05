"use client";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ControlesReproduccion({
  dia,
  totalDias,
  reproduciendo,
  terminado,
  alternarReproduccion,
  anterior,
  siguiente,
  reiniciar,
}: {
  dia: number;
  totalDias: number;
  reproduciendo: boolean;
  terminado: boolean;
  alternarReproduccion: () => void;
  anterior: () => void;
  siguiente: () => void;
  reiniciar: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-baseline gap-2">
        <span className="numeric text-2xl font-semibold">
          Día{" "}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={dia}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              {dia}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-sm text-muted-foreground">de {totalDias}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={anterior}
          disabled={dia <= 1}
          aria-label="Día anterior"
        >
          <SkipBack />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={alternarReproduccion}
          aria-label={reproduciendo ? "Pausar" : "Reproducir"}
        >
          {reproduciendo ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={siguiente}
          disabled={dia >= totalDias}
          aria-label="Día siguiente"
        >
          <SkipForward />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          onClick={reiniciar}
          disabled={dia === 1 && !terminado}
          aria-label="Reiniciar"
        >
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
