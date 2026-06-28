import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StepIndicator } from "@/components/scheduler/StepIndicator";
import { StepPersonal } from "@/components/scheduler/StepPersonal";
import { StepDateTime } from "@/components/scheduler/StepDateTime";
import { StepDetails } from "@/components/scheduler/StepDetails";
import { StepReview } from "@/components/scheduler/StepReview";
import { CallebiProvider, CallebiStage, useCallebi } from "@/components/scheduler/Callebi";
import { greetingFor } from "@/lib/scheduler/callebi";
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
  hasDraftContent,
} from "@/lib/scheduler/draft";
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
  const [draftLoaded, setDraftLoaded] = useState(false);
  const { speak } = useCallebi();

  useEffect(() => {
    const draft = loadBookingDraft();
    if (draft) {
      setStep(Math.min(Math.max(draft.step, 1), 4));
      setBooking(draft.booking);
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    saveBookingDraft(step, booking);
  }, [step, booking, draftLoaded]);

  useEffect(() => {
    if (!draftLoaded) return;
    speak(greetingFor(step));
  }, [step, speak, draftLoaded]);

  const resetDraft = () => {
    setStep(1);
    setBooking(initialBooking);
    clearBookingDraft();
    speak({ text: "Rascunho apagado. Bora começar do zero!", mood: "wink" });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center lg:mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Agenda oficial do
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Callebi 🥃
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Marca um horário comigo — prometo tentar não chegar bêbado. Tentar.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(260px,320px)_1fr] lg:gap-8">
          <aside className="callebi-sticky z-20 lg:max-w-sm">
            <CallebiStage step={step} layout="sidebar" />
          </aside>

          <div className="min-w-0">
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <StepIndicator current={step} />

              <div key={step} className="animate-in fade-in slide-in-from-right-3 duration-300">
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
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 lg:items-start">
              <p className="text-center text-xs text-muted-foreground lg:text-left">
                Ao enviar, cai direto no meu Zap. Se eu demorar pra responder, é porque tô honrando
                algum compromisso etílico. 🍻
              </p>
              {hasDraftContent(booking) && (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Limpar rascunho salvo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
