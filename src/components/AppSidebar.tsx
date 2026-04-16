import * as React from "react";
import {
  Heart, LogOut, DoorOpen, Calendar, Users,
  ClipboardList, Microscope, BarChart3, Stethoscope, Handshake,
  CalendarDays, Scissors, Printer, Settings2, UserPlus, Tag, FolderArchive,
  RotateCcw, FileText, Receipt, Scale, BedDouble, ShieldCheck, FlaskConical,
  FileBarChart, Pill, Package, Utensils, Wallet, TrendingUp, CreditCard,
  Activity, Home as HomeIcon, Siren, HeartPulse, Beaker, ShieldAlert,
  ListChecks, Radiation, Settings, ChevronRight, Star,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

/* ── icon registry for favorites ── */
const iconMap: Record<string, LucideIcon> = {
  DoorOpen, Stethoscope, CalendarDays, Scissors, Printer, Settings2,
  Users, UserPlus, RotateCcw, Tag, FolderArchive, ClipboardList,
  Receipt, FileText, BedDouble, Scale, ShieldCheck, FileBarChart,
  Microscope, ListChecks, Wallet, TrendingUp, CreditCard, Activity,
  Pill, Package, Beaker, Utensils, FlaskConical, HomeIcon, Siren,
  HeartPulse, ShieldAlert, Radiation, Handshake, Calendar, BarChart3,
  Settings,
};

function getIconByName(name: string): LucideIcon {
  return iconMap[name] || Star;
}

/* ── types ── */
interface SubItem {
  label: string;
  icon: LucideIcon;
  iconName: string;
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
          { label: "Sala de Espera", icon: DoorOpen, iconName: "DoorOpen", path: "/salas/espera" },
          { label: "Sala de Procedimentos", icon: Stethoscope, iconName: "Stethoscope", path: "/salas/procedimentos" },
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
          { label: "Calendário", icon: CalendarDays, iconName: "CalendarDays", path: "/agenda" },
          { label: "Centro Cirúrgico", icon: Scissors, iconName: "Scissors", path: "/agenda/centro-cirurgico" },
          { label: "Imprimir Agenda", icon: Printer, iconName: "Printer", path: "/agenda/imprimir" },
        ],
      },
      {
        heading: "Administração",
        items: [
          { label: "Gestão de Agendas", icon: Settings2, iconName: "Settings2", path: "/agenda/admin" },
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
          { label: "Pacientes", icon: Users, iconName: "Users", path: "/patients" },
          { label: "Cadastrar Paciente", icon: UserPlus, iconName: "UserPlus", path: "/patients?new=1" },
        ],
      },
      {
        heading: "Gestão",
        items: [
          { label: "Gerenciar Retornos", icon: RotateCcw, iconName: "RotateCcw", path: "/pacientes/retornos" },
          { label: "Tags", icon: Tag, iconName: "Tag", path: "/pacientes/tags" },
          { label: "SAME", icon: FolderArchive, iconName: "FolderArchive", path: "/pacientes/same" },
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
          { label: "Abertura de Atendimento", icon: ClipboardList, iconName: "ClipboardList", path: "/atendimentos/abertura" },
          { label: "Orçamento", icon: Receipt, iconName: "Receipt", path: "/atendimentos/orcamento" },
          { label: "Nota Fiscal", icon: FileText, iconName: "FileText", path: "/atendimentos/nf" },
        ],
      },
      {
        heading: "Operacional",
        items: [
          { label: "Leitos", icon: BedDouble, iconName: "BedDouble", path: "/atendimentos/leitos" },
          { label: "Escalas", icon: Scale, iconName: "Scale", path: "/atendimentos/escalas" },
          { label: "Portaria", icon: ShieldCheck, iconName: "ShieldCheck", path: "/atendimentos/portaria" },
          { label: "Relatórios", icon: FileBarChart, iconName: "FileBarChart", path: "/atendimentos/relatorios" },
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
          { label: "Laudos", icon: FileText, iconName: "FileText", path: "/diagnostico/laudos" },
          { label: "Fila de Exames", icon: ListChecks, iconName: "ListChecks", path: "/diagnostico/fila" },
          { label: "Gerar Etiquetas", icon: Tag, iconName: "Tag", path: "/diagnostico/etiquetas" },
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
          { label: "Dashboard Financeiro", icon: Wallet, iconName: "Wallet", path: "/gerenciamento/financeiro" },
          { label: "Contas a Pagar", icon: TrendingUp, iconName: "TrendingUp", path: "/gerenciamento/contas-pagar" },
          { label: "Contas a Receber", icon: CreditCard, iconName: "CreditCard", path: "/gerenciamento/contas-receber" },
          { label: "Faturamento", icon: Receipt, iconName: "Receipt", path: "/gerenciamento/faturamento" },
        ],
      },
      {
        heading: "Indicadores",
        items: [
          { label: "Dashboards", icon: TrendingUp, iconName: "TrendingUp", path: "/dashboards" },
          { label: "Produtividade", icon: Activity, iconName: "Activity", path: "/gerenciamento/produtividade" },
        ],
      },
      {
        heading: "Estoque",
        items: [
          { label: "Farmácia", icon: Pill, iconName: "Pill", path: "/gerenciamento/estoque/farmacia" },
          { label: "Almoxarifado", icon: Package, iconName: "Package", path: "/gerenciamento/estoque/almoxarifado" },
          { label: "Laboratório", icon: Beaker, iconName: "Beaker", path: "/gerenciamento/estoque/laboratorio" },
          { label: "Nutrição", icon: Utensils, iconName: "Utensils", path: "/gerenciamento/estoque/nutricao" },
          { label: "CME", icon: FlaskConical, iconName: "FlaskConical", path: "/cme" },
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
          { label: "Home Care", icon: HomeIcon, iconName: "HomeIcon", path: "/assistencial/homecare" },
          { label: "Internados", icon: BedDouble, iconName: "BedDouble", path: "/assistencial/internados" },
          { label: "UTI", icon: HeartPulse, iconName: "HeartPulse", path: "/assistencial/uti" },
          { label: "Pronto Atendimento", icon: Siren, iconName: "Siren", path: "/assistencial/pa" },
        ],
      },
      {
        heading: "Setores Executores",
        items: [
          { label: "Enfermagem", icon: Activity, iconName: "Activity", path: "/assistencial/enfermagem" },
          { label: "Farmácia", icon: Pill, iconName: "Pill", path: "/assistencial/farmacia" },
          { label: "Procedimentos", icon: Stethoscope, iconName: "Stethoscope", path: "/assistencial/procedimentos" },
          { label: "Nutrição", icon: Utensils, iconName: "Utensils", path: "/assistencial/nutricao" },
          { label: "CME / Expurgo", icon: FlaskConical, iconName: "FlaskConical", path: "/assistencial/cme" },
        ],
      },
      {
        heading: "Especializado",
        items: [
          { label: "Laboratório", icon: FlaskConical, iconName: "FlaskConical", path: "/laboratorio" },
          { label: "SCIH", icon: ShieldAlert, iconName: "ShieldAlert", path: "/assistencial/scih" },
          { label: "Triagem", icon: ListChecks, iconName: "ListChecks", path: "/assistencial/triagem" },
          { label: "Oncologia", icon: Radiation, iconName: "Radiation", path: "/assistencial/oncologia" },
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
          { label: "Solicitantes", icon: Stethoscope, iconName: "Stethoscope", path: "/cadastros/solicitantes" },
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
          { label: "Solicitações", icon: FileText, iconName: "FileText", path: "/crm/solicitacoes" },
          { label: "Negociação", icon: Handshake, iconName: "Handshake", path: "/crm/negociacao" },
          { label: "Relacionamento", icon: Users, iconName: "Users", path: "/crm/relacionamento" },
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
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

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
        {/* ★ Favoritos */}
        {favorites.length > 0 && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>
                <Star className="size-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>Favoritos</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favorites.map((fav) => {
                    const FavIcon = getIconByName(fav.iconName);
                    return (
                      <SidebarMenuItem key={fav.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={currentPath === fav.path}
                          size="sm"
                        >
                          <Link to={fav.path}>
                            <FavIcon className="size-4" />
                            <span>{fav.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Menu categories */}
        <SidebarMenu>
          {menuConfig.map((menu) => {
            const hasActiveChild = menu.groups.some((g) =>
              g.items.some((i) => currentPath === i.path)
            );

            return (
              <SidebarMenuItem key={menu.label}>
                <HoverCard openDelay={100} closeDelay={200}>
                  <HoverCardTrigger asChild>
                    <SidebarMenuButton
                      isActive={hasActiveChild}
                      tooltip={collapsed ? menu.label : undefined}
                    >
                      <menu.icon className="size-4" />
                      <span className="flex-1">{menu.label}</span>
                      <ChevronRight className="ml-auto size-3 text-muted-foreground" />
                    </SidebarMenuButton>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    align="start"
                    sideOffset={4}
                    className="w-64 p-2"
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
                          <div
                            key={item.path + item.label}
                            className="group/fav-item flex items-center"
                          >
                            <Link
                              to={item.path}
                              className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                currentPath === item.path
                                  ? "bg-accent font-medium text-accent-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              <item.icon className="size-3.5 shrink-0" />
                              <span className="flex-1">{item.label}</span>
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite({
                                  label: item.label,
                                  iconName: item.iconName,
                                  path: item.path,
                                });
                              }}
                              className="ml-0.5 flex size-6 shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-accent group-hover/fav-item:opacity-100 data-[fav=true]:opacity-100"
                              data-fav={isFavorite(item.path) ? "true" : undefined}
                              title={isFavorite(item.path) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                              <Star
                                className={`size-3 ${
                                  isFavorite(item.path)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </HoverCardContent>
                </HoverCard>
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
