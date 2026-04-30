import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import {
  docConvenioSvc, tiposDocumentoSvc, tiposMovimentacaoSvc, prioridadesSvc,
} from "@/services/fluxodocs";
import { CONVENIO_OPTIONS } from "@/types/entities/fluxodocs";
import type {
  FluxodocsDocObrigatorioConvenio, FluxodocsTipoDocumento,
  FluxodocsTipoMovimentacao, FluxodocsPrioridade,
} from "@/types/entities/fluxodocs";

export default function DocumentacaoConvenioPage() {
  const [tiposDoc, setTiposDoc] = useState<FluxodocsTipoDocumento[]>([]);
  const [tiposMov, setTiposMov] = useState<FluxodocsTipoMovimentacao[]>([]);
  const [prios, setPrios] = useState<FluxodocsPrioridade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tiposDocumentoSvc.list(), tiposMovimentacaoSvc.list(), prioridadesSvc.list()])
      .then(([t, m, p]) => { setTiposDoc(t); setTiposMov(m); setPrios(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="size-4 animate-spin mr-2" /> Carregando...
    </div>
  );

  const tipoOpts = tiposDoc.map((t) => ({ id: t.id, value: t.nome }));
  const movOpts = tiposMov.map((t) => ({ id: t.id, value: t.nome }));
  const prioOpts = prios.map((p) => ({ id: p.id, value: p.nome }));
  const lbl = (opts: {id: number | string; value: string}[], id?: number | null) =>
    id == null ? "—" : (opts.find((o) => o.id === id)?.value ?? `#${id}`);

  const fields: FieldDef<FluxodocsDocObrigatorioConvenio>[] = [
    { name: "convenioId", label: "Convênio", type: "select", required: true, options: CONVENIO_OPTIONS,
      inTable: true, renderCell: (r) => lbl(CONVENIO_OPTIONS, r.convenioId) },
    { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", required: true, options: tipoOpts,
      inTable: true, renderCell: (r) => lbl(tipoOpts, r.tipoDocumentoId) },
    { name: "tipoMovimentacaoId", label: "Tipo de Movimentação (opcional)", type: "select", options: movOpts,
      renderCell: (r) => lbl(movOpts, r.tipoMovimentacaoId) },
    { name: "prioridadeId", label: "Prioridade (opcional)", type: "select", options: prioOpts,
      renderCell: (r) => lbl(prioOpts, r.prioridadeId) },
    { name: "obrigatorio", label: "Documento obrigatório", type: "switch", defaultValue: true, inTable: true,
      renderCell: (r) => r.obrigatorio ? "Sim" : "Não" },
    { name: "bloqueiaEnvio", label: "Bloqueia envio se ausente", type: "switch", defaultValue: true,
      tooltip: "Quando ativo, o protocolo não pode ser enviado sem este documento." },
    { name: "exigeJustificativaAusencia", label: "Exige justificativa quando ausente", type: "switch", defaultValue: false },
    { name: "exigeAprovacaoJustificativa", label: "Exige aprovação da justificativa", type: "switch", defaultValue: false,
      tooltip: "Quando ativo, a justificativa precisa ser aprovada antes do envio." },
    { name: "descricao", label: "Descrição", type: "textarea" },
  ];

  return (
    <SimpleCadastroPage
      title="Documentação por Convênio"
      description="Documentos exigidos por convênio. Aplica-se somente quando há convênio no item."
      entityLabel="Regra de Documentação"
      service={docConvenioSvc}
      fields={fields}
    />
  );
}
