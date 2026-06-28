const steps = ["Dados", "Data", "Detalhes", "Revisão"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
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
                {label}
              </span>
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