"""
Parametros del sistema y rutas de exportacion. Fuente unica de verdad:
si un numero aparece dos veces en el repo, uno de los dos esta mal.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]

# Espejo en TypeScript: web/src/lib/rutas.ts
RUTA_JSON_RELATIVA = "web/public/data/simulacion.json"
RUTA_JSON = RAIZ / RUTA_JSON_RELATIVA
DIR_SALIDAS = RAIZ / "salidas"
VERSION_ESQUEMA = "1.0"

SEMILLA = 123

MEDIA_REGULAR = 2.0
MEDIA_MAYORISTA = 20.0
PESO_MAYORISTA = 0.10
TASA_REGULAR = 1.0 / MEDIA_REGULAR
TASA_MAYORISTA = 1.0 / MEDIA_MAYORISTA
MEDIA_MEZCLA_TEORICA = (1 - PESO_MAYORISTA) * MEDIA_REGULAR + PESO_MAYORISTA * MEDIA_MAYORISTA
MINIMO_POR_CLIENTE = 1

DIAS_POR_REPLICA = 30
REPLICAS = 1000
PASO_PRODUCCION = 1


@dataclass(frozen=True)
class Franquicia:
    id: str
    nombre: str
    contexto: str
    clientes_por_dia: float
    precio: float
    costo: float
    produccion_actual: int

    @property
    def margen(self) -> float:
        return self.precio - self.costo

    @property
    def demanda_media_teorica(self) -> float:
        return self.clientes_por_dia * MEDIA_MEZCLA_TEORICA

    @property
    def razon_critica(self) -> float:
        """Newsvendor: la produccion optima es este percentil de la demanda diaria."""
        return self.margen / (self.margen + self.costo)


# clientes_por_dia, precio y costo salen del documento de contextualizacion.
# produccion_actual es un supuesto del equipo, no un dato del cliente.
FRANQUICIAS: tuple[Franquicia, ...] = (
    Franquicia(
        id="miraflores",
        nombre="Miraflores",
        contexto="Zona comercial / mall, trafico medio-alto",
        clientes_por_dia=80.0,
        precio=25.0,
        costo=9.0,
        produccion_actual=300,
    ),
    Franquicia(
        id="oakland",
        nombre="Oakland",
        contexto="Mall, trafico moderado",
        clientes_por_dia=50.0,
        precio=25.0,
        costo=9.0,
        produccion_actual=200,
    ),
    Franquicia(
        id="uvg",
        nombre="UVG",
        contexto="Campus universitario, trafico muy alto, presupuesto ajustado",
        clientes_por_dia=120.0,
        precio=20.0,
        costo=9.0,
        produccion_actual=450,
    ),
)


def buscar_franquicia(identificador: str) -> Franquicia:
    for franquicia in FRANQUICIAS:
        if franquicia.id == identificador:
            return franquicia
    disponibles = ", ".join(franquicia.id for franquicia in FRANQUICIAS)
    raise KeyError(f"No existe la franquicia {identificador!r}. Disponibles: {disponibles}")


def niveles_produccion(demanda_minima: int, demanda_maxima: int) -> list[int]:
    """
    Niveles a evaluar: del peor dia simulado al mejor. Producir menos que el peor
    dia o mas que el mejor nunca puede ser optimo, y como el optimo del Newsvendor
    es un percentil de la demanda, cae necesariamente dentro de ese rango.
    """
    return list(range(demanda_minima, demanda_maxima + 1, PASO_PRODUCCION))
