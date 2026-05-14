import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { listarFluxosCompletos, reenviarFluxo, cancelarFluxo } from "@/services/fluxodocsOperacional";

export function FluxodocsFluxosOperacionais({ onChanged }: { onChanged: () => void }) {
  const [tick, setTick] = useState(0);
  const [busca, setBusca] = useState("");
  const fluxos = useMemo(() => listarFluxosCompletos({ incluirFinalizadores: true }), [tick]);
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return fluxos;
    return fluxos.filter(f =>
      f.protocolo.numero.toLowerCase().includes(q) ||
      f.pacienteNome?.toLowerCase().includes(q) ||
      f.convenioNome?.toLowerCase().includes(q),
    );
  }, [busca, fluxos]);

  function refresh() { setTick(t => t + 1); onChanged(); }
  function exportar() { toast.success("Excel será gerado pelo backend."); }

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-2">
        <Input placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} className="max-w-sm" />
        <Button variant="outline" onClick={exportar}>Exportar Excel</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Origem → Destino</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Convênio</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.slice(0, 50).map(f => (
              <TableRow key={f.protocolo.id}>
                <TableCell className="font-mono text-xs">{f.protocolo.numero}</TableCell>
                <TableCell className="text-xs">{f.setorOrigemNome} → {f.setorDestinoNome}</TableCell>
                <TableCell className="text-xs">{f.pacienteNome ?? "—"}</TableCell>
                <TableCell className="text-xs">{f.convenioNome ?? "—"}</TableCell>
                <TableCell><Badge variant="outline" style={{ color: f.prioridadeCor, borderColor: f.prioridadeCor }}>{f.prioridadeNome}</Badge></TableCell>
                <TableCell><Badge variant="outline" style={{ color: f.statusCor, borderColor: f.statusCor }}>{f.statusNome}</Badge></TableCell>
                <TableCell><Badge variant={f.protocolo.slaStatus === "ATRASADO" ? "destructive" : "secondary"}>{f.protocolo.slaStatus}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {f.statusNome === "Devolvido" && (
                      <Button size="sm" variant="outline" onClick={() => { reenviarFluxo(f.protocolo.id); toast.success("Reenviado."); refresh(); }}>Reenviar</Button>
                    )}
                    {!["Cancelado", "Finalizado", "Recebido"].includes(f.statusNome) && (
                      <Button size="sm" variant="ghost" onClick={() => { if (window.confirm("Cancelar este fluxo?")) { cancelarFluxo(f.protocolo.id); toast.success("Cancelado."); refresh(); } }}>Cancelar</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
