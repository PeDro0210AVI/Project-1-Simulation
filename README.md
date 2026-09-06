# Simulación de inventario de brownies

Proyecto 1 del curso CC2017, Modelización y Simulación, Universidad del Valle de
Guatemala.

Una cadena de tres franquicias hornea brownies cada mañana sin saber cuánta
gente va a llegar ese día. Lo que sobra se pierde porque el producto es
perecedero, y lo que falta es una venta que se va por la puerta. Este repo
simula la operación para encontrar cuántos brownies conviene hornear en cada
local, y cuánto vale hacer ese ajuste.

El resultado se publica como un sitio web que lee un único archivo JSON
producido por la simulación, de modo que la interfaz no contiene un solo número
escrito a mano.

## Resultado

| Franquicia | Produce hoy | Óptimo | Ganancia diaria | Meses que gana |
|---|---|---|---|---|
| Miraflores | 300 | **339** | Q4,293 | 857 de 1,000 |
| Oakland | 200 | **214** | Q2,548 | 670 de 1,000 |
| UVG | 450 | **482** | Q4,460 | 778 de 1,000 |

Las tres producen por debajo de su óptimo. Ajustar las tres suma Q142.50
diarios, unos Q4,275 al mes, sin cambiar precios ni invertir nada.

## Cómo está armado

```
simulation/            motor de simulación en Python
  config.py            parámetros del sistema, fuente única de verdad
  random_engine/       crate de Rust con los generadores (PyO3)
  generadores.py       única capa que habla con Rust
  modelo.py            demanda de un día y resultado económico de ese día
  montecarlo.py        réplicas, barrido de niveles y selección del óptimo
  comparacion.py       Inversa contra Aceptación-Rechazo (Sección 1)
  contrato.py          construye y valida el JSON, falla antes de escribir
  pipeline.py          orquesta la corrida completa
notebooks/
  generadores.ipynb    validación estadística de los generadores
web/                   sitio en Next.js que consume el JSON
  src/features/        métodos, simulación, óptimo, hallazgos
  public/data/simulacion.json
```

La frontera entre las dos mitades es `web/public/data/simulacion.json`. Su forma
está definida en `simulation/contrato.py` y espejada en `web/src/lib/rutas.ts`.
Si el JSON no cumple el contrato, la corrida falla antes de escribir el archivo.

Los parámetros del modelo viven solo en `simulation/config.py`. Si un número
aparece dos veces en el repo, uno de los dos está mal.

## Puesta en marcha

Las dependencias del sistema están declaradas en `flake.nix`.

```bash
virtualenv .venv && source .venv/bin/activate
maturin develop --release
```

`maturin develop` compila el crate de Rust y lo instala como módulo de Python
dentro del venv que esté activo en ese momento.

### Correr la simulación

Desde la raíz del repo, con el `.venv` **del proyecto** activado:

```bash
source .venv/bin/activate && python -m simulation
```

Tarda alrededor de 40 segundos y escribe `web/public/data/simulacion.json`.
Son 1,000 réplicas de 30 días por franquicia, 30,000 días simulados cada una,
contra los que se evalúan 2,205 niveles de producción.

La semilla está fija en 123 (`config.SEMILLA`), así que dos corridas con los
mismos parámetros dan exactamente los mismos números.

### Correr el sitio

```bash
cd web && npm install && npm run dev
```

El JSON se versiona en git. Si lo regenerás con parámetros distintos hay que
commitearlo, si no cada quien ve números distintos.

## El módulo de Rust se desactualiza en silencio

Si aparece esto:

```
AttributeError: module 'random_engine' has no attribute 'set_seed'
```

no falta instalar nada, el `.so` que hay en el `.venv` es un build viejo. Se
arregla recompilando:

```bash
maturin develop --release
```

Hay que hacerlo en tres casos:

1. Después de tocar cualquier código de Rust en `simulation/random_engine/`
2. Después de correr `uv pip install` o `uv sync`, porque uv no compila Rust,
   reinstala el paquete y pisa el build de maturin con un artefacto viejo
3. Al clonar el repo por primera vez

Para verificar sin adivinar:

```bash
python -c "import random_engine as r; print([f for f in dir(r) if not f.startswith('_')])"
```

Tienen que aparecer `set_seed`, `default_seed`, `poisson_arrival`,
`customer_quantity`, `regular_quantity_inverse` y
`regular_quantity_accept_reject`.

### Ojo con el venv

`random_engine` **no es un paquete de PyPI**, es el crate de Rust compilado, y
`maturin develop` lo instala en el venv activo. Si activás otro venv el módulo
no está ahí. Usar siempre el `.venv` de la raíz del proyecto.

## Roles

| Rol | Responsable | Alcance |
|---|---|---|
| A | Pedro Rubén Ávila Cofiño | Generadores en Rust, validación estadística, comparación Inversa contra Aceptación-Rechazo, Sección 1 del sitio |
| B | Bryan Alberto Martínez Orellana | Motor Monte Carlo, lógica de negocio, contrato JSON, Secciones 2, 3 y 4 del sitio |
| C | Adriana Sophia Palacios Contreras | Diseño e implementación de la interfaz |
