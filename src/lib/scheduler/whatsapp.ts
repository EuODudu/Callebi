import { format } from "date-fns";
import type { BookingState } from "./types";

const DEFAULT_PHONE = "5511930407700";

function callebiPhone(): string {
  const raw = import.meta.env.VITE_CALLEBI_WHATSAPP?.trim();
  if (!raw) return DEFAULT_PHONE;
  return raw.replace(/\D/g, "");
}

export function buildWhatsappUrl(b: BookingState): string {
  const dataStr = b.dateTime.data ? format(b.dateTime.data, "dd/MM/yyyy") : "";
  const lines = [
    "📅 NOVA SOLICITAÇÃO DE COMPROMISSO",
    "",
    `👤 Nome: ${b.personal.nome}`,
    `📱 WhatsApp: ${b.personal.whatsapp}`,
    `🏙️ Cidade: ${b.personal.cidade}`,
    `🤝 Nível de proximidade: ${b.personal.proximidade}`,
    "",
    "🎯 Motivo:",
    b.personal.motivo,
    "",
    `📆 Data: ${dataStr}`,
    `🕒 Horário: ${b.dateTime.horario ?? ""}`,
    "",
    "📍 Local:",
    b.details.local + (b.details.endereco ? ` — ${b.details.endereco}` : ""),
    "",
    "⏱️ Duração:",
    b.details.duracao,
    "",
    "👥 Participantes:",
    b.details.participantes,
    "",
    "📝 Observações:",
    b.details.observacoes || "—",
    "",
    "Aguardando sua confirmação.",
  ];
  return `https://wa.me/${callebiPhone()}?text=${encodeURIComponent(lines.join("\n"))}`;
}
