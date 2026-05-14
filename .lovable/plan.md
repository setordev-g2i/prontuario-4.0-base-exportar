
# Etapa 2 — Fluxo de Documentos Operacional

## Escopo
Implementar a tela operacional única em `/gerenciamento/fluxo-documentos` com 8 abas (Dashboard, Novo Fluxo, Recebimento, Fila Inteligente, Aprovações, Rastreabilidade, Fluxos, Relatórios), wizard de novo fluxo (4 etapas), motor de IA/SLA/Fila, validações de workflow e checklist, integração com as 19 pages CRUD da Etapa 1 e geração de logs.

## Estrutura de pastas (adaptada ao padrão do projeto)
A sugestão do prompt era `src/modules/fluxodocs/operacional/`, mas o projeto usa **Vite + React Router DOM com `src/pages/<Modulo>/`** (memória do projeto). Vou seguir o padrão existente:

```text
src/pages/FluxoDocumentosOperacional/
├── index.tsx                         # FluxodocsOperacionalPage com Tabs
├── components/
│   ├── FluxodocsDashboard.tsx
│   ├── FluxodocsNovoFluxoWizard.tsx
│   ├── wizard/
│   │   ├── EtapaCabecalho.tsx
│   │   ├── EtapaSelecaoItens.tsx
│   │   ├── EtapaChecklist.tsx
│   │   └── EtapaRevisao.tsx
│   ├── FluxodocsRecebimento.tsx
│   ├── FluxodocsFilaInteligente.tsx
│   ├── FluxodocsAprovacoesOperacionais.tsx
│   ├── FluxodocsRastreabilidade.tsx
│   ├── FluxodocsFluxosOperacionais.tsx
│   └── FluxodocsRelatorios.tsx
└── hooks/
    ├── useFluxoWizard.ts
    └── useFilaInteligente.ts

src/services/
├── fluxodocsOperacional.ts           # CRUD de fluxos (cabeçalho + itens)
├── fluxodocsIa.ts                    # cálculo de risco + recomendação + reorden. fila
└── fluxodocsSla.ts                   # cálculo de SLA (cascata 4 níveis)

src/lib/
└── fluxodocsOperacionalMocks.ts      # fluxos, contas, atendimentos, clientes, convênios mock

src/types/entities/
└── FluxodocsOperacional.ts           # FluxoCabecalho, FluxoItem, ItemTipo, ChecklistStatus, etc.
```

Mantém a regra "uma pasta por módulo + components/services próprios" — sem engine genérico.

## Roteamento e menu
- Nova rota: `/gerenciamento/fluxo-documentos` em `src/routes.tsx`
- Novo grupo no `AppSidebar`: **Gerenciamento → Fluxo de Documentos** (separado do item Configurações que já aponta para o hub CRUD)
- O hub `src/pages/FluxoDocumentos/` (cards das 19 entidades) continua intacto em Configurações

## Dados (mocks + tryApi)
- Reaproveitar mocks existentes onde houver (clientes/atendimentos/contas/convênios/users) — onde não houver, criar mocks ricos (≥20 itens) em `fluxodocsOperacionalMocks.ts`
- Termo "Paciente" na UI; campo `clienteId` no payload
- Convênio herdado da conta (read-only quando origem = Conta)

## Detalhes técnicos por aba

**Dashboard**: 8 KPIs em cards + 5 gráficos (recharts já no projeto) + lista "últimos fluxos" + "top críticos IA".

**Novo Fluxo (wizard em FormModal)**:
1. Cabeçalho — valida `fluxodocs_regra_fluxo` (origem+destino+tipoMov ativo) antes de avançar
2. Itens — array dinâmico, regras por tipo (Conta/Atendimento/Paciente/Doc/Ofício/Manual), autocarregamento ao escolher conta
3. Checklist — gerado automaticamente quando há `convenioId`, baseado em `fluxodocs_documento_obrigatorio_convenio`; cada item: PENDENTE | ANEXADO | CONFIRMADO | JUSTIFICADO | BLOQUEANTE
4. Revisão — exibe SLA previsto, score IA, risco, recomendação, pendências; botões Voltar / Salvar rascunho / Enviar
- Número gerado: `FLUXO-AAAA-NNNN`
- Bloqueios de envio conforme spec (mensagens inteligentes via sonner)

