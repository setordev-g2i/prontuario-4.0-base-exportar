import {
  Heart, LogOut, DoorOpen, Calendar, Users,
  ClipboardList, Microscope, BarChart3, Stethoscope, Handshake,
  CalendarDays, Scissors, Printer, Settings2, UserPlus, Tag, FolderArchive,
  RotateCcw, FileText, Receipt, Scale, BedDouble, ShieldCheck, FlaskConical,
  FileBarChart, Pill, Package, Utensils, Wallet, TrendingUp, CreditCard,
  Activity, Home as HomeIcon, Siren, HeartPulse, Beaker, ShieldAlert,
  ListChecks, Radiation, Settings, ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

/* ── types ── */
interface SubItem {
  label: string;
  icon: LucideIcon;
  path: string;
}
interface MenuGroup {
  heading?: string;
  items: SubItem[];
}
interface MenuItem {
  label: string;
  icon: LucideIcon;
  groups: MenuGroup[];
}

/* ── menu config (from Zurich 2.0) ── */
const menuConfig: MenuItem[] = [
  {
    label: "Salas",
    icon: DoorOpen,
    groups: [
      {
        items: [
          { label: "Sala de Espera", icon: DoorOpen, path: "/salas/espera" },
          { label: "Sala de Procedimentos", icon: Stethoscope, path: "/salas/procedimentos" },
        ],
      },
    ],
  },
  {
    label: "Agenda",
    icon: Calendar,
    groups: [
      {
        heading: "Operacional",
        items: [
          { label: "Calendário", icon: CalendarDays, path: "/agenda" },
          { label: "Centro Cirúrgico", icon: Scissors, path: "/agenda/centro-cirurgico" },
          { label: "Imprimir Agenda", icon: Printer, path: "/agenda/imprimir" },
        ],
      },
      {
        heading: "Administração",
        items: [
          { label: "Gestão de Agendas", icon: Settings2, path: "/agenda/admin" },
        ],
      },
    ],
  },
  {
    label: "Pacientes",
    icon: Users,
    groups: [
      {
        heading: "Cadastro",
        items: [
          { label: "Pacientes", icon: Users, path: "/patients" },
          { label: "Cadastrar Paciente", icon: UserPlus, path: "/patients?new=1" },
        ],
      },
      {
        heading: "Gestão",
        items: [
          { label: "Gerenciar Retornos", icon: RotateCcw, path: "/pacientes/retornos" },
          { label: "Tags", icon: Tag, path: "/pacientes/tags" },
          { label: "SAME", icon: FolderArchive, path: "/pacientes/same" },
        ],
      },
    ],
  },
  {
    label: "Atendimentos",
    icon: ClipboardList,
    groups: [
      {
        heading: "Recepção",
        items: [
          { label: "Abertura de Atendimento", icon: ClipboardList, path: "/atendimentos/abertura" },
          { label: "Orçamento", icon: Receipt, path: "/atendimentos/orcamento" },
          { label: "Nota Fiscal", icon: FileText, path: "/atendimentos/nf" },
        ],
      },
      {
        heading: "Operacional",
        items: [
          { label: "Leitos", icon: BedDouble, path: "/atendimentos/leitos" },
          { label: "Escalas", icon: Scale, path: "/atendimentos/escalas" },
          { label: "Portaria", icon: ShieldCheck, path: "/atendimentos/portaria" },
          { label: "Relatórios", icon: FileBarChart, path: "/atendimentos/relatorios" },
        ],
      },
    ],
  },
  {
    label: "Diagnóstico",
    icon: Microscope,
    groups: [
      {
        items: [
          { label: "Laudos", icon: FileText, path: "/diagnostico/laudos" },
          { label: "Fila de Exames", icon: ListChecks, path: "/diagnostico/fila" },
          { label: "Gerar Etiquetas", icon: Tag, path: "/diagnostico/etiquetas" },
        ],
      },
    ],
  },
  {
    label: "Gerenciamento",
    icon: BarChart3,
    groups: [
      {
        heading: "Financeiro",
        items: [
          { label: "Dashboard Financeiro", icon: Wallet, path: "/gerenciamento/financeiro" },
          { label: "Contas a Pagar", icon: TrendingUp, path: "/gerenciamento/contas-pagar" },
          { label: "Contas a Receber", icon: CreditCard, path: "/gerenciamento/contas-receber" },
          { label: "Faturamento", icon: Receipt, path: "/gerenciamento/faturamento" },
        ],
      },
      {
        heading: "Indicadores",
        items: [
          { label: "Dashboards", icon: TrendingUp, path: "/dashboards" },
          { label: "Produtividade", icon: Activity, path: "/gerenciamento/produtividade" },
        ],
      },
      {
        heading: "Estoque",
        items: [
          { label: "Farmácia", icon: Pill, path: "/gerenciamento/estoque/farmacia" },
          { label: "Almoxarifado", icon: Package, path: "/gerenciamento/estoque/almoxarifado" },
          { label: "Laboratório", icon: Beaker, path: "/gerenciamento/estoque/laboratorio" },
          { label: "Nutrição", icon: Utensils, path: "/gerenciamento/estoque/nutricao" },
          { label: "CME", icon: FlaskConical, path: "/cme" },
        ],
      },
    ],
  },
  {
    label: "Assistencial",
    icon: HeartPulse,
    groups: [
      {
        heading: "Pacientes Admitidos",
        items: [
          { label: "Home Care", icon: HomeIcon, path: "/assistencial/homecare" },
          { label: "Internados", icon: BedDouble, path: "/assistencial/internados" },
          { label: "UTI", icon: HeartPulse, path: "/assistencial/uti" },
          { label: "Pronto Atendimento", icon: Siren, path: "/assistencial/pa" },
        ],
      },
      {
        heading: "Setores Executores",
        items: [
          { label: "Enfermagem", icon: Activity, path: "/assistencial/enfermagem" },
          { label: "Farmácia", icon: Pill, path: "/assistencial/farmacia" },
          { label: "Procedimentos", icon: Stethoscope, path: "/assistencial/procedimentos" },
          { label: "Nutrição", icon: Utensils, path: "/assistencial/nutricao" },
          { label: "CME / Expurgo", icon: FlaskConical, path: "/assistencial/cme" },
        ],
      },
      {
        heading: "Especializado",
        items: [
          { label: "Laboratório", icon: FlaskConical, path: "/laboratorio" },
          { label: "SCIH", icon: ShieldAlert, path: "/assistencial/scih" },
          { label: "Triagem", icon: ListChecks, path: "/assistencial/triagem" },
          { label: "Oncologia", icon: Radiation, path: "/assistencial/oncologia" },
        ],
      },
    ],
  },
  {
    label: "Cadastros",
    icon: Settings,
    groups: [
      {
        heading: "Profissionais",
        items: [
          { label: "Solicitantes", icon: Stethoscope, path: "/cadastros/solicitantes" },
        ],
      },
    ],
  },
  {
    label: "CRM",
    icon: Handshake,
    groups: [
      {
        items: [
          { label: "Solicitações", icon: FileText, path: "/crm/solicitacoes" },
          { label: "Negociação", icon: Handshake, path: "/crm/negociacao" },
          { label: "Relacionamento", icon: Users, path: "/crm/relacionamento" },
        ],
      },
    ],
  },
];

/* ── Sidebar Component ── */
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="size-4 text-primary" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Zurich</span>
                  <span className="truncate text-xs text-muted-foreground">Sistema Hospitalar</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {menuConfig.map((menu) => {
            const hasActiveChild = menu.groups.some((g) =>
              g.items.some((i) => currentPath === i.path)
            );

            return (
              <SidebarMenuItem key={menu.label}>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      isActive={hasActiveChild}
                      tooltip={collapsed ? menu.label : undefined}
                    >
                      <menu.icon className="size-4" />
                      <span className="flex-1">{menu.label}</span>
                      <ChevronRight className="ml-auto size-3 text-muted-foreground" />
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    sideOffset={4}
                    className="w-56 p-2"
                  >
                    <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                      {menu.label}
                    </div>
                    {menu.groups.map((group, gi) => (
                      <div key={gi}>
                        {group.heading && (
                          <div className="mt-2 px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {group.heading}
                          </div>
                        )}
                        {group.items.map((item) => (
                          <Link
                            key={item.path + item.label}
                            to={item.path}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              currentPath === item.path
                                ? "bg-accent font-medium text-accent-foreground"
                                : "text-foreground"
                            }`}
                          >
                            <item.icon className="size-3.5 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" className="text-destructive hover:text-destructive">
              <LogOut className="size-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
