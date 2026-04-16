

# Plano: Menu Lateral Expansivel baseado no Zurich 2.0

## Objetivo
Substituir o menu superior (TopNav) do Zurich 2.0 por um menu lateral (sidebar) expansivel usando o componente shadcn Sidebar ja presente no projeto. Apenas o menu sera criado — sem paginas ou rotas adicionais.

## O que sera feito

### 1. Criar `src/components/AppSidebar.tsx`
- Sidebar lateral com `collapsible="icon"` (colapsa para icones, nunca desaparece)
- Toda a estrutura de menu do TopNav do Zurich 2.0 (menuConfig com 9 categorias: Salas, Agenda, Pacientes, Atendimentos, Diagnostico, Gerenciamento, Assistencial, Cadastros, CRM)
- Cada categoria sera um `SidebarGroup` com `Collapsible` para expandir/recolher os subitens
- Subgrupos com headings preservados
- Header com logo "Zurich" e icone Heart
- Footer com area do usuario (nome, role, botao sair)
- Botoes de busca, notificacoes e configuracoes no footer ou header

### 2. Atualizar `src/routes/__root.tsx`
- Envolver o `Outlet` com `SidebarProvider` + layout com `AppSidebar` + `SidebarInset`
- Adicionar `SidebarTrigger` no header do conteudo principal (sempre visivel)

### 3. Atualizar `src/routes/index.tsx`
- Remover placeholder e colocar conteudo simples (ex: "Dashboard" com texto de boas-vindas) para visualizar o layout com a sidebar

### Detalhes tecnicos
- Usa componentes existentes: `Sidebar`, `SidebarProvider`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, `SidebarMenuButton`, `SidebarTrigger`, `SidebarInset`, etc.
- Usa `Collapsible` do radix para grupos expansiveis (precisa adicionar dependencia `@radix-ui/react-collapsible` se nao existir)
- Navegacao com `Link` do `@tanstack/react-router` e `useLocation` para highlight ativo
- Aplica fix do Tailwind 4 para `w-[var(--sidebar-width)]`

