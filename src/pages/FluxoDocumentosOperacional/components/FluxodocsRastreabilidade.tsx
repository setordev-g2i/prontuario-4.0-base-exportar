import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listarFluxosCompletos, listarLogsPorProtocolo } from "@/services/fluxodocsOperacional";

export function FluxodocsRastreabilidade() {
  const [busca, setBusca] = useState("");
  const fluxos = useMemo(() => listarFluxosCompletos({ incluirFinalizadores: true }), []);
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return fluxos.slice(0, 10);
    return fluxos.filter(f =>
      f.protocolo.numero.toLowerCase().includes(q) ||
      f.pacienteNome?.toLowerCase().includes(q) ||
      f.convenioNome?.toLowerCase().includes(q) ||
      f.contaNumero?.toLowerCase().includes(q) ||
      f.setorOrigemNome.toLowerCase().includes(q) ||
      f.setorDestinoNome.toLowerCase().includes(q),
    ).slice(0, 20);
  }, [busca, fluxos]);

  return (
    <div className="space-y-3">
      <Input placeholder="Buscar por número, paciente, conta, convênio ou setor..." value={busca} onChange={e => setBusca(e.target.value)} />
      {filtrados.map(f => {
        const logs = listarLogsPorProtocolo(f.protocolo.id);
        return (
          <Card key={f.protocolo.id}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{f.protocolo.numero}</div>
                <Badge variant="outline" style={{ color: f.statusCor, borderColor: f.statusCor }}>{f.statusNome}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {f.setorOrigemNome} → {f.setorDestinoNome}
                {f.pacienteNome && ` · 👤 ${f.pacienteNome}`}
                {f.convenioNome && ` · 🏥 ${f.convenioNome}`}
              </div>
              <div className="space-y-1 border-l-2 border-muted pl-3">
                {logs.length === 0 && <div className="text-xs text-muted-foreground">Sem eventos registrados.</div>}
                {logs.map(l => (
                  <div key={l.id} className="text-xs">
                    <span className="font-mono text-muted-foreground">{new Date(l.created).toLocaleString("pt-BR")}</span>
                    {" · "}<span className="font-medium">{l.acao}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
