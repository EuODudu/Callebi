import { z } from "zod";

export const proximidadeOptions = [
  "Família",
  "Amigo(a)",
  "Cliente",
  "Parceiro",
  "Trabalho",
  "Outro",
] as const;

export const horarios = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "19:00",
  "20:00",
] as const;

export const BLOCKED_DATES = [
  "2026-07-03",
  "2026-07-04",
  "2026-07-08",
  "2026-07-09",
  "2026-07-10",
  "2026-07-11",
];

export const BLOCKED_REASONS: Record<string, string> = {
  "2026-07-03": "🍻 Callebi vai estar enchendo a cara",
  "2026-07-04": "🥴 Callebi se recuperando da ressaca de ontem",
  "2026-07-08": "🍺 Callebi marcou de encher a cara com os amigos",
  "2026-07-09": "🍷 Callebi em sessão intensiva de degustação",
  "2026-07-10": "🍸 Sexta santa: Callebi vai beber até esquecer o nome",
  "2026-07-11": "😵 Callebi tentando lembrar o que aconteceu na sexta",
};

export const personalSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo").max(100),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato: (11) 99999-9999"),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(80),
  proximidade: z.enum(proximidadeOptions, { message: "Selecione uma opção" }),
  motivo: z.string().trim().min(5, "Descreva brevemente o motivo").max(500),
});

export const dateTimeSchema = z.object({
  data: z.date({ message: "Ô, escolhe uma data aí 👀" }),
  horario: z.enum(horarios, { message: "Falta o horário!" }),
});

// O formulário guarda `participantes` como string (vem de um <input>), então
// o schema precisa aceitar string e convertê-la antes de validar como número.
const participantesField = z.preprocess(
  (v) => {
    if (v === "" || v == null) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  },
  z
    .number({ message: "Informe quantas pessoas vão" })
    .int("Sem meio participante, por favor")
    .min(1, "Mínimo 1 participante")
    .max(999, "Calma, no máximo 999"),
);

export const detailsSchema = z.object({
  local: z.string().trim().min(2, "Informe o local").max(120),
  endereco: z.string().trim().max(200, "Endereço muito longo"),
  duracao: z.string().trim().min(1, "Informe a duração").max(50),
  participantes: participantesField,
  observacoes: z.string().trim().max(500, "Observações muito longas"),
});

// Helper compartilhado: transforma os erros do Zod em { campo: mensagem },
// usado igual nos três passos do wizard.
export function collectZodErrors(error: z.ZodError): Record<string, string> {
  const errs: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!(key in errs)) errs[key] = issue.message;
  }
  return errs;
}

export type PersonalData = z.infer<typeof personalSchema>;
export type DateTimeData = { data?: Date; horario?: (typeof horarios)[number] };
export type DetailsData = {
  local: string;
  endereco: string;
  duracao: string;
  participantes: string;
  observacoes: string;
};

export type BookingState = {
  personal: {
    nome: string;
    whatsapp: string;
    cidade: string;
    proximidade: string;
    motivo: string;
  };
  dateTime: DateTimeData;
  details: DetailsData;
};

export const initialBooking: BookingState = {
  personal: { nome: "", whatsapp: "", cidade: "", proximidade: "", motivo: "" },
  dateTime: { data: undefined, horario: undefined },
  details: {
    local: "",
    endereco: "",
    duracao: "",
    participantes: "",
    observacoes: "",
  },
};

export function formatWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
