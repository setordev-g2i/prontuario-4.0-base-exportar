/**
 * Wizard de Novo Fluxo: 4 etapas (Cabeçalho, Itens, Checklist, Revisão).
 */
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Info, Plus, Trash2, ArrowRight, ArrowLeft, FileText, Save, Send } from "lucide-react";
import {
  setores, prioridades, tiposMov, tiposItem, tiposDoc, motivos,
  contasMock, atendimentosMock, clientesMock, conveniosMock,
  validarRegraFluxo, gerarChecklistAutomatico, createFluxo,
} from "@/services/fluxodocsOperacional";
import { calcularRisco } from "@/services/fluxodocsIa";
import { calcularSla } from "@/services/fluxodocsSla";
import type { NovoFluxoDraft, FluxoItemDraft, ChecklistDraft, ItemTipo } from "@/types/entities/FluxodocsOperacional";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const initialDraft = (): NovoFluxoDraft => ({
  tipoMovimentacaoId: null,
  setorOrigemId: null,
  setorDestinoId: null,
  prioridadeId: null,
  motivoId: null,
  observacao: "",
  itens: [],
  checklist: [],
});

export function FluxodocsNovoFluxoWizard({ open, onOpenChange, onCreated }: Props) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<NovoFluxoDraft>(initialDraft);

  function reset() {
    setDraft(initialDraft());
    setStep(1);
  }
  function close() {
    onOpenChange(false);
    setTimeout(reset, 200);
  }

  function avancarParaItens() {
    if (!draft.tipoMovimentacaoId || !draft.setorOrigemId || !draft.setorDestinoId || !draft.prioridadeId) {
      toast.error("Preencha tipo de movimentação, setores e prioridade.");
      return;
    }
    if (!validarRegraFluxo(draft.setorOrigemId, draft.setorDestinoId, draft.tipoMovimentacaoId)) {
      toast.error("Fluxo não permitido. Não existe regra configurada para os setores selecionados.");
      return;
    }
    setStep(2);
  }

  function avancarParaChecklist() {
    if (draft.itens.length === 0) {
      toast.error("Adicione ao menos 1 item ao fluxo.");
      return;
    }
    const checklist = gerarChecklistAutomatico({
      convenioId: null,
      itensConvenioIds: draft.itens.map(i => i.convenioId),
    });
    setDraft(d => ({ ...d, checklist }));
    setStep(3);
  }

  function enviar(rascunho: boolean) {
    const convPrim = draft.itens.find(i => i.convenioId)?.convenioId ?? null;
    const risco = calcularRisco(draft.checklist, convPrim);
    if (!rascunho && risco.bloqueiaEnvio) {
      if (risco.nivel === "BLOQUEIO" && draft.checklist.some(c => c.aprovacaoStatus === "REPROVADO")) {
        toast.error("A justificativa foi reprovada. Corrija o item ou anexe o documento obrigatório.");
      } else if (draft.checklist.some(c => c.status === "JUSTIFICADO" && c.exigeAprovacao && c.aprovacaoStatus === "PENDENTE")) {
        toast.error("Envio bloqueado. Existe justificativa pendente de aprovação.");
      } else {
        toast.error("Envio bloqueado. Existem pendências obrigatórias no checklist documental.");
      }
      return;
    }
    const r = createFluxo({ draft, rascunho });
    toast.success(`Fluxo ${r.protocolo.numero} ${rascunho ? "salvo como rascunho" : "enviado"} com sucesso.`);
    onCreated();
    close();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => v ? onOpenChange(true) : close()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Fluxo — Etapa {step} de 4</DialogTitle>
        </DialogHeader>

        <Stepper step={step} />

        <TooltipProvider delayDuration={200}>
          {step === 1 && <EtapaCabecalho draft={draft} setDraft={setDraft} />}
          {step === 2 && <EtapaItens draft={draft} setDraft={setDraft} />}
          {step === 3 && <EtapaChecklist draft={draft} setDraft={setDraft} />}
          {step === 4 && <EtapaRevisao draft={draft} />}
        </TooltipProvider>

        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <Button variant="outline" onClick={close}>Cancelar</Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            )}
            {step === 1 && (
              <Button onClick={avancarParaItens}>Avançar <ArrowRight className="ml-2 h-4 w-4" /></Button>
            )}
            {step === 2 && (
              <Button onClick={avancarParaChecklist}>Avançar <ArrowRight className="ml-2 h-4 w-4" /></Button>
            )}
            {step === 3 && (
              <Button onClick={() => setStep(4)}>Revisar <ArrowRight className="ml-2 h-4 w-4" /></Button>
            )}
            {step === 4 && (
              <>
                <Button variant="secondary" onClick={() => enviar(true)}>
                  <Save className="mr-2 h-4 w-4" /> Salvar rascunho
                </Button>
                <Button onClick={() => enviar(false)}>
                  <Send className="mr-2 h-4 w-4" /> Enviar fluxo
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Cabeçalho", "Itens", "Checklist", "Revisão"];
  return (
    <div className="flex items-center gap-2 text-xs">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={l} className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
              active ? "bg-primary text-primary-foreground"
                : done ? "bg-emerald-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}>{n}</div>
            <span className={active ? "font-medium" : "text-muted-foreground"}>{l}</span>
            {n < 4 && <span className="text-muted-foreground">›</span>}
          </div>
        );
      })}
    </div>
  );
}

