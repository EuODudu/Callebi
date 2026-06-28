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
import { idleLine } from "@/lib/scheduler/callebi";

// ─────────────────────────────────────────────────────────────────────────
// Contexto: deixa qualquer passo do wizard "mandar o Callebi falar".
// ─────────────────────────────────────────────────────────────────────────

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
  text: "E aí! Eu sou o Callebi. Bora marcar um compromisso?",
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

  // Conversa fiada se o usuário ficar parado por um tempo.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => speak(idleLine()), 14000);
    return () => window.clearTimeout(t);
  }, [line.id, speak]);

  return <CallebiContext.Provider value={{ line, say, speak }}>{children}</CallebiContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────
// O mascote em SVG — expressões mudam conforme o humor.
// ─────────────────────────────────────────────────────────────────────────

function Eyes({ mood }: { mood: CallebiMood }) {
  const stroke = "var(--color-primary-foreground)";
  switch (mood) {
    case "wink":
      return (
        <>
          <path
            d="M34 44 q5 -5 10 0"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="61" cy="44" r="3.5" fill={stroke} />
        </>
      );
    case "drunk":
      return (
        <>
          <path
            d="M33 41 l11 6 M44 41 l-11 6"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M56 41 l11 6 M67 41 l-11 6"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      );
    case "sleepy":
      return (
        <>
          <path
            d="M34 45 q5 3 10 0"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M56 45 q5 3 10 0"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      );
    case "thinking":
      return (
        <>
          <circle cx="40" cy="42" r="3.5" fill={stroke} />
          <circle cx="62" cy="42" r="3.5" fill={stroke} />
        </>
      );
    case "hype":
      return (
        <>
          <path
            d="M34 46 q5 -8 10 0"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M56 46 q5 -8 10 0"
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return (
        <>
          <circle cx="39" cy="44" r="3.8" fill={stroke} />
          <circle cx="61" cy="44" r="3.8" fill={stroke} />
        </>
      );
  }
}

function Mouth({ mood }: { mood: CallebiMood }) {
  const stroke = "var(--color-primary-foreground)";
  switch (mood) {
    case "hype":
      return (
        <path
          d="M40 56 q10 14 20 0 q-10 6 -20 0"
          fill={stroke}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "drunk":
      return (
        <path
          d="M40 57 q5 6 10 0 q5 -6 10 0"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case "thinking":
      return <circle cx="50" cy="58" r="3.5" fill="none" stroke={stroke} strokeWidth="3" />;
    case "sleepy":
      return (
        <path d="M44 58 h12" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      );
    case "wink":
      return (
        <path
          d="M40 56 q10 9 20 0"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M41 56 q9 8 18 0"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
  }
}

function CallebiAvatar({ mood }: { mood: CallebiMood }) {
  const tipsy = mood === "drunk";
  return (
    <svg
      viewBox="0 0 100 110"
      className="callebi-bob h-20 w-20 shrink-0 sm:h-24 sm:w-24"
      role="img"
      aria-label="Callebi, seu assistente de agendamento"
    >
      {/* chapeuzinho boêmio */}
      <path d="M28 30 q22 -16 44 0 q-22 -7 -44 0 Z" fill="var(--color-primary)" opacity="0.9" />
      <ellipse cx="50" cy="31" rx="24" ry="4" fill="var(--color-primary)" opacity="0.5" />
      {/* cabeça */}
      <circle cx="50" cy="50" r="27" fill="var(--color-primary)" />
      {/* bochechas coradas quando alegrinho */}
      {(tipsy || mood === "hype") && (
        <>
          <circle cx="33" cy="55" r="5" fill="var(--color-destructive)" opacity="0.35" />
          <circle cx="67" cy="55" r="5" fill="var(--color-destructive)" opacity="0.35" />
        </>
      )}
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      {/* copo de uísque na "mão" */}
      <g className={tipsy ? "callebi-swirl" : undefined} style={{ transformOrigin: "78px 78px" }}>
        <path
          d="M70 70 h16 l-2 14 h-12 Z"
          fill="var(--color-card)"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M71.5 77 h13 l-1 7 h-11 Z" fill="var(--color-primary)" opacity="0.85" />
        <circle cx="78" cy="80" r="1.6" fill="var(--color-card)" opacity="0.7" />
      </g>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .callebi-bob { animation: callebi-bob 4s ease-in-out infinite; }
          .callebi-swirl { animation: callebi-swirl 1.6s ease-in-out infinite; }
        }
        @keyframes callebi-bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes callebi-swirl {
          0%,100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
      `}</style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// O palco: avatar + balão com efeito de digitação.
// ─────────────────────────────────────────────────────────────────────────

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CallebiStage() {
  const { line } = useCallebi();
  const [shown, setShown] = useState(line.text);

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
    }, 22);
    return () => window.clearInterval(id);
  }, [line.id, line.text]);

  const typing = shown.length < line.text.length;

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <CallebiAvatar mood={line.mood} />
      <div
        key={line.id}
        className="callebi-pop relative mt-2 max-w-md flex-1 rounded-2xl rounded-tl-sm border bg-card px-4 py-3 text-left shadow-sm"
      >
        {/* rabicho do balão apontando pro Callebi */}
        <span
          className="absolute -left-2 top-3 h-3 w-3 rotate-45 border-b border-l bg-card"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-card-foreground sm:text-base" aria-live="polite">
          {shown}
          {typing && <span className="callebi-caret">▌</span>}
        </p>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .callebi-pop { animation: callebi-pop 0.32s ease-out; }
            .callebi-caret { animation: callebi-blink 0.8s step-end infinite; }
          }
          @keyframes callebi-pop {
            0% { opacity: 0; transform: translateY(6px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes callebi-blink { 50% { opacity: 0; } }
          .callebi-caret { margin-left: 1px; color: var(--color-primary); }
        `}</style>
      </div>
    </div>
  );
}
