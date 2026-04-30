/**
 * Página agrupadora "Fluxo de Documentos" em /configuracoes/fluxo-documentos.
 * Exibe cards organizados por agrupador (Cadastros, Operacionais, Workflow,
 * Parâmetros, Documentação, Auditoria) com link para cada page.
 */
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2, FileType, Tags, ArrowRightLeft, Flag, Activity, Layers, ListChecks,
  Workflow, Settings, Bot, FileCheck, FileWarning, ShieldCheck, ScrollText,
  FolderTree, FileBox, FileSearch, Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CardItem { title: string; description: string; href: string; icon: LucideIcon }
interface Group { heading: string; items: CardItem[] }

const groups: Group[] = [
  {
    heading: "Cadastros",
    items: [
      { title: "Setores", description: "Setores que participam do fluxo.",
        href: "/configuracoes/fluxo-documentos/setores", icon: Building2 },
      { title: "Tipos de Documento", description: "Categorias de documentos.",
        href: "/configuracoes/fluxo-documentos/tipos-documento", icon: FileType },
      { title: "Motivos", description: "Motivos de envio, devolução e cancelamento.",
        href: "/configuracoes/fluxo-documentos/motivos", icon: Tags },
    ],
  },
  {
    heading: "Cadastros Operacionais",
    items: [
      { title: "Tipos de Movimentação", description: "Tipos de fluxo entre setores.",
        href: "/configuracoes/fluxo-documentos/tipos-movimentacao", icon: ArrowRightLeft },
      { title: "Prioridades", description: "Pesos para a fila inteligente.",
        href: "/configuracoes/fluxo-documentos/prioridades", icon: Flag },
      { title: "Status do Fluxo", description: "Estados possíveis dos protocolos.",
        href: "/configuracoes/fluxo-documentos/status", icon: Activity },
      { title: "Tipos de Item", description: "Conta, atendimento, paciente, etc.",
        href: "/configuracoes/fluxo-documentos/tipos-item", icon: Layers },
      { title: "Status do Item", description: "Pendente, aceito, devolvido.",
        href: "/configuracoes/fluxo-documentos/status-item", icon: ListChecks },
    ],
  },
  {
    heading: "Workflow",
    items: [
      { title: "Workflow por Tipo de Documento", description: "Fluxo configurável por tipo.",
        href: "/configuracoes/fluxo-documentos/workflows", icon: Workflow },
      { title: "Etapas do Workflow", description: "Transições e regras por etapa.",
        href: "/configuracoes/fluxo-documentos/workflow-etapas", icon: Network },
      { title: "Regras de Fluxo", description: "Origem/destino permitidos por documento.",
        href: "/configuracoes/fluxo-documentos/regras-fluxo", icon: FolderTree },
    ],
  },
  {
    heading: "Parâmetros",
    items: [
      { title: "SLA", description: "Prazos por documento, setor, prioridade e convênio.",
        href: "/configuracoes/fluxo-documentos/parametros-sla", icon: Settings },
      { title: "IA", description: "Pesos e limites usados pela inteligência.",
        href: "/configuracoes/fluxo-documentos/parametros-ia", icon: Bot },
    ],
  },
  {
    heading: "Documentação",
    items: [
      { title: "Documentação por Convênio", description: "Documentos exigidos por convênio.",
        href: "/configuracoes/fluxo-documentos/documentos-obrigatorios-convenio", icon: FileCheck },
      { title: "Checklist Documental", description: "Itens de checklist por protocolo.",
        href: "/configuracoes/fluxo-documentos/checklist", icon: FileSearch },
      { title: "Aprovação de Justificativas", description: "Aprovação de ausência documental.",
        href: "/configuracoes/fluxo-documentos/aprovacoes-justificativa", icon: ShieldCheck },
    ],
  },
  {
    heading: "Protocolos",
    items: [
      { title: "Protocolos", description: "Consulta administrativa de protocolos.",
        href: "/configuracoes/fluxo-documentos/protocolos", icon: FileBox },
      { title: "Itens de Protocolo", description: "Itens vinculados a cada protocolo.",
        href: "/configuracoes/fluxo-documentos/protocolo-itens", icon: FileWarning },
    ],
  },
  {
    heading: "Auditoria",
    items: [
      { title: "Logs", description: "Histórico de ações críticas do módulo.",
        href: "/configuracoes/fluxo-documentos/logs", icon: ScrollText },
    ],
  },
];

export default function FluxoDocumentosHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fluxo de Documentos</h1>
        <p className="text-sm text-muted-foreground">
          Configure cadastros, workflows, SLA, documentação por convênio, parâmetros de IA e auditoria.
        </p>
      </div>

      {groups.map((g) => (
        <section key={g.heading} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {g.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {g.items.map((item) => (
              <Link key={item.href} to={item.href} className="block">
                <Card className="h-full transition-colors hover:border-primary hover:bg-accent/30">
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {item.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
