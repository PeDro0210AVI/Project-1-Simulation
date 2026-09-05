# Navegación por archivos y rutas

## Decisión aprobada

El dashboard deja de ser una página con anclas. Las cuatro áreas se vuelven pantallas de
Next.js:

- `/metodos`
- `/simulacion-base`
- `/simulacion-ajustada`
- `/hallazgos`

La sidebar es un explorador de archivos café, colapsable a iconos y usable como panel lateral
en móvil. No tiene header ni footer. Cada fila representa una pantalla, con icono de archivo,
nombre y estado activo rosa.

## Límites

No se modifican `simulation/`, `web/src/lib/tipos.ts` ni `web/src/lib/rutas.ts`. Las pantallas
comparten shell y componentes de presentación, pero conservan rutas independientes.
