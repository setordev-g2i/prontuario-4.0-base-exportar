import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESET_MODALITIES: { code: string; label: string }[] = [
  { code: "RX", label: "RX — Radiografia" },
  { code: "MG", label: "MG — Mamografia" },
  { code: "RM", label: "RM — Ressonância Magnética" },
  { code: "CT", label: "CT — Tomografia" },
  { code: "US", label: "US — Ultrassom" },
  { code: "DO", label: "DO — Densitometria Óssea" },
];

const PRESET_CODES = PRESET_MODALITIES.map((m) => m.code);
const OTHER = "__other__";

interface Props {
  value: string | null | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DicomModalitySelector({ value, onChange, disabled }: Props) {
  const current = (value ?? "").trim().toUpperCase();
  const isPreset = current !== "" && PRESET_CODES.includes(current);
  const isCustom = current !== "" && !isPreset;

  const [mode, setMode] = useState<string>(
    isCustom ? OTHER : current || "",
  );
  const [custom, setCustom] = useState<string>(isCustom ? current : "");

  // Sincroniza estado interno se o valor externo mudar (ex: edição)
  useEffect(() => {
    if (isCustom) {
      setMode(OTHER);
      setCustom(current);
    } else {
      setMode(current);
      setCustom("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleSelect(v: string) {
    setMode(v);
    if (v === OTHER) {
      onChange(custom.trim().toUpperCase());
    } else {
      setCustom("");
      onChange(v);
    }
  }

  function handleCustomChange(v: string) {
    const up = v.toUpperCase();
    setCustom(up);
    onChange(up.trim());
  }

  return (
    <div className="space-y-2">
      <Select value={mode} onValueChange={handleSelect} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a modalidade" />
        </SelectTrigger>
        <SelectContent>
          {PRESET_MODALITIES.map((m) => (
            <SelectItem key={m.code} value={m.code}>
              {m.label}
            </SelectItem>
          ))}
          <SelectItem value={OTHER}>Outro…</SelectItem>
        </SelectContent>
      </Select>

      {mode === OTHER && (
        <div>
          <Label className="text-xs text-muted-foreground">
            Informe a sigla
          </Label>
          <Input
            value={custom}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="Ex: NM, PT, XA"
            maxLength={16}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
