
-- Adicionar colunas de dados pessoais
ALTER TABLE public.medico_responsaveis 
  ADD COLUMN IF NOT EXISTS rg VARCHAR(20),
  ADD COLUMN IF NOT EXISTS data_nascimento DATE,
  ADD COLUMN IF NOT EXISTS sexo VARCHAR(20),
  ADD COLUMN IF NOT EXISTS email VARCHAR(150),
  ADD COLUMN IF NOT EXISTS celular VARCHAR(20),
  ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Endereço (Complementares I)
ALTER TABLE public.medico_responsaveis 
  ADD COLUMN IF NOT EXISTS cep VARCHAR(10),
  ADD COLUMN IF NOT EXISTS endereco VARCHAR(200),
  ADD COLUMN IF NOT EXISTS numero VARCHAR(20),
  ADD COLUMN IF NOT EXISTS complemento VARCHAR(100),
  ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);

-- Documentos e Registros
ALTER TABLE public.medico_responsaveis 
  ADD COLUMN IF NOT EXISTS sigla VARCHAR(20),
  ADD COLUMN IF NOT EXISTS status_conselho VARCHAR(50),
  ADD COLUMN IF NOT EXISTS rqe VARCHAR(50),
  ADD COLUMN IF NOT EXISTS nome_laudo VARCHAR(150),
  ADD COLUMN IF NOT EXISTS conselho_laudo VARCHAR(50),
  ADD COLUMN IF NOT EXISTS cartao_nacional_saude VARCHAR(30),
  ADD COLUMN IF NOT EXISTS pis VARCHAR(20),
  ADD COLUMN IF NOT EXISTS cnes VARCHAR(20);

-- Financeiro
ALTER TABLE public.medico_responsaveis 
  ADD COLUMN IF NOT EXISTS banco VARCHAR(100),
  ADD COLUMN IF NOT EXISTS agencia VARCHAR(20),
  ADD COLUMN IF NOT EXISTS conta VARCHAR(30);

-- Configurações
ALTER TABLE public.medico_responsaveis 
  ADD COLUMN IF NOT EXISTS atende_psiquiatricos BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cadastrar_agenda BOOLEAN NOT NULL DEFAULT false;

-- SUS
ALTER TABLE public.medico_responsaveis 
  ADD COLUMN IF NOT EXISTS vinculo_sus VARCHAR(100);
