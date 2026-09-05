/**
 * El brownie, dibujado una sola vez.
 *
 * Va como <symbol> + <use> y no como un <svg> por instancia: en pantalla hay
 * decenas de porciones y repetir el arbol de nodos en cada una multiplicaria el
 * DOM sin necesidad.
 *
 * Tres decisiones que salieron de comparar variantes lado a lado:
 *
 * - Vista en tres cuartos, no de frente. Una cara superior clara sobre un
 *   lateral en sombra da volumen; de frente se lee como un cuadrado plano, que
 *   es de lo que veniamos.
 * - Trozos de chocolate ARRIBA ademas de en el corte. Son los que sostienen la
 *   textura cuando el dibujo baja a 24px y las vetas de la corteza se pierden.
 * - Contorno propio. Un trazo oscuro alrededor mantiene la silueta legible
 *   contra el molde claro y le da lectura de sticker en vez de mancha.
 */
export function DefinicionBrownie() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <symbol id="brownie" viewBox="0 0 24 24">
          {/* sombra en el molde */}
          <ellipse cx="12" cy="20.6" rx="8.6" ry="1.4" fill="#000" opacity="0.14" />
          {/* lateral: la miga */}
          <path
            d="M3.4 10.8h17.2v6.4c0 1.9-1.5 3.4-3.4 3.4H6.8c-1.9 0-3.4-1.5-3.4-3.4v-6.4Z"
            fill="#4a2812"
          />
          {/* canto iluminado, separa la tapa del lateral */}
          <path d="M3.4 10.8h17.2v1.1H3.4z" fill="#b3714a" />
          {/* trozos asomando en el corte */}
          <circle cx="7.2" cy="14.8" r="1.8" fill="#281206" />
          <circle cx="13" cy="17" r="1.3" fill="#281206" />
          <circle cx="17.2" cy="14.2" r="1.6" fill="#281206" />
          <circle cx="10" cy="17.6" r="0.9" fill="#281206" />
          {/* cara superior: la corteza */}
          <path
            d="M6.4 2.8h11.2c1.9 0 3.4 1.5 3.4 3.4v4.6H3V6.2c0-1.9 1.5-3.4 3.4-3.4Z"
            fill="#a3653a"
          />
          {/* vetas de la corteza crujiente */}
          <g fill="#d6a071" opacity="0.7">
            <path d="M5.4 5.1c2.4-.8 4.6-.4 6.8.3 1.9.6 3.6.3 5.4-.3l.4 1.2c-2.1.8-4.1 1-6.2.4-2-.6-3.8-.8-6-.3l-.4-1.3Z" />
            <path d="M4.9 8.2c2.1-.6 4-.5 5.8.1l-.4 1.2c-1.6-.5-3.2-.5-5.1 0l-.3-1.3Z" />
            <path d="M13.2 8.5c1.7-.5 3.2-.4 4.7.1l-.4 1.2c-1.3-.4-2.5-.5-4-.1l-.3-1.2Z" />
          </g>
          {/* trozos sobre la corteza: sostienen la textura en tamano chico */}
          <circle cx="15.8" cy="4.5" r="1.15" fill="#5c3419" />
          <circle cx="8.2" cy="9.3" r="0.95" fill="#5c3419" />
          <circle cx="18.4" cy="8.6" r="0.8" fill="#5c3419" />
          {/* brillo del glaseado */}
          <path
            d="M5.8 3.7h7.4c.6 0 1 .5 1 1s-.4 1-1 1H5.8c-.6 0-1-.5-1-1s.4-1 1-1Z"
            fill="#fff"
            opacity="0.14"
          />
          {/* contorno: mantiene la silueta a 24px */}
          <path
            d="M6.4 2.8h11.2c1.9 0 3.4 1.5 3.4 3.4v11c0 1.9-1.5 3.4-3.4 3.4H6.8c-1.9 0-3.4-1.5-3.4-3.4V6.2c0-1.9 1.5-3.4 3.4-3.4Z"
            fill="none"
            stroke="#3a1f0e"
            strokeWidth="0.55"
            opacity="0.45"
          />
        </symbol>
      </defs>
    </svg>
  );
}
/** Una porcion con brownie. Referencia el dibujo compartido. */
export function Brownie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <use href="#brownie" />
    </svg>
  );
}
