import { addMonths, eachDayOfInterval, format, getDay, startOfDay } from "date-fns";

const FRIDAY_REASONS = [
  "🍸 Sexta santa: Callebi vai beber até esquecer o nome",
  "🍺 Happy hour sagrado — nem pensa em marcar",
  "🥃 Callebi já reservou o banquinho do boteco",
  "🍷 Sexta é dia de degustação intensiva (de cachaça)",
] as const;

const SATURDAY_REASONS = [
  "🥴 Callebi se recuperando da ressaca de ontem",
  "😵 Callebi tentando lembrar o que aconteceu na sexta",
  "🛌 Sábado de resgate — só água e remorso",
] as const;

const EXTRA_REASONS = [
  "🍻 Callebi marcou de encher a cara com os amigos",
  "🎰 Callebi perdeu no truco e prometeu saideira",
  "🎤 Callebi tem karaokê etílico agendado",
] as const;

function buildBlockedReasons(): Record<string, string> {
  const start = startOfDay(new Date());
  const end = addMonths(start, 6);
  const reasons: Record<string, string> = {};
  let fridayIndex = 0;
  let saturdayIndex = 0;

  for (const day of eachDayOfInterval({ start, end })) {
    const key = format(day, "yyyy-MM-dd");
    const dow = getDay(day);

    if (dow === 5) {
      reasons[key] = FRIDAY_REASONS[fridayIndex % FRIDAY_REASONS.length];
      fridayIndex += 1;
    } else if (dow === 6) {
      reasons[key] = SATURDAY_REASONS[saturdayIndex % SATURDAY_REASONS.length];
      saturdayIndex += 1;
    }
  }

  // Alguns dias aleatórios extras (determinísticos por mês) para surpresa.
  for (let m = 0; m < 6; m++) {
    const anchor = addMonths(start, m);
    const extraDay = 10 + (anchor.getMonth() % 5);
    const extra = new Date(anchor.getFullYear(), anchor.getMonth(), extraDay);
    if (extra >= start && extra <= end && getDay(extra) !== 5 && getDay(extra) !== 6) {
      const key = format(extra, "yyyy-MM-dd");
      reasons[key] = EXTRA_REASONS[m % EXTRA_REASONS.length];
    }
  }

  return reasons;
}

let cache: { day: string; reasons: Record<string, string> } | null = null;

/** Mapa de datas bloqueadas (yyyy-MM-dd) → motivo engraçado. Atualiza 1x por dia. */
export function getBlockedDateReasons(): Record<string, string> {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  if (cache?.day === todayKey) return cache.reasons;
  const reasons = buildBlockedReasons();
  cache = { day: todayKey, reasons };
  return reasons;
}

export function isBlockedDateKey(key: string): boolean {
  return key in getBlockedDateReasons();
}
