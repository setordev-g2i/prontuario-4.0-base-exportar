/**
 * Página operacional do Fluxo de Documentos.
 * Rota: /gerenciamento/fluxo-documentos
 * 8 abas: Dashboard, Novo Fluxo, Recebimento, Fila Inteligente,
 * Aprovações, Rastreabilidade, Fluxos, Relatórios.
 */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FluxodocsDashboard } from "./components/FluxodocsDashboard";
import { FluxodocsNovoFluxoWizard } from "./components/FluxodocsNovoFluxoWizard";
import { FluxodocsRecebimento } from "./components/FluxodocsRecebimento";
import { FluxodocsFilaInteligente } from "./components/FluxodocsFilaInteligente";
import { FluxodocsAprovacoesOperacionais } from "./components/FluxodocsAprovacoesOperacionais";
import { FluxodocsRastreabilidade } from "./components/FluxodocsRastreabilidade";
import { FluxodocsFluxosOperacionais } from "./components/FluxodocsFluxosOperacionais";
import { FluxodocsRelatorios } from "./components/FluxodocsRelatorios";

export default function FluxodocsOperacionalPage() {
  const [tab, setTab] = useState("dashboard");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onCreated = () => setRefreshKey(k => k + 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Fluxo de Documentos</h1>
          <p className="text-sm text-muted-foreground">
            Crie, acompanhe e priorize os fluxos documentais com apoio da IA.
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Fluxo
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="novo">Novo Fluxo</TabsTrigger>
          <TabsTrigger value="recebimento">Recebimento</TabsTrigger>
          <TabsTrigger value="fila">Fila Inteligente</TabsTrigger>
          <TabsTrigger value="aprovacoes">Aprovações</TabsTrigger>
          <TabsTrigger value="rastreabilidade">Rastreabilidade</TabsTrigger>
          <TabsTrigger value="fluxos">Fluxos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard"><FluxodocsDashboard key={`dash-${refreshKey}`} /></TabsContent>
        <TabsContent value="novo">
          <div className="rounded-md border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Use o botão <strong>Novo Fluxo</strong> no topo para abrir o wizard.
            </p>
            <Button className="mt-3" onClick={() => setWizardOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Abrir Wizard
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="recebimento"><FluxodocsRecebimento key={`rec-${refreshKey}`} onChanged={onCreated} /></TabsContent>
        <TabsContent value="fila"><FluxodocsFilaInteligente key={`fila-${refreshKey}`} onChanged={onCreated} /></TabsContent>
        <TabsContent value="aprovacoes"><FluxodocsAprovacoesOperacionais key={`apr-${refreshKey}`} onChanged={onCreated} /></TabsContent>
        <TabsContent value="rastreabilidade"><FluxodocsRastreabilidade key={`rast-${refreshKey}`} /></TabsContent>
        <TabsContent value="fluxos"><FluxodocsFluxosOperacionais key={`flx-${refreshKey}`} onChanged={onCreated} /></TabsContent>
        <TabsContent value="relatorios"><FluxodocsRelatorios key={`rel-${refreshKey}`} /></TabsContent>
      </Tabs>

      <FluxodocsNovoFluxoWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCreated={() => { onCreated(); setTab("fluxos"); }}
      />
    </div>
  );
}
