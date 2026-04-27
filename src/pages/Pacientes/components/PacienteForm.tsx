import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { pacienteSchema, type PacienteFormValues } from "@/lib/schemas/paciente";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputMasked } from "@/components/InputMasked";
import { MASKS } from "@/lib/masks";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifyRequiredErrors } from "@/lib/forms/notifyRequired";

export type PacienteFormMode = "create" | "edit";

interface PacienteFormProps {
  mode: PacienteFormMode;
  initialData?: Partial<PacienteFormValues>;
  onSubmit: (values: PacienteFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
  readOnly?: boolean;
}

const PACIENTE_FIELD_LABELS: Record<string, string> = {
  nome: "Nome",
  cpf: "CPF",
  rg: "RG",
  dataNascimento: "Dt. Nascimento",
  sexo: "Sexo",
  email: "Email",
  telefone: "Telefone",
  celular: "Celular",
  cep: "CEP",
  endereco: "Endereço",
  numero: "Número",
  complemento: "Complemento",
  bairro: "Bairro",
  cidade: "Cidade",
  estadoId: "UF",
};

const defaultValues: PacienteFormValues = {
  nome: "",
  cpf: "",
  rg: "",
  dataNascimento: "",
  sexo: undefined,
  email: "",
  telefone: "",
  celular: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estadoId: "",
  situacaoId: 1,
};

export function PacienteForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
  readOnly = false,
}: PacienteFormProps) {
  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    mode: "onChange",
    defaultValues: { ...defaultValues, ...initialData },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const disabled = readOnly;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) =>
        notifyRequiredErrors(errs, PACIENTE_FIELD_LABELS),
      )}
      className="space-y-6"
      aria-label={
        readOnly
          ? "Visualizar paciente"
          : mode === "create"
            ? "Cadastrar paciente"
            : "Editar paciente"
      }
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Dados principais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
              disabled={disabled}
              {...register("nome")}
              className={cn(errors.nome && "border-destructive")}
            />
            {errors.nome && (
              <p className="mt-1 text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <InputMasked
                  id="cpf"
                  mask={MASKS.CPF}
                  value={field.value}
                  onChange={(val: string) => field.onChange(val)}
                  hasError={!!errors.cpf}
                  disabled={disabled}
                />
              )}
            />
            {errors.cpf && (
              <p className="mt-1 text-xs text-destructive">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="rg">RG</Label>
            <Input id="rg" disabled={disabled} {...register("rg")} />
          </div>

          <div>
            <Label htmlFor="dataNascimento">Data de nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
              disabled={disabled}
              {...register("dataNascimento")}
              className={cn(errors.dataNascimento && "border-destructive")}
            />
            {errors.dataNascimento && (
              <p className="mt-1 text-xs text-destructive">
                {errors.dataNascimento.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="sexo">Sexo</Label>
            <Controller
              control={control}
              name="sexo"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) =>
                    field.onChange(v as "masculino" | "feminino" | "outro")
                  }
                  disabled={disabled}
                >
                  <SelectTrigger id="sexo">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Contato</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={disabled}
              {...register("email")}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="celular">Celular</Label>
            <Controller
              control={control}
              name="celular"
              render={({ field }) => (
                <InputMasked
                  id="celular"
                  mask={MASKS.CELULAR}
                  value={field.value ?? ""}
                  onChange={(val: string) => field.onChange(val)}
                  disabled={disabled}
                />
              )}
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <InputMasked
                  id="telefone"
                  mask={MASKS.TELEFONE}
                  value={field.value ?? ""}
                  onChange={(val: string) => field.onChange(val)}
                  disabled={disabled}
                />
              )}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Endereço</h2>
        <div className="grid gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label htmlFor="cep">CEP</Label>
            <Controller
              control={control}
              name="cep"
              render={({ field }) => (
                <InputMasked
                  id="cep"
                  mask={MASKS.CEP}
                  value={field.value ?? ""}
                  onChange={(val: string) => field.onChange(val)}
                  disabled={disabled}
                />
              )}
            />
          </div>
          <div className="md:col-span-4">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" disabled={disabled} {...register("endereco")} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" disabled={disabled} {...register("numero")} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              disabled={disabled}
              {...register("complemento")}
            />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" disabled={disabled} {...register("bairro")} />
          </div>
          <div className="md:col-span-4">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" disabled={disabled} {...register("cidade")} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="estadoId">UF</Label>
            <Input id="estadoId" disabled={disabled} {...register("estadoId")} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          <X className="mr-1 size-4" />
          {readOnly ? "Fechar" : "Cancelar"}
        </Button>
        {!readOnly && (
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : (
              <Save className="mr-1 size-4" />
            )}
            {mode === "create" ? "Cadastrar" : "Salvar alterações"}
          </Button>
        )}
      </div>
    </form>
  );
}
