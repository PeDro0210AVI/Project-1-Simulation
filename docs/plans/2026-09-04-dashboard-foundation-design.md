# Base visual del dashboard de simulación

## Alcance

Preparar el frontend de Next.js para las cuatro secciones narrativas del proyecto:
Métodos, simulación base, simulación ajustada y hallazgos. No se modifica `simulation/`,
`web/src/lib/tipos.ts` ni `web/src/lib/rutas.ts`.

## Dirección visual aprobada

"Bitácora de decisión": una interfaz analítica de lectura inmediata, construida con
superficies neutras cálidas y una tinta azul oscura. Los colores acentúan estados y
comparaciones; no sustituyen a la jerarquía tipográfica ni al contenido.

## Sistema de UI

- shadcn/ui es la única fuente de controles y primitivas visuales reutilizables.
- Las clases consumen tokens semánticos. No se usan colores hardcodeados en componentes.
- Los componentes son presentacionales y reciben datos mediante props; no realizan fetch ni
  contienen reglas de negocio.
- La navegación es una sola página con anclas para evitar cambios en el contrato de rutas.
- La sidebar es colapsable y accesible en escritorio y móvil.

## Tokens de dominio

- `--color-waste`: desperdicio.
- `--color-unmet-demand`: demanda no satisfecha.
- `--color-profit`: ganancia.
- `--color-policy-base`: política base.
- `--color-policy-optimal`: política óptima.

Los cinco se definen para claro y oscuro, con contrastes distinguibles para gráficos y
comparaciones lado a lado.

## Estados de datos

- Si `meta.placeholder` es `true`, se muestra un `Alert` visible.
- Si `comparacion_metodos.n_muestras === 0`, Métodos muestra un estado `Empty` con
  "Pendiente" en vez de resultados cero.
- Las secciones prevén skeleton de carga, empty y error antes de mostrar datos.

## Tipografía

Una sans compacta y legible para interfaz; títulos con escala explícita para `h1`, `h2` y
`h3`; cuerpo y texto pequeño. Todas las superficies numéricas usan `tabular-nums`.