**Fila Inteligente**: cards/linhas com score = prioridade + SLA + risco_atraso + risco_glosa + complexidade + convênio. Ordenação multi-critério. Ações: Visualizar, Receber, Receber parcialmente, Devolver, Repriorizar, Enviar alerta. Animação ao reordenar.

**Recebimento**: filtros + ações em massa (Aceitar tudo / Devolver) + recebimento parcial item-a-item com sugestão de motivo pela IA.

**Aprovações**: lista de `fluxodocs_aprovacao_justificativa` pendentes, ações Aprovar/Reprovar/Solicitar correção, com efeitos colaterais no checklist do fluxo + log.

**Rastreabilidade**: busca global + timeline a partir de `fluxodocs_log`.

**Fluxos**: listagem geral com filtros, ações Visualizar/Editar rascunho/Reenviar/Duplicar/Cancelar/Imprimir/Exportar Excel.

**Relatórios**: 10 relatórios listados, cada um com botão "Exportar Excel" (usar `xlsx` ou geração simples CSV/XLSX).

## Motor IA + SLA + Fila (puro client-side, mock)
- `fluxodocsSla.ts`: cascata 4 níveis (convênio+tipoDoc+setor+prioridade → ... → prioridade), retorna `{ slaPrevistoEm, slaStatus, iaRiscoAtraso }`
- `fluxodocsIa.ts`: `calcularRisco(checklist, convenio, historico)`, `recomendar(...)`, `sugerirMotivoDevolucao(item)`, `calcularScoreFila(fluxo)`
- Integração futura com Lovable AI Gateway é opcional; nesta etapa heurísticas determinísticas (com seed) são suficientes para o mock

## Workflow / Logs
- Helper `validarAcaoWorkflow(statusAtual, acao, tipoDocId, perfilUserId)` consulta mocks de `fluxodocs_workflow_etapa`
- Helper `gravarLog(fluxoId, tipoEvento, payload)` adiciona em `fluxodocs_log` (mock store) em toda ação crítica (lista de 17 eventos do prompt)

## Integrações com pages da Etapa 1
- Banner "Ir para Regras de Fluxo" → `/configuracoes/fluxo-documentos/regras-fluxo`
- "Ir para Parâmetros de SLA" → idem para SLA
- "Ir para Documentação por Convênio" → idem
- Botão "Aprovações" → aba Aprovações ou page CRUD

## Fora do escopo desta etapa
- Anexo real de arquivos (apenas registrar metadado mock — sem upload para storage)
- Geração de PDF "espelho do fluxo" (deixar botão desabilitado com tooltip "Disponível na próxima etapa")
- Integração real com IA gateway (heurísticas determinísticas no mock)
- Persistência em Supabase (continua tudo via tryApi → mock)
- Permissões/roles efetivas (estrutura preparada, sem enforcement)

## Entrega esperada
≈ 25 arquivos novos. TypeScript estrito, zero erros de build. Todas as 8 abas navegáveis com dados mock realistas, wizard funcional ponta-a-ponta gerando fluxo no mock store, fila reordenando ao vivo, aprovações afetando checklist, logs sendo gravados.

## Confirmações antes de começar
1. **Estrutura de pastas**: OK usar `src/pages/FluxoDocumentosOperacional/` (padrão do projeto) em vez de `src/modules/fluxodocs/operacional/`?
2. **Escopo**: entregar as 8 abas de uma vez, ou priorizar (ex: Dashboard + Novo Fluxo + Fila + Recebimento primeiro, deixar Aprovações/Rastreabilidade/Fluxos/Relatórios para uma próxima rodada)?
3. **IA**: heurísticas determinísticas client-side está OK, ou já integrar Lovable AI Gateway (gemini-flash) para gerar recomendação textual e sugestão de motivo de devolução?
