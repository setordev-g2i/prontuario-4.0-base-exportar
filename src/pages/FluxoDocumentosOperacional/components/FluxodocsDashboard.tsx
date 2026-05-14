/**
 * Dashboard do Fluxo de Documentos: 8 KPIs + 4 gráficos + listas.
 */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  listarFluxosCompletos, listarAprovacoes, setores,
} from "@/services/fluxodocsOperacional";

export function FluxodocsDashboard() {
  const fluxos = useMemo(() => listarFluxosCompletos({ incluirFinalizadores: true }), []);
  const aprovPend = useMemo(() => listarAprovacoes("PENDENTE"), []);

  const hojeISO = new Date().toISOString().slice(0, 10);
  const kpis = {
    total: fluxos.length,
    hoje: fluxos.filter(f => f.protocolo.created.slice(0, 10) === hojeISO).length,
    pendentes: fluxos.filter(f => f.statusNome === "Aberto" || f.statusNome === "Enviado").length,
    recebidos: fluxos.filter(f => f.statusNome === "Recebido").length,
    devolvidos: fluxos.filter(f => f.statusNome === "Devolvido").length,
    foraSla: fluxos.filter(f => f.protocolo.slaStatus === "ATRASADO").length,
    altoRisco: fluxos.filter(f => f.riscoNivel === "ALTO" || f.riscoNivel === "BLOQUEIO").length,
    aprovPend: aprovPend.length,
  };

  const porStatus = Object.entries(
    fluxos.reduce<Record<string, number>>((acc, f) => {
      acc[f.statusNome] = (acc[f.statusNome] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const porSetorDestino = setores.slice(0, 8).map(s => ({
    name: s.sigla,
    fluxos: fluxos.filter(f => f.protocolo.setorDestinoId === s.id).length,
  }));

  const slaPorConvenio = Array.from(
    fluxos.reduce<Map<string, { name: string; risco: number; n: number }>>((acc, f) => {
      const key = f.convenioNome ?? "Sem convênio";
      const cur = acc.get(key) ?? { name: key, risco: 0, n: 0 };
      cur.risco += f.protocolo.iaRiscoAtraso ?? 0;
      cur.n += 1;
      acc.set(key, cur);
      return acc;
    }, new Map()).values(),
  ).map(x => ({ name: x.name, risco: Math.round((x.risco / x.n) * 100) }));

  const ultimos = [...fluxos]
    .sort((a, b) => new Date(b.protocolo.created).getTime() - new Date(a.protocolo.created).getTime())
    .slice(0, 5);
  const topCriticos = [...fluxos]
    .sort((a, b) => b.scoreFila - a.scoreFila)
    .slice(0, 5);

  const cores = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#22c55e", "#a78bfa"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Total de fluxos" value={kpis.total} />
        <Kpi label="Criados hoje" value={kpis.hoje} />
        <Kpi label="Pendentes" value={kpis.pendentes} />
        <Kpi label="Recebidos" value={kpis.recebidos} />
        <Kpi label="Devolvidos" value={kpis.devolvidos} tone="warning" />
        <Kpi label="Fora SLA" value={kpis.foraSla} tone="destructive" />
        <Kpi label="Alto risco IA" value={kpis.altoRisco} tone="destructive" />
        <Kpi label="Aprovações pendentes" value={kpis.aprovPend} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Status dos fluxos</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porStatus} dataKey="value" nameKey="name" outerRadius={80}>
                  {porStatus.map((_, i) => <Cell key={i} fill={cores[i % cores.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Volume por setor destino</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porSetorDestino}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fluxos" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Risco médio de atraso por convênio (%)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaPorConvenio}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="risco" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Últimos fluxos</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {ultimos.map(f => (
              <div key={f.protocolo.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div>
                  <div className="font-medium">{f.protocolo.numero}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.setorOrigemNome} → {f.setorDestinoNome}
                  </div>
                </div>
                <Badge variant="outline" style={{ color: f.statusCor, borderColor: f.statusCor }}>
                  {f.statusNome}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Top fluxos críticos (IA)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topCriticos.map(f => (
              <div key={f.protocolo.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div>
                  <div className="font-medium">{f.protocolo.numero}</div>
                  <div className="text-xs text-muted-foreground">{f.recomendacaoIa}</div>
                </div>
                <Badge variant={f.riscoNivel === "ALTO" || f.riscoNivel === "BLOQUEIO" ? "destructive" : "secondary"}>
                  {f.riscoNivel} · {(f.scoreFila * 100).toFixed(0)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone?: "warning" | "destructive" }) {
  const color = tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-amber-600" : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`mt-1 text-2xl font-semibold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
