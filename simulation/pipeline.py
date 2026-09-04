"""
Orquestacion de la corrida: del motor Monte Carlo al JSON que consume el sitio.

Es la unica pieza que conoce las dos puntas, y no calcula nada de negocio: toda
la matematica ya viene resuelta en montecarlo.
"""

from __future__ import annotations

from typing import Any

from . import config, contrato, generadores, montecarlo


def _hallazgo(resultado: montecarlo.ResultadoFranquicia) -> str:
    """Recomendacion en lenguaje llano, para la Seccion 4 del sitio."""
    franquicia = resultado.franquicia
    diferencia = resultado.optima.produccion - franquicia.produccion_actual
    por_mes = (resultado.optima.ganancia - resultado.base.ganancia) * config.DIAS_POR_REPLICA

    if diferencia == 0:
        return (
            f"{franquicia.nombre} ya produce el nivel optimo "
            f"({franquicia.produccion_actual} brownies diarios). No hay ajuste que recomendar."
        )

    verbo = "sub-produciendo" if diferencia > 0 else "sobre-produciendo"
    return (
        f"{franquicia.nombre} esta {verbo} {abs(diferencia)} brownies al dia. "
        f"Pasar de {franquicia.produccion_actual} a {resultado.optima.produccion} "
        f"agregaria unos Q{por_mes:,.0f} de ganancia al mes."
    )


def bloque_franquicia(resultado: montecarlo.ResultadoFranquicia) -> dict[str, Any]:
    """Traduce un ResultadoFranquicia al bloque JSON del contrato."""
    franquicia = resultado.franquicia
    base, optima = resultado.base, resultado.optima

    def punto(p: montecarlo.PuntoBarrido) -> dict[str, Any]:
        return {
            "produccion": p.produccion,
            "ganancia": round(p.ganancia, 2),
            "desperdicio": round(p.desperdicio, 2),
            "demanda_no_satisfecha": round(p.demanda_no_satisfecha, 2),
            "vendidos": round(p.vendidos, 2),
        }

    diferencia_ganancia = optima.ganancia - base.ganancia

    return {
        "id": franquicia.id,
        "nombre": franquicia.nombre,
        "contexto": franquicia.contexto,
        "lambda": franquicia.clientes_por_dia,
        "precio": franquicia.precio,
        "costo": franquicia.costo,
        "margen": franquicia.margen,
        "barrido": [punto(p) for p in resultado.barrido],
        "politica_base": punto(base),
        "politica_optima": punto(optima),
        "delta": {
            "produccion": optima.produccion - base.produccion,
            "ganancia": round(diferencia_ganancia, 2),
            "ganancia_pct": (
                round(100 * diferencia_ganancia / abs(base.ganancia), 2) if base.ganancia else 0.0
            ),
            "desperdicio": round(optima.desperdicio - base.desperdicio, 2),
            "demanda_no_satisfecha": round(
                optima.demanda_no_satisfecha - base.demanda_no_satisfecha, 2
            ),
        },
        # El mismo mes bajo las dos politicas: el contraste del sitio muestra el
        # efecto de la decision, no el de haber sorteado dias distintos.
        "dias_base": montecarlo.traza_dias(
            franquicia, base.produccion, resultado.mes_representativo
        ),
        "dias_optima": montecarlo.traza_dias(
            franquicia, optima.produccion, resultado.mes_representativo
        ),
        "meses_ganados": resultado.meses_ganados_por_optima,
        "meses_totales": resultado.meses_totales,
        "hallazgo": _hallazgo(resultado),
    }


def correr() -> dict[str, Any]:
    """Corrida completa de las tres franquicias."""
    generadores.sembrar(config.SEMILLA)
    bloques = [
        bloque_franquicia(montecarlo.correr_franquicia(franquicia))
        for franquicia in config.FRANQUICIAS
    ]
    return contrato.construir(bloques, placeholder=False)
