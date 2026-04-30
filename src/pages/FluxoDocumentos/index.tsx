import { Link } from "react-router-dom";
import {
  Building2, FileText, AlertCircle, ArrowRightLeft, Flag, CircleDot,
  Layers, ListChecks, GitBranch, Workflow, Timer, Brain, FileCheck2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionItem {
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}
interface Section { title: string; items: SectionItem[] }

const sections: Section[] = [
  {
    title: "Cadastros",
    items: [
      { label: "Setores", description: "Setores que participam dos fluxos", path: "/configuracoes/fluxo-documentos/setores", icon: Building2 },
      { label: "Tipos de Documento", description: "Tipos de documento usados", path: "/configuracoes/fluxo-documentos/tipos-documento", icon: FileText },
      { label: "Motivos", description: "Motivos de envio, devolução, justificativa", path: "/configuracoes/fluxo-documentos/motivos", icon: AlertCircle },
    ],
  },
  {
    title: "Cadastros Operacionais",
    items: [
      { label: "Tipos de Movimentação", description: "Envio, devolução, reenvio etc.", path: "/configuracoes/fluxo-documentos/tipos-movimentacao", icon: ArrowRightLeft },
      { label: "Prioridades", description: "Níveis e pesos para a fila inteligente", path: "/configuracoes/fluxo-documentos/prioridades", icon: Flag },
      { label: "Status do Fluxo", description: "Status dos protocolos", path: "/configuracoes/fluxo-documentos/status", icon: CircleDot },
      { label: "Tipos de Item", description: "Conta, Atendimento, Paciente etc.", path: "/configuracoes/fluxo-documentos/tipos-item", icon: Layers },
      { label: "Status do Item", description: "Pendente, Aceito, Devolvido etc.", path: "/configuracoes/fluxo-documentos/status-item", icon: ListChecks },
    ],
  },
  {
    title: "Workflow",
    items: [
      { label: "Regras de Fluxo", description: "Combinações origem→destino permitidas", path: "/configuracoes/fluxo-documentos/regras-fluxo", icon: GitBranch },
      { label: "Workflow por Tipo de Documento", description: "Fluxos parametrizáveis por tipo", path: "/configuracoes/fluxo-documentos/workflow-tipo-doc", icon: Workflow },
      { label: "Ordem dos Status", description: "Etapas e transições do workflow", path: "/configuracoes/fluxo-documentos/ordem-status", icon: ListChecks },
    ],
  },
  {
    title: "Parâmetros",
    items: [
      { label: "SLA", description: "Prazos por convênio, tipo e prioridade", path: "/configuracoes/fluxo-documentos/sla", icon: Timer },
      { label: "IA", description: "Pesos e limites do motor de IA", path: "/configuracoes/fluxo-documentos/ia", icon: Brain },
    ],
  },
  {
    title: "Documentação",
    items: [
      { label: "Documentação por Convênio", description: "Documentos obrigatórios por convênio", path: "/configuracoes/fluxo-documentos/documentacao-convenio", icon: FileCheck2 },
    ],
  },
];

export default function FluxoDocumentosHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fluxo de Documentos</h1>
        <p className="text-sm text-muted-foreground">
          Configure cadastros, workflow, SLA, IA e documentação obrigatória do módulo.
        </p>
      </div>

      {sections.map((sec) => (
        <div key={sec.title} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {sec.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sec.items.map((it) => {
              const Icon = it.icon;
              return (
                <Link key={it.path} to={it.path} className="block">
                  <Card className="hover:border-primary/50 transition-colors h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        {it.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{it.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
