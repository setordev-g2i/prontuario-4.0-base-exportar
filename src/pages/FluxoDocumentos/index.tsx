import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2, FileText, AlertCircle, ArrowLeftRight, Flag, ListChecks,
  Layers, CircleDot, GitBranch, Workflow, Network, Clock, Brain,
  ShieldCheck, ClipboardCheck, CheckCircle2, FileStack, Package, ScrollText,
} from "lucide-react";

interface Item {
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Group {
  heading: string;
  items: Item[];
}

const groups: Group[] = [
  {
    heading: "Cadastros",
    items: [
      { label: "Setores", description: "Setores que participam do fluxo.", path: "/configuracoes/fluxo-documentos/setores", icon: Building2 },
      { label: "Tipos de Documento", description: "Categorias de documentos.", path: "/configuracoes/fluxo-documentos/tipos-documento", icon: FileText },
      { label: "Motivos", description: "Envio, devolução, cancelamento, reenvio, justificativa.", path: "/configuracoes/fluxo-documentos/motivos", icon: AlertCircle },
    ],
  },
  {
    heading: "Cadastros Operacionais",
    items: [
      { label: "Tipos de Movimentação", description: "Tipos de fluxo entre setores.", path: "/configuracoes/fluxo-documentos/tipos-movimentacao", icon: ArrowLeftRight },
      { label: "Prioridades", description: "Pesos da fila inteligente.", path: "/configuracoes/fluxo-documentos/prioridades", icon: Flag },
      { label: "Status do Fluxo", description: "Status do protocolo.", path: "/configuracoes/fluxo-documentos/status", icon: ListChecks },
      { label: "Tipos de Item", description: "Conta, atendimento, paciente, etc.", path: "/configuracoes/fluxo-documentos/tipos-item", icon: Layers },
      { label: "Status do Item", description: "Status individual de cada item.", path: "/configuracoes/fluxo-documentos/status-item", icon: CircleDot },
    ],
  },
  {
    heading: "Workflow",
    items: [
      { label: "Workflow por Tipo de Documento", description: "Workflow associado por tipo.", path: "/configuracoes/fluxo-documentos/workflows", icon: Workflow },
      { label: "Etapas do Workflow", description: "Transições válidas e perfis.", path: "/configuracoes/fluxo-documentos/workflow-etapas", icon: GitBranch },
      { label: "Regras de Fluxo", description: "Validação setor + tipo + movimentação.", path: "/configuracoes/fluxo-documentos/regras-fluxo", icon: Network },
    ],
  },
  {
    heading: "Parâmetros",
    items: [
      { label: "Parâmetros de SLA", description: "Prazos por convênio, tipo, prioridade.", path: "/configuracoes/fluxo-documentos/parametros-sla", icon: Clock },
      { label: "Parâmetros de IA", description: "Pesos e limites da IA.", path: "/configuracoes/fluxo-documentos/parametros-ia", icon: Brain },
    ],
  },
  {
    heading: "Documentação",
    items: [
      { label: "Documentação por Convênio", description: "Documentos exigidos por convênio.", path: "/configuracoes/fluxo-documentos/documentos-obrigatorios", icon: ShieldCheck },
      { label: "Checklist Documental", description: "Anexar, confirmar ou justificar.", path: "/configuracoes/fluxo-documentos/checklist", icon: ClipboardCheck },
      { label: "Aprovação de Justificativas", description: "Aprovações de justificativa de ausência.", path: "/configuracoes/fluxo-documentos/aprovacoes-justificativa", icon: CheckCircle2 },
    ],
  },
  {
    heading: "Operacional",
    items: [
      { label: "Protocolos", description: "Cadastro administrativo de protocolos.", path: "/configuracoes/fluxo-documentos/protocolos", icon: FileStack },
      { label: "Itens de Protocolo", description: "Itens vinculados a um protocolo.", path: "/configuracoes/fluxo-documentos/protocolo-itens", icon: Package },
    ],
  },
  {
    heading: "Auditoria",
    items: [
      { label: "Logs", description: "Registro de auditoria do módulo.", path: "/configuracoes/fluxo-documentos/logs", icon: ScrollText },
    ],
  },
];

export default function FluxoDocumentosIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fluxo de Documentos</h1>
        <p className="text-sm text-muted-foreground">
          Configurações e cadastros do módulo Fluxo de Documentos.
        </p>
      </div>

      {groups.map((g) => (
        <section key={g.heading} className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {g.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {g.items.map((item) => (
              <Link key={item.path} to={item.path} className="block">
                <Card className="hover:border-primary/50 hover:shadow-sm transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4 text-primary" />
                      <CardTitle className="text-base">{item.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
