import { createFileRoute } from "@tanstack/react-router";
import { Activity, Users, Calendar, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bem-vindo ao sistema Zurich</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pacientes Hoje", value: "24", icon: Users, color: "text-blue-500" },
          { label: "Agendamentos", value: "18", icon: Calendar, color: "text-green-500" },
          { label: "Atendimentos", value: "12", icon: ClipboardList, color: "text-orange-500" },
          { label: "Em Espera", value: "6", icon: Activity, color: "text-red-500" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
