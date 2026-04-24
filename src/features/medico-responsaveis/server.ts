import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  LookupCollections,
  LookupOption,
  MedicoResponsavelListItem,
  MedicoResponsavelRecord,
  QuickCreateLookupTable,
} from "@/features/medico-responsaveis/types";

const db = supabaseAdmin as any;

const lookupDefinitions = {
  situacao_cadastros: { column: "descricao", orderBy: "descricao" },
  users: { column: "nome", orderBy: "nome" },
  fin_contabilidades: { column: "descricao", orderBy: "descricao" },
  tipo_conselho_profissional: { column: "descricao", orderBy: "descricao" },
  solicitantes: { column: "nome", orderBy: "nome" },
  solicitante_cbo: { column: "descricao", orderBy: "descricao" },
  configuracao_solicitantes_estados: { column: "descricao", orderBy: "descricao" },
  medico_responsaveis_tipo_cadastro: { column: "descricao", orderBy: "descricao" },
  homecare_escala_repasse_tabela_padrao: { column: "descricao", orderBy: "descricao" },
  estado_civis: { column: "descricao", orderBy: "descricao" },
  religiao: { column: "descricao", orderBy: "descricao" },
  etnia: { column: "descricao", orderBy: "descricao" },
  escolaridade: { column: "descricao", orderBy: "descricao" },
  home_care_regiao_responsavel: { column: "descricao", orderBy: "descricao" },
  configuracao_apuracao: { column: "descricao", orderBy: "descricao" },
  fin_fornecedores: { column: "nome", orderBy: "nome" },
  fin_plano_contas: { column: "descricao", orderBy: "descricao" },
  unidades: { column: "nome", orderBy: "nome" },
} satisfies Record<QuickCreateLookupTable, { column: string; orderBy: string }>;

const lookupTableSchema = z.enum([
  "situacao_cadastros",
  "users",
  "fin_contabilidades",
  "tipo_conselho_profissional",
  "solicitantes",
  "solicitante_cbo",
  "configuracao_solicitantes_estados",
  "medico_responsaveis_tipo_cadastro",
  "homecare_escala_repasse_tabela_padrao",
  "estado_civis",
  "religiao",
  "etnia",
  "escolaridade",
  "home_care_regiao_responsavel",
  "configuracao_apuracao",
  "fin_fornecedores",
  "fin_plano_contas",
  "unidades",
]);

const medicoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().trim().min(1, "Nome obrigatório").max(150),
  cpf: z.string().trim().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  crm: z.string().trim().min(1, "CRM obrigatório").max(50),
  situacao_id: z.number().min(1, "Situação obrigatória"),
  user_id: z.number().nullable().optional(),
  produtividade_fin_contabilidade_id: z.number().nullable().optional(),
  id_tipo_conselho_profissional: z.number().min(1, "Tipo de conselho obrigatório"),
  solicitante_id: z.number().nullable().optional(),
  cbo_id: z.number().nullable().optional(),
  estado_id: z.number().nullable().optional(),
  tipo_cadastro_id: z.number().nullable().optional(),
  homecare_escala_repasse_tabela_padrao_id: z.number().nullable().optional(),
  estado_civil_id: z.number().nullable().optional(),
  religiao_id: z.number().nullable().optional(),
  etnia_id: z.number().nullable().optional(),
  escolaridade_id: z.number().nullable().optional(),
  home_care_regiao_responsavel_id: z.number().nullable().optional(),
  configuracao_apuracao_id: z.number().nullable().optional(),
  fin_fornecedor_id: z.number().nullable().optional(),
  contas_pagar_plano_contas_id: z.number().nullable().optional(),
  contas_receber_plano_contas_id: z.number().nullable().optional(),
  unidade_id: z.number().min(1, "Unidade obrigatória"),
  cbo_ids: z.array(z.number()).default([]),
  exportacoes_sus: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
});

function assertNoError(error: any, fallback: string) {
  if (error) {
    throw new Error(error.message || fallback);
  }
}

