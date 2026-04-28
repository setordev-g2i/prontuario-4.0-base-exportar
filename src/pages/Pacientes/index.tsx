import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { parseSearchTerm, normalize, onlyDigits } from "@/lib/search";
import { fetchPacientes, inactivatePaciente } from "@/services/pacientes";
import type { Paciente } from "@/types/entities/Paciente";
import {
  PacienteModal,
  type PacienteModalMode,
} from "./components/PacienteModal";

export default function PacientesListPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Paciente[]>([]);
  const [search, setSearch] = useState("");
  const [, setPage] = useState(1);
  const debounced = useDebounce(search, 300);
  const [inactivatingId, setInactivatingId] = useState<Paciente["id"] | null>(
    null,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PacienteModalMode>("create");
  const [selected, setSelected] = useState<Paciente | null>(null);

  function openModal(mode: PacienteModalMode, p: Paciente | null) {
    setModalMode(mode);
    setSelected(p);
    setModalOpen(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetchPacientes({ search: debounced, limit: 50 });
      setData(res.data);
    } catch {
      toast.error("Erro ao carregar pacientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  async function confirmInactivate() {
    if (!inactivatingId) return;
    try {
      await inactivatePaciente(inactivatingId);
      toast.success("Paciente inativado");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar paciente");
    }
  }

  // Filtro frontend complementar (normalize nome + dígitos CPF)
  const visible = useMemo(() => {
    if (!debounced.trim()) return data;
    const { term, digits } = parseSearchTerm(debounced);
    return data.filter((p) => {
      const matchNome = term ? normalize(p.nome).includes(term) : false;
      const matchCpf = digits ? onlyDigits(p.cpf).includes(digits) : false;
      return matchNome || matchCpf;
    });
  }, [data, debounced]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro e gestão de pacientes
          </p>
        </div>
        <Button onClick={() => openModal("create", null)}>
          <Plus className="mr-1 size-4" />
          Novo paciente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de pacientes</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Buscar pacientes"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Nascimento</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum paciente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell>{p.cpf}</TableCell>
                      <TableCell>
                        {p.dataNascimento
                          ? new Date(p.dataNascimento).toLocaleDateString(
                              "pt-BR",
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>{p.celular ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={p.situacaoId === 1 ? "default" : "secondary"}
                        >
                          {p.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onView={() => openModal("view", p)}
                          onEdit={() => openModal("edit", p)}
                          onInactivate={() => setInactivatingId(p.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PacienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        paciente={selected}
        onSaved={load}
      />

      <AlertDialog
        open={!!inactivatingId}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar paciente?</AlertDialogTitle>
            <AlertDialogDescription>
              O paciente será marcado como <strong>Inativo</strong> (exclusão
              lógica). Você poderá reativá-lo depois na edição.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmInactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Inativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
