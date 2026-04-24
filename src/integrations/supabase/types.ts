export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      configuracao_apuracao: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      configuracao_solicitantes_estados: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      escolaridade: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      estado_civis: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      etnia: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      fin_contabilidades: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      fin_fornecedores: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      fin_plano_contas: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      home_care_regiao_responsavel: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      homecare_escala_repasse_tabela_padrao: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      medico_responsaveis: {
        Row: {
          cbo_id: number | null
          configuracao_apuracao_id: number | null
          contas_pagar_plano_contas_id: number | null
          contas_receber_plano_contas_id: number | null
          cpf: string
          created_at: string
          crm: string
          escolaridade_id: number | null
          estado_civil_id: number | null
          estado_id: number | null
          etnia_id: number | null
          fin_fornecedor_id: number | null
          home_care_regiao_responsavel_id: number | null
          homecare_escala_repasse_tabela_padrao_id: number | null
          id: number
          id_tipo_conselho_profissional: number
          nome: string
          produtividade_fin_contabilidade_id: number | null
          religiao_id: number | null
          situacao_id: number
          solicitante_id: number | null
          tipo_cadastro_id: number | null
          unidade_id: number
          updated_at: string
          user_id: number | null
        }
        Insert: {
          cbo_id?: number | null
          configuracao_apuracao_id?: number | null
          contas_pagar_plano_contas_id?: number | null
          contas_receber_plano_contas_id?: number | null
          cpf: string
          created_at?: string
          crm: string
          escolaridade_id?: number | null
          estado_civil_id?: number | null
          estado_id?: number | null
          etnia_id?: number | null
          fin_fornecedor_id?: number | null
          home_care_regiao_responsavel_id?: number | null
          homecare_escala_repasse_tabela_padrao_id?: number | null
          id?: number
          id_tipo_conselho_profissional: number
          nome: string
          produtividade_fin_contabilidade_id?: number | null
          religiao_id?: number | null
          situacao_id: number
          solicitante_id?: number | null
          tipo_cadastro_id?: number | null
          unidade_id: number
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          cbo_id?: number | null
          configuracao_apuracao_id?: number | null
          contas_pagar_plano_contas_id?: number | null
          contas_receber_plano_contas_id?: number | null
          cpf?: string
          created_at?: string
          crm?: string
          escolaridade_id?: number | null
          estado_civil_id?: number | null
          estado_id?: number | null
          etnia_id?: number | null
          fin_fornecedor_id?: number | null
          home_care_regiao_responsavel_id?: number | null
          homecare_escala_repasse_tabela_padrao_id?: number | null
          id?: number
          id_tipo_conselho_profissional?: number
          nome?: string
          produtividade_fin_contabilidade_id?: number | null
          religiao_id?: number | null
          situacao_id?: number
          solicitante_id?: number | null
          tipo_cadastro_id?: number | null
          unidade_id?: number
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medico_responsaveis_cbo_id_fkey"
            columns: ["cbo_id"]
            isOneToOne: false
            referencedRelation: "solicitante_cbo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_configuracao_apuracao_id_fkey"
            columns: ["configuracao_apuracao_id"]
            isOneToOne: false
            referencedRelation: "configuracao_apuracao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_contas_pagar_plano_contas_id_fkey"
            columns: ["contas_pagar_plano_contas_id"]
            isOneToOne: false
            referencedRelation: "fin_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_contas_receber_plano_contas_id_fkey"
            columns: ["contas_receber_plano_contas_id"]
            isOneToOne: false
            referencedRelation: "fin_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_escolaridade_id_fkey"
            columns: ["escolaridade_id"]
            isOneToOne: false
            referencedRelation: "escolaridade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_estado_civil_id_fkey"
            columns: ["estado_civil_id"]
            isOneToOne: false
            referencedRelation: "estado_civis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "configuracao_solicitantes_estados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_etnia_id_fkey"
            columns: ["etnia_id"]
            isOneToOne: false
            referencedRelation: "etnia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_fin_fornecedor_id_fkey"
            columns: ["fin_fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fin_fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_home_care_regiao_responsavel_id_fkey"
            columns: ["home_care_regiao_responsavel_id"]
            isOneToOne: false
            referencedRelation: "home_care_regiao_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_homecare_escala_repasse_tabela_padrao__fkey"
            columns: ["homecare_escala_repasse_tabela_padrao_id"]
            isOneToOne: false
            referencedRelation: "homecare_escala_repasse_tabela_padrao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_id_tipo_conselho_profissional_fkey"
            columns: ["id_tipo_conselho_profissional"]
            isOneToOne: false
            referencedRelation: "tipo_conselho_profissional"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_produtividade_fin_contabilidade_id_fkey"
            columns: ["produtividade_fin_contabilidade_id"]
            isOneToOne: false
            referencedRelation: "fin_contabilidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_religiao_id_fkey"
            columns: ["religiao_id"]
            isOneToOne: false
            referencedRelation: "religiao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_situacao_id_fkey"
            columns: ["situacao_id"]
            isOneToOne: false
            referencedRelation: "situacao_cadastros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "solicitantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_tipo_cadastro_id_fkey"
            columns: ["tipo_cadastro_id"]
            isOneToOne: false
            referencedRelation: "medico_responsaveis_tipo_cadastro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      medico_responsaveis_cbo: {
        Row: {
          cbo_id: number
          created_at: string
          id: number
          medico_responsaveis_id: number
        }
        Insert: {
          cbo_id: number
          created_at?: string
          id?: number
          medico_responsaveis_id: number
        }
        Update: {
          cbo_id?: number
          created_at?: string
          id?: number
          medico_responsaveis_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "medico_responsaveis_cbo_cbo_id_fkey"
            columns: ["cbo_id"]
            isOneToOne: false
            referencedRelation: "solicitante_cbo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medico_responsaveis_cbo_medico_responsaveis_id_fkey"
            columns: ["medico_responsaveis_id"]
            isOneToOne: false
            referencedRelation: "medico_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      medico_responsaveis_sus_exportacao: {
        Row: {
          created_at: string
          data_exportacao: string
          id: number
          medico_responsaveis_id: number
        }
        Insert: {
          created_at?: string
          data_exportacao: string
          id?: number
          medico_responsaveis_id: number
        }
        Update: {
          created_at?: string
          data_exportacao?: string
          id?: number
          medico_responsaveis_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "medico_responsaveis_sus_exportacao_medico_responsaveis_id_fkey"
            columns: ["medico_responsaveis_id"]
            isOneToOne: false
            referencedRelation: "medico_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      medico_responsaveis_tipo_cadastro: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      religiao: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      situacao_cadastros: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      solicitante_cbo: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      solicitantes: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      tipo_conselho_profissional: {
        Row: {
          descricao: string
          id: number
        }
        Insert: {
          descricao: string
          id?: number
        }
        Update: {
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      unidades: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
