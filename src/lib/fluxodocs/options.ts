/**
 * Helpers para gerar SelectOptions a partir do mock store das FKs.
 * Usados por todas as configs de entidade fluxodocs_*.
 */
import { useEffect, useState } from "react";
import {
  setoresService, tiposDocumentoService, tiposMovimentacaoService,
  prioridadesService, motivosService, statusService,
  tiposItemService, statusItemService, workflowsService,
} from "@/services/fluxodocs";

export interface SelectOpt { id: number | string; value: string }

export function useFluxodocsOptions() {
  const [setores, setSetores] = useState<SelectOpt[]>([]);
  const [tiposDoc, setTiposDoc] = useState<SelectOpt[]>([]);
  const [tiposMov, setTiposMov] = useState<SelectOpt[]>([]);
  const [prioridades, setPrioridades] = useState<SelectOpt[]>([]);
  const [motivos, setMotivos] = useState<SelectOpt[]>([]);
  const [status, setStatus] = useState<SelectOpt[]>([]);
  const [tiposItem, setTiposItem] = useState<SelectOpt[]>([]);
  const [statusItem, setStatusItem] = useState<SelectOpt[]>([]);
  const [workflows, setWorkflows] = useState<SelectOpt[]>([]);

  useEffect(() => {
    Promise.all([
      setoresService.fetchAll(),
      tiposDocumentoService.fetchAll(),
      tiposMovimentacaoService.fetchAll(),
      prioridadesService.fetchAll(),
      motivosService.fetchAll(),
      statusService.fetchAll(),
      tiposItemService.fetchAll(),
      statusItemService.fetchAll(),
      workflowsService.fetchAll(),
    ]).then(([s, td, tm, p, m, st, ti, si, w]) => {
      setSetores(s.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setTiposDoc(td.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setTiposMov(tm.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setPrioridades(p.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setMotivos(m.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setStatus(st.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setTiposItem(ti.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setStatusItem(si.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
      setWorkflows(w.filter((x) => x.situacaoId === 1).map((x) => ({ id: x.id, value: x.nome })));
    });
  }, []);

  return { setores, tiposDoc, tiposMov, prioridades, motivos, status, tiposItem, statusItem, workflows };
}

/** Opções estáticas para entidades já existentes no sistema (mock). */
export const CONVENIO_OPTIONS: SelectOpt[] = [
  { id: 1, value: "Particular" },
  { id: 2, value: "Unimed" },
  { id: 3, value: "Bradesco Saúde" },
  { id: 4, value: "Amil" },
  { id: 5, value: "SUS" },
];

export const USUARIO_OPTIONS: SelectOpt[] = [
  { id: 1, value: "Dr. João Silva" },
  { id: 2, value: "Maria Souza" },
  { id: 3, value: "Carlos Lima" },
  { id: 4, value: "Ana Beatriz" },
];

export const PACIENTE_OPTIONS: SelectOpt[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1, value: `Paciente ${String(i + 1).padStart(3, "0")}`,
}));

export const CONTA_OPTIONS: SelectOpt[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, value: `Conta ${20260000 + i}`,
}));

export const ATENDIMENTO_OPTIONS: SelectOpt[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, value: `Atendimento ${10000 + i}`,
}));
