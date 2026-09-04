from __future__ import annotations

import argparse
import sys

from . import config, contrato, pipeline


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m simulation",
        description="Corre la simulacion Monte Carlo y exporta el JSON que consume el sitio.",
    )
    parser.add_argument(
        "--salida",
        default=None,
        help=f"Ruta de salida. Por defecto: {config.RUTA_JSON_RELATIVA}",
    )
    args = parser.parse_args(argv)

    payload = pipeline.correr()
    destino = contrato.escribir(payload, args.salida)

    rel = destino.relative_to(config.RAIZ) if destino.is_relative_to(config.RAIZ) else destino
    print(f"JSON escrito en {rel}")
    print(f"  franquicias : {len(payload['franquicias'])}")
    print(f"  semilla     : {payload['meta']['semilla']}")
    print(f"  replicas    : {payload['meta']['replicas']}  x  {payload['meta']['dias']} dias")
    return 0


sys.exit(main())