function HelpIcon({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  );
}

function EtapaCabecalho({ draft, setDraft }: { draft: NovoFluxoDraft; setDraft: React.Dispatch<React.SetStateAction<NovoFluxoDraft>> }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field label="Tipo Movimentação" tip="Define o tipo de fluxo entre setores.">
        <Select value={draft.tipoMovimentacaoId?.toString() ?? ""} onValueChange={v => setDraft(d => ({ ...d, tipoMovimentacaoId: Number(v) }))}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{tiposMov.filter(t => t.situacaoId === 1).map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.nome}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Prioridade" tip="Impacta diretamente a fila inteligente e SLA.">
        <Select value={draft.prioridadeId?.toString() ?? ""} onValueChange={v => setDraft(d => ({ ...d, prioridadeId: Number(v) }))}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{prioridades.filter(p => p.situacaoId === 1).map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Setor Origem" tip="Setor responsável pelo envio.">
        <Select value={draft.setorOrigemId?.toString() ?? ""} onValueChange={v => setDraft(d => ({ ...d, setorOrigemId: Number(v) }))}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{setores.filter(s => s.situacaoId === 1).map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.nome}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Setor Destino" tip="Setor responsável pelo recebimento.">
        <Select value={draft.setorDestinoId?.toString() ?? ""} onValueChange={v => setDraft(d => ({ ...d, setorDestinoId: Number(v) }))}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{setores.filter(s => s.situacaoId === 1).map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.nome}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Motivo" tip="Motivo do envio, devolução ou cancelamento.">
        <Select value={draft.motivoId?.toString() ?? ""} onValueChange={v => setDraft(d => ({ ...d, motivoId: Number(v) }))}>
          <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
          <SelectContent>{motivos.slice(0, 12).map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nome}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <div className="md:col-span-2">
        <Label>Observação</Label>
        <Textarea value={draft.observacao} onChange={e => setDraft(d => ({ ...d, observacao: e.target.value }))} rows={2} />
      </div>
    </div>
  );
}

function Field({ label, tip, children }: { label: string; tip: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="flex items-center gap-1.5">{label} <HelpIcon text={tip} /></Label>
      {children}
    </div>
  );
}

function EtapaItens({ draft, setDraft }: { draft: NovoFluxoDraft; setDraft: React.Dispatch<React.SetStateAction<NovoFluxoDraft>> }) {
  function add() {
    const novo: FluxoItemDraft = {
      uid: `it-${Date.now()}-${Math.random()}`,
      tipoItem: "CONTA", tipoDocumentoId: null,
      contaId: null, atendimentoId: null, clienteId: null, convenioId: null,
      descricaoManual: null, observacao: null,
    };
    setDraft(d => ({ ...d, itens: [...d.itens, novo] }));
  }
  function update(uid: string, patch: Partial<FluxoItemDraft>) {
    setDraft(d => ({ ...d, itens: d.itens.map(it => it.uid === uid ? { ...it, ...patch } : it) }));
  }
  function remove(uid: string) {
    setDraft(d => ({ ...d, itens: d.itens.filter(it => it.uid !== uid) }));
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Adicione os itens que farão parte deste fluxo.</p>
        <Button size="sm" onClick={add}><Plus className="mr-2 h-4 w-4" /> Adicionar item</Button>
      </div>
      {draft.itens.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum item adicionado.
        </div>
      )}
      {draft.itens.map((it, idx) => <ItemEditor key={it.uid} idx={idx} item={it} onUpdate={(p) => update(it.uid, p)} onRemove={() => remove(it.uid)} />)}
    </div>
  );
}

