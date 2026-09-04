"""
Contrato del JSON que consume el sitio: la frontera entre simulacion y front

Que consume cada seccion del sitio:
    comparacion_metodos  -> Seccion 1, Inversa vs Rechazo (Rol A)
    dias_base -> Seccion 2, contador de dias y camion
    dias_optima -> Seccion 3, contraste contra la politica base
    hallazgo -> Seccion 4, recomendacion de negocio
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import config

LLAVES_PUNTO = ("produccion", "ganancia", "desperdicio", "demanda_no_satisfecha", "vendidos")
LLAVES_DIA = ("dia", "demanda", "vendidos", "desperdicio", "demanda_no_satisfecha", "ganancia")


def construir(
    franquicias: list[dict[str, Any]],
    comparacion_metodos: dict[str, Any] | None = None,
    *,
    placeholder: bool = False,
) -> dict[str, Any]:
    total_base = sum(bloque["politica_base"]["ganancia"] for bloque in franquicias)
    total_optima = sum(bloque["politica_optima"]["ganancia"] for bloque in franquicias)

    return {
        "meta": {
            "version": config.VERSION_ESQUEMA,
            "generado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "semilla": config.SEMILLA,
            "replicas": config.REPLICAS,
            "dias": config.DIAS_POR_REPLICA,
            # true = numeros inventados; el sitio muestra un banner mientras lo sea
            "placeholder": placeholder,
        },
        "parametros": {
            "composicion": {
                "peso_mayorista": config.PESO_MAYORISTA,
                "media_regular": config.MEDIA_REGULAR,
                "media_mayorista": config.MEDIA_MAYORISTA,
                "media_mezcla_teorica": config.MEDIA_MEZCLA_TEORICA,
            },
            "redondeo": {
                "cantidad_minima": config.MINIMO_POR_CLIENTE,
                "nota": "Cantidad continua redondeada al entero mas cercano, minimo 1. Infla la media ~5%.",
            },
            "paso_produccion": config.PASO_PRODUCCION,
        },
        "franquicias": franquicias,
        "comparacion_metodos": comparacion_metodos or _comparacion_pendiente(),
        "resumen": {
            "ganancia_base": total_base,
            "ganancia_optima": total_optima,
            "mejora": total_optima - total_base,
            "mejora_pct": (100 * (total_optima - total_base) / total_base) if total_base else 0.0,
        },
    }


def _comparacion_pendiente() -> dict[str, Any]:
    """Ceros con la forma correcta, para que Rol C pueda maquetar antes que Rol A mida."""
    return {
        "n_muestras": 0,
        "inversa": {"segundos": 0.0, "muestras_por_segundo": 0.0},
        "rechazo": {
            "segundos": 0.0,
            "muestras_por_segundo": 0.0,
            "candidatos_generados": 0,
            "candidatos_descartados": 0,
            "tasa_aceptacion": 0.0,
        },
        "veces_mas_lento": 0.0,
        "conclusion": "",
    }


def validar(payload: dict[str, Any]) -> None:
    """
    Lanza ValueError si el payload no cumple el contrato.

    Corre antes de escribir: es preferible fallar aqui que entregarle a Rol C un
    JSON al que le falta una llave y le reviente el sitio sin explicacion.
    """
    for llave in ("meta", "parametros", "franquicias", "comparacion_metodos", "resumen"):
        if llave not in payload:
            raise ValueError(f"Falta la llave de primer nivel {llave!r}")

    ids_esperados = {franquicia.id for franquicia in config.FRANQUICIAS}
    ids_vistos = set()

    for indice, bloque in enumerate(payload["franquicias"]):
        ubicacion = f"franquicias[{indice}]"
        for llave in ("id", "nombre", "lambda", "precio", "costo", "barrido",
                      "politica_base", "politica_optima", "dias_base", "dias_optima",
                      "meses_ganados", "meses_totales"):
            if llave not in bloque:
                raise ValueError(f"{ubicacion}: falta {llave!r}")
        ids_vistos.add(bloque["id"])

        if not bloque["barrido"]:
            raise ValueError(f"{ubicacion}: 'barrido' esta vacio")
        for indice_punto, punto in enumerate(bloque["barrido"]):
            faltan = set(LLAVES_PUNTO) - set(punto)
            if faltan:
                raise ValueError(f"{ubicacion}.barrido[{indice_punto}]: faltan {sorted(faltan)}")

        for campo in ("politica_base", "politica_optima"):
            faltan = set(LLAVES_PUNTO) - set(bloque[campo])
            if faltan:
                raise ValueError(f"{ubicacion}.{campo}: faltan {sorted(faltan)}")

        for campo in ("dias_base", "dias_optima"):
            traza = bloque[campo]
            if len(traza) != config.DIAS_POR_REPLICA:
                raise ValueError(
                    f"{ubicacion}.{campo}: se esperaban {config.DIAS_POR_REPLICA} dias, "
                    f"hay {len(traza)}"
                )
            for indice_dia, dia in enumerate(traza):
                faltan = set(LLAVES_DIA) - set(dia)
                if faltan:
                    raise ValueError(f"{ubicacion}.{campo}[{indice_dia}]: faltan {sorted(faltan)}")

        mejor_ganancia = max(punto["ganancia"] for punto in bloque["barrido"])
        if bloque["politica_optima"]["ganancia"] < mejor_ganancia - 1e-6:
            raise ValueError(
                f"{ubicacion}: politica_optima (Q{bloque['politica_optima']['ganancia']:.2f}) "
                f"no es el maximo del barrido (Q{mejor_ganancia:.2f})"
            )

    if ids_vistos != ids_esperados:
        raise ValueError(
            f"Ids de franquicia {sorted(ids_vistos)} != esperados {sorted(ids_esperados)}"
        )


def escribir(payload: dict[str, Any], ruta: Path | None = None) -> Path:
    validar(payload)
    destino = Path(ruta) if ruta else config.RUTA_JSON
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return destino
