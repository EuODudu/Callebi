import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import type { BookingState } from "@/lib/scheduler/types";
import { buildWhatsappUrl } from "@/lib/scheduler/whatsapp";
import { clearBookingDraft } from "@/lib/scheduler/draft";
import { useCallebi } from "@/components/scheduler/Callebi";
import { reactToReview, reactToSent } from "@/lib/scheduler/callebi";
import { OWNER_NAME } from "@/lib/scheduler/owner";

type Props = {
  booking: BookingState;
  onBack: () => void;
};

export function StepReview({ booking, onBack }: Props) {
  const { speak } = useCallebi();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    speak(reactToReview());
  }, [speak]);

  const send = () => {
    speak(reactToSent());
    clearBookingDraft();
    const url = buildWhatsappUrl(booking);
    window.open(url, "_blank");
    setConfirmOpen(false);
  };

  const dataStr = booking.dateTime.data
    ? format(booking.dateTime.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "—";

  return (
    <div className="space-y-6">
      <Section title="Solicitante">
        <Row label="Nome" value={booking.personal.nome} />
        <Row label="WhatsApp" value={booking.personal.whatsapp} />
        <Row label="Cidade" value={booking.personal.cidade} />
        <Row label="Proximidade" value={booking.personal.proximidade} />
        <Row label="Motivo" value={booking.personal.motivo} multiline />
      </Section>

      <Section title="Compromisso">
        <Row label="Data" value={dataStr} />
        <Row label="Horário" value={booking.dateTime.horario ?? "—"} />
        <Row
          label="Local"
          value={
            booking.details.local +
            (booking.details.endereco ? ` — ${booking.details.endereco}` : "")
          }
        />
        <Row label="Duração" value={booking.details.duracao} />
        <Row label="Participantes" value={booking.details.participantes} />
        <Row label="Observações" value={booking.details.observacoes || "—"} multiline />
      </Section>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} className="order-2 w-full sm:order-1 sm:w-auto">
          ← Voltar
        </Button>
        <Button
          onClick={() => setConfirmOpen(true)}
          size="lg"
          className="order-1 h-auto min-h-10 w-full whitespace-normal px-4 py-2.5 text-center text-sm leading-snug sm:order-2 sm:h-10 sm:w-auto sm:whitespace-nowrap sm:px-8"
        >
          Mandar pro Zap do {OWNER_NAME} 🚀
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirma o envio?</AlertDialogTitle>
            <AlertDialogDescription>
              Vou abrir o WhatsApp com tudo preenchido pro {OWNER_NAME}. Se tiver errado, corrige
              antes — ele é ocupado demais pra adivinhar. 😏
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Deixa eu revisar</AlertDialogCancel>
            <AlertDialogAction onClick={send}>Manda ver 🥃</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card/50 p-5">
      <h3 className="mb-3 font-serif text-lg font-semibold tracking-tight">{title}</h3>
      <dl className="space-y-2.5">{children}</dl>
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div
      className={
        multiline ? "flex flex-col gap-1" : "flex flex-wrap items-baseline justify-between gap-2"
      }
    >
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
