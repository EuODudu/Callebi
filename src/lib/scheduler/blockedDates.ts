import { format } from "date-fns";
import { OWNER_NAME } from "./owner";

/** Julho em que o Eduardo está no rodeio (ano da agenda). */
export const RODEIO_YEAR = 2026;

/** Datas bloqueadas (dia do mês em julho) → piada do Callebi. */
const RODEIO_DAYS: Record<number, string> = {
  3: `🤠 ${OWNER_NAME} abrindo o rodeio — chapéu na cabeça, agenda no bolso (vazio).`,
  4: `🐂 Segundo dia de rodeio. O ${OWNER_NAME} jurou que só ia "dar uma olhadinha" na arquibancada.`,
  8: `🎪 Rodeio de novo! O ${OWNER_NAME} tá entre o bar da feira e a fila do churrasco.`,
  9: `🍺 ${OWNER_NAME} no rodeio — hoje a reunião perdeu pro copo de cerveja gelada.`,
  10: `🤠 ${OWNER_NAME} em pleno rodeio. Nem eu consigo puxar ele pro Zap.`,
  11: `🐴 Último dia de rodeio. O ${OWNER_NAME} volta segunda... se não emendar na festa.`,
};

function buildRodeioReasons(): Record<string, string> {
  const reasons: Record<string, string> = {};
  for (const [day, joke] of Object.entries(RODEIO_DAYS)) {
    const key = format(new Date(RODEIO_YEAR, 6, Number(day)), "yyyy-MM-dd");
    reasons[key] = joke;
  }
  return reasons;
}

const RODEIO_REASONS = buildRodeioReasons();

/** Chaves yyyy-MM-dd dos dias de rodeio (3, 4, 8, 9, 10 e 11 de julho). */
export const RODEIO_DATE_KEYS = Object.keys(RODEIO_REASONS);

export function isRodeioDateKey(key: string): boolean {
  return key in RODEIO_REASONS;
}

/** Mapa de datas bloqueadas → motivo engraçado (somente dias de rodeio). */
export function getBlockedDateReasons(): Record<string, string> {
  return RODEIO_REASONS;
}

export function isBlockedDateKey(key: string): boolean {
  return isRodeioDateKey(key);
}

/** Mês padrão do calendário quando o rodeio ainda não passou. */
export function getCalendarDefaultMonth(): Date {
  return new Date(RODEIO_YEAR, 6, 1);
}
