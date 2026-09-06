"""
Capa delgada sobre el motor de Rust

Este es el UNICO modulo que importa `random_engine`. El resto del paquete habla
con estas funciones, de modo que si el motor cambia de firma solo hay que tocar
un archivo. Aqui tambien vive la regla de redondeo a unidades enteras.
"""

from __future__ import annotations

import random_engine as _motor

from .config import (
    MINIMO_POR_CLIENTE,
    SEMILLA,
    TASA_MAYORISTA,
    TASA_REGULAR,
)


def sembrar(semilla: int = SEMILLA) -> None:
    """Reinicia el generador con la semilla dada, para hacer reproducible la simulacion."""
    _motor.set_seed(semilla)


def tiempos_de_llegada(clientes_por_dia: float, horizonte: float = 1.0) -> list[float]:
    """
    Instante en que llega cada cliente, como fraccion del dia (horizonte = 1 dia).

    Acumular tiempos entre llegadas exponenciales es lo que produce un proceso de
    Poisson: el motor de Rust genera un hueco a la vez, nunca el dia completo.
    """
    tiempos: list[float] = []
    instante = 0.0
    while True:
        instante += _motor.poisson_arrival(clientes_por_dia)
        if instante > horizonte:
            # esta llegada cae despues del cierre, no cuenta
            return tiempos
        tiempos.append(instante)


def cantidad_comprada(
    tasa_regular: float = TASA_REGULAR,
    tasa_mayorista: float = TASA_MAYORISTA,
) -> tuple[int, bool]:
    """
    Unidades que compra un cliente y si resulto mayorista, por Composicion.

    La mezcla 90/10 esta cableada en el motor de Rust, no aqui.

    Redondear infla la demanda media ~5%: todo lo que cae en [0, 0.5) se fuerza a
    1 en vez de 0. Medido 3.98 brownies/cliente contra 3.80 teoricos. Es un
    supuesto de modelado y va declarado en el informe.
    """
    cantidad_continua, es_mayorista = _motor.customer_quantity(tasa_regular, tasa_mayorista)
    return max(MINIMO_POR_CLIENTE, round(cantidad_continua)), es_mayorista


def cantidad_regular_inversa(tasa: float = TASA_REGULAR) -> float:
    """
    Cantidad del cliente regular por Transformada Inversa, sin pasar por
    Composicion ni redondear. Solo para la Seccion 1 (comparacion.py): en
    produccion la cantidad real sale de cantidad_comprada.
    """
    return _motor.regular_quantity_inverse(tasa)


def cantidad_regular_rechazo(tasa: float = TASA_REGULAR) -> tuple[float, int]:
    """
    La misma cantidad del cliente regular, por Aceptacion-Rechazo, y cuantos
    candidatos costo aceptar una muestra. Solo para comparar contra Inversa en
    la Seccion 1: en produccion se usa Inversa (ver notebooks/generadores.ipynb).
    """
    return _motor.regular_quantity_accept_reject(tasa)