async function fetchLookupTable(table: QuickCreateLookupTable): Promise<LookupOption[]> {
  const config = lookupDefinitions[table];
  const { data, error } = await db
    .from(table)
    .select(`id, ${config.column}`)
    .order(config.orderBy, { ascending: true });

  assertNoError(error, `Erro ao carregar ${table}`);

  return (data ?? []).map((row: Record<string, any>) => ({
    id: Number(row.id),
    value: String(row[config.column] ?? ""),
  }));
}

export const listLookupCollections = createServerFn({ method: "GET" }).handler(async () => {
  const entries = await Promise.all(
    (Object.keys(lookupDefinitions) as QuickCreateLookupTable[]).map(async (table) => {
      const options = await fetchLookupTable(table);
      return [table, options] as const;
    }),
  );

  return Object.fromEntries(entries) as LookupCollections;
});

export const listMedicoResponsaveis = createServerFn({ method: "GET" })
  .inputValidator((input: { search?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const term = data.search?.trim();

    let query = db
      .from("medico_responsaveis")
      .select(`
        id,
        nome,
        cpf,
        crm,
        situacao:situacao_id ( descricao ),
        tipo_conselho:id_tipo_conselho_profissional ( descricao ),
        unidade:unidade_id ( nome )
      `)
      .order("nome", { ascending: true });

    if (term) {
      query = query.or(`nome.ilike.%${term}%,cpf.ilike.%${term}%,crm.ilike.%${term}%`);
    }

    const { data: rows, error } = await query;
    assertNoError(error, "Erro ao listar médicos responsáveis");

    return (rows ?? []).map((row: any) => ({
      id: Number(row.id),
      nome: row.nome ?? "",
      cpf: row.cpf ?? "",
      crm: row.crm ?? "",
      situacao: row.situacao?.descricao ?? null,
      tipoConselho: row.tipo_conselho?.descricao ?? null,
      unidade: row.unidade?.nome ?? null,
    })) as MedicoResponsavelListItem[];
  });

export const getMedicoResponsavelById = createServerFn({ method: "GET" })
  .inputValidator((input: { id: number }) => z.object({ id: z.number().positive() }).parse(input))
  .handler(async ({ data }) => {
    const { data: medico, error } = await db
      .from("medico_responsaveis")
      .select("*")
      .eq("id", data.id)
      .single();

    assertNoError(error, "Erro ao carregar médico responsável");

    const { data: cbos, error: cboError } = await db
      .from("medico_responsaveis_cbo")
      .select("cbo_id")
      .eq("medico_responsaveis_id", data.id)
      .order("id", { ascending: true });
    assertNoError(cboError, "Erro ao carregar CBOs vinculados");

    const { data: exportacoes, error: exportError } = await db
      .from("medico_responsaveis_sus_exportacao")
      .select("data_exportacao")
      .eq("medico_responsaveis_id", data.id)
      .order("data_exportacao", { ascending: true });
    assertNoError(exportError, "Erro ao carregar exportações SUS");

    return {
      ...(medico as Record<string, any>),
      id: Number(medico.id),
      cbo_ids: (cbos ?? []).map((item: any) => Number(item.cbo_id)),
      exportacoes_sus: (exportacoes ?? []).map((item: any) => String(item.data_exportacao).slice(0, 10)),
    } as MedicoResponsavelRecord;
  });

export const saveMedicoResponsavel = createServerFn({ method: "POST" })
  .inputValidator((input) => medicoSchema.parse(input))
  .handler(async ({ data }) => {
    const payload = {
      nome: data.nome,
      cpf: data.cpf,
      crm: data.crm,
      situacao_id: data.situacao_id,
      user_id: data.user_id ?? null,
      produtividade_fin_contabilidade_id: data.produtividade_fin_contabilidade_id ?? null,
      id_tipo_conselho_profissional: data.id_tipo_conselho_profissional,
      solicitante_id: data.solicitante_id ?? null,
      cbo_id: data.cbo_id ?? null,
      estado_id: data.estado_id ?? null,
      tipo_cadastro_id: data.tipo_cadastro_id ?? null,
      homecare_escala_repasse_tabela_padrao_id: data.homecare_escala_repasse_tabela_padrao_id ?? null,
      estado_civil_id: data.estado_civil_id ?? null,
      religiao_id: data.religiao_id ?? null,
      etnia_id: data.etnia_id ?? null,
      escolaridade_id: data.escolaridade_id ?? null,
      home_care_regiao_responsavel_id: data.home_care_regiao_responsavel_id ?? null,
      configuracao_apuracao_id: data.configuracao_apuracao_id ?? null,
      fin_fornecedor_id: data.fin_fornecedor_id ?? null,
      contas_pagar_plano_contas_id: data.contas_pagar_plano_contas_id ?? null,
      contas_receber_plano_contas_id: data.contas_receber_plano_contas_id ?? null,
      unidade_id: data.unidade_id,
    };

    let medicoId = data.id;

    if (medicoId) {
      const { error } = await db
        .from("medico_responsaveis")
        .update(payload)
        .eq("id", medicoId);
      assertNoError(error, "Erro ao atualizar médico responsável");
    } else {
      const { data: created, error } = await db
        .from("medico_responsaveis")
        .insert(payload)
        .select("id")
        .single();
      assertNoError(error, "Erro ao criar médico responsável");
      medicoId = Number(created.id);
    }

    const { error: deleteCboError } = await db
      .from("medico_responsaveis_cbo")
      .delete()
      .eq("medico_responsaveis_id", medicoId);
    assertNoError(deleteCboError, "Erro ao atualizar CBOs vinculados");

    if (data.cbo_ids.length > 0) {
      const cboRows = data.cbo_ids.map((cboId) => ({
        medico_responsaveis_id: medicoId,
        cbo_id: cboId,
      }));
      const { error: insertCboError } = await db
        .from("medico_responsaveis_cbo")
        .insert(cboRows);
      assertNoError(insertCboError, "Erro ao salvar CBOs vinculados");
    }

    const { error: deleteExportError } = await db
      .from("medico_responsaveis_sus_exportacao")
      .delete()
      .eq("medico_responsaveis_id", medicoId);
    assertNoError(deleteExportError, "Erro ao atualizar exportações SUS");

    if (data.exportacoes_sus.length > 0) {
      const exportRows = data.exportacoes_sus.map((date) => ({
        medico_responsaveis_id: medicoId,
        data_exportacao: `${date}T00:00:00.000Z`,
      }));
      const { error: insertExportError } = await db
        .from("medico_responsaveis_sus_exportacao")
        .insert(exportRows);
      assertNoError(insertExportError, "Erro ao salvar exportações SUS");
    }

    return { id: medicoId };
  });

export const deactivateMedicoResponsavel = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => z.object({ id: z.number().positive() }).parse(input))
  .handler(async ({ data }) => {
    const { data: inactiveStatus, error: statusError } = await db
      .from("situacao_cadastros")
      .select("id")
      .ilike("descricao", "Inativo")
      .maybeSingle();
    assertNoError(statusError, "Erro ao buscar situação inativa");

    const situacaoId = inactiveStatus?.id ?? 2;

    const { error } = await db
      .from("medico_responsaveis")
      .update({ situacao_id: situacaoId })
      .eq("id", data.id);

    assertNoError(error, "Erro ao desativar médico responsável");
    return { success: true };
  });

export const createQuickLookupValue = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      table: lookupTableSchema,
      value: z.string().trim().min(1, "Informe um valor").max(150),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const config = lookupDefinitions[data.table];
    const payload = { [config.column]: data.value };

    const { data: created, error } = await db
      .from(data.table)
      .insert(payload)
      .select(`id, ${config.column}`)
      .single();

    assertNoError(error, "Erro ao cadastrar opção auxiliar");

    return {
      id: Number(created.id),
      value: String(created[config.column]),
    } as LookupOption;
  });
