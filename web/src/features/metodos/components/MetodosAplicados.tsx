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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead>Dónde</TableHead>
                <TableHead>Por qué</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metodos.map((m) => (
                <TableRow key={m.nombre}>
                  <TableCell className="font-medium whitespace-nowrap">{m.nombre}</TableCell>
                  <TableCell className="whitespace-nowrap">{m.donde}</TableCell>
                  <TableCell className="text-muted-foreground">{m.porque}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Composición no compite con Inversa, la usa.</span>{" "}
          Composición decide de qué subpoblación sale el cliente (con una uniforme y el corte 90/10);
          Inversa saca el número dentro de esa subpoblación. Son capas distintas, no alternativas.
        </p>
      </CardContent>
    </Card>
  );
}
