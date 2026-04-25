-- Remove tabelas dependentes primeiro
DROP TABLE IF EXISTS public.medico_responsaveis_sus_exportacao CASCADE;
DROP TABLE IF EXISTS public.medico_responsaveis_cbo CASCADE;
DROP TABLE IF EXISTS public.medico_responsaveis CASCADE;

-- Remove tabelas auxiliares (lookups)
DROP TABLE IF EXISTS public.medico_responsaveis_tipo_cadastro CASCADE;
DROP TABLE IF EXISTS public.situacao_cadastros CASCADE;
DROP TABLE IF EXISTS public.tipo_conselho_profissional CASCADE;
DROP TABLE IF EXISTS public.solicitante_cbo CASCADE;
DROP TABLE IF EXISTS public.solicitantes CASCADE;
DROP TABLE IF EXISTS public.configuracao_solicitantes_estados CASCADE;
DROP TABLE IF EXISTS public.configuracao_apuracao CASCADE;
DROP TABLE IF EXISTS public.homecare_escala_repasse_tabela_padrao CASCADE;
DROP TABLE IF EXISTS public.home_care_regiao_responsavel CASCADE;
DROP TABLE IF EXISTS public.estado_civis CASCADE;
DROP TABLE IF EXISTS public.religiao CASCADE;
DROP TABLE IF EXISTS public.etnia CASCADE;
DROP TABLE IF EXISTS public.escolaridade CASCADE;
DROP TABLE IF EXISTS public.fin_contabilidades CASCADE;
DROP TABLE IF EXISTS public.fin_fornecedores CASCADE;
DROP TABLE IF EXISTS public.fin_plano_contas CASCADE;
DROP TABLE IF EXISTS public.unidades CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Remove função auxiliar
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;