import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

const PRESET_MODALITIES: { code: string; label: string }[] = [
  { code: "RX", label: "RX — Radiografia" },
  { code: "MG", label: "MG — Mamografia" },
  { code: "RM", label: "RM — Ressonância Magnética" },
  { code: "CT", label: "CT — Tomografia" },
  { code: "US", label: "US — Ultrassom" },
  { code: "DO", label: "DO — Densitometria Óssea" },
];

const PRESET_CODES = PRESET_MODALITIES.map((m) => m.code);

function parse(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim().toUpperCase())
    .filter(Boolean);
}

function serialize(list: string[]): string {
  return Array.from(new Set(list.map((v) => v.trim().toUpperCase()).filter(Boolean))).join(", ");
}

interface Props {
  value: string | null | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DicomModalitySelector({ value, onChange, disabled }: Props) {
  const selected = useMemo(() => parse(value), [value]);
  const [custom, setCustom] = useState("");

  const customs = selected.filter((c) => !PRESET_CODES.includes(c));

  function toggle(code: string, checked: boolean) {
    const next = checked
      ? [...selected, code]
      : selected.filter((c) => c !== code);
    onChange(serialize(next));
  }

  function addCustom() {
    const code = custom.trim().toUpperCase();
    if (!code) return;
    if (selected.includes(code)) {
      setCustom("");
      return;
    }
    onChange(serialize([...selected, code]));
    setCustom("");
  }

  function removeCustom(code: string) {
    onChange(serialize(selected.filter((c) => c !== code)));
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="grid gap-2 md:grid-cols-3">
        {PRESET_MODALITIES.map((m) => {
          const checked = selected.includes(m.code);
          return (
            <label
              key={m.code}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-colors ${
                disabled ? "opacity-60" : "cursor-pointer hover:bg-accent"
              } ${checked ? "border-primary bg-primary/5" : ""}`}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => toggle(m.code, !!c)}
                disabled={disabled}
              />
              <span>{m.label}</span>
            </label>
          );
        })}
      </div>

      {customs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customs.map((code) => (
            <Badge key={code} variant="secondary" className="gap-1">
              {code}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeCustom(code)}
                  className="ml-1 rounded-full hover:bg-background"
                  aria-label={`Remover ${code}`}
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {!disabled && (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder="Adicionar outra modalidade (ex: NM, PT, XA)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              maxLength={16}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addCustom}
            disabled={!custom.trim()}
          >
            <Plus className="mr-1 size-4" />
            Incluir
          </Button>
        </div>
      )}
    </div>
  );
}
