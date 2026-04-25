import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  Plus, Save, Pencil, Trash2, Eye, Upload, X, Search,
  Eye as EyeIcon, EyeOff, FileBadge, Stethoscope, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase } from "lucide-react";
import {
  ProfissionalCBOsDialog,
  type ProfissionalCBO,
} from "./ProfissionalCBOsDialog";
import {
  ProfissionalEspecialidadesDialog,
  type ProfissionalEspecialidade,
} from "./ProfissionalEspecialidadesDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

/* ───────────────── Types ───────────────── */

type SimNao = "sim" | "nao";

interface Profissional {
  id: string;
  // Dados Principais
  foto: string | null;
  nome: string;
  tipo_cadastro_id: string; // "medico" | "enfermeiro"
  cpf: string;
  rg: string;
  dta_nascimento: string;
  sexo: string;
  situacao_id: string; // "1" | "2"
  // Complementares I
  cep: string;
  endereco: string;
  numero_residencial: string;
  complemento: string;
  bairro: string;
  cidade: string;
  endereco_estado: string;
  telefone: string;
  celular: string;
  email: string;
  estado_id: string;
  // Documentos e Registros
  id_tipo_conselho_profissional: string;
  status: string;
  conselho_estado_id: string;
  status_conselho: string;
  conselho: string;
  numero_conselho: string;
  registro_rqe: string;
  nome_laudo: string;
  conselho_laudo: string;
  cns: string;
  pis: string;
  cbo_id: string;
  cnes: string;
  // Financeiro
  banco: string;
  agencia_bancaria: string;
  conta_bancaria: string;
  // Configurações
  unidade_id: string;
  cadastra_agenda: SimNao;
  habilita_agenda_sessoes: SimNao;
  preceptor_usuario_habilitado_ser_escolhido: SimNao;
  sus_vinculo_empregaticio: string;
  psiquiatria: SimNao;
  // Certificado Digital
  possui_certificado: SimNao;
  arquivo_certificado_pfx: { name: string; size: number } | null;
  senha_certificado: string;
  data_hora_anexo_certificado: string;
  validade_inicio_certificado: string;
  validade_fim_certificado: string;
}

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const TIPOS_CADASTRO = [
  { value: "medico", label: "Médico" },
  { value: "enfermeiro", label: "Enfermeiro" },
];

const SITUACOES = [
  { value: "1", label: "Ativo" },
  { value: "2", label: "Inativo" },
];

const SEXOS = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
];

const CONSELHOS = [
  { value: "CRM", label: "CRM - Conselho Regional de Medicina" },
  { value: "COREN", label: "COREN - Conselho Regional de Enfermagem" },
];

const STATUS_OPTS = ["Ativo", "Inativo", "Suspenso", "Pendente"];
const STATUS_CONSELHO_OPTS = ["Regular", "Irregular", "Suspenso", "Pendente"];
const VINCULO_SUS_OPTS = ["CLT", "Autônomo"];
const UNIDADES = [
  { value: "u1", label: "Unidade Centro" },
  { value: "u2", label: "Unidade Norte" },
  { value: "u3", label: "Unidade Sul" },
];

/* ───────────────── Helpers ───────────────── */

const empty = (): Profissional => ({
  id: "",
  foto: null,
  nome: "", tipo_cadastro_id: "", cpf: "", rg: "",
  dta_nascimento: "", sexo: "", situacao_id: "",
  cep: "", endereco: "", numero_residencial: "", complemento: "",
  bairro: "", cidade: "", endereco_estado: "",
  telefone: "", celular: "", email: "", estado_id: "",
  id_tipo_conselho_profissional: "", status: "",
  conselho_estado_id: "", status_conselho: "", conselho: "",
  numero_conselho: "", registro_rqe: "", nome_laudo: "",
  conselho_laudo: "", cns: "", pis: "", cbo_id: "", cnes: "",
  banco: "", agencia_bancaria: "", conta_bancaria: "",
  unidade_id: "", cadastra_agenda: "nao", habilita_agenda_sessoes: "nao",
  preceptor_usuario_habilitado_ser_escolhido: "nao",
  sus_vinculo_empregaticio: "", psiquiatria: "nao",
  possui_certificado: "nao", arquivo_certificado_pfx: null,
  senha_certificado: "", data_hora_anexo_certificado: "",
  validade_inicio_certificado: "", validade_fim_certificado: "",
});

