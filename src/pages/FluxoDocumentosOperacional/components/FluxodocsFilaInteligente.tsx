/**
 * Fila Inteligente: cards ordenados por score IA + ações.
 */
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { listarFluxosCompletos, repriorizarFluxo, receberFluxo, devolverFluxo, prioridades } from "@/services/fluxodocsOperacional";
import { ordenarFila } from "@/services/fluxodocsIa";

export function FluxodocsFilaInteligente({ onChanged }: { onChanged: () => void }) {
  const [tick, setTick] = useState(0);
  const fila = useMemo(() => ordenarFila(listarFluxosCompletos()), [tick]);

  function reordenar(id: number, prioridadeId: number) {
    repriorizarFluxo(id, prioridadeId);
    toast.success("Fila reordenada pela IA.");
    setTick(t => t + 1);
    onChanged();
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{fila.length} fluxos pendentes ordenados por score IA.</p>
      {fila.slice(0, 30).map((f, idx) => (
        <Card key={f.protocolo.id} className={idx < 3 ? "border-primary" : ""}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">#{idx + 1}</span>
                <span className="font-medium">{f.protocolo.numero}</span>
                <Badge variant="outline" style={{ color: f.prioridadeCor, borderColor: f.prioridadeCor }}>{f.prioridadeNome}</Badge>
                <Badge variant={f.protocolo.slaStatus === "ATRASADO" ? "destructive" : "secondary"}>{f.protocolo.slaStatus}</Badge>
                <Badge variant={f.riscoNivel === "ALTO" || f.riscoNivel === "BLOQUEIO" ? "destructive" : "outline"}>{f.riscoNivel}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {f.setorOrigemNome} → {f.setorDestinoNome}
                {f.convenioNome && ` · 🏥 ${f.convenioNome}`}
                {f.pacienteNome && ` · 👤 ${f.pacienteNome}`}
              </div>
              <div className="text-xs italic text-muted-foreground">{f.recomendacaoIa}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Score IA</div>
                <div className="text-lg font-semibold">{(f.scoreFila * 100).toFixed(0)}</div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => { receberFluxo(f.protocolo.id); toast.success("Fluxo recebido."); setTick(t => t + 1); onChanged(); }}>Receber</Button>
                <Button size="sm" variant="outline" onClick={() => {
                  const obs = window.prompt("Motivo da devolução:");
                  if (obs) { devolverFluxo(f.protocolo.id, obs, obs); toast.success("Fluxo devolvido."); setTick(t => t + 1); onChanged(); }
                }}>Devolver</Button>
                {prioridades.filter(p => p.situacaoId === 1).slice(0, 3).map(p => (
                  <Button key={p.id} size="sm" variant={f.protocolo.prioridadeId === p.id ? "default" : "ghost"} onClick={() => reordenar(f.protocolo.id, p.id)}>
                    {p.nome[0]}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
