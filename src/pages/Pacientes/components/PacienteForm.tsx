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

export type PacienteFormMode = "create" | "edit";

interface PacienteFormProps {
  mode: PacienteFormMode;
  initialData?: Partial<PacienteFormValues>;
  onSubmit: (values: PacienteFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

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

/**
 * Form compartilhado entre cadastro (novo) e edição de Pacientes.
 */
export function PacienteForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: PacienteFormProps) {
  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: { ...defaultValues, ...initialData },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-label={mode === "create" ? "Cadastrar paciente" : "Editar paciente"}
    >
      {/* Dados principais */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Dados principais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
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
                  className={cn(errors.cpf && "border-destructive")}
                />
              )}
            />
            {errors.cpf && (
              <p className="mt-1 text-xs text-destructive">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="rg">RG</Label>
            <Input id="rg" {...register("rg")} />
          </div>

          <div>
            <Label htmlFor="dataNascimento">Data de nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
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

      {/* Contato */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Contato</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
                />
              )}
            />
          </div>
        </div>
      </section>

      {/* Endereço */}
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
                />
              )}
            />
          </div>
          <div className="md:col-span-4">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" {...register("endereco")} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" {...register("numero")} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input id="complemento" {...register("complemento")} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" {...register("bairro")} />
          </div>
          <div className="md:col-span-4">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" {...register("cidade")} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="estadoId">UF</Label>
            <Input id="estadoId" {...register("estadoId")} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          <X className="mr-1 size-4" />
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Loader2 className="mr-1 size-4 animate-spin" />
          ) : (
            <Save className="mr-1 size-4" />
          )}
          {mode === "create" ? "Cadastrar" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