const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskCEP = (v: string) =>
  v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

const maskTelefone = (v: string) =>
  v.replace(/\D/g, "").slice(0, 10)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const maskCelular = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

const isValidEmail = (e: string) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const labelOf = (arr: { value: string; label: string }[], v: string) =>
  arr.find((o) => o.value === v)?.label ?? "";

/* ───────────────── Mocks iniciais ───────────────── */

const initialMocks: Profissional[] = [
  {
    ...empty(),
    id: "p1",
    nome: "Dr. Carlos Mendes",
    tipo_cadastro_id: "medico",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    dta_nascimento: "1980-05-12",
    sexo: "masculino",
    situacao_id: "1",
    cep: "01310-100",
    endereco: "Av. Paulista",
    numero_residencial: "1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    endereco_estado: "SP",
    telefone: "(11) 3000-0000",
    celular: "(11) 98888-7777",
    email: "carlos.mendes@hospital.com",
    id_tipo_conselho_profissional: "CRM",
    conselho_estado_id: "SP",
    conselho: "CRM-SP",
    numero_conselho: "123456",
    status_conselho: "Regular",
    status: "Ativo",
    cadastra_agenda: "sim",
    habilita_agenda_sessoes: "sim",
    psiquiatria: "nao",
    preceptor_usuario_habilitado_ser_escolhido: "sim",
  },
  {
    ...empty(),
    id: "p2",
    nome: "Enf. Maria Silva",
    tipo_cadastro_id: "enfermeiro",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    dta_nascimento: "1990-09-22",
    sexo: "feminino",
    situacao_id: "1",
    cep: "20040-002",
    endereco: "Rua do Ouvidor",
    numero_residencial: "50",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    endereco_estado: "RJ",
    celular: "(21) 99999-1111",
    email: "maria.silva@hospital.com",
    id_tipo_conselho_profissional: "COREN",
    conselho_estado_id: "RJ",
    conselho: "COREN-RJ",
    numero_conselho: "987654",
    status_conselho: "Regular",
    status: "Ativo",
    cadastra_agenda: "sim",
  },
];

/* ───────────────── Page ───────────────── */

