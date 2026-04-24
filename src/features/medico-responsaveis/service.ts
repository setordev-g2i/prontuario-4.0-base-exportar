import {
  createQuickLookupValue,
  deactivateMedicoResponsavel,
  getMedicoResponsavelById,
  listLookupCollections,
  listMedicoResponsaveis,
  saveMedicoResponsavel,
} from "@/features/medico-responsaveis/server";
import type {
  LookupCollections,
  LookupOption,
  MedicoResponsavelListItem,
  MedicoResponsavelRecord,
  QuickCreateLookupTable,
} from "@/features/medico-responsaveis/types";

export async function fetchLookupCollections(): Promise<LookupCollections> {
  return listLookupCollections();
}

export async function fetchMedicoResponsaveis(search?: string): Promise<MedicoResponsavelListItem[]> {
  return listMedicoResponsaveis({ data: { search } });
}

export async function fetchMedicoResponsavelById(id: number): Promise<MedicoResponsavelRecord> {
  return getMedicoResponsavelById({ data: { id } });
}

export async function persistMedicoResponsavel(
  payload: MedicoResponsavelRecord,
): Promise<{ id: number | undefined }> {
  return saveMedicoResponsavel({ data: payload });
}

export async function deactivateMedicoResponsavelById(id: number): Promise<{ success: boolean }> {
  return deactivateMedicoResponsavel({ data: { id } });
}

export async function quickCreateLookupOption(
  table: QuickCreateLookupTable,
  value: string,
): Promise<LookupOption> {
  return createQuickLookupValue({ data: { table, value } });
}
