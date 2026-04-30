import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import {
  slaSvc, tiposDocumentoSvc, setoresSvc, prioridadesSvc,
} from "@/services/fluxodocs";
import { CONVENIO_OPTIONS } from "@/types/entities/fluxodocs";
import type {
  FluxodocsParametroSla, FluxodocsTipoDocumento,
  FluxodocsSetor, FluxodocsPrioridade,
} from "@/types/entities/fluxodocs";

export default function ParametrosSlaPage() {
  const [tiposDoc, setTiposDoc] = useState<FluxodocsTipoDocumento[]>([]);
  const [setores, setSetores] = useState<FluxodocsSetor[]>([]);
  const [prioridades, setPrioridades] = useState<FluxodocsPrioridade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tiposDocumentoSvc.list(), setoresSvc.list(), prioridadesSvc.list()])
      .then(([t, s, p]) => { setTiposDoc(t); setSetores(s); setPrioridades(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="size-4 animate-spin mr-2" /> Carregando...
    </div>
  );

  const tipoOpts = tiposDoc.map((t) => ({ id: t.id, value: t.nome }));
  const setorOpts = setores.map((s) => ({ id: s.id, value: `${s.sigla} - ${s.nome}` }));
  const prioOpts = prioridades.map((p) => ({ id: p.id, value: p.nome }));
  const convOpts = CONVENIO_OPTIONS;
  const lbl = (opts: {id: number | string; value: string}[], id?: number | null) =>
    id == null ? "—" : (opts.find((o) => o.id === id)?.value ?? `#${id}`);

  const fields: FieldDef<FluxodocsParametroSla>[] = [
    { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", required: true, options: tipoOpts,
      inTable: true, renderCell: (r) => lbl(tipoOpts, r.tipoDocumentoId) },
    { name: "prioridadeId", label: "Prioridade", type: "select", required: true, options: prioOpts,
      inTable: true, renderCell: (r) => lbl(prioOpts, r.prioridadeId) },
    { name: "setorDestinoId", label: "Setor Destino (opcional)", type: "select", options: setorOpts,
      inTable: true, renderCell: (r) => lbl(setorOpts, r.setorDestinoId),
      tooltip: "Quando vazio, aplica-se a qualquer setor de destino." },
    { name: "convenioId", label: "Convênio (opcional)", type: "select", options: convOpts,
      inTable: true, renderCell: (r) => lbl(convOpts, r.convenioId),
      tooltip: "Se preenchido, este SLA tem prioridade sobre os SLAs sem convênio." },
    { name: "prazoHoras", label: "Prazo (horas)", type: "number", required: true, defaultValue: 24, inTable: true,
      tooltip: "Prazo em horas para conclusão da etapa." },
  ];

  return (
    <SimpleCadastroPage
      title="Parâmetros de SLA"
      description="Prazos por tipo de documento, prioridade, setor e convênio. A busca segue: convênio → tipo+setor+prioridade → tipo+prioridade → prioridade."
      entityLabel="Parâmetro de SLA"
      service={slaSvc}
      fields={fields}
    />
  );
}
