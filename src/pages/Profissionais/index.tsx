import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Search, Loader2, Briefcase, Stethoscope } from "lucide-react";
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
import {
  fetchProfissionais,
  inactivateProfissional,
} from "@/services/profissionais";
import type { Profissional } from "@/types/entities/Profissional";
import {
  ProfissionalModal,
  type ProfissionalModalMode,
} from "./components/ProfissionalModal";

export default function ProfissionaisListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Profissional[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [inactivatingId, setInactivatingId] = useState<
    Profissional["id"] | null
  >(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProfissionalModalMode>("create");
  const [selected, setSelected] = useState<Profissional | null>(null);

  function openModal(mode: ProfissionalModalMode, p: Profissional | null) {
    setModalMode(mode);
    setSelected(p);
    setModalOpen(true);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetchProfissionais({ search: debounced, limit: 50 });
      setData(res.data);
    } catch {
      toast.error("Erro ao carregar profissionais");
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
      await inactivateProfissional(inactivatingId);
      toast.success("Profissional inativado");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar profissional");
    }
  }

  const visible = useMemo(() => data, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profissionais</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro e gestão de profissionais de saúde
          </p>
        </div>
        <Button onClick={() => openModal("create", null)}>
          <Plus className="mr-1 size-4" />
          Novo profissional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de profissionais</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar profissionais"
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Conselho</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
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
                      Nenhum profissional encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell>{p.cpf}</TableCell>
                      <TableCell className="capitalize">
                        {p.tipoCadastroId}
                      </TableCell>
                      <TableCell>{p.conselho ?? "—"}</TableCell>
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
                          customActions={[
                            {
                              icon: <Briefcase className="mr-2 h-4 w-4" />,
                              label: "CBOs",
                              onClick: () =>
                                navigate(
                                  `/configuracoes/profissionais/${p.id}/cbos`,
                                ),
                            },
                            {
                              icon: <Stethoscope className="mr-2 h-4 w-4" />,
                              label: "Especialidades",
                              onClick: () =>
                                navigate(
                                  `/configuracoes/profissionais/${p.id}/especialidades`,
                                ),
                            },
                          ]}
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

      <ProfissionalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        profissional={selected}
        onSaved={load}
      />

      <AlertDialog
        open={!!inactivatingId}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              O profissional será marcado como <strong>Inativo</strong>{" "}
              (exclusão lógica). Você poderá reativá-lo depois na edição.
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
