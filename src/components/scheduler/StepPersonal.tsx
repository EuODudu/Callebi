import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  personalSchema,
  proximidadeOptions,
  formatWhatsapp,
  collectZodErrors,
  type BookingState,
} from "@/lib/scheduler/types";
import { useCallebi } from "@/components/scheduler/Callebi";
import { reactToNome, reactToProximidade, reactToMotivo, reactToValidationErrors } from "@/lib/scheduler/callebi";
import { OWNER_NAME } from "@/lib/scheduler/owner";

type Props = {
  data: BookingState["personal"];
  onChange: (d: BookingState["personal"]) => void;
  onNext: () => void;
};

export function StepPersonal({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { speak } = useCallebi();

  const set = <K extends keyof BookingState["personal"]>(
    key: K,
    value: BookingState["personal"][K],
  ) => onChange({ ...data, [key]: value });

  const submit = () => {
    const result = personalSchema.safeParse(data);
    if (!result.success) {
      const nextErrors = collectZodErrors(result.error);
      setErrors(nextErrors);
      speak(reactToValidationErrors(nextErrors));
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-5">
      <Field label="Como devo te chamar?" error={errors.nome}>
        <Input
          value={data.nome}
          onChange={(e) => set("nome", e.target.value)}
          onBlur={() => {
            const r = reactToNome(data.nome);
            if (r) speak(r);
          }}
          placeholder="Nome completo, sem apelido vergonhoso"
        />
      </Field>
      <Field label={`WhatsApp (pro ${OWNER_NAME} te responder)`} error={errors.whatsapp}>
        <Input
          value={data.whatsapp}
          onChange={(e) => set("whatsapp", formatWhatsapp(e.target.value))}
          placeholder="(11) 99999-9999"
          inputMode="numeric"
        />
      </Field>
      <Field label="De onde você fala?" error={errors.cidade}>
        <Input
          value={data.cidade}
          onChange={(e) => set("cidade", e.target.value)}
          placeholder="Cidade — quanto mais perto do bar, melhor"
        />
      </Field>
      <Field label="Qual é a nossa? 👀" error={errors.proximidade}>
        <Select
          value={data.proximidade}
          onValueChange={(v) => {
            set("proximidade", v);
            const r = reactToProximidade(v);
            if (r) speak(r);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Me explica nossa relação" />
          </SelectTrigger>
          <SelectContent>
            {proximidadeOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label={`Pra que você quer falar com o ${OWNER_NAME}?`} error={errors.motivo}>
        <Textarea
          value={data.motivo}
          onChange={(e) => set("motivo", e.target.value)}
          onBlur={() => {
            const r = reactToMotivo(data.motivo);
            if (r) speak(r);
          }}
          placeholder="Trabalho, café, rodeio, conselho... o Eduardo topa quase tudo"
          rows={4}
        />
      </Field>
      <div className="flex justify-end pt-2">
        <Button onClick={submit} size="lg">
          Bora marcar →
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