function ItemEditor({ idx, item, onUpdate, onRemove }: {
  idx: number; item: FluxoItemDraft;
  onUpdate: (p: Partial<FluxoItemDraft>) => void; onRemove: () => void;
}) {
  function selecionarConta(contaId: number) {
    const c = contasMock.find(x => x.id === contaId);
    if (!c) return;
    onUpdate({
      contaId, atendimentoId: c.atendimentoId,
      clienteId: c.clienteId, convenioId: c.convenioId,
    });
    toast.success("Dados carregados automaticamente. Paciente, atendimento e convênio preenchidos pela conta.");
  }
  function selecionarAtendimento(atId: number) {
    const a = atendimentosMock.find(x => x.id === atId);
    if (!a) return;
    onUpdate({ atendimentoId: atId, clienteId: a.clienteId, convenioId: a.convenioId });
    toast.success("Atendimento carregado. Paciente e convênio preenchidos.");
  }

  const tipo = item.tipoItem;
  const exigeDoc = tipo === "DOCUMENTO" || tipo === "OFICIO" || tipo === "MANUAL";

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Item #{idx + 1}</div>
          <Button variant="ghost" size="sm" onClick={onRemove}><Trash2 className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v: ItemTipo) => onUpdate({ tipoItem: v, contaId: null, atendimentoId: null, clienteId: null, convenioId: null, descricaoManual: null })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{tiposItem.filter(t => t.situacaoId === 1).slice(0, 6).map(t => <SelectItem key={t.codigo} value={t.codigo}>{t.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {tipo === "CONTA" && (
            <div className="md:col-span-2">
              <Label>Conta</Label>
              <Select value={item.contaId?.toString() ?? ""} onValueChange={v => selecionarConta(Number(v))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{contasMock.slice(0, 20).map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.numero}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {tipo === "ATENDIMENTO" && (
            <div className="md:col-span-2">
              <Label>Atendimento</Label>
              <Select value={item.atendimentoId?.toString() ?? ""} onValueChange={v => selecionarAtendimento(Number(v))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{atendimentosMock.slice(0, 20).map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.numero}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {tipo === "PACIENTE" && (
            <div className="md:col-span-2">
              <Label>Paciente</Label>
              <Select value={item.clienteId?.toString() ?? ""} onValueChange={v => onUpdate({ clienteId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{clientesMock.slice(0, 20).map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {exigeDoc && (
            <>
              <div>
                <Label>Tipo Documento</Label>
                <Select value={item.tipoDocumentoId?.toString() ?? ""} onValueChange={v => onUpdate({ tipoDocumentoId: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{tiposDoc.slice(0, 22).map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.nome}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={item.descricaoManual ?? ""} onChange={e => onUpdate({ descricaoManual: e.target.value })} />
              </div>
            </>
          )}

          {(item.clienteId || item.convenioId || item.atendimentoId) && (
            <div className="md:col-span-3 rounded-md bg-muted/40 p-2 text-xs">
              {item.clienteId && <span className="mr-3">👤 {clientesMock.find(c => c.id === item.clienteId)?.nome}</span>}
              {item.atendimentoId && <span className="mr-3">📋 {atendimentosMock.find(a => a.id === item.atendimentoId)?.numero}</span>}
              {item.convenioId && (
                <span>🏥 {conveniosMock.find(c => c.id === item.convenioId)?.nome} <Badge variant="secondary" className="ml-1 text-[10px]">somente leitura</Badge></span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EtapaChecklist({ draft, setDraft }: { draft: NovoFluxoDraft; setDraft: React.Dispatch<React.SetStateAction<NovoFluxoDraft>> }) {
  function update(uid: string, patch: Partial<ChecklistDraft>) {
    setDraft(d => ({ ...d, checklist: d.checklist.map(c => c.uid === uid ? { ...c, ...patch } : c) }));
  }
  function anexar(c: ChecklistDraft) {
    update(c.uid, { status: "ANEXADO", documentoNome: `doc-${Date.now()}.pdf` });
    toast.success("Documento anexado com sucesso.");
  }
  function confirmar(c: ChecklistDraft) {
    update(c.uid, { status: "CONFIRMADO" });
    toast.success("Documento confirmado com base no sistema.");
  }
  function justificar(c: ChecklistDraft, j: string) {
    const novoApr = c.exigeAprovacao ? "PENDENTE" as const : "NAO_APLICA" as const;
    update(c.uid, { status: "JUSTIFICADO", justificativa: j, aprovacaoStatus: novoApr });
    toast.success("Justificativa registrada.");
  }
  function reset(c: ChecklistDraft) {
    update(c.uid, { status: "PENDENTE", justificativa: null, documentoNome: null, aprovacaoStatus: "NAO_APLICA" });
  }

  if (draft.checklist.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Nenhuma exigência documental para os convênios selecionados. Fluxo livre.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <strong>Checklist Documental</strong>
        <HelpIcon text="Documentos exigidos conforme convênio e regras." />
      </div>
      {draft.checklist.map(c => {
        const td = tiposDoc.find(t => t.id === c.tipoDocumentoId);
        return (
          <Card key={c.uid}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{td?.nome ?? `Doc #${c.tipoDocumentoId}`}</div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {c.obrigatorio && <span>Obrigatório</span>}
                    {c.bloqueiaEnvio && <span>Bloqueia envio</span>}
                    {c.exigeAprovacao && <span>Exige aprovação</span>}
                  </div>
                </div>
                <StatusChecklistBadge status={c.status} aprov={c.aprovacaoStatus} />
              </div>
              {c.justificativa && <div className="text-xs italic text-muted-foreground">"{c.justificativa}"</div>}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => anexar(c)}>Anexar</Button>
                <Button size="sm" variant="outline" onClick={() => confirmar(c)} title="Use quando o documento já estiver no sistema.">Confirmar no sistema</Button>
                <Button size="sm" variant="outline" onClick={() => {
                  const j = window.prompt("Justificativa de ausência:");
                  if (j) justificar(c, j);
                }}>Justificar ausência</Button>
                {c.status !== "PENDENTE" && (
                  <Button size="sm" variant="ghost" onClick={() => reset(c)}>Limpar</Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatusChecklistBadge({ status, aprov }: { status: ChecklistDraft["status"]; aprov: ChecklistDraft["aprovacaoStatus"] }) {
  const map: Record<string, { color: string; label: string }> = {
    PENDENTE: { color: "#f59e0b", label: "Pendente" },
    ANEXADO: { color: "#10b981", label: "Anexado" },
    CONFIRMADO: { color: "#0ea5e9", label: "Confirmado" },
    JUSTIFICADO: { color: "#8b5cf6", label: "Justificado" },
    BLOQUEANTE: { color: "#ef4444", label: "Bloqueante" },
  };
  const m = map[status];
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" style={{ color: m.color, borderColor: m.color }}>{m.label}</Badge>
      {status === "JUSTIFICADO" && aprov === "PENDENTE" && (
        <Badge variant="outline" className="text-amber-600 border-amber-600">Aprovação pendente</Badge>
      )}
      {aprov === "REPROVADO" && <Badge variant="destructive">Reprovada</Badge>}
    </div>
  );
}

function EtapaRevisao({ draft }: { draft: NovoFluxoDraft }) {
  const convPrim = draft.itens.find(i => i.convenioId)?.convenioId ?? null;
  const tipoDoc = draft.itens.find(i => i.tipoDocumentoId)?.tipoDocumentoId ?? null;
  const sla = useMemo(() => calcularSla({
    convenioId: convPrim, tipoDocumentoId: tipoDoc,
    setorDestinoId: draft.setorDestinoId!, prioridadeId: draft.prioridadeId!,
  }), [draft.setorDestinoId, draft.prioridadeId, convPrim, tipoDoc]);
  const risco = calcularRisco(draft.checklist, convPrim);

  return (
    <div className="space-y-3 text-sm">
      <Card><CardContent className="p-3 space-y-1">
        <div className="font-medium flex items-center gap-2"><FileText className="h-4 w-4" /> Cabeçalho</div>
        <div>{tiposMov.find(t => t.id === draft.tipoMovimentacaoId)?.nome} · {prioridades.find(p => p.id === draft.prioridadeId)?.nome}</div>
        <div>{setores.find(s => s.id === draft.setorOrigemId)?.nome} → {setores.find(s => s.id === draft.setorDestinoId)?.nome}</div>
        {draft.observacao && <div className="text-muted-foreground italic">{draft.observacao}</div>}
      </CardContent></Card>

      <Card><CardContent className="p-3 space-y-1">
        <div className="font-medium">Itens ({draft.itens.length})</div>
        {draft.itens.map((i, idx) => (
          <div key={i.uid} className="text-xs text-muted-foreground">
            #{idx + 1} {i.tipoItem}
            {i.clienteId && ` · 👤 ${clientesMock.find(c => c.id === i.clienteId)?.nome}`}
            {i.convenioId && ` · 🏥 ${conveniosMock.find(c => c.id === i.convenioId)?.nome}`}
          </div>
        ))}
      </CardContent></Card>

      <Card><CardContent className="p-3 space-y-2">
        <div className="font-medium">SLA & IA</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>SLA previsto: <strong>{new Date(sla.slaPrevistoEm).toLocaleString("pt-BR")}</strong></div>
          <div>Risco atraso: <strong>{(sla.iaRiscoAtraso * 100).toFixed(0)}%</strong></div>
          <div>Origem SLA: {sla.origem}</div>
          <div>Risco glosa: <strong>{(risco.riscoGlosa * 100).toFixed(0)}%</strong></div>
        </div>
        <div className="rounded-md bg-muted/40 p-2 text-xs">
          <strong>Recomendação IA:</strong> {risco.recomendacao}
        </div>
        {risco.bloqueiaEnvio && (
          <Badge variant="destructive">Envio bloqueado — pendências no checklist</Badge>
        )}
      </CardContent></Card>
    </div>
  );
}
