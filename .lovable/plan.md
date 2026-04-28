## Ajustes no módulo Produtividade do Profissional

Alterações em 3 arquivos existentes — sem mudanças em banco, services ou tipos.

### 1. `ProdutividadeFormModal.tsx` — permitir edição por Grupo + reorganizar tabs

**Edição por Grupo (item 1):**
- Remover a restrição que mostra o seletor "Cadastrar por: Procedimento | Grupo" apenas em modo create. Passar a exibi-lo também em modo `edit`.
- No modo `edit`, ao salvar com `alvo = "grupo"`:
  - Buscar todos os procedimentos ativos do grupo selecionado.
  - Para cada procedimento do grupo, verificar se já existe uma produtividade ativa daquele profissional + convênio + procedimento:
    - Se existir → chamar `updateProdutividade(existente.id, payload)` com os novos valores (produtividade, configurações, vigência, situação).
    - Se não existir → chamar `createProdutividade(...)` para gerar a nova entrada.
  - Mostrar toast: `X atualizada(s) • Y criada(s)`.
- No modo `edit` com `alvo = "procedimento"`, manter o comportamento atual (update do registro original).
- Para suportar isso, no `useEffect` de abertura em modo edit, pré-carregar a lista existente do profissional (via `fetchProdutividades`) e armazenar em estado para uso na hora de fazer o "update em lote".

**Mover Produtividade para bloco abaixo de Dados Principais (item 4):**
- Remover a `TabsTrigger value="produtividade"` e o respectivo `TabsContent`.
- Mover todos os campos da aba Produtividade (% Recebimento, % Caixa, % Imposto, Vl. Fixo, % Imposto Caixa, % Clínica, Vl. Fixo Clínica, Vl. Fixo Laudo, Terceiro Profissional, % Terceiro, Vigência Inicial, Vigência Final) para dentro do `TabsContent value="principal"`, logo abaixo do grid Convênio/Procedimento(Grupo)/Situação, dentro de um bloco visualmente separado:
  ```tsx
  <div className="rounded border p-4 space-y-3">
    <h3 className="text-sm font-semibold">Produtividade</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> ... campos ... </div>
  </div>
  ```
- Ajustar a validação de vigência: se inválida, manter na aba `principal` (não mais `produtividade`).

**Aba Configurações (item 3):**
- Remover os 3 campos read-only: "Usuário de Cadastro", "Criado em", "Alterado em".
- Manter apenas os 4 SwitchRow + o select "Operação" (Crédito/Débito).
- Pode-se também remover do `FormState` e do `fromEntity` os campos `created` e `modified` (limpeza opcional, sem impacto funcional).

**Tabs finais:** apenas `Dados Principais` e `Configurações`.

### 2. `ProdutividadeModal.tsx` — filtros na listagem (item 2)

Adicionar uma barra de filtros acima da tabela com 3 selects:

- **Convênio** — usar `CONVENIO_OPTIONS` de `services/profissionaisProdutividade`.
- **Procedimento** — usar lista já carregada em `procedimentos` (filtrar ativos).
- **Grupo de Procedimentos** — carregar via `fetchGruposProcedimentos()` (já usado no FormModal). Filtrar produtividades cujo `procedimentoId` pertença a um procedimento daquele grupo (lookup via `procedimentos[i].grupoId`).

Comportamento:
- Cada select com opção "Todos" (value vazio).
- Layout: grid de 3 colunas em `md:`, com botão "Limpar filtros" ao lado.
- Aplicar os filtros via `useMemo` sobre `list`, gerando `visibleList`. A combinação dos 3 filtros é AND.
- Substituir `list.map` na renderização da tabela por `visibleList.map` e atualizar a checagem de "lista vazia" e os colSpans.

### 3. Estado/efeitos auxiliares

- Em `ProdutividadeModal`, adicionar `useState` para `grupos`, `convenioFilter`, `procedimentoFilter`, `grupoFilter`. Carregar `grupos` no `load()` em paralelo com procedimentos e produtividades.
- Em `ProdutividadeFormModal`, adicionar `useState<ProfissionalProdutividade[]>` para "produtividades existentes do profissional", populada no useEffect de abertura quando `mode === "edit"`, usada para decidir update vs create no fluxo de grupo.

### Resumo de arquivos

- `src/pages/Profissionais/components/ProdutividadeFormModal.tsx` (refatoração das tabs + edição por grupo + remoção dos campos de auditoria)
- `src/pages/Profissionais/components/ProdutividadeModal.tsx` (3 filtros na listagem)

Sem alterações em services, types, schemas ou rotas.