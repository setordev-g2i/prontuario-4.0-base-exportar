import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profissionalFormSchema,
  type ProfissionalFormValues,
} from "@/lib/schemas/profissionais/formSchema";
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

export type ProfissionalFormMode = "create" | "edit";

interface ProfissionalFormProps {
  mode: ProfissionalFormMode;
  initialData?: Partial<ProfissionalFormValues>;
  onSubmit: (values: ProfissionalFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

const TIPOS_CADASTRO = [
  { value: "medico", label: "Médico" },
  { value: "enfermeiro", label: "Enfermeiro" },
];

const defaultValues: ProfissionalFormValues = {
  nome: "",
  tipoCadastroId: "",
  cpf: "",
  rg: "",
  dataNascimento: "",
  sexo: undefined,
  conselho: "",
  situacaoId: 1,
};

/**
 * Form compartilhado entre cadastro (novo) e edição de Profissionais.
 */
export function ProfissionalForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: ProfissionalFormProps) {
  const form = useForm<ProfissionalFormValues>({
    resolver: zodResolver(profissionalFormSchema),
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
      aria-label={
        mode === "create" ? "Cadastrar profissional" : "Editar profissional"
      }
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
              <p className="mt-1 text-xs text-destructive">
                {errors.nome.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="tipoCadastroId">Tipo de cadastro *</Label>
            <Controller
              control={control}
              name="tipoCadastroId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="tipoCadastroId"
                    className={cn(errors.tipoCadastroId && "border-destructive")}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_CADASTRO.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoCadastroId && (
              <p className="mt-1 text-xs text-destructive">
                {errors.tipoCadastroId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="situacaoId">Situação *</Label>
            <Controller
              control={control}
              name="situacaoId"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger id="situacaoId">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="2">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
                />
              )}
            />
            {errors.cpf && (
              <p className="mt-1 text-xs text-destructive">
                {errors.cpf.message}
              </p>
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

          <div className="md:col-span-2">
            <Label htmlFor="conselho">Conselho</Label>
            <Input
              id="conselho"
              placeholder="Ex: CRM-SP, COREN-RJ"
              {...register("conselho")}
            />
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
