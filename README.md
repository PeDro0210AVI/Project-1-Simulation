## How to setup Pyo3 libraries

> See the flake.nix to see which dependencies are installed

- setup venv
  ```bash
  virtualenv .venv && source .venv/bin/activate
  ```

- compile the library with maturin in dev mode (will be set in the .venv as a library)
  ```bash
  maturin develop
  ```

- And u set with your python-binding

---

## Correr la simulación

Desde la raíz del repo, con el `.venv` **del proyecto** activado:

```bash
source .venv/bin/activate && python -m simulation
```

Tarda ~40 segundos y escribe `web/public/data/simulacion.json`, que es lo que
consume el sitio.

### ⚠️ El módulo de Rust se desactualiza en silencio

Si aparece esto:

```
AttributeError: module 'random_engine' has no attribute 'set_seed'
```

**no falta instalar nada** — el `.so` que hay en el `.venv` es un build viejo.
Se arregla recompilando:

```bash
maturin develop --release
```

Hay que hacerlo en tres casos:

1. Después de tocar cualquier código de Rust en `src/random_engine/`
2. **Después de correr `uv pip install` o `uv sync`** — uv no compila Rust,
   reinstala el paquete y pisa el build de maturin con un artefacto viejo
3. Al clonar el repo por primera vez

Para verificar sin adivinar:

```bash
python -c "import random_engine as r; print([f for f in dir(r) if not f.startswith('_')])"
```

Tienen que aparecer `set_seed`, `poisson_arrival`, `customer_quantity`,
`regular_quantity_inverse` y `regular_quantity_accept_reject`.

### Ojo con el venv

`random_engine` **no es un paquete de PyPI**: es el crate de Rust compilado, y
`maturin develop` lo instala en el venv que esté activo en ese momento. Si
activás otro venv, el módulo no está ahí.

Usar siempre el `.venv` de la raíz del proyecto.

---

## Correr el sitio

```bash
cd web && npm install && npm run dev
```

El JSON de la simulación **se versiona en git**. Si lo regenerás con parámetros
distintos, hay que commitearlo: si no, cada quien ve números distintos.
