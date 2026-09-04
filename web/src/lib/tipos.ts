/** Metricas promedio por dia a un nivel de produccion dado. */
export interface PuntoBarrido {
  /** Brownies producidos cada manana. */
  produccion: number;
  /** Ganancia diaria promedio, en quetzales. */
  ganancia: number;
  /** Brownies que sobraron y se perdieron, promedio diario. */
  desperdicio: number;
  /** Brownies que los clientes quisieron y no hubo, promedio diario. */
  demanda_no_satisfecha: number;
  /** Brownies efectivamente vendidos, promedio diario. */
  vendidos: number;
}

/** Un dia concreto de una corrida. Alimenta el contador y la animacion del camion. */
export interface Dia {
  /** 1..30 */
  dia: number;
  demanda: number;
  vendidos: number;
  desperdicio: number;
  demanda_no_satisfecha: number;
  ganancia: number;
}

/** Diferencia entre la politica optima y la politica base. Positivo = la optima gana. */
export interface Delta {
  produccion: number;
  ganancia: number;
  ganancia_pct: number;
  desperdicio: number;
  demanda_no_satisfecha: number;
}

export interface Franquicia {
  /** "miraflores" | "oakland" | "uvg" */
  id: string;
  nombre: string;
  contexto: string;
  /** Tasa del proceso de Poisson: clientes por dia. */
  lambda: number;
  precio: number;
  costo: number;
  /** precio - costo */
  margen: number;
  /** Curva completa de ganancia vs. produccion. Es el insumo del grafico principal. */
  barrido: PuntoBarrido[];
  /** Politica actual supuesta del cliente. Seccion 2. */
  politica_base: PuntoBarrido;
  /** Nivel que maximiza la ganancia esperada. Seccion 3. */
  politica_optima: PuntoBarrido;
  delta: Delta;
  /** 30 dias operando con la politica base. */
  dias_base: Dia[];
  /** 30 dias operando con la politica optima. */
  dias_optima: Dia[];
  /** Recomendacion de negocio en lenguaje llano. Seccion 4. */
  hallazgo: string;
}

/** Comparacion Inversa vs. Aceptacion-Rechazo (Rol A). Seccion 1. */
export interface ComparacionMetodos {
  n_muestras: number;
  inversa: { segundos: number; muestras_por_segundo: number };
  rechazo: {
    segundos: number;
    muestras_por_segundo: number;
    candidatos_generados: number;
    candidatos_descartados: number;
    tasa_aceptacion: number;
  };
  veces_mas_lento: number;
  conclusion: string;
}

export interface Meta {
  version: string;
  /** ISO 8601, UTC. */
  generado: string;
  semilla: number;
  replicas: number;
  dias: number;
  /**
   * true = los numeros son de ejemplo y NO deben presentarse.
   * El sitio debe mostrar una advertencia visible mientras esto sea true.
   */
  placeholder: boolean;
}

export interface Parametros {
  composicion: {
    peso_mayorista: number;
    media_regular: number;
    media_mayorista: number;
    media_mezcla_teorica: number;
  };
  redondeo: { cantidad_minima: number; nota: string };
  paso_produccion: number;
}

export interface Resumen {
  ganancia_base: number;
  ganancia_optima: number;
  mejora: number;
  mejora_pct: number;
}

/** Raiz del JSON. */
export interface Simulacion {
  meta: Meta;
  parametros: Parametros;
  franquicias: Franquicia[];
  comparacion_metodos: ComparacionMetodos;
  resumen: Resumen;
}