export function ProfissionaisPage() {
  const [list, setList] = useState<Profissional[]>(initialMocks);
  const [form, setForm] = useState<Profissional>(empty());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState("dados");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Profissional | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSenha, setShowSenha] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [cbosOpenForId, setCbosOpenForId] = useState<string | null>(null);
  const [especialidadesOpenForId, setEspecialidadesOpenForId] = useState<string | null>(null);
  const [profissionalCbos, setProfissionalCbos] = useState<ProfissionalCBO[]>([
    {
      id: "cbo1", medico_responsaveis_id: "p1", cbo_id: "225125", situacao_id: "1",
      user_created: "usuario.logado", user_modified: "usuario.logado",
      created: new Date().toISOString(), modified: new Date().toISOString(),
    },
    {
      id: "cbo2", medico_responsaveis_id: "p1", cbo_id: "225170", situacao_id: "2",
      user_created: "usuario.logado", user_modified: "usuario.logado",
      created: new Date().toISOString(), modified: new Date().toISOString(),
    },
    {
      id: "cbo3", medico_responsaveis_id: "p2", cbo_id: "223505", situacao_id: "1",
      user_created: "usuario.logado", user_modified: "usuario.logado",
      created: new Date().toISOString(), modified: new Date().toISOString(),
    },
  ]);
  const [profissionalEspecialidades, setProfissionalEspecialidades] = useState<ProfissionalEspecialidade[]>([
    {
      id: "esp1", medico_id: "p1", especialidade_id: "1", situacao_id: "1",
      created: new Date().toISOString(), modified: new Date().toISOString(),
    },
    {
      id: "esp2", medico_id: "p1", especialidade_id: "2", situacao_id: "2",
      created: new Date().toISOString(), modified: new Date().toISOString(),
    },
    {
      id: "esp3", medico_id: "p2", especialidade_id: "9", situacao_id: "1",
      created: new Date().toISOString(), modified: new Date().toISOString(),
    },
  ]);
  const fotoInput = useRef<HTMLInputElement>(null);
  const pfxInput = useRef<HTMLInputElement>(null);

  const update = <K extends keyof Profissional>(k: K, v: Profissional[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.cpf.includes(q) ||
        p.conselho.toLowerCase().includes(q),
    );
  }, [list, search]);

  /* ── Actions ── */

  const handleNovo = () => {
    setForm(empty());
    setEditingId(null);
    setTab("dados");
    setShowSenha(false);
    setFormOpen(true);
  };

  const handleSalvar = () => {
    // Validation
    const errors: string[] = [];
    if (!form.nome.trim()) errors.push("Nome");
    if (!form.tipo_cadastro_id) errors.push("Tipo de Cadastro");
    if (!form.cpf || form.cpf.replace(/\D/g, "").length !== 11) errors.push("CPF");
    if (!form.situacao_id) errors.push("Situação");
    if (form.email && !isValidEmail(form.email)) {
      toast.error("E-mail inválido");
      setTab("complementares");
      return;
    }
    if (form.possui_certificado === "sim") {
      if (!form.arquivo_certificado_pfx) errors.push("Arquivo Certificado PFX");
      if (!form.senha_certificado) errors.push("Senha do Certificado");
      if (!form.validade_inicio_certificado) errors.push("Validade Início");
      if (!form.validade_fim_certificado) errors.push("Validade Fim");
    }
    if (errors.length) {
      toast.error(`Campos obrigatórios: ${errors.join(", ")}`);
      if (errors.some((e) => ["Nome", "Tipo de Cadastro", "CPF", "Situação"].includes(e))) {
        setTab("dados");
      } else if (errors.some((e) => e.includes("Certificado") || e.includes("Validade") || e.includes("Senha"))) {
        setTab("certificado");
      }
      return;
    }

    if (editingId) {
      setList((l) => l.map((p) => (p.id === editingId ? { ...form, id: editingId } : p)));
      toast.success("Profissional atualizado com sucesso");
    } else {
      const novo = { ...form, id: `p${Date.now()}` };
      setList((l) => [...l, novo]);
      toast.success("Profissional cadastrado com sucesso");
    }
    setForm(empty());
    setEditingId(null);
    setTab("dados");
    setShowSenha(false);
    setFormOpen(false);
  };

  const handleEditar = (p: Profissional) => {
    setForm({ ...p });
    setEditingId(p.id);
    setTab("dados");
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    setList((l) => l.filter((p) => p.id !== deletingId));
    if (editingId === deletingId) {
      setForm(empty());
      setEditingId(null);
      setFormOpen(false);
    }
    setDeletingId(null);
    toast.success("Profissional excluído com sucesso");
  };

  /* ── Foto upload ── */

  const handleFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpe?g|png|webp)$/.test(file.type)) {
      toast.error("Formato inválido. Use JPG, JPEG, PNG ou WEBP");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("foto", reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ── PFX upload ── */

  const handlePfx = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pfx")) {
      toast.error("Apenas arquivos .pfx são permitidos");
      return;
    }
    setForm((f) => ({
      ...f,
      arquivo_certificado_pfx: { name: file.name, size: file.size },
      data_hora_anexo_certificado: nowStamp(),
    }));
  };

  const certEnabled = form.possui_certificado === "sim";

  /* ───────────────── Render ───────────────── */

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Stethoscope className="size-6 text-primary" />
              Cadastro de Profissionais
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie médicos, enfermeiros e demais profissionais.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleNovo}>
              <Plus className="size-4" /> Novo Profissional
            </Button>
          </div>
        </div>

        {/* Listagem */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">Profissionais cadastrados</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="size-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou conselho..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Foto</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Conselho</TableHead>
                    <TableHead className="w-32 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Nenhum profissional encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => (
                      <TableRow key={p.id} className={editingId === p.id ? "bg-accent/40" : ""}>
                        <TableCell>
                          {p.foto ? (
                            <img src={p.foto} alt={p.nome} className="size-10 rounded-full object-cover border" />
                          ) : (
                            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                              {p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{p.nome}</TableCell>
                        <TableCell className="font-mono text-xs">{p.cpf}</TableCell>
                        <TableCell>{labelOf(TIPOS_CADASTRO, p.tipo_cadastro_id)}</TableCell>
                        <TableCell>
                          <Badge variant={p.situacao_id === "1" ? "default" : "secondary"}>
                            {labelOf(SITUACOES, p.situacao_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.conselho || "—"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1">
                                Opções <ChevronDown className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => setViewing(p)}>
                                <Eye className="size-4" /> Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditar(p)}>
                                <Pencil className="size-4" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setCbosOpenForId(p.id)}>
                                <Briefcase className="size-4" /> CBO
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingId(p.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4" /> Excluir
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

        {/* Formulário (Dialog) */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingId ? (
                  <>
                    <Pencil className="size-4" /> Editar Profissional
                  </>
                ) : (
                  <>
                    <Plus className="size-4" /> Novo Profissional
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? `Editando: ${form.nome || "Profissional"}`
                  : "Preencha os dados para cadastrar um novo profissional."}
              </DialogDescription>
            </DialogHeader>
            <div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex flex-wrap h-auto">
                <TabsTrigger value="dados">Dados Principais</TabsTrigger>
                <TabsTrigger value="complementares">Complementares I</TabsTrigger>
                <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="config">Configurações</TabsTrigger>
                <TabsTrigger value="certificado">Certificado Digital</TabsTrigger>
              </TabsList>

              {/* ── Dados Principais ── */}
              <TabsContent value="dados" className="mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="space-y-2">
                    <Label>Foto do Profissional</Label>
                    <div className="size-32 rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden relative">
                      {form.foto ? (
                        <img src={form.foto} alt="preview" className="size-full object-cover" />
                      ) : (
                        <Upload className="size-8 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      ref={fotoInput}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFoto}
                    />
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => fotoInput.current?.click()}>
                        {form.foto ? "Trocar" : "Selecionar"}
                      </Button>
                      {form.foto && (
                        <Button size="sm" variant="ghost" onClick={() => update("foto", null)}>
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <Field label="Nome" required>
                      <Input value={form.nome} onChange={(e) => update("nome", e.target.value)} />
                    </Field>
                    <Field label="Tipo de Cadastro" required>
                      <Select value={form.tipo_cadastro_id} onValueChange={(v) => update("tipo_cadastro_id", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {TIPOS_CADASTRO.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="CPF" required>
                      <Input value={form.cpf} placeholder="000.000.000-00"
                        onChange={(e) => update("cpf", maskCPF(e.target.value))} />
                    </Field>
                    <Field label="RG">
                      <Input value={form.rg} onChange={(e) => update("rg", e.target.value)} />
                    </Field>
                    <Field label="Dt. Nascimento">
                      <Input type="date" value={form.dta_nascimento}
                        onChange={(e) => update("dta_nascimento", e.target.value)} />
                    </Field>
                    <Field label="Sexo">
                      <Select value={form.sexo} onValueChange={(v) => update("sexo", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {SEXOS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Situação" required>
                      <Select value={form.situacao_id} onValueChange={(v) => update("situacao_id", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {SITUACOES.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.value} - {o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              </TabsContent>

              {/* ── Complementares I ── */}
              <TabsContent value="complementares" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="CEP">
                    <Input value={form.cep} placeholder="00000-000"
                      onChange={(e) => update("cep", maskCEP(e.target.value))} />
                  </Field>
                  <Field label="Endereço" className="md:col-span-2">
                    <Input value={form.endereco} onChange={(e) => update("endereco", e.target.value)} />
                  </Field>
                  <Field label="Número">
                    <Input value={form.numero_residencial} onChange={(e) => update("numero_residencial", e.target.value)} />
                  </Field>
                  <Field label="Complemento">
                    <Input value={form.complemento} onChange={(e) => update("complemento", e.target.value)} />
                  </Field>
                  <Field label="Bairro">
                    <Input value={form.bairro} onChange={(e) => update("bairro", e.target.value)} />
                  </Field>
                  <Field label="Cidade">
                    <Input value={form.cidade} onChange={(e) => update("cidade", e.target.value)} />
                  </Field>
                  <Field label="Estado">
                    <Select value={form.endereco_estado} onValueChange={(v) => update("endereco_estado", v)}>
                      <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>
                        {UFS.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Estado ID">
                    <Input value={form.estado_id} onChange={(e) => update("estado_id", e.target.value)} />
                  </Field>
                  <Field label="Telefone">
                    <Input value={form.telefone} placeholder="(00) 0000-0000"
                      onChange={(e) => update("telefone", maskTelefone(e.target.value))} />
                  </Field>
                  <Field label="Celular">
                    <Input value={form.celular} placeholder="(00) 00000-0000"
                      onChange={(e) => update("celular", maskCelular(e.target.value))} />
                  </Field>
                  <Field label="E-mail">
                    <Input type="email" value={form.email}
                      onChange={(e) => update("email", e.target.value)} />
                  </Field>
                </div>
              </TabsContent>

              {/* ── Documentos e Registros ── */}
              <TabsContent value="documentos" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Sigla" tooltip="Sigla do Conselho">
                    <Select value={form.id_tipo_conselho_profissional}
                      onValueChange={(v) => update("id_tipo_conselho_profissional", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {CONSELHOS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Status">
                    <Select value={form.status} onValueChange={(v) => update("status", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Conselho UF">
                    <Select value={form.conselho_estado_id} onValueChange={(v) => update("conselho_estado_id", v)}>
                      <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>
                        {UFS.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Status" tooltip="Status no Conselho">
                    <Select value={form.status_conselho} onValueChange={(v) => update("status_conselho", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {STATUS_CONSELHO_OPTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Conselho">
                    <Input value={form.conselho} onChange={(e) => update("conselho", e.target.value)} />
                  </Field>
                  <Field label="Número Conselho">
                    <Input value={form.numero_conselho} onChange={(e) => update("numero_conselho", e.target.value)} />
                  </Field>
                  <Field label="RQE">
                    <Input value={form.registro_rqe} onChange={(e) => update("registro_rqe", e.target.value)} />
                  </Field>
                  <Field label="Nome Laudo">
                    <Input value={form.nome_laudo} onChange={(e) => update("nome_laudo", e.target.value)} />
                  </Field>
                  <Field label="Conselho Laudo">
                    <Input value={form.conselho_laudo} onChange={(e) => update("conselho_laudo", e.target.value)} />
                  </Field>
                  <Field label="CNS" tooltip="Cartão Nacional Saúde">
                    <Input value={form.cns} onChange={(e) => update("cns", e.target.value)} />
                  </Field>
                  <Field label="PIS">
                    <Input value={form.pis} onChange={(e) => update("pis", e.target.value)} />
                  </Field>
                  <Field label="CBO" tooltip="CBO Principal">
                    <Input value={form.cbo_id} onChange={(e) => update("cbo_id", e.target.value)} />
                  </Field>
                  <Field label="CNES">
                    <Input value={form.cnes} onChange={(e) => update("cnes", e.target.value)} />
                  </Field>
                </div>
              </TabsContent>

              {/* ── Financeiro ── */}
              <TabsContent value="financeiro" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Banco">
                    <Input value={form.banco} onChange={(e) => update("banco", e.target.value)} />
                  </Field>
                  <Field label="Agência">
                    <Input value={form.agencia_bancaria} onChange={(e) => update("agencia_bancaria", e.target.value)} />
                  </Field>
                  <Field label="Conta">
                    <Input value={form.conta_bancaria} onChange={(e) => update("conta_bancaria", e.target.value)} />
                  </Field>
                </div>
              </TabsContent>

              {/* ── Configurações ── */}
              <TabsContent value="config" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Unidade" tooltip="Corresponde a uma unidade específica">
                    <Select value={form.unidade_id} onValueChange={(v) => update("unidade_id", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {UNIDADES.map((u) => (
                          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Vínculo SUS">
                    <Select value={form.sus_vinculo_empregaticio}
                      onValueChange={(v) => update("sus_vinculo_empregaticio", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {VINCULO_SUS_OPTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <SwitchField
                    label="Agenda" tooltip="Habilita utilização na Agenda"
                    value={form.cadastra_agenda}
                    onChange={(v) => update("cadastra_agenda", v)}
                  />
                  <SwitchField
                    label="Agenda Sessões" tooltip="Habilita utilização na Agenda de Sessões"
                    value={form.habilita_agenda_sessoes}
                    onChange={(v) => update("habilita_agenda_sessoes", v)}
                  />
                  <SwitchField
                    label="Preceptor?" tooltip="Habilita o profissional para ser preceptor"
                    value={form.preceptor_usuario_habilitado_ser_escolhido}
                    onChange={(v) => update("preceptor_usuario_habilitado_ser_escolhido", v)}
                  />
                  <SwitchField
                    label="Atende Pacientes Psiquiátricos?"
                    value={form.psiquiatria}
                    onChange={(v) => update("psiquiatria", v)}
                  />
                </div>
              </TabsContent>

              {/* ── Certificado Digital ── */}
              <TabsContent value="certificado" className="mt-4 space-y-4">
                <SwitchField
                  label="Utiliza Certificado?"
                  value={form.possui_certificado}
                  onChange={(v) => update("possui_certificado", v)}
                />
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${certEnabled ? "" : "opacity-50 pointer-events-none"}`}>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Arquivo Certificado PFX {certEnabled && <span className="text-destructive">*</span>}</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        ref={pfxInput}
                        type="file"
                        accept=".pfx"
                        className="hidden"
                        onChange={handlePfx}
                      />
                      <Button type="button" variant="outline" onClick={() => pfxInput.current?.click()}>
                        <FileBadge className="size-4" />
                        {form.arquivo_certificado_pfx ? "Trocar arquivo" : "Anexar .pfx"}
                      </Button>
                      {form.arquivo_certificado_pfx && (
                        <>
                          <Badge variant="secondary">
                            {form.arquivo_certificado_pfx.name} • {formatBytes(form.arquivo_certificado_pfx.size)}
                          </Badge>
                          <Button size="icon" variant="ghost"
                            onClick={() => setForm((f) => ({
                              ...f, arquivo_certificado_pfx: null,
                              data_hora_anexo_certificado: "",
                            }))}>
                            <X className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <Field label="Senha do Certificado" required={certEnabled}>
                    <div className="relative">
                      <Input
                        type={showSenha ? "text" : "password"}
                        value={form.senha_certificado}
                        onChange={(e) => update("senha_certificado", e.target.value)}
                        className="pr-9"
                      />
                      <button type="button" onClick={() => setShowSenha((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showSenha ? <EyeOff className="size-4" /> : <EyeIcon className="size-4" />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Data/Hora do Anexo">
                    <Input value={form.data_hora_anexo_certificado} readOnly className="bg-muted" />
                  </Field>

                  <Field label="Validade Início Certificado" required={certEnabled}>
                    <Input type="date" value={form.validade_inicio_certificado}
                      onChange={(e) => update("validade_inicio_certificado", e.target.value)} />
                  </Field>

                  <Field label="Validade Fim Certificado" required={certEnabled}>
                    <Input type="date" value={form.validade_fim_certificado}
                      onChange={(e) => update("validade_fim_certificado", e.target.value)} />
                  </Field>
                </div>
              </TabsContent>
            </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Fechar
              </Button>
              <Button onClick={handleSalvar}>
                <Save className="size-4" /> Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visualizar Profissional</DialogTitle>
              <DialogDescription>{viewing?.nome}</DialogDescription>
            </DialogHeader>
            {viewing && <ViewDetails p={viewing} />}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewing(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir profissional?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* CBOs do Profissional */}
        <ProfissionalCBOsDialog
          open={!!cbosOpenForId}
          onOpenChange={(o) => !o && setCbosOpenForId(null)}
          profissional={(() => {
            const p = list.find((x) => x.id === cbosOpenForId);
            if (!p) return null;
            return {
              id: p.id,
              nome: p.nome,
              cpf: p.cpf,
              tipo_cadastro_label: labelOf(TIPOS_CADASTRO, p.tipo_cadastro_id),
              conselho: p.conselho,
            };
          })()}
          cbos={profissionalCbos}
          onChange={setProfissionalCbos}
        />
      </div>
    </TooltipProvider>
  );
}

/* ───────────────── Sub components ───────────────── */

function Field({
  label, children, required, tooltip, className = "",
}: {
  label: string; children: React.ReactNode; required?: boolean;
  tooltip?: string; className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </Label>
      {children}
    </div>
  );
}

function SwitchField({
  label, tooltip, value, onChange,
}: {
  label: string; tooltip?: string;
  value: SimNao; onChange: (v: SimNao) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
      <Label className="flex items-center gap-1.5 cursor-pointer">
        {label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{value === "sim" ? "Sim" : "Não"}</span>
        <Switch checked={value === "sim"}
          onCheckedChange={(c) => onChange(c ? "sim" : "nao")} />
      </div>
    </div>
  );
}

function ViewDetails({ p }: { p: Profissional }) {
  return (
    <Tabs defaultValue="dados">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="dados">Dados Principais</TabsTrigger>
        <TabsTrigger value="comp">Complementares I</TabsTrigger>
        <TabsTrigger value="docs">Documentos</TabsTrigger>
        <TabsTrigger value="fin">Financeiro</TabsTrigger>
        <TabsTrigger value="cfg">Configurações</TabsTrigger>
        <TabsTrigger value="cert">Certificado</TabsTrigger>
      </TabsList>
      <TabsContent value="dados" className="mt-4">
        <div className="flex gap-4 items-start">
          {p.foto ? (
            <img src={p.foto} alt={p.nome} className="size-24 rounded-md object-cover border" />
          ) : (
            <div className="size-24 rounded-md bg-muted flex items-center justify-center text-2xl text-muted-foreground">
              {p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
          )}
          <DL items={[
            ["Nome", p.nome], ["Tipo", labelOf(TIPOS_CADASTRO, p.tipo_cadastro_id)],
            ["CPF", p.cpf], ["RG", p.rg],
            ["Nascimento", p.dta_nascimento], ["Sexo", labelOf(SEXOS, p.sexo)],
            ["Situação", labelOf(SITUACOES, p.situacao_id)],
          ]} />
        </div>
      </TabsContent>
      <TabsContent value="comp" className="mt-4">
        <DL items={[
          ["CEP", p.cep], ["Endereço", p.endereco], ["Número", p.numero_residencial],
          ["Complemento", p.complemento], ["Bairro", p.bairro],
          ["Cidade", p.cidade], ["Estado", p.endereco_estado],
          ["Telefone", p.telefone], ["Celular", p.celular], ["E-mail", p.email],
        ]} />
      </TabsContent>
      <TabsContent value="docs" className="mt-4">
        <DL items={[
          ["Sigla", p.id_tipo_conselho_profissional], ["Status", p.status],
          ["Conselho UF", p.conselho_estado_id], ["Status Conselho", p.status_conselho],
          ["Conselho", p.conselho], ["Número Conselho", p.numero_conselho],
          ["RQE", p.registro_rqe], ["Nome Laudo", p.nome_laudo],
          ["Conselho Laudo", p.conselho_laudo], ["CNS", p.cns],
          ["PIS", p.pis], ["CBO", p.cbo_id], ["CNES", p.cnes],
        ]} />
      </TabsContent>
      <TabsContent value="fin" className="mt-4">
        <DL items={[["Banco", p.banco], ["Agência", p.agencia_bancaria], ["Conta", p.conta_bancaria]]} />
      </TabsContent>
      <TabsContent value="cfg" className="mt-4">
        <DL items={[
          ["Unidade", labelOf(UNIDADES, p.unidade_id)],
          ["Agenda", p.cadastra_agenda === "sim" ? "Sim" : "Não"],
          ["Agenda Sessões", p.habilita_agenda_sessoes === "sim" ? "Sim" : "Não"],
          ["Preceptor", p.preceptor_usuario_habilitado_ser_escolhido === "sim" ? "Sim" : "Não"],
          ["Vínculo SUS", p.sus_vinculo_empregaticio],
          ["Atende Psiquiátricos", p.psiquiatria === "sim" ? "Sim" : "Não"],
        ]} />
      </TabsContent>
      <TabsContent value="cert" className="mt-4">
        <DL items={[
          ["Utiliza Certificado", p.possui_certificado === "sim" ? "Sim" : "Não"],
          ["Arquivo PFX", p.arquivo_certificado_pfx?.name ?? "—"],
          ["Tamanho", p.arquivo_certificado_pfx ? formatBytes(p.arquivo_certificado_pfx.size) : "—"],
          ["Data/Hora Anexo", p.data_hora_anexo_certificado],
          ["Validade Início", p.validade_inicio_certificado],
          ["Validade Fim", p.validade_fim_certificado],
          ["Senha", p.senha_certificado ? "********" : "—"],
        ]} />
      </TabsContent>
    </Tabs>
  );
}

function DL({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 flex-1">
      {items.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="text-xs text-muted-foreground">{k}</dt>
          <dd className="text-sm font-medium">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

// Suppress unused import warning
void Textarea;
