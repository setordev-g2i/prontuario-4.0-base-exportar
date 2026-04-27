# Plano: modais de ação + feedback de validação + abas no cadastro de Profissional

Três frentes: (1) transformar **Novo/Editar/Visualizar** em **modais** (mantendo rotas como atalhos opcionais), (2) disparar **toast "O campo X é obrigatório"** no submit inválido, e (3) **reestruturar o form de Profissional em 7 abas** conforme spec.

## 1. Ações da listagem em modal

Hoje `Visualizar`, `Editar` e `Novo` navegam para páginas dedicadas (`/novo`, `/:id/editar`, `/:id`). Passaremos tudo para **modais** abertos diretamente da listagem, usando o `FormModal` existente (já com suporte a tabs).

**Mudanças nas listagens** (`Profissionais/index.tsx`, `Pacientes/index.tsx`, `ProfissionaisCbos/index.tsx`, `ProfissionaisEspecialidades/index.tsx`):
- Remover `navigate(...)` nos handlers `onView`, `onEdit`, botão "Novo".
- Controlar estado local: `modalMode: "create" | "edit" | "view" | null` + `selected: Entity | null`.
- Botão "Novo" abre modal em modo `create`. `ActionsDropdown.onView/onEdit` abrem modal com a entidade.
- O modal renderiza o form compartilhado (`PacienteForm`, `ProfissionalForm`) dentro do `FormModal` (com título "Novo/Editar/Visualizar X").
- Modo `view`: form recebe nova prop `readOnly` → todos os inputs com `disabled` e apenas botão "Fechar".

**Rotas** (`src/routes.tsx`): manter as rotas `/novo`, `/:id`, `/:id/editar` como atalhos (redirecionam para a listagem abrindo o modal correspondente via `useEffect` + search params, ex.: `/configuracoes/profissionais?modal=edit&id=123`). Alternativa mais simples: remover as rotas de novo/editar/visualizar e eliminar os arquivos `novo.tsx`, `editar.tsx`, `visualizar.tsx`. **Proposta: remover** (modal é a fonte única da verdade, menos código duplicado). Rotas de CBOs/Especialidades permanecem como rotas de página (já abrem dialog interno).

**ActionsDropdown**: sem mudança estrutural — apenas os consumidores mudam os handlers.

## 2. Toast em campos obrigatórios no submit

Criar helper `src/lib/forms/notifyRequired.ts`:

```ts
export function notifyRequiredErrors(
  errors: FieldErrors,
  labels: Record<string, string>
) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  const label = labels[first] ?? first;
  toast.error(`O campo ${label} é obrigatório`);
}
```

Nos forms (`PacienteForm`, `ProfissionalForm`), passar segundo argumento ao `handleSubmit`:

```ts
const FIELD_LABELS = { nome: "Nome", cpf: "CPF", dataNascimento: "Dt. Nascimento", ... };
<form onSubmit={handleSubmit(onSubmit, (errs) => notifyRequiredErrors(errs, FIELD_LABELS))}>
```

Assim, além da **borda vermelha** já existente (`errors.X && "border-destructive"`), o usuário recebe o toast no submit inválido. A limpeza do erro ao digitar já é automática (react-hook-form + `mode: "onChange"` a ser adicionado no `useForm`).

## 3. Reestruturação do form de Profissional em 7 abas

Substituir o layout seccionado atual do `ProfissionalForm.tsx` por `<Tabs>` (shadcn). Estrutura:

```text
[Dados Principais] [Complementares I] [Complementares II] [Documentos e Registros] [Financeiro] [Configurações] [SUS]
```

### Abas e campos

| Aba | Campos |
|---|---|
| **Dados Principais** | Nome, Tipo de Cadastro (select), CPF, RG, Dt. Nascimento (date), Sexo (select), Email, Celular (masked), Telefone (masked), Situação |
| **Complementares I** | CEP (masked), Endereço, Número, Complemento, Cidade, Estado (select UF) |
| **Complementares II** | Estado civil (select), Religião, Etnia (select), Escolaridade (select), Região responsável Home Care |
| **Documentos e Registros** | Sigla, Conselho (CRM), Status Conselho (select), RQE, Nome Laudo, Conselho Laudo, Cartão Nacional Saúde, PIS, CBO, CNES, Tipo de Pessoa |
| **Financeiro** | Banco, Agência, Conta, Configuração Apuração, Contabilidade, Fornecedor, Planos de Conta, Tabela Repasse |
| **Configurações** | Atende Pacientes Psiquiátricos? (Switch), Cadastrar Agenda? (Switch), Unidade (select), Solicitante (select) |
| **SUS** | Vínculo SUS (text) + tabela de datas de exportação (placeholder por enquanto — dados mock) |

