"""
Motor Monte Carlo: barrido de niveles de produccion.

Todo el azar del modulo se consume en matriz_demanda; el resto solo reevalua esa
misma demanda. Eso es deliberado: comparar todos los niveles contra exactamente
los mismos dias (variables aleatorias comunes) hace que las diferencias entre
niveles sean atribuibles al nivel y no al ruido del muestreo.
"""

from __future__ import annotations

from dataclasses import dataclass

from . import config, modelo
from .config import Franquicia


@dataclass(frozen=True)
class PuntoBarrido:
    """Un nivel de produccion y sus metricas PROMEDIO POR DIA sobre todas las replicas."""

    produccion: int
    ganancia: float
    desperdicio: float
    demanda_no_satisfecha: float
    vendidos: float


@dataclass(frozen=True)
class ResultadoFranquicia:
    """La curva completa mas los dos puntos que se contrastan en el informe."""

    franquicia: Franquicia
    barrido: list[PuntoBarrido]
    base: PuntoBarrido
    optima: PuntoBarrido
    mes_representativo: list[int]
    meses_ganados_por_optima: int
    meses_totales: int


def matriz_demanda(franquicia: Franquicia, replicas: int, dias: int) -> list[list[int]]:
    """Una fila por replica, una columna por dia. Es lo unico caro de todo el barrido."""
    return [
        [modelo.demanda_diaria(franquicia) for _ in range(dias)]
        for _ in range(replicas)
    ]


def evaluar_nivel(
    franquicia: Franquicia, demanda: list[list[int]], produccion: int
) -> PuntoBarrido:
    """Promedio POR DIA de las cuatro metricas, no total del mes."""
    total_vendidos = 0
    total_desperdicio = 0
    total_no_satisfecha = 0
    total_ganancia = 0.0
    total_dias = 0

    for replica in demanda:
        for demanda_del_dia in replica:
            dia = modelo.evaluar_dia(franquicia, demanda_del_dia, produccion)
            total_vendidos += dia.vendidos
            total_desperdicio += dia.desperdicio
            total_no_satisfecha += dia.demanda_no_satisfecha
            total_ganancia += dia.ganancia
            total_dias += 1

    return PuntoBarrido(
        produccion=produccion,
        ganancia=total_ganancia / total_dias,
        desperdicio=total_desperdicio / total_dias,
        demanda_no_satisfecha=total_no_satisfecha / total_dias,
        vendidos=total_vendidos / total_dias,
    )


def ganancia_del_mes(franquicia: Franquicia, mes: list[int], produccion: int) -> float:
    """Ganancia acumulada de un mes concreto, no el promedio diario."""
    return sum(
        modelo.evaluar_dia(franquicia, demanda, produccion).ganancia for demanda in mes
    )


def mes_representativo(demanda: list[list[int]]) -> list[int]:
    """
    El mes simulado cuya demanda media queda mas cerca de la media global.

    El criterio se fija antes de mirar que politica gana, y sirve para ilustrar
    el caso tipico sin aplanar la variacion: promediar los 1000 meses dia a dia
    daria una demanda casi constante y borraria el desperdicio, que es justo lo
    que el sitio necesita mostrar.
    """
    total_dias = sum(len(replica) for replica in demanda)
    media_global = sum(sum(replica) for replica in demanda) / total_dias
    return min(demanda, key=lambda replica: abs(sum(replica) / len(replica) - media_global))


def correr_franquicia(franquicia: Franquicia) -> ResultadoFranquicia:
    """Barrido completo de una franquicia, del peor dia simulado al mejor."""
    demanda = matriz_demanda(franquicia, config.REPLICAS, config.DIAS_POR_REPLICA)

    peor_dia = min(min(replica) for replica in demanda)
    mejor_dia = max(max(replica) for replica in demanda)

    barrido = [
        evaluar_nivel(franquicia, demanda, produccion)
        for produccion in config.niveles_produccion(peor_dia, mejor_dia)
    ]
    base = evaluar_nivel(franquicia, demanda, franquicia.produccion_actual)
    optima = max(barrido, key=lambda punto: punto.ganancia)

    ganados = sum(
        ganancia_del_mes(franquicia, mes, optima.produccion)
        > ganancia_del_mes(franquicia, mes, base.produccion)
        for mes in demanda
    )

    return ResultadoFranquicia(
        franquicia=franquicia,
        barrido=barrido,
        base=base,
        optima=optima,
        mes_representativo=mes_representativo(demanda),
        meses_ganados_por_optima=ganados,
        meses_totales=len(demanda),
    )


def traza_dias(
    franquicia: Franquicia, produccion: int, demanda_por_dia: list[int]
) -> list[dict]:
    """
    Un mes concreto dia por dia, para la animacion del sitio. No estima nada.

    Recibe la demanda en vez de generarla para que las trazas de la politica base
    y la optima puedan correr sobre el MISMO mes: asi el contraste del sitio
    muestra el efecto de la politica y no el de haber sorteado dias distintos.
    Un mes se obtiene con matriz_demanda(franquicia, 1, dias)[0].

    Las llaves son las de contrato.LLAVES_DIA.
    """
    traza = []
    for numero_dia, demanda in enumerate(demanda_por_dia, start=1):
        resultado = modelo.evaluar_dia(franquicia, demanda, produccion)
        traza.append(
            {
                "dia": numero_dia,
                "demanda": resultado.demanda,
                "vendidos": resultado.vendidos,
                "desperdicio": resultado.desperdicio,
                "demanda_no_satisfecha": resultado.demanda_no_satisfecha,
                "ganancia": resultado.ganancia,
            }
        )
    return traza
