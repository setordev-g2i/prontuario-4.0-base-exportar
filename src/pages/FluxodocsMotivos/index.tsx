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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { normalize } from "@/lib/search";
import { buildPaginationItems } from "@/lib/pagination";
import {
  fetchMotivos,
  inactivateMotivo,
} from "@/services/fluxodocsMotivos";
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";
import {
  FluxodocsMotivosModal,
  type FluxodocsMotivosModalMode,
} from "./components/FluxodocsMotivosModal";

const PAGE_SIZE = 20;

const OPTS_TIPO = [{id:"ENVIO",value:"Envio"},{id:"DEVOLUCAO",value:"Devolução"},{id:"CANCELAMENTO",value:"Cancelamento"},{id:"REENVIO",value:"Reenvio"},{id:"JUSTIFICATIVA",value:"Justificativa"}];

export default function FluxodocsMotivosPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FluxodocsMotivo[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [inactivatingId, setInactivatingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FluxodocsMotivosModalMode>("create");
  const [selected, setSelected] = useState<FluxodocsMotivo | null>(null);

  function openModal(mode: FluxodocsMotivosModalMode, r: FluxodocsMotivo | null) {
    setModalMode(mode);
    setSelected(r);
    setModalOpen(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetchMotivos();
      setData(res.filter((r) => r.situacaoId === 1));
    } catch {
      toast.error("Erro ao carregar motivos");
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
      await inactivateMotivo(inactivatingId);
      toast.success("Registro inativado com sucesso");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar registro");
    }
  }

  const visible = useMemo(() => {
    const term = normalize(debounced.trim());
    if (!term) return data;
    return data.filter((r) => normalize(String(r.nome ?? "")).includes(term));
  }, [data, debounced]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [visible, currentPage],
  );
  const startItem = visible.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, visible.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Motivos</h1>
          <p className="text-sm text-muted-foreground">
            Configurações &gt; Fluxo de Documentos &gt; Motivos
          </p>
        </div>
        <Button onClick={() => openModal("create", null)}>
          <Plus className="mr-1 size-4" />
          Novo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de motivos</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar..."
              value={search}
              onChange={(ev) => handleSearchChange(ev.target.value)}
              aria-label="Buscar"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
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
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((r) => (
                    <TableRow key={r.id}>
              <TableCell>{r.nome != null && r.nome !== "" ? String(r.nome) : "—"}</TableCell>
              <TableCell>
                {(OPTS_TIPO.find((o) => String(o.id) === String(r.tipo as unknown))?.value) ?? (r.tipo != null ? String(r.tipo) : "—")}
              </TableCell>
                      <TableCell>
                        <Badge variant={r.situacaoId === 1 ? "default" : "secondary"}>
                          {r.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onView={() => openModal("view", r)}
                          onEdit={() => openModal("edit", r)}
                          onInactivate={() => setInactivatingId(r.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {visible.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Exibindo {startItem}-{endItem} de {visible.length} registro
                {visible.length === 1 ? "" : "s"}
              </div>
              {totalPages > 1 && (
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPage((p) => Math.max(1, p - 1));
                        }}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {buildPaginationItems(currentPage, totalPages).map((it, i) =>
                      it === "ellipsis" ? (
                        <PaginationItem key={`e-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={it}>
                          <PaginationLink
                            href="#"
                            isActive={it === currentPage}
                            onClick={(ev) => {
                              ev.preventDefault();
                              setPage(it);
                            }}
                          >
                            {it}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPage((p) => Math.min(totalPages, p + 1));
                        }}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <FluxodocsMotivosModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        registro={selected}
        onSaved={load}
      />

      <AlertDialog
        open={inactivatingId != null}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              O registro será marcado como <strong>Inativo</strong> (exclusão lógica).
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
