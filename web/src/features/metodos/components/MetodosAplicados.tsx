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

const metodos = [
  {
    nombre: "Proceso de Poisson",
    donde: "Llegadas de clientes",
    porque:
      "Lo exige el enunciado para llegadas de entidades; se construye acumulando interarribos exponenciales hasta cubrir el día.",
  },
  {
    nombre: "Transformada Inversa",
    donde: "Interarribos y cantidades",
    porque:
      "La exponencial tiene F^-1 en forma cerrada: un paso, sin descartes.",
  },
  {
    nombre: "Composición",
    donde: "Cantidad comprada",
    porque:
      "La cantidad no sigue una sola distribución sino una mezcla: 90% cliente regular Exp(media 2), 10% mayorista Exp(media 20).",
  },
];

/** Seccion 1: que se uso y por que. Punto 3 del encargo de Rol A. */
export function MetodosAplicados() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos aplicados</CardTitle>
        <CardDescription>Qué genera cada variable del sistema y por qué ese método.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Los anchos van fijados por columna y el texto largo envuelve: shadcn
            trae whitespace-nowrap por defecto en TableHead y TableCell, lo que
            forzaba la tabla a crecer y sacaba scroll horizontal. */}
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[9.5rem]">Método</TableHead>
              <TableHead className="w-[11rem]">Dónde</TableHead>
              <TableHead className="whitespace-normal">Por qué</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metodos.map((m) => (
              <TableRow key={m.nombre}>
                <TableCell className="whitespace-normal font-medium">{m.nombre}</TableCell>
                <TableCell className="whitespace-normal">{m.donde}</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {m.porque}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Composición no compite con Inversa, la usa.</span>{" "}
          Composición decide de qué subpoblación sale el cliente (con una uniforme y el corte 90/10);
          Inversa saca el número dentro de esa subpoblación. Son capas distintas, no alternativas.
        </p>
      </CardContent>
    </Card>
  );
}
