import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { detailsSchema, collectZodErrors, type BookingState } from "@/lib/scheduler/types";
import { useCallebi } from "@/components/scheduler/Callebi";
import { reactToLocal, reactToParticipantes } from "@/lib/scheduler/callebi";

type Props = {
  data: BookingState["details"];
  onChange: (d: BookingState["details"]) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepDetails({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { speak } = useCallebi();

  const set = <K extends keyof BookingState["details"]>(
    key: K,
    value: BookingState["details"][K],
  ) => onChange({ ...data, [key]: value });

  const submit = () => {
    const result = detailsSchema.safeParse(data);
    if (!result.success) {
      setErrors(collectZodErrors(result.error));
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-5">
      <Field label="Onde a gente se encontra?" error={errors.local}>
        <Input
          value={data.local}
          onChange={(e) => set("local", e.target.value)}
          onBlur={() => {
            const r = reactToLocal(data.local);
            if (r) speak(r);
          }}
          placeholder="Café, escritório, boteco... aceito sugestões"
        />
      </Field>
      <Field label="Endereço (se eu precisar de GPS)">
        <Input
          value={data.endereco}
          onChange={(e) => set("endereco", e.target.value)}
          placeholder="Rua, número, bairro — opcional"
        />
      </Field>
      <Field label="Vai durar quanto?" error={errors.duracao}>
        <Input
          value={data.duracao}
          onChange={(e) => set("duracao", e.target.value)}
          placeholder="Ex: 1 hora (ou até a conta chegar)"
        />
      </Field>
      <Field label="Quantas almas vão estar lá?" error={errors.participantes}>
        <Input
          type="number"
          min={1}
          value={data.participantes}
          onChange={(e) => {
            set("participantes", e.target.value);
            const r = reactToParticipantes(Number(e.target.value));
            if (r) speak(r);
          }}
          placeholder="Contando comigo, claro"
        />
      </Field>
      <Field label="Algo mais que eu precise saber?">
        <Textarea
          value={data.observacoes}
          onChange={(e) => set("observacoes", e.target.value)}
          placeholder="Detalhes, recados, ameaças veladas..."
          rows={4}
        />
      </Field>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          ← Voltar
        </Button>
        <Button onClick={submit} size="lg">
          Quase lá →
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
