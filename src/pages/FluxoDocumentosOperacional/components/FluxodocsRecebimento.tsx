import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { listarFluxosCompletos, receberFluxo, devolverFluxo, aceitarParcial } from "@/services/fluxodocsOperacional";
import { sugerirMotivoDevolucao } from "@/services/fluxodocsIa";

export function FluxodocsRecebimento({ onChanged }: { onChanged: () => void }) {
  const [tick, setTick] = useState(0);
  const pendentes = useMemo(
    () => listarFluxosCompletos().filter(f => ["Enviado", "Aceito Parcial"].includes(f.statusNome)),
    [tick],
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{pendentes.length} fluxos pendentes de recebimento.</p>
      {pendentes.map(f => (
        <Card key={f.protocolo.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div>
              <div className="flex items-center gap-2 font-medium">{f.protocolo.numero}
                <Badge variant="outline" style={{ color: f.statusCor, borderColor: f.statusCor }}>{f.statusNome}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{f.setorOrigemNome} → {f.setorDestinoNome}
                {f.convenioNome && ` · 🏥 ${f.convenioNome}`} {f.pacienteNome && ` · 👤 ${f.pacienteNome}`}</div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" onClick={() => { receberFluxo(f.protocolo.id); toast.success("Fluxo aceito."); setTick(t => t + 1); onChanged(); }}>Aceitar tudo</Button>
              <Button size="sm" variant="outline" onClick={() => { aceitarParcial(f.protocolo.id); toast.success("Recebido parcialmente."); setTick(t => t + 1); onChanged(); }}>Receber parcial</Button>
              <Button size="sm" variant="outline" onClick={() => {
                const sug = sugerirMotivoDevolucao();
                const obs = window.prompt(`Motivo (sugestão IA: ${sug}):`, sug);
                if (obs) { devolverFluxo(f.protocolo.id, obs, obs); toast.success("Devolvido."); setTick(t => t + 1); onChanged(); }
              }}>Devolver</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
