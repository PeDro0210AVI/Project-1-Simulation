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
