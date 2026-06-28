import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { horarios, dateTimeSchema, collectZodErrors, type BookingState } from "@/lib/scheduler/types";
import { getBlockedDateReasons } from "@/lib/scheduler/blockedDates";
import { useCallebi } from "@/components/scheduler/Callebi";
import {
  reactToBlockedDate,
  reactToData,
  reactToHorario,
  reactToValidationErrors,
} from "@/lib/scheduler/callebi";
import { OWNER_NAME } from "@/lib/scheduler/owner";

type Props = {
  data: BookingState["dateTime"];
  onChange: (d: BookingState["dateTime"]) => void;
  onBack: () => void;
  onNext: () => void;
};

// Só datas passadas ficam realmente desabilitadas. As datas ocupadas do
// Eduardo continuam clicáveis de propósito — o toque revela a piada
function isPast(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function StepDateTime({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const blockedReasons = useMemo(() => getBlockedDateReasons(), []);
  const blockedKeys = useMemo(() => new Set(Object.keys(blockedReasons)), [blockedReasons]);
  // Mensagem revelada ao TOCAR numa data bloqueada (funciona no celular).
  const [revealed, setRevealed] = useState<string | null>(null);
  // Pré-visualização no hover (bônus pra quem usa mouse).
  const [hoverMsg, setHoverMsg] = useState<string | null>(null);
  const { speak } = useCallebi();

  const submit = () => {
    const result = dateTimeSchema.safeParse(data);
    if (!result.success) {
      const nextErrors = collectZodErrors(result.error);
      setErrors(nextErrors);
      speak(reactToValidationErrors(nextErrors));
      return;
    }
    setErrors({});
    onNext();
  };

  const handleSelect = (d: Date | undefined) => {
    if (!d) return; // ignora "desmarcar" tocando de novo
    const key = format(d, "yyyy-MM-dd");
    if (blockedKeys.has(key)) {
      const reason = blockedReasons[key];
      setRevealed(reason);
      speak(reactToBlockedDate(reason));
      return;
    }
    setRevealed(null);
    onChange({ ...data, data: d });
    speak(reactToData());
    if (errors.data) setErrors((e) => ({ ...e, data: "" }));
  };

  const activeMsg = revealed ?? hoverMsg;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-sm font-medium">Quando você quer ver o {OWNER_NAME}?</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Toque (ou passe o mouse) nas datas riscadas pra descobrir onde ele vai estar 🍻
        </p>
        <div
          className="flex justify-center rounded-lg border bg-card p-2"
          onMouseLeave={() => setHoverMsg(null)}
        >
          <Calendar
            mode="single"
            locale={ptBR}
            selected={data.data}
            onSelect={handleSelect}
            disabled={isPast}
            defaultMonth={data.data ?? new Date()}
            className="pointer-events-auto"
            modifiers={{
              drinking: (d) => blockedKeys.has(format(d, "yyyy-MM-dd")),
            }}
            modifiersClassNames={{
              drinking: "line-through opacity-60 hover:opacity-100 cursor-pointer",
            }}
            onDayMouseEnter={(d) => {
              const key = format(d, "yyyy-MM-dd");
              setHoverMsg(blockedReasons[key] ?? null);
            }}
          />
        </div>
        <div className="mt-2 min-h-[20px] text-xs" aria-live="polite">
          {activeMsg ? (
            <span className="italic text-primary">{activeMsg}</span>
          ) : (
            <span className="text-muted-foreground">
              Datas riscadas? O {OWNER_NAME} tá ocupado — trabalhando, bebendo ou no show. Toca pra
              ver o motivo.
            </span>
          )}
        </div>
        {errors.data && <p className="mt-1 text-xs text-destructive">{errors.data}</p>}
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">A que horas?</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Antes das 8h o {OWNER_NAME} ainda tá no travesseiro, depois das 20h pode já estar no bar
          ou no after. Escolha sabiamente.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {horarios.map((h) => {
            const active = data.horario === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => {
                  onChange({ ...data, horario: h });
                  speak(reactToHorario(h));
                  if (errors.horario) setErrors((e) => ({ ...e, horario: "" }));
                }}
                className={[
                  "rounded-md border px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent",
                ].join(" ")}
              >
                {h}
              </button>
            );
          })}
        </div>
        {errors.horario && <p className="mt-2 text-xs text-destructive">{errors.horario}</p>}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          ← Voltar
        </Button>
        <Button onClick={submit} size="lg">
          Continuar →
        </Button>
      </div>
    </div>
  );
}
