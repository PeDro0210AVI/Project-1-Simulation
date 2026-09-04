"""
Un dia de operacion de una tienda: de numeros aleatorios a quetzales.

Todo lo aleatorio pasa por demanda_diaria; evaluar_dia es aritmetica pura.
"""

from __future__ import annotations

from dataclasses import dataclass

from . import generadores
from .config import Franquicia


@dataclass(frozen=True)
class ResultadoDia:
    """Demanda es lo que los clientes pidieron; vendidos es lo que alcanzo a haber."""

    demanda: int
    vendidos: int
    desperdicio: int
    demanda_no_satisfecha: int
    ganancia: float


def demanda_diaria(franquicia: Franquicia) -> int:
    """
    Brownies que los clientes pidieron en un dia, hayan alcanzado o no.

    No recibe el nivel de produccion, y eso es a proposito: la demanda no depende
    de cuanto se horneo. Generarla una sola vez por (franquicia, replica, dia) y
    reusarla para todos los niveles elimina el ruido entre niveles que ensuciaria
    la comparacion (variables aleatorias comunes).
    """
    llegadas = generadores.tiempos_de_llegada(franquicia.clientes_por_dia)

    demanda = 0
    for _llegada in llegadas:
        unidades, _es_mayorista = generadores.cantidad_comprada()
        demanda += unidades
    return demanda


def evaluar_dia(franquicia: Franquicia, demanda: int, produccion: int) -> ResultadoDia:
    """
    Regla del Newsvendor sobre un dia ya simulado.

    La ganancia descuenta la produccion COMPLETA, no solo lo vendido: el brownie
    es perecedero y lo que sobra ya se pago.
    """
    vendidos = min(demanda, produccion)
    return ResultadoDia(
        demanda=demanda,
        vendidos=vendidos,
        desperdicio=max(0, produccion - demanda),
        demanda_no_satisfecha=max(0, demanda - produccion),
        ganancia=vendidos * franquicia.precio - produccion * franquicia.costo,
    )
