import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StepIndicator } from "@/components/scheduler/StepIndicator";
import { StepPersonal } from "@/components/scheduler/StepPersonal";
import { StepDateTime } from "@/components/scheduler/StepDateTime";
import { StepDetails } from "@/components/scheduler/StepDetails";
import { StepReview } from "@/components/scheduler/StepReview";
import { CallebiProvider, CallebiStage, useCallebi } from "@/components/scheduler/Callebi";
import { greetingFor } from "@/lib/scheduler/callebi";
import { initialBooking, type BookingState } from "@/lib/scheduler/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agendamento — Callebi" },
      {
        name: "description",
        content:
          "Agende um compromisso com o Callebi — desde que ele não esteja enchendo a cara, claro.",
      },
      { property: "og:title", content: "Agendamento — Callebi" },
      {
        property: "og:description",
        content: "Marque com o Callebi sem atrapalhar a happy hour dele.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CallebiProvider>
      <Wizard />
    </CallebiProvider>
  );
}

function Wizard() {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const { speak } = useCallebi();

  // O Callebi cumprimenta sempre que o passo muda — é o que o deixa "vivo".
  useEffect(() => {
    speak(greetingFor(step));
  }, [step, speak]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Agenda oficial do
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Callebi 🥃
          </h1>
        </header>

        {/* O Callebi como herói da página: avatar vivo + balão de fala. */}
        <div className="mb-6">
          <CallebiStage />
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <StepIndicator current={step} />

          {step === 1 && (
            <StepPersonal
              data={booking.personal}
              onChange={(personal) => setBooking({ ...booking, personal })}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepDateTime
              data={booking.dateTime}
              onChange={(dateTime) => setBooking({ ...booking, dateTime })}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepDetails
              data={booking.details}
              onChange={(details) => setBooking({ ...booking, details })}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && <StepReview booking={booking} onBack={() => setStep(3)} />}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ao enviar, cai direto no meu Zap. Se eu demorar pra responder, é porque tô honrando algum
          compromisso etílico. 🍻
        </p>
      </div>
    </main>
  );
}
