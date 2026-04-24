import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, Eye, Plus, Pencil, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  LookupCollections,
  LookupOption,
  MedicoResponsavelListItem,
  MedicoResponsavelRecord,
  QuickCreateLookupTable,
} from "@/features/medico-responsaveis/types";
import {
  deactivateMedicoResponsavelById,
  fetchLookupCollections,
  fetchMedicoResponsavelById,
  fetchMedicoResponsaveis,
  persistMedicoResponsavel,
  quickCreateLookupOption,
} from "@/features/medico-responsaveis/service";
import { formatCpf, normalizeNullableNumber } from "@/features/medico-responsaveis/utils";

const basePath = "/configuracoes/profissionais/medico-responsaveis" as const;

type Mode = "list" | "new" | "edit" | "view";

type FormErrors = Partial<Record<keyof MedicoResponsavelRecord, string>>;

const emptyRecord: MedicoResponsavelRecord = {
  nome: "",
  cpf: "",
  crm: "",
  situacao_id: null,
  user_id: null,
  produtividade_fin_contabilidade_id: null,
  id_tipo_conselho_profissional: null,
  solicitante_id: null,
  cbo_id: null,
  estado_id: null,
  tipo_cadastro_id: null,
  homecare_escala_repasse_tabela_padrao_id: null,
  estado_civil_id: null,
  religiao_id: null,
  etnia_id: null,
  escolaridade_id: null,
  home_care_regiao_responsavel_id: null,
  configuracao_apuracao_id: null,
  fin_fornecedor_id: null,
  contas_pagar_plano_contas_id: null,
  contas_receber_plano_contas_id: null,
  unidade_id: null,
  cbo_ids: [],
  exportacoes_sus: [],
};

const fieldLabels: Record<string, string> = {
  situacao_id: "Situação",
  user_id: "Usuário",
  produtividade_fin_contabilidade_id: "Contabilidade de produtividade",
  id_tipo_conselho_profissional: "Tipo de conselho profissional",
  solicitante_id: "Solicitante",
  cbo_id: "CBO principal",
  estado_id: "Estado",
  tipo_cadastro_id: "Tipo de cadastro",
  homecare_escala_repasse_tabela_padrao_id: "Tabela padrão de repasse",
  estado_civil_id: "Estado civil",
  religiao_id: "Religião",
  etnia_id: "Etnia",
  escolaridade_id: "Escolaridade",
  home_care_regiao_responsavel_id: "Região responsável Home Care",
  configuracao_apuracao_id: "Configuração de apuração",
  fin_fornecedor_id: "Fornecedor financeiro",
  contas_pagar_plano_contas_id: "Plano de contas a pagar",
  contas_receber_plano_contas_id: "Plano de contas a receber",
  unidade_id: "Unidade",
};

function normalizeFormData(record: MedicoResponsavelRecord): MedicoResponsavelRecord {
  return {
    ...record,
    user_id: normalizeNullableNumber(record.user_id),
    produtividade_fin_contabilidade_id: normalizeNullableNumber(record.produtividade_fin_contabilidade_id),
    id_tipo_conselho_profissional: normalizeNullableNumber(record.id_tipo_conselho_profissional),
    solicitante_id: normalizeNullableNumber(record.solicitante_id),
    cbo_id: normalizeNullableNumber(record.cbo_id),
    estado_id: normalizeNullableNumber(record.estado_id),
    tipo_cadastro_id: normalizeNullableNumber(record.tipo_cadastro_id),
    homecare_escala_repasse_tabela_padrao_id: normalizeNullableNumber(
      record.homecare_escala_repasse_tabela_padrao_id,
    ),
    estado_civil_id: normalizeNullableNumber(record.estado_civil_id),
    religiao_id: normalizeNullableNumber(record.religiao_id),
    etnia_id: normalizeNullableNumber(record.etnia_id),
    escolaridade_id: normalizeNullableNumber(record.escolaridade_id),
    home_care_regiao_responsavel_id: normalizeNullableNumber(record.home_care_regiao_responsavel_id),
    configuracao_apuracao_id: normalizeNullableNumber(record.configuracao_apuracao_id),
    fin_fornecedor_id: normalizeNullableNumber(record.fin_fornecedor_id),
    contas_pagar_plano_contas_id: normalizeNullableNumber(record.contas_pagar_plano_contas_id),
    contas_receber_plano_contas_id: normalizeNullableNumber(record.contas_receber_plano_contas_id),
    situacao_id: normalizeNullableNumber(record.situacao_id),
    unidade_id: normalizeNullableNumber(record.unidade_id),
    cbo_ids: record.cbo_ids.map((value) => Number(value)).filter(Boolean),
    exportacoes_sus: [...record.exportacoes_sus].sort(),
  };
}

