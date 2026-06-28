import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CallebiLine, CallebiMood } from "@/lib/scheduler/callebi";
import { hoverLine, idleLine, pokeLine } from "@/lib/scheduler/callebi";
import { CallebiMascot } from "@/components/scheduler/CallebiMascot";

type SpokenLine = CallebiLine & { id: number };

type CallebiApi = {
  line: SpokenLine;
  say: (text: string, mood?: CallebiMood) => void;
  speak: (line: CallebiLine) => void;
};

const CallebiContext = createContext<CallebiApi | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useCallebi(): CallebiApi {
  const ctx = useContext(CallebiContext);
  if (!ctx) throw new Error("useCallebi precisa estar dentro de <CallebiProvider>");
  return ctx;
}

const FIRST_LINE: SpokenLine = {
  id: 0,
  text: "E aí! Eu sou o Callebi — anfitrião da casa e especialista em uísque. Clica em mim se quiser papo.",
  mood: "happy",
};

export function CallebiProvider({ children }: { children: ReactNode }) {
  const [line, setLine] = useState<SpokenLine>(FIRST_LINE);
  const counter = useRef(0);

  const speak = useCallback((next: CallebiLine) => {
    counter.current += 1;
    setLine({ ...next, id: counter.current });
  }, []);

  const say = useCallback(
    (text: string, mood: CallebiMood = "happy") => speak({ text, mood }),
    [speak],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => speak(idleLine()), 14000);
    return () => window.clearTimeout(t);
  }, [line.id, speak]);

  return <CallebiContext.Provider value={{ line, say, speak }}>{children}</CallebiContext.Provider>;
}

const MOOD_LABEL: Record<CallebiMood, string> = {
  happy: "Animado",
  wink: "Misterioso",
  drunk: "Etílico",
  thinking: "Pensativo",
  hype: "Empolgado",
  sleepy: "Cochilando",
  neutral: "De boa",
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CallebiStage() {
  const { line, speak } = useCallebi();
  const [shown, setShown] = useState(line.text);
  const [blinking, setBlinking] = useState(false);
  const [waving, setWaving] = useState(false);
  const [poking, setPoking] = useState(false);
  const hoverSpoke = useRef(false);
  const pokeCount = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(line.text);
      return;
    }
    setShown("");
    let i = 0;
    const full = line.text;
    const id = window.setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [line.id, line.text]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const blink = () => {
      setBlinking(true);
      window.setTimeout(() => setBlinking(false), 140);
    };
    const id = window.setInterval(blink, 3200 + Math.random() * 2000);
    return () => window.clearInterval(id);
  }, []);

  const handlePoke = () => {
    pokeCount.current += 1;
    setPoking(true);
    setWaving(true);
    window.setTimeout(() => setPoking(false), 450);
    window.setTimeout(() => setWaving(false), 1100);

    if (pokeCount.current >= 5) {
      speak({
        text: "Tá viciado em clicar, hein? Vai preencher o form que eu seguro o copo!",
        mood: "drunk",
      });
      pokeCount.current = 0;
      return;
    }
    speak(pokeLine());
  };

  const handleHover = () => {
    setWaving(true);
    window.setTimeout(() => setWaving(false), 1100);
    if (!hoverSpoke.current) {
      hoverSpoke.current = true;
      speak(hoverLine());
    }
  };

  const typing = shown.length < line.text.length;
  const bubbleClass =
    line.mood === "wink"
      ? "callebi-bubble-tilt-wink"
      : line.mood === "drunk"
        ? "callebi-bubble-tilt-drunk"
        : "";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-card to-orange-50/80 p-4 shadow-sm sm:p-6 dark:border-amber-900/40 dark:from-amber-950/30 dark:via-card dark:to-orange-950/20">
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-orange-400/15 blur-2xl"
        aria-hidden
      />

      <p className="relative mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800/70 dark:text-amber-200/70">
        Bartender oficial · clique no Callebi
      </p>

      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
        <button
          type="button"
          onClick={handlePoke}
          onMouseEnter={handleHover}
          className="group relative shrink-0 rounded-3xl bg-amber-100/50 p-2 outline-none ring-amber-300/0 transition-all hover:scale-[1.02] hover:bg-amber-100/80 hover:ring-4 focus-visible:ring-4 focus-visible:ring-amber-400/40 active:scale-[0.98] dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
          aria-label="Callebi — clique para conversar"
          title="Clica aí, prometo que sou simpático"
        >
          <CallebiMascot mood={line.mood} blinking={blinking} waving={waving} poking={poking} />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-700 px-2.5 py-0.5 text-[10px] font-bold text-amber-50 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            Clica! 🥃
          </span>
        </button>

        <div
          key={line.id}
          className={`callebi-pop relative w-full max-w-md flex-1 rounded-2xl rounded-tl-lg border border-amber-200/80 bg-card/95 px-4 py-3.5 text-left shadow-lg backdrop-blur-sm sm:mt-3 ${bubbleClass}`}
        >
          <span
            className="absolute -left-2 top-5 hidden h-4 w-4 rotate-45 border-b border-l border-amber-200/80 bg-card/95 sm:block"
            aria-hidden
          />
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
              {MOOD_LABEL[line.mood]}
            </span>
            <span className="text-xs text-muted-foreground">Callebi diz:</span>
          </div>
          <p className="text-sm leading-relaxed text-card-foreground sm:text-[15px]" aria-live="polite">
            {shown}
            {typing && <span className="callebi-caret text-amber-600">▌</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
