DROP POLICY IF EXISTS "Authenticated users can manage situacao_cadastros" ON public.situacao_cadastros;
DROP POLICY IF EXISTS "Authenticated users can manage users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can manage fin_contabilidades" ON public.fin_contabilidades;
DROP POLICY IF EXISTS "Authenticated users can manage tipo_conselho_profissional" ON public.tipo_conselho_profissional;
DROP POLICY IF EXISTS "Authenticated users can manage solicitantes" ON public.solicitantes;
DROP POLICY IF EXISTS "Authenticated users can manage solicitante_cbo" ON public.solicitante_cbo;
DROP POLICY IF EXISTS "Authenticated users can manage configuracao_solicitantes_estados" ON public.configuracao_solicitantes_estados;
DROP POLICY IF EXISTS "Authenticated users can manage medico_responsaveis_tipo_cadastro" ON public.medico_responsaveis_tipo_cadastro;
DROP POLICY IF EXISTS "Authenticated users can manage homecare_escala_repasse_tabela_padrao" ON public.homecare_escala_repasse_tabela_padrao;
DROP POLICY IF EXISTS "Authenticated users can manage estado_civis" ON public.estado_civis;
DROP POLICY IF EXISTS "Authenticated users can manage religiao" ON public.religiao;
DROP POLICY IF EXISTS "Authenticated users can manage etnia" ON public.etnia;
DROP POLICY IF EXISTS "Authenticated users can manage escolaridade" ON public.escolaridade;
DROP POLICY IF EXISTS "Authenticated users can manage home_care_regiao_responsavel" ON public.home_care_regiao_responsavel;
DROP POLICY IF EXISTS "Authenticated users can manage configuracao_apuracao" ON public.configuracao_apuracao;
DROP POLICY IF EXISTS "Authenticated users can manage fin_fornecedores" ON public.fin_fornecedores;
DROP POLICY IF EXISTS "Authenticated users can manage fin_plano_contas" ON public.fin_plano_contas;
DROP POLICY IF EXISTS "Authenticated users can manage unidades" ON public.unidades;
DROP POLICY IF EXISTS "Authenticated users can manage medico_responsaveis" ON public.medico_responsaveis;
DROP POLICY IF EXISTS "Authenticated users can manage medico_responsaveis_cbo" ON public.medico_responsaveis_cbo;
DROP POLICY IF EXISTS "Authenticated users can manage medico_responsaveis_sus_exportacao" ON public.medico_responsaveis_sus_exportacao;

