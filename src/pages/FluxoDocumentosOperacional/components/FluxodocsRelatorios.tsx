import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, Download } from "lucide-react";
import { toast } from "sonner";

const relatorios = [
  "SLA por convênio",
  "Pendências documentais por convênio",
  "Bloqueios de envio",
  "Glosa prevista",
  "Produtividade por usuário",
  "Justificativas aprovadas/reprovadas",
  "Fila inteligente histórica",
  "Rastreabilidade por paciente",
  "Rastreabilidade por conta",
  "Relatório analítico item a item",
];

export function FluxodocsRelatorios() {
  function exportar(nome: string) {
    toast.success(`Relatório "${nome}" enviado para geração em Excel.`);
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {relatorios.map(r => (
        <Card key={r}>
          <CardHeader className="flex-row items-start gap-3 space-y-0 p-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary"><FileBarChart className="h-4 w-4" /></div>
            <CardTitle className="text-sm flex-1">{r}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <Button size="sm" variant="outline" className="w-full" onClick={() => exportar(r)}>
              <Download className="mr-2 h-3 w-3" /> Exportar Excel
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
