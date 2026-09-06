import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const descartados = [
  {
    nombre: "Adelgazamiento (thinning)",
    resuelve: "Tasa lambda(t) variable dentro del período (ej. más clientes al mediodía)",
    porque:
      "El sistema modela totales por día, no franjas horarias. No hay tasa variable que adelgazar; el Poisson homogéneo alcanza.",
  },
  {
    nombre: "Método Polar",
    resuelve: "Generar pares de variables Normales con eficiencia",
    porque:
      "Ninguna variable del sistema es Normal - ambas fuentes (llegadas y cantidades) son exponenciales.",
  },
  {
    nombre: "Poisson bidimensional",
    resuelve: "Repartir puntos sobre una superficie (ubicaciones geográficas)",
    porque:
      "El sistema es temporal, no espacial. El camión de la animación es una decisión visual, no implica modelar posiciones.",
  },
];

/** Seccion 1: que se descarto y por que. Punto 4 del encargo de Rol A. */
export function MetodosDescartados() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos descartados</CardTitle>
        <CardDescription>
          Cada uno resuelve un problema real - no es el problema de este sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[11rem] whitespace-normal">Descartado</TableHead>
                <TableHead className="whitespace-normal">Qué resuelve</TableHead>
                <TableHead className="whitespace-normal">Por qué no aplica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {descartados.map((m) => (
                <TableRow key={m.nombre}>
                  <TableCell className="whitespace-normal font-medium">{m.nombre}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{m.resuelve}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{m.porque}</TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
