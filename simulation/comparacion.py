"""
Comparacion Inversa vs. Aceptacion-Rechazo para la Seccion 1 del sitio.

La variable es la misma en ambos casos -la cantidad del cliente regular,
Exp(TASA_REGULAR)- generada de dos formas. No se comparan metodos que hagan
cosas distintas: se resuelve la misma tarea de dos maneras y se mide el costo
de cada una. El detalle estadistico (media, varianza, chi-cuadrado) vive en
notebooks/generadores.ipynb; aqui solo se cronometra, para que el sitio
consuma numeros medidos y no inventados.
"""

from __future__ import annotations

import time
from typing import Any

from . import config, generadores


def medir(
    n_muestras: int = config.N_MUESTRAS_COMPARACION,
    tasa: float = config.TASA_REGULAR,
) -> dict[str, Any]:
    inicio = time.perf_counter()
    for _ in range(n_muestras):
        generadores.cantidad_regular_inversa(tasa)
    segundos_inversa = time.perf_counter() - inicio

    inicio = time.perf_counter()
    intentos = [generadores.cantidad_regular_rechazo(tasa)[1] for _ in range(n_muestras)]
    segundos_rechazo = time.perf_counter() - inicio

    candidatos_generados = sum(intentos)
    candidatos_descartados = candidatos_generados - n_muestras
    tasa_aceptacion = n_muestras / candidatos_generados
    veces_mas_lento = segundos_rechazo / segundos_inversa

    return {
        "n_muestras": n_muestras,
        "inversa": {
            "segundos": round(segundos_inversa, 4),
            "muestras_por_segundo": round(n_muestras / segundos_inversa, 2),
        },
        "rechazo": {
            "segundos": round(segundos_rechazo, 4),
            "muestras_por_segundo": round(n_muestras / segundos_rechazo, 2),
            "candidatos_generados": candidatos_generados,
            "candidatos_descartados": candidatos_descartados,
            "tasa_aceptacion": round(tasa_aceptacion, 4),
        },
        "veces_mas_lento": round(veces_mas_lento, 2),
        "conclusion": _conclusion(tasa_aceptacion, veces_mas_lento),
    }


def _conclusion(tasa_aceptacion: float, veces_mas_lento: float) -> str:
    """Recomendacion en lenguaje llano, para la Seccion 1 del sitio."""
    intentos_promedio = 1 / tasa_aceptacion
    return (
        f"Ambos metodos generan la misma Exp(media {config.MEDIA_REGULAR:.0f} "
        "brownies) y pasan la validacion estadistica (media, varianza y "
        "chi-cuadrado, ver notebooks/generadores.ipynb): los dos son "
        "correctos. La diferencia es de costo. Rechazo necesita en promedio "
        f"{intentos_promedio:.2f} candidatos por muestra aceptada -una tasa de "
        f"aceptacion de {100 * tasa_aceptacion:.0f}%, la que predice c=2- y por "
        f"eso resulta {veces_mas_lento:.1f}x mas lento. El sistema usa Inversa "
        "en produccion no porque haya medido mas rapido, sino porque la "
        "exponencial tiene F^-1 en forma cerrada: F^-1(u) = -ln(1-u)/lambda "
        "resuelve la generacion en un paso, sin descartes. Aceptacion-Rechazo "
        "se justificaria solo si F no fuera invertible, y ese caso no se "
        "presenta en este sistema."
    )
