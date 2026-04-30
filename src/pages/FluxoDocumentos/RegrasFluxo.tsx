import { useEffect, useState } from "react";
import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import {
  regrasFluxoSvc, setoresSvc, tiposDocumentoSvc, tiposMovimentacaoSvc,
} from "@/services/fluxodocs";
import type {
  FluxodocsRegraFluxo, FluxodocsSetor,
  FluxodocsTipoDocumento, FluxodocsTipoMovimentacao,
} from "@/types/entities/fluxodocs";
import { Loader2 } from "lucide-react";

export default function RegrasFluxoPage() {
  const [setores, setSetores] = useState<FluxodocsSetor[]>([]);
  const [tiposDoc, setTiposDoc] = useState<FluxodocsTipoDocumento[]>([]);
  const [tiposMov, setTiposMov] = useState<FluxodocsTipoMovimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([setoresSvc.list(), tiposDocumentoSvc.list(), tiposMovimentacaoSvc.list()])
      .then(([s, t, m]) => { setSetores(s); setTiposDoc(t); setTiposMov(m); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="size-4 animate-spin mr-2" /> Carregando...
    </div>;
  }

  const setorOptions = setores.map((s) => ({ id: s.id, value: `${s.sigla} - ${s.nome}` }));
  const tipoDocOptions = tiposDoc.map((t) => ({ id: t.id, value: t.nome }));
  const tipoMovOptions = tiposMov.map((t) => ({ id: t.id, value: `${t.codigo} - ${t.nome}` }));

  const lbl = (opts: {id: number; value: string}[], id: number) =>
    opts.find((o) => o.id === id)?.value ?? `#${id}`;

  const fields: FieldDef<FluxodocsRegraFluxo>[] = [
    { name: "setorOrigemId", label: "Setor Origem", type: "select", required: true, options: setorOptions,
      tooltip: "Setor responsável pelo envio.", inTable: true,
      renderCell: (r) => lbl(setorOptions, r.setorOrigemId) },
    { name: "setorDestinoId", label: "Setor Destino", type: "select", required: true, options: setorOptions,
      tooltip: "Setor responsável pelo recebimento.", inTable: true,
      renderCell: (r) => lbl(setorOptions, r.setorDestinoId) },
    { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", required: true, options: tipoDocOptions,
      inTable: true, renderCell: (r) => lbl(tipoDocOptions, r.tipoDocumentoId) },
    { name: "tipoMovimentacaoId", label: "Tipo de Movimentação", type: "select", required: true, options: tipoMovOptions,
      inTable: true, renderCell: (r) => lbl(tipoMovOptions, r.tipoMovimentacaoId) },
  ];

  return (
    <SimpleCadastroPage
      title="Regras de Fluxo"
      description="Combinações permitidas de origem → destino por tipo de documento e movimentação. Sem regra ativa, o envio é bloqueado."
      entityLabel="Regra de Fluxo"
      service={regrasFluxoSvc}
      fields={fields}
    />
  );
}