CREATE POLICY "Authenticated users can read situacao_cadastros"
ON public.situacao_cadastros
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert situacao_cadastros"
ON public.situacao_cadastros
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update situacao_cadastros"
ON public.situacao_cadastros
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete situacao_cadastros"
ON public.situacao_cadastros
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read users"
ON public.users
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert users"
ON public.users
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update users"
ON public.users
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete users"
ON public.users
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read fin_contabilidades"
ON public.fin_contabilidades
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert fin_contabilidades"
ON public.fin_contabilidades
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update fin_contabilidades"
ON public.fin_contabilidades
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete fin_contabilidades"
ON public.fin_contabilidades
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read tipo_conselho_profissional"
ON public.tipo_conselho_profissional
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert tipo_conselho_profissional"
ON public.tipo_conselho_profissional
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update tipo_conselho_profissional"
ON public.tipo_conselho_profissional
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete tipo_conselho_profissional"
ON public.tipo_conselho_profissional
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read solicitantes"
ON public.solicitantes
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert solicitantes"
ON public.solicitantes
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update solicitantes"
ON public.solicitantes
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete solicitantes"
ON public.solicitantes
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read solicitante_cbo"
ON public.solicitante_cbo
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert solicitante_cbo"
ON public.solicitante_cbo
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update solicitante_cbo"
ON public.solicitante_cbo
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete solicitante_cbo"
ON public.solicitante_cbo
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read configuracao_solicitantes_estados"
ON public.configuracao_solicitantes_estados
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert configuracao_solicitantes_estados"
ON public.configuracao_solicitantes_estados
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update configuracao_solicitantes_estados"
ON public.configuracao_solicitantes_estados
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete configuracao_solicitantes_estados"
ON public.configuracao_solicitantes_estados
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read medico_responsaveis_tipo_cadastro"
ON public.medico_responsaveis_tipo_cadastro
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert medico_responsaveis_tipo_cadastro"
ON public.medico_responsaveis_tipo_cadastro
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update medico_responsaveis_tipo_cadastro"
ON public.medico_responsaveis_tipo_cadastro
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete medico_responsaveis_tipo_cadastro"
ON public.medico_responsaveis_tipo_cadastro
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read homecare_escala_repasse_tabela_padrao"
ON public.homecare_escala_repasse_tabela_padrao
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert homecare_escala_repasse_tabela_padrao"
ON public.homecare_escala_repasse_tabela_padrao
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update homecare_escala_repasse_tabela_padrao"
ON public.homecare_escala_repasse_tabela_padrao
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete homecare_escala_repasse_tabela_padrao"
ON public.homecare_escala_repasse_tabela_padrao
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read estado_civis"
ON public.estado_civis
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert estado_civis"
ON public.estado_civis
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update estado_civis"
ON public.estado_civis
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete estado_civis"
ON public.estado_civis
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read religiao"
ON public.religiao
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert religiao"
ON public.religiao
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update religiao"
ON public.religiao
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete religiao"
ON public.religiao
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read etnia"
ON public.etnia
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert etnia"
ON public.etnia
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update etnia"
ON public.etnia
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete etnia"
ON public.etnia
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read escolaridade"
ON public.escolaridade
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert escolaridade"
ON public.escolaridade
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update escolaridade"
ON public.escolaridade
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete escolaridade"
ON public.escolaridade
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read home_care_regiao_responsavel"
ON public.home_care_regiao_responsavel
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert home_care_regiao_responsavel"
ON public.home_care_regiao_responsavel
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update home_care_regiao_responsavel"
ON public.home_care_regiao_responsavel
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete home_care_regiao_responsavel"
ON public.home_care_regiao_responsavel
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read configuracao_apuracao"
ON public.configuracao_apuracao
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert configuracao_apuracao"
ON public.configuracao_apuracao
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update configuracao_apuracao"
ON public.configuracao_apuracao
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete configuracao_apuracao"
ON public.configuracao_apuracao
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read fin_fornecedores"
ON public.fin_fornecedores
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert fin_fornecedores"
ON public.fin_fornecedores
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update fin_fornecedores"
ON public.fin_fornecedores
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete fin_fornecedores"
ON public.fin_fornecedores
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read fin_plano_contas"
ON public.fin_plano_contas
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert fin_plano_contas"
ON public.fin_plano_contas
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update fin_plano_contas"
ON public.fin_plano_contas
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete fin_plano_contas"
ON public.fin_plano_contas
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read unidades"
ON public.unidades
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert unidades"
ON public.unidades
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update unidades"
ON public.unidades
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete unidades"
ON public.unidades
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read medico_responsaveis"
ON public.medico_responsaveis
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert medico_responsaveis"
ON public.medico_responsaveis
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update medico_responsaveis"
ON public.medico_responsaveis
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete medico_responsaveis"
ON public.medico_responsaveis
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read medico_responsaveis_cbo"
ON public.medico_responsaveis_cbo
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert medico_responsaveis_cbo"
ON public.medico_responsaveis_cbo
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update medico_responsaveis_cbo"
ON public.medico_responsaveis_cbo
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete medico_responsaveis_cbo"
ON public.medico_responsaveis_cbo
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read medico_responsaveis_sus_exportacao"
ON public.medico_responsaveis_sus_exportacao
FOR SELECT TO authenticated
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert medico_responsaveis_sus_exportacao"
ON public.medico_responsaveis_sus_exportacao
FOR INSERT TO authenticated
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update medico_responsaveis_sus_exportacao"
ON public.medico_responsaveis_sus_exportacao
FOR UPDATE TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete medico_responsaveis_sus_exportacao"
ON public.medico_responsaveis_sus_exportacao
FOR DELETE TO authenticated
USING (auth.role() = 'authenticated');