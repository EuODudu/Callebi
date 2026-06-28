import { addMonths, eachDayOfInterval, format, getDay, startOfDay } from "date-fns";
import { OWNER_NAME } from "./owner";

const FRIDAY_REASONS = [
  `🍸 ${OWNER_NAME} no happy hour sagrado — nem pensa em marcar`,
  `🎤 ${OWNER_NAME} tem show na sexta — palco chama primeiro`,
  `🥃 ${OWNER_NAME} já reservou o banquinho do boteco`,
  `💼 ${OWNER_NAME} fechando sprint e depois cerveja — dia off`,
] as const;

const SATURDAY_REASONS = [
  `🥴 ${OWNER_NAME} se recuperando da ressaca de ontem`,
  `🎪 ${OWNER_NAME} no after do show de sexta`,
  `🛌 ${OWNER_NAME} em modo resgate — só água e remorso`,
] as const;

const EXTRA_REASONS = [
  `🍻 ${OWNER_NAME} bebendo por aí com os amigos`,
  `💻 ${OWNER_NAME} enterrado em deadline até de madrugada`,
  `🎰 ${OWNER_NAME} perdeu no truco e prometeu saideira`,
  `🎤 ${OWNER_NAME} tem ensaio / show surpresa`,
  `✈️ ${OWNER_NAME} viajando a trabalho (ou fingindo que é)`,
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
