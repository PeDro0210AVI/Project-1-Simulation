"use client";
import type { Franquicia } from "@/lib/tipos";
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
const enteros = new Intl.NumberFormat("es-GT");
/**
 * Una recomendacion de negocio, escrita para el cliente y no para el curso.
 *
 * Muestra tres cosas juntas a proposito: que cambiar, cuanto vale y que tan
 * confiable es. Las tres recomendaciones difieren mucho en las dos ultimas
 * (Q2,620 al mes con 86% de acierto contra Q428 con 67%), y presentarlas como
 * equivalentes seria enganoso.
 *
 * El espaciado sigue una escala con significado —8px dentro de un grupo, 24px
 * entre bloques, reglas entre secciones— en lugar del gap uniforme que tenia
 * antes, donde todo estaba igual de separado y por lo tanto nada agrupaba.
 */
export function RecomendacionFranquicia({
  franquicia,
  dias,
  prioridad,
}: {
  franquicia: Franquicia;
  dias: number;
  prioridad: number;
}) {
  const { politica_base: base, politica_optima: optima, delta } = franquicia;
  const porMes = delta.ganancia * dias;
  const porcentaje = Math.round(
    (franquicia.meses_ganados / franquicia.meses_totales) * 100,
  );
  const solido = porcentaje >= 75;
  return (
    <article className="rounded-xl border bg-card">
      <header className="flex flex-wrap items-start justify-between gap-6 p-6 pb-5">
        <div className="flex gap-4">
          <span
            aria-hidden
            className="numeric font-heading text-3xl font-semibold text-border"
          >
            {String(prioridad).padStart(2, "0")}
          </span>
          <div className="space-y-1">
            <h3 className="text-xl">{franquicia.nombre}</h3>
            <p className="max-w-xs text-sm leading-snug text-muted-foreground">
              {franquicia.contexto}
            </p>
          </div>
        </div>
        <p className="numeric text-right">
          <span className="text-3xl font-semibold text-profit">
            {porMes > 0 ? "+" : ""}
            {quetzales.format(porMes)}
          </span>
          <span className="block text-xs uppercase tracking-widest text-muted-foreground">
            al mes en promedio
          </span>
        </p>
      </header>

      {/* La accion concreta, en el centro de la tarjeta y con el peso visual mas alto */}
      <div className="border-y bg-muted/40 px-6 py-5">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm text-muted-foreground">Hornear</span>
          <span className="numeric text-2xl text-muted-foreground line-through decoration-1">
            {enteros.format(base.produccion)}
          </span>
          <span className="numeric text-4xl font-semibold text-policy-optimal">
            {enteros.format(optima.produccion)}
          </span>
          <span className="text-sm text-muted-foreground">
            brownies al día
            <span className="ml-2 rounded-full bg-policy-optimal/12 px-2 py-0.5 text-xs font-medium text-policy-optimal">
              {delta.produccion > 0 ? "+" : ""}
              {delta.produccion}
            </span>
          </span>
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-6 p-6 sm:grid-cols-[1fr_1fr_auto]">
        <Efecto
          etiqueta="Ventas perdidas"
          antes={base.demanda_no_satisfecha}
          despues={optima.demanda_no_satisfecha}
          bajarEsBueno
        />
        <Efecto
          etiqueta="Producto desperdiciado"
          antes={base.desperdicio}
          despues={optima.desperdicio}
          bajarEsBueno={false}
        />
        <div className="space-y-2 sm:w-40">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Acierta
            </span>
            <span className="numeric text-sm font-semibold">{porcentaje}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full ${solido ? "bg-profit" : "bg-waste"}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="text-xs leading-snug text-muted-foreground">
            gana en {enteros.format(franquicia.meses_ganados)} de{" "}
            {enteros.format(franquicia.meses_totales)} meses
          </p>
        </div>
      </div>
    </article>
  );
}
/**
 * El efecto del ajuste sobre una metrica.
 *
 * Encabeza con el CAMBIO ("18 menos") y deja los dos estados como detalle
 * ("de 42 a 24 al dia"). Antes mostraba solo "42 -> 24", que obligaba a hacer
 * la resta y no decia cual de los dos numeros era el de hoy.
 */
function Efecto({
  etiqueta,
  antes,
  despues,
  bajarEsBueno,
}: {
  etiqueta: string;
  antes: number;
  despues: number;
  bajarEsBueno: boolean;
}) {
  const desde = Math.round(antes);
  const hasta = Math.round(despues);
  const cambio = hasta - desde;
  const baja = cambio < 0;
  const favorable = baja === bajarEsBueno;
  return (
    <div className="space-y-1.5">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground">
        {etiqueta}
      </span>
      <p
        className={`numeric text-2xl font-semibold ${favorable ? "text-profit" : "text-waste"}`}
      >
        {enteros.format(Math.abs(cambio))}{" "}
        <span className="text-base font-normal">{baja ? "menos" : "más"}</span>
      </p>
      {/* "en promedio" no es relleno: son medias sobre 30,000 dias simulados, y
          sin la aclaracion se leen como lo que pasa todos los dias. La mediana
          real es la mitad del promedio y un tercio de los dias no se pierde
          ninguna venta. */}
      <p className="numeric text-xs text-muted-foreground">
        de {enteros.format(desde)} a {enteros.format(hasta)} al día en promedio
      </p>
    </div>
  );
}
