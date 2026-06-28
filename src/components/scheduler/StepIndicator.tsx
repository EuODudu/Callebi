const steps = [
  { label: "Quem é você?", short: "Você" },
  { label: "Quando?", short: "Data" },
  { label: "Onde e quantos?", short: "Detalhes" },
  { label: "Bora pro Zap?", short: "Revisão" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-2">
      {steps.map((step, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={step.short} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : done
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground",
                ].join(" ")}
              >
                {n}
              </div>
              <span
                className={[
                  "hidden text-[11px] sm:block",
                  active ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {step.short}
              </span>
              <span className="hidden text-[10px] text-muted-foreground/80 md:block">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  "mb-5 h-px flex-1 transition-colors",
                  done ? "bg-primary" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}