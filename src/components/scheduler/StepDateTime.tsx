import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import {
  BLOCKED_DATES,
  BLOCKED_REASONS,
  horarios,
  dateTimeSchema,
  collectZodErrors,
  type BookingState,
} from "@/lib/scheduler/types";
import { useState } from "react";
import { useCallebi } from "@/components/scheduler/Callebi";
import { reactToBlockedDate, reactToData, reactToHorario } from "@/lib/scheduler/callebi";

type Props = {
  data: BookingState["dateTime"];
  onChange: (d: BookingState["dateTime"]) => void;
  onBack: () => void;
  onNext: () => void;
};

const blockedSet = new Set(BLOCKED_DATES);

// Só datas passadas ficam realmente desabilitadas. As datas "etílicas" do
// Callebi continuam clicáveis de propósito — assim o toque revela a piada
// (em vez de depender de hover, que não existe em celular).
function isPast(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function StepDateTime({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Mensagem revelada ao TOCAR numa data bloqueada (funciona no celular).
  const [revealed, setRevealed] = useState<string | null>(null);
  // Pré-visualização no hover (bônus pra quem usa mouse).
  const [hoverMsg, setHoverMsg] = useState<string | null>(null);
  const { speak } = useCallebi();

  const submit = () => {
    const result = dateTimeSchema.safeParse(data);
    if (!result.success) {
      setErrors(collectZodErrors(result.error));
      return;
    }
    setErrors({});
    onNext();
  };

  const handleSelect = (d: Date | undefined) => {
    if (!d) return; // ignora "desmarcar" tocando de novo
    const key = format(d, "yyyy-MM-dd");
    if (blockedSet.has(key)) {
      const reason = BLOCKED_REASONS[key];
      setRevealed(reason); // revela ao toque
      speak(reactToBlockedDate(reason));
      return; // não seleciona um dia bloqueado
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
        <p className="mb-1 text-sm font-medium">Quando você quer me ver?</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Toque (ou passe o mouse) nas datas riscadas pra descobrir onde o Callebi vai estar 🍻
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
            defaultMonth={data.data ?? new Date(2026, 6, 1)}
            className="pointer-events-auto"
            modifiers={{
              drinking: (d) => blockedSet.has(format(d, "yyyy-MM-dd")),
            }}
            modifiersClassNames={{
              drinking: "line-through opacity-60 hover:opacity-100 cursor-pointer",
            }}
            onDayMouseEnter={(d) => {
              const key = format(d, "yyyy-MM-dd");
              setHoverMsg(BLOCKED_REASONS[key] ?? null);
            }}
          />
        </div>
        <div className="mt-2 min-h-[20px] text-xs" aria-live="polite">
          {activeMsg ? (
            <span className="italic text-primary">{activeMsg}</span>
          ) : (
            <span className="text-muted-foreground">
              Datas riscadas? Callebi tá ocupado com compromissos... etílicos. Toca pra ver o
              motivo.
            </span>
          )}
        </div>
        {errors.data && <p className="mt-1 text-xs text-destructive">{errors.data}</p>}
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">A que horas?</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Antes das 8h o Callebi ainda tá sonhando, depois das 20h ele já tá no bar. Escolha
          sabiamente.
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