function validateRecord(record: MedicoResponsavelRecord): FormErrors {
  const errors: FormErrors = {};

  if (!record.nome.trim()) errors.nome = "Nome é obrigatório";
  if (!record.cpf.trim()) errors.cpf = "CPF é obrigatório";
  else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(record.cpf)) errors.cpf = "CPF deve estar no formato 000.000.000-00";
  if (!record.crm.trim()) errors.crm = "CRM é obrigatório";
  if (!record.situacao_id) errors.situacao_id = "Situação é obrigatória";
  if (!record.id_tipo_conselho_profissional) {
    errors.id_tipo_conselho_profissional = "Tipo de conselho é obrigatório";
  }
  if (!record.unidade_id) errors.unidade_id = "Unidade é obrigatória";

  return errors;
}

function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}

function FieldShell({
  label,
  error,
  children,
  action,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
        <span>{label}</span>
        {action}
      </span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function LookupSelectField({
  label,
  table,
  options,
  value,
  onChange,
  onQuickCreate,
  error,
  disabled,
  placeholder = "Selecione",
}: {
  label: string;
  table: QuickCreateLookupTable;
  options: LookupOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  onQuickCreate: (table: QuickCreateLookupTable) => Promise<void>;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <FieldShell
      label={label}
      error={error}
      action={
        !disabled ? (
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => onQuickCreate(table)}
          >
            Cadastro rápido
          </button>
        ) : undefined
      }
    >
      <Select
        disabled={disabled}
        value={value ? String(value) : "__none__"}
        onValueChange={(selected) => onChange(selected === "__none__" ? null : Number(selected))}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Não informado</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

export function MedicoResponsaveisPage({
  mode,
  medicoId,
}: {
  mode: Mode;
  medicoId?: number;
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(mode === "list");
  const [records, setRecords] = useState<MedicoResponsavelListItem[]>([]);
  const [lookupCollections, setLookupCollections] = useState<LookupCollections | null>(null);
  const [loadingForm, setLoadingForm] = useState(mode !== "list");
  const [saving, setSaving] = useState(false);
  const [record, setRecord] = useState<MedicoResponsavelRecord>(emptyRecord);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCboId, setSelectedCboId] = useState<string>("");
  const [newExportDate, setNewExportDate] = useState("");
  const [deactivateId, setDeactivateId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("principais");

  const readOnly = mode === "view";

  const title = useMemo(() => {
    if (mode === "new") return "Novo Médico Responsável";
    if (mode === "view") return "Visualizar Médico Responsável";
    if (mode === "edit") return "Editar Médico Responsável";
    return "Médicos Responsáveis";
  }, [mode]);

  async function loadList(term?: string) {
    setLoadingList(true);
    try {
      const data = await fetchMedicoResponsaveis(term);
      setRecords(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível carregar os médicos responsáveis.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    if (mode === "list") {
      void loadList();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "list") return;

    let active = true;

    async function loadForm() {
      setLoadingForm(true);
      try {
        const [lookups, data] = await Promise.all([
          fetchLookupCollections(),
          medicoId ? fetchMedicoResponsavelById(medicoId) : Promise.resolve(emptyRecord),
        ]);

        if (!active) return;
        setLookupCollections(lookups);
        setRecord(normalizeFormData(data));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível carregar o cadastro.");
      } finally {
        if (active) setLoadingForm(false);
      }
    }

    void loadForm();
    return () => {
      active = false;
    };
  }, [mode, medicoId]);

  const handleQuickCreate = async (table: QuickCreateLookupTable) => {
    const label = fieldLabels[table] ?? "Nova opção";
    const value = window.prompt(`Informe o valor para ${label.toLowerCase()}:`);

    if (!value?.trim()) return;

    try {
      const created = await quickCreateLookupOption(table, value.trim());
      setLookupCollections((current) => {
        if (!current) return current;
        return {
          ...current,
          [table]: [...current[table], created].sort((a, b) => a.value.localeCompare(b.value)),
        };
      });
      toast.success(`${label} cadastrada com sucesso.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível cadastrar a opção.");
    }
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await loadList(search);
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    try {
      await deactivateMedicoResponsavelById(deactivateId);
      toast.success("Médico responsável desativado com sucesso.");
      setDeactivateId(null);
      await loadList(search);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível desativar o registro.");
    }
  };

  const updateField = <K extends keyof MedicoResponsavelRecord>(field: K, value: MedicoResponsavelRecord[K]) => {
    setRecord((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const addLinkedCbo = () => {
    const cboId = Number(selectedCboId);
    if (!cboId || record.cbo_ids.includes(cboId)) return;
    updateField("cbo_ids", [...record.cbo_ids, cboId]);
    setSelectedCboId("");
  };

  const addExportDate = () => {
    if (!newExportDate || record.exportacoes_sus.includes(newExportDate)) return;
    updateField("exportacoes_sus", [...record.exportacoes_sus, newExportDate].sort());
    setNewExportDate("");
  };

  const handleSave = async () => {
    const nextErrors = validateRecord(record);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setActiveTab("principais");
      toast.error("Preencha os campos obrigatórios antes de salvar.");
      return;
    }

    setSaving(true);
    try {
      const payload = normalizeFormData(record);
      const response = await persistMedicoResponsavel(payload);
      toast.success("Médico responsável salvo com sucesso.");
      await navigate({ to: "/configuracoes/profissionais/medico-responsaveis/$medicoId", params: { medicoId: String(response.id ?? medicoId ?? "") } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o cadastro.");
    } finally {
      setSaving(false);
    }
  };

  if (mode === "list") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Médicos Responsáveis"
          description="Cadastre, consulte e mantenha os profissionais responsáveis vinculados ao sistema."
          actions={
            <Button asChild>
              <Link to="/configuracoes/profissionais/medico-responsaveis/novo">
                <Plus />
                Novo Médico Responsável
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Cadastro de Médicos Responsáveis</CardTitle>
            <CardDescription>Busque por nome, CPF ou CRM para localizar rapidamente um profissional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSearchSubmit}>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome, CPF ou CRM"
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="outline">Buscar</Button>
            </form>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Tipo de Conselho</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="w-[120px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingList ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        Carregando médicos responsáveis...
                      </TableCell>
                    </TableRow>
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        Nenhum médico responsável encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>{item.cpf}</TableCell>
                        <TableCell>{item.crm}</TableCell>
                        <TableCell>{item.situacao ?? "—"}</TableCell>
                        <TableCell>{item.tipoConselho ?? "—"}</TableCell>
                        <TableCell>{item.unidade ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Opções
                                <ChevronDown />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate({ to: "/configuracoes/profissionais/medico-responsaveis/$medicoId", params: { medicoId: String(item.id) }, search: { modo: "visualizar" } as never })}>
                                <Eye />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate({ to: "/configuracoes/profissionais/medico-responsaveis/$medicoId", params: { medicoId: String(item.id) } })}>
                                <Pencil />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeactivateId(item.id)}>
                                <Trash2 />
                                Desativar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={deactivateId !== null} onOpenChange={(open) => !open && setDeactivateId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Desativar médico responsável?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação altera a situação do cadastro para inativo e preserva o histórico do profissional.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeactivate}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="Gerencie os dados cadastrais, financeiros e vínculos auxiliares do profissional." 
        actions={
          <Button asChild variant="outline">
            <Link to={basePath}>
              <ArrowLeft />
              Voltar para listagem
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Cadastro de Médicos Responsáveis</CardTitle>
          <CardDescription>Use as abas abaixo para preencher as informações do profissional.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingForm || !lookupCollections ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Carregando formulário...</div>
          ) : (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 md:grid-cols-5">
                  <TabsTrigger value="principais">Dados principais</TabsTrigger>
                  <TabsTrigger value="complementares">Complementares</TabsTrigger>
                  <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                  <TabsTrigger value="cbos">CBOs vinculados</TabsTrigger>
                  <TabsTrigger value="sus">Exportação SUS</TabsTrigger>
                </TabsList>

                <TabsContent value="principais" className="space-y-4 pt-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <FieldShell label="Nome" error={errors.nome}>
                      <Input value={record.nome} disabled={readOnly} onChange={(event) => updateField("nome", event.target.value)} />
                    </FieldShell>
                    <FieldShell label="CPF" error={errors.cpf}>
                      <Input value={record.cpf} disabled={readOnly} onChange={(event) => updateField("cpf", formatCpf(event.target.value))} maxLength={14} />
                    </FieldShell>
                    <FieldShell label="CRM" error={errors.crm}>
                      <Input value={record.crm} disabled={readOnly} onChange={(event) => updateField("crm", event.target.value)} />
                    </FieldShell>
                    <LookupSelectField label="Situação" table="situacao_cadastros" options={lookupCollections.situacao_cadastros} value={record.situacao_id} onChange={(value) => updateField("situacao_id", value)} onQuickCreate={handleQuickCreate} error={errors.situacao_id} disabled={readOnly} />
                    <LookupSelectField label="Usuário" table="users" options={lookupCollections.users} value={record.user_id} onChange={(value) => updateField("user_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Tipo de conselho profissional" table="tipo_conselho_profissional" options={lookupCollections.tipo_conselho_profissional} value={record.id_tipo_conselho_profissional} onChange={(value) => updateField("id_tipo_conselho_profissional", value)} onQuickCreate={handleQuickCreate} error={errors.id_tipo_conselho_profissional} disabled={readOnly} />
                    <LookupSelectField label="Solicitante" table="solicitantes" options={lookupCollections.solicitantes} value={record.solicitante_id} onChange={(value) => updateField("solicitante_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="CBO" table="solicitante_cbo" options={lookupCollections.solicitante_cbo} value={record.cbo_id} onChange={(value) => updateField("cbo_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Estado" table="configuracao_solicitantes_estados" options={lookupCollections.configuracao_solicitantes_estados} value={record.estado_id} onChange={(value) => updateField("estado_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Tipo de cadastro" table="medico_responsaveis_tipo_cadastro" options={lookupCollections.medico_responsaveis_tipo_cadastro} value={record.tipo_cadastro_id} onChange={(value) => updateField("tipo_cadastro_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Unidade" table="unidades" options={lookupCollections.unidades} value={record.unidade_id} onChange={(value) => updateField("unidade_id", value)} onQuickCreate={handleQuickCreate} error={errors.unidade_id} disabled={readOnly} />
                  </div>
                </TabsContent>

                <TabsContent value="complementares" className="space-y-4 pt-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <LookupSelectField label="Estado civil" table="estado_civis" options={lookupCollections.estado_civis} value={record.estado_civil_id} onChange={(value) => updateField("estado_civil_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Religião" table="religiao" options={lookupCollections.religiao} value={record.religiao_id} onChange={(value) => updateField("religiao_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Etnia" table="etnia" options={lookupCollections.etnia} value={record.etnia_id} onChange={(value) => updateField("etnia_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Escolaridade" table="escolaridade" options={lookupCollections.escolaridade} value={record.escolaridade_id} onChange={(value) => updateField("escolaridade_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Região responsável Home Care" table="home_care_regiao_responsavel" options={lookupCollections.home_care_regiao_responsavel} value={record.home_care_regiao_responsavel_id} onChange={(value) => updateField("home_care_regiao_responsavel_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                  </div>
                </TabsContent>

                <TabsContent value="financeiro" className="space-y-4 pt-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <LookupSelectField label="Contabilidade de produtividade" table="fin_contabilidades" options={lookupCollections.fin_contabilidades} value={record.produtividade_fin_contabilidade_id} onChange={(value) => updateField("produtividade_fin_contabilidade_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Configuração de apuração" table="configuracao_apuracao" options={lookupCollections.configuracao_apuracao} value={record.configuracao_apuracao_id} onChange={(value) => updateField("configuracao_apuracao_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Fornecedor financeiro" table="fin_fornecedores" options={lookupCollections.fin_fornecedores} value={record.fin_fornecedor_id} onChange={(value) => updateField("fin_fornecedor_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Plano de contas a pagar" table="fin_plano_contas" options={lookupCollections.fin_plano_contas} value={record.contas_pagar_plano_contas_id} onChange={(value) => updateField("contas_pagar_plano_contas_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Plano de contas a receber" table="fin_plano_contas" options={lookupCollections.fin_plano_contas} value={record.contas_receber_plano_contas_id} onChange={(value) => updateField("contas_receber_plano_contas_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                    <LookupSelectField label="Tabela padrão de repasse Home Care" table="homecare_escala_repasse_tabela_padrao" options={lookupCollections.homecare_escala_repasse_tabela_padrao} value={record.homecare_escala_repasse_tabela_padrao_id} onChange={(value) => updateField("homecare_escala_repasse_tabela_padrao_id", value)} onQuickCreate={handleQuickCreate} disabled={readOnly} />
                  </div>
                </TabsContent>

                <TabsContent value="cbos" className="space-y-4 pt-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex-1 space-y-2">
                      <span className="text-sm font-medium text-foreground">Adicionar CBO vinculado</span>
                      <Select disabled={readOnly} value={selectedCboId} onValueChange={setSelectedCboId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um CBO" />
                        </SelectTrigger>
                        <SelectContent>
                          {lookupCollections.solicitante_cbo.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                              {option.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {!readOnly ? <Button type="button" onClick={addLinkedCbo}><Plus />Adicionar</Button> : null}
                  </div>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CBO vinculado</TableHead>
                          {!readOnly ? <TableHead className="w-[120px] text-right">Ação</TableHead> : null}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.cbo_ids.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={readOnly ? 1 : 2} className="py-8 text-center text-muted-foreground">
                              Nenhum CBO vinculado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          record.cbo_ids.map((cboId) => {
                            const option = lookupCollections.solicitante_cbo.find((item) => item.id === cboId);
                            return (
                              <TableRow key={cboId}>
                                <TableCell>{option?.value ?? `CBO #${cboId}`}</TableCell>
                                {!readOnly ? (
                                  <TableCell className="text-right">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => updateField("cbo_ids", record.cbo_ids.filter((item) => item !== cboId))}>
                                      Remover
                                    </Button>
                                  </TableCell>
                                ) : null}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="sus" className="space-y-4 pt-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end">
                    <FieldShell label="Nova data de exportação">
                      <Input type="date" value={newExportDate} disabled={readOnly} onChange={(event) => setNewExportDate(event.target.value)} />
                    </FieldShell>
                    {!readOnly ? <Button type="button" onClick={addExportDate}><Plus />Adicionar data</Button> : null}
                  </div>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data de exportação</TableHead>
                          {!readOnly ? <TableHead className="w-[120px] text-right">Ação</TableHead> : null}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.exportacoes_sus.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={readOnly ? 1 : 2} className="py-8 text-center text-muted-foreground">
                              Nenhum registro de exportação SUS.
                            </TableCell>
                          </TableRow>
                        ) : (
                          record.exportacoes_sus.map((date) => (
                            <TableRow key={date}>
                              <TableCell>{date}</TableCell>
                              {!readOnly ? (
                                <TableCell className="text-right">
                                  <Button type="button" variant="ghost" size="sm" onClick={() => updateField("exportacoes_sus", record.exportacoes_sus.filter((item) => item !== date))}>
                                    Remover
                                  </Button>
                                </TableCell>
                              ) : null}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>

              {!readOnly ? (
                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button type="button" variant="outline" asChild>
                    <Link to={basePath}>Cancelar</Link>
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={saving}>
                    <Save />
                    {saving ? "Salvando..." : "Salvar cadastro"}
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
