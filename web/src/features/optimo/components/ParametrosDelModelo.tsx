import type { Simulacion } from "@/lib/tipos";
const enteros = new Intl.NumberFormat("es-GT");
const quetzales = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});
/**
 * Los supuestos con los que se corrió todo, declarados.
 *
 * Casi todo sale del JSON —las tasas, los precios, la mezcla, la semilla— para
 * que no puedan desincronizarse con lo que realmente se simuló. Solo las tres
 * reglas del modelo van como texto, porque son decisiones de modelado y no
 * numeros que la simulacion produzca.
 */
export function ParametrosDelModelo({ datos }: { datos: Simulacion }) {
  const { composicion } = datos.parametros;
  const pesoRegular = Math.round((1 - composicion.peso_mayorista) * 100);
  const pesoMayorista = Math.round(composicion.peso_mayorista * 100);
  return (
    <section className="rounded-xl border bg-card">
      <header className="border-b px-6 py-4">
        <h2 className="text-lg">Con qué se calculó</h2>
        <p className="text-sm text-muted-foreground">
          Los parámetros y supuestos detrás de cada curva.
        </p>
      </header>

      <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="space-y-3 p-6">
          <Rotulo>Las tiendas</Rotulo>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-1 text-left font-medium">Franquicia</th>
                <th className="pb-1 text-right font-medium">Clientes/día</th>
                <th className="pb-1 text-right font-medium">Venta</th>
                <th className="pb-1 text-right font-medium">Costo</th>
              </tr>
            </thead>
            <tbody className="numeric">
              {datos.franquicias.map((franquicia) => (
                <tr key={franquicia.id}>
                  <td className="py-1 font-medium">{franquicia.nombre}</td>
                  <td className="py-1 text-right">{franquicia.lambda}</td>
                  <td className="py-1 text-right">
                    {quetzales.format(franquicia.precio)}
                  </td>
                  <td className="py-1 text-right text-muted-foreground">
                    {quetzales.format(franquicia.costo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">
            Las llegadas siguen un proceso de Poisson con esa tasa diaria.
          </p>
        </div>

        <div className="space-y-3 p-6">
          <Rotulo>Cuánto compra cada cliente</Rotulo>
          <dl className="space-y-2 text-sm">
            <Mezcla
              peso={pesoRegular}
              tipo="regular"
              media={composicion.media_regular}
            />
            <Mezcla
              peso={pesoMayorista}
              tipo="mayorista"
              media={composicion.media_mayorista}
            />
          </dl>
          {/* -mx-6 px-6: la regla sale del padding para cruzar la columna entera,
              y el texto vuelve a alinearse con el resto del bloque. */}
          <p className="numeric -mx-6 border-t px-6 pt-3 text-sm">
            <span className="text-muted-foreground">Promedio ponderado: </span>
            <span className="font-semibold">
              {composicion.media_mezcla_teorica} brownies
            </span>
            <span className="text-muted-foreground"> por cliente</span>
          </p>
        </div>
      </div>

      <div className="border-t px-6 py-5">
        <Rotulo>Supuestos declarados</Rotulo>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>
            El brownie es <strong className="font-medium text-foreground">perecedero</strong>:
            lo que no se vende se pierde y no hay inventario que pase de un día
            al siguiente.
          </li>
          <li>
            La producción se fija{" "}
            <strong className="font-medium text-foreground">una vez cada mañana</strong>,
            sin reabastecer durante el día.
          </li>
        </ul>
      </div>

      <footer className="numeric border-t bg-muted/40 px-6 py-3 text-xs text-muted-foreground">
        {enteros.format(datos.meta.replicas)} réplicas ×{" "}
        {datos.meta.dias} días ={" "}
        {enteros.format(datos.meta.replicas * datos.meta.dias)} días simulados por
        franquicia · semilla {datos.meta.semilla} · niveles de producción
        evaluados de {datos.parametros.paso_produccion} en{" "}
        {datos.parametros.paso_produccion}
      </footer>
    </section>
  );
}
function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
      {children}
    </h3>
  );
}
function Mezcla({
  peso,
  tipo,
  media,
}: {
  peso: number;
  tipo: string;
  media: number;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="numeric w-10 shrink-0 font-semibold">{peso}%</dt>
      <dd className="text-muted-foreground">
        cliente <span className="text-foreground">{tipo}</span> — Exponencial de
        media{" "}
        <span className="numeric text-foreground">{media} brownies</span>
      </dd>
    </div>
  );
}