Aba **"CBOs vinculados"** permanece **fora** do form (é um fluxo próprio em `/:id/cbos`), acessada via customAction no dropdown.

### Schema Zod atualizado (`src/lib/schemas/profissionais/formSchema.ts`)

Adicionar todos os novos campos como opcionais (exceto os já obrigatórios: `nome`, `tipoCadastroId`, `cpf`, `dataNascimento`). Exemplo de acréscimos:

```ts
email: z.string().email().optional().or(z.literal("")),
celular: z.string().optional().or(z.literal("")),
telefone: z.string().optional().or(z.literal("")),
cep: z.string().optional().or(z.literal("")),
endereco: z.string().optional().or(z.literal("")),
// ... (numero, complemento, cidade, estado)
estadoCivilId: z.string().optional(),
religiao: z.string().optional(),
etniaId: z.string().optional(),
escolaridadeId: z.string().optional(),
regiaoHomeCare: z.string().optional(),
sigla: z.string().optional(),
crm: z.string().optional(),
statusConselhoId: z.string().optional(),
rqe: z.string().optional(),
// ... (nomeLaudo, conselhoLaudo, cns, pis, cbo, cnes, tipoPessoa)
banco: z.string().optional(),
agencia: z.string().optional(),
conta: z.string().optional(),
// ... (configApuracao, contabilidade, fornecedor, planosConta, tabelaRepasse)
atendePsiquiatricos: z.boolean().default(false),
cadastrarAgenda: z.boolean().default(false),
unidadeId: z.string().optional(),
solicitanteSusId: z.string().optional(),
vinculoSus: z.string().optional(),
```

Selects com FK seguem a convenção do projeto: `{ id, value }` (id enviado, value exibido) — populados com listas mock enquanto não há backend.

### Prop `readOnly` no ProfissionalForm

Adicionar `readOnly?: boolean`. Quando true:
- Todos `Input`/`InputMasked`/`Select`/`Switch` recebem `disabled`.
- Footer mostra apenas "Fechar".

## Arquivos afetados (resumo técnico)

- **Editados**:
  - `src/pages/Profissionais/index.tsx` — listagem abre modal (novo/ver/editar).
  - `src/pages/Pacientes/index.tsx` — idem.
  - `src/pages/ProfissionaisCbos/index.tsx`, `src/pages/ProfissionaisEspecialidades/index.tsx` — já usam dialog, apenas garantir consistência.
  - `src/pages/Profissionais/components/ProfissionalForm.tsx` — reestruturação total em `<Tabs>`, novos campos, `readOnly`, `notifyRequiredErrors`, `mode: "onChange"`.
  - `src/pages/Pacientes/components/PacienteForm.tsx` — adicionar `readOnly` e `notifyRequiredErrors`.
  - `src/lib/schemas/profissionais/formSchema.ts` — ampliar schema.
  - `src/routes.tsx` — remover rotas `/novo`, `/:id`, `/:id/editar` dos módulos Profissionais e Pacientes.
- **Novos**:
  - `src/lib/forms/notifyRequired.ts` — helper de toast.
  - `src/pages/Profissionais/components/EntityModal.tsx` (wrapper de `FormModal` + `ProfissionalForm`) — opcional, pode ficar inline na listagem.
- **Removidos**:
  - `src/pages/Profissionais/{novo,editar,visualizar}.tsx`
  - `src/pages/Pacientes/{novo,editar,visualizar}.tsx`

## Pontos a confirmar

1. **Remover páginas `/novo`, `/:id`, `/:id/editar`** ou manter como atalhos que abrem o modal da listagem? (Minha recomendação: remover — evita duplicação.)
2. Os campos das abas novas (Complementares II, Financeiro etc.) são **todos texto livre ou selects**? Assumi selects com mock para ids conhecidos (estado civil, etnia, escolaridade, status conselho, unidade, solicitante) e texto para o resto. Pode ser ajustado quando vier o SQL das FKs.
3. A aba **SUS** inclui uma "tabela de datas de exportação existente" — no código atual **não existe** essa tabela. Vou incluir placeholder vazio (mock) até você fornecer a estrutura.

Ao aprovar, executo tudo de uma vez: helper, schema, form com abas, refatoração das listagens para modal, remoção das páginas e ajuste das rotas.