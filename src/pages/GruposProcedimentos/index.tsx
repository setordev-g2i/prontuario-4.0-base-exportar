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
import { normalize } from "@/lib/search";
import {
  fetchGruposProcedimentos,
  inactivateGrupoProcedimento,
} from "@/services/gruposProcedimentos";
import type { GrupoProcedimento } from "@/types/entities/GrupoProcedimento";
import {
  GrupoProcedimentoModal,
  type GrupoProcedimentoModalMode,
} from "./components/GrupoProcedimentoModal";

export default function GruposProcedimentosPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GrupoProcedimento[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [, setPage] = useState(1);
  const [inactivatingId, setInactivatingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<GrupoProcedimentoModalMode>("create");
  const [selected, setSelected] = useState<GrupoProcedimento | null>(null);

  function openModal(mode: GrupoProcedimentoModalMode, g: GrupoProcedimento | null) {
    setModalMode(mode);
    setSelected(g);
    setModalOpen(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetchGruposProcedimentos();
      setData(res);
    } catch {
      toast.error("Erro ao carregar grupos de procedimentos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmInactivate() {
    if (inactivatingId == null) return;
    try {
      await inactivateGrupoProcedimento(inactivatingId);
      toast.success("Registro inativado com sucesso");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar grupo de procedimentos");
    }
  }

  const visible = useMemo(() => {
    const term = normalize(debounced.trim());
    if (!term) return data;
    return data.filter(
      (g) =>
        normalize(g.nome).includes(term) ||
        normalize(g.codigoGrupo).includes(term),
    );
  }, [data, debounced]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grupo de Procedimentos</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de grupos de procedimentos
          </p>
        </div>
        <Button onClick={() => openModal("create", null)}>
          <Plus className="mr-1 size-4" />
          Novo grupo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de grupos</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar por código ou nome..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Buscar grupos de procedimentos"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[120px]">Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum grupo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block size-3 rounded-full border"
                            style={{ backgroundColor: g.color }}
                            aria-hidden
                          />
                          {g.codigoGrupo}
                        </div>
                      </TableCell>
                      <TableCell>{g.nome}</TableCell>
                      <TableCell>
                        <Badge
                          variant={g.situacaoId === 1 ? "default" : "secondary"}
                        >
                          {g.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onView={() => openModal("view", g)}
                          onEdit={() => openModal("edit", g)}
                          onInactivate={() => setInactivatingId(g.id)}
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

      <GrupoProcedimentoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        grupo={selected}
        onSaved={load}
      />

      <AlertDialog
        open={inactivatingId != null}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar grupo de procedimentos?</AlertDialogTitle>
            <AlertDialogDescription>
              O registro será marcado como <strong>Inativo</strong> (exclusão
              lógica). Você poderá reativá-lo depois pela edição.
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
