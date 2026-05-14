import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  listarAprovacoes, aprovarJustificativa, reprovarJustificativa, solicitarCorrecaoJustificativa,
} from "@/services/fluxodocsOperacional";

export function FluxodocsAprovacoesOperacionais({ onChanged }: { onChanged: () => void }) {
  const [tick, setTick] = useState(0);
  const pendentes = useMemo(() => listarAprovacoes("PENDENTE"), [tick]);

  function refresh() { setTick(t => t + 1); onChanged(); }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pendentes.length} justificativas pendentes de aprovação.</p>
        <Link to="/configuracoes/fluxo-documentos/aprovacoes-justificativa" className="text-sm text-primary underline">
          Ir para CRUD completo
        </Link>
      </div>
      {pendentes.map(a => (
        <Card key={a.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-3 p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Protocolo #{a.protocoloId}</span>
                <Badge variant="outline">Item #{a.itemId}</Badge>
              </div>
              <div className="text-sm">{a.justificativa}</div>
              <div className="text-xs text-muted-foreground">Solicitado em {new Date(a.solicitadoEm).toLocaleString("pt-BR")}</div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" onClick={() => { aprovarJustificativa(a.id); toast.success("Justificativa aprovada."); refresh(); }}>Aprovar</Button>
              <Button size="sm" variant="destructive" onClick={() => {
                const obs = window.prompt("Motivo da reprovação:");
                if (obs) { reprovarJustificativa(a.id, obs); toast.success("Justificativa reprovada."); refresh(); }
              }}>Reprovar</Button>
              <Button size="sm" variant="outline" onClick={() => {
                const obs = window.prompt("O que precisa ser corrigido?");
                if (obs) { solicitarCorrecaoJustificativa(a.id, obs); toast.success("Correção solicitada."); refresh(); }
              }}>Solicitar correção</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {pendentes.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhuma aprovação pendente.
        </div>
      )}
    </div>
  );
}
