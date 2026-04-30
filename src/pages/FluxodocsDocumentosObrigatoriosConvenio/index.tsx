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
  fetchDocumentosObrigatoriosConvenio,
  inactivateDocumentosObrigatoriosConvenio,
} from "@/services/fluxodocsDocumentosObrigatoriosConvenio";
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";
import {
  FluxodocsDocumentosObrigatoriosConvenioModal,
  type FluxodocsDocumentosObrigatoriosConvenioModalMode,
} from "./components/FluxodocsDocumentosObrigatoriosConvenioModal";

const PAGE_SIZE = 20;

const OPTS_CONVENIOID = [{id:1,value:"Particular"},{id:2,value:"Unimed"},{id:3,value:"Bradesco Saúde"},{id:4,value:"Amil"},{id:5,value:"SUS"}];
const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}];

export default function FluxodocsDocumentosObrigatoriosConvenioPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FluxodocsDocumentoObrigatorioConvenio[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [inactivatingId, setInactivatingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FluxodocsDocumentosObrigatoriosConvenioModalMode>("create");
  const [selected, setSelected] = useState<FluxodocsDocumentoObrigatorioConvenio | null>(null);

  function openModal(mode: FluxodocsDocumentosObrigatoriosConvenioModalMode, r: FluxodocsDocumentoObrigatorioConvenio | null) {
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
      const res = await fetchDocumentosObrigatoriosConvenio();
      setData(res.filter((r) => r.situacaoId === 1));
    } catch {
      toast.error("Erro ao carregar documentos obrigatórios por convênio");
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
      await inactivateDocumentosObrigatoriosConvenio(inactivatingId);
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
    return data.filter((r) => normalize(String(r.descricao ?? "")).includes(term));
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
          <h1 className="text-2xl font-bold">Documentos Obrigatórios por Convênio</h1>
          <p className="text-sm text-muted-foreground">
            Configurações &gt; Fluxo de Documentos &gt; Documentos Obrigatórios por Convênio
          </p>
        </div>
        <Button onClick={() => openModal("create", null)}>
          <Plus className="mr-1 size-4" />
          Novo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de documentos obrigatórios por convênio</CardTitle>
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
              <TableHead>Convênio</TableHead>
              <TableHead>Tipo de Documento</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>Bloqueia envio</TableHead>
                  <TableHead className="w-[120px]">Situação</TableHead>
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
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((r) => (
                    <TableRow key={r.id}>
              <TableCell>
                {(OPTS_CONVENIOID.find((o) => String(o.id) === String(r.convenioId as unknown))?.value) ?? (r.convenioId != null ? String(r.convenioId) : "—")}
              </TableCell>
              <TableCell>
                {(OPTS_TIPODOCUMENTOID.find((o) => String(o.id) === String(r.tipoDocumentoId as unknown))?.value) ?? (r.tipoDocumentoId != null ? String(r.tipoDocumentoId) : "—")}
              </TableCell>
              <TableCell>{r.obrigatorio ? "Sim" : "Não"}</TableCell>
              <TableCell>{r.bloqueiaEnvio ? "Sim" : "Não"}</TableCell>
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

      <FluxodocsDocumentosObrigatoriosConvenioModal
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
