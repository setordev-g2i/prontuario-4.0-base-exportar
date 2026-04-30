import type { FluxodocsBase } from "@/types/entities/Fluxodocs";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "datetime";

export interface FieldOption {
  id: number | string;
  value: string;
}

export interface CrudField<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  type: FieldType;
  /** Tooltip (para campos complexos) */
  tooltip?: string;
  /** Larguras em colunas (1-3) no grid */
  span?: 1 | 2 | 3;
  /** Para select: source assíncrono de options */
  optionsSource?: () => Promise<FieldOption[]>;
  /** Para select FK: permitir nulo */
  nullable?: boolean;
  /** Para text/number: opções */
  placeholder?: string;
  required?: boolean;
  /** Para listagem: como renderizar (texto curto). Se ausente, mostra raw */
  formatList?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  /** Esconde no formulário (somente listagem/visualização) */
  hideInForm?: boolean;
  /** Esconde na listagem */
  hideInList?: boolean;
}

export interface CrudConfig<T extends FluxodocsBase> {
  /** Identificador da entidade (kebab-case) */
  entity: string;
  /** Título exibido na page (plural) */
  titlePlural: string;
  /** Título singular ("Setor", "Tipo de Documento") */
  titleSingular: string;
  /** Campo usado como busca textual principal e label de FK quando exposto */
  searchKey: keyof T & string;
  /** Campos do CRUD */
  fields: CrudField<T>[];
  /** Service mock */
  service: {
    fetchAll: () => Promise<T[]>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: number, data: Partial<T>) => Promise<T>;
    inactivate: (id: number) => Promise<void>;
    reactivate: (id: number) => Promise<void>;
  };
  /** Tooltip da própria entidade (mostrado no header) */
  tooltip?: string;
  /** Campos extras para visualização agrupada (auditoria) — automático */
}
