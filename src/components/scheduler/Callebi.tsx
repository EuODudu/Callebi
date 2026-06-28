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
  text: "E aí! Eu sou o Callebi — mestre da agenda e da saideira. Clica em mim se quiser papo.",
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

// ── Expressões faciais ───────────────────────────────────────────────────

function Eyes({ mood, blinking }: { mood: CallebiMood; blinking: boolean }) {
  const iris = "#2c1810";
  const white = "#fff8f0";

  if (blinking) {
    return (
      <>
        <path d="M38 46 q6 4 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M62 46 q6 4 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }

  switch (mood) {
    case "wink":
      return (
        <>
          <path d="M38 46 q6 -5 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="68" cy="46" rx="5" ry="6" fill={white} stroke={iris} strokeWidth="1.5" />
          <circle cx="69" cy="47" r="2.8" fill={iris} />
          <circle cx="70.5" cy="45.5" r="1" fill={white} opacity="0.9" />
        </>
      );
    case "drunk":
      return (
        <>
          <path d="M36 43 l14 8 M50 43 l-14 8" stroke={iris} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M58 43 l14 8 M72 43 l-14 8" stroke={iris} strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "sleepy":
      return (
        <>
          <path d="M38 47 q6 3 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 47 q6 3 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
          <text x="78" y="40" fontSize="10" opacity="0.5">
            z
          </text>
        </>
      );
    case "thinking":
      return (
        <>
          <ellipse cx="44" cy="46" rx="5" ry="6" fill={white} stroke={iris} strokeWidth="1.5" />
          <ellipse cx="68" cy="46" rx="5" ry="6" fill={white} stroke={iris} strokeWidth="1.5" />
          <circle cx="45" cy="47" r="2.8" fill={iris} />
          <circle cx="69" cy="47" r="2.8" fill={iris} />
        </>
      );
    case "hype":
      return (
        <>
          <path d="M38 48 q6 -9 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 48 q6 -9 12 0" fill="none" stroke={iris} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="44" cy="42" r="1.5" fill="#fbbf24" className="callebi-sparkle" />
          <circle cx="72" cy="41" r="1.2" fill="#fbbf24" className="callebi-sparkle" style={{ animationDelay: "0.3s" }} />
        </>
      );
    default:
      return (
        <>
          <ellipse cx="44" cy="46" rx="5" ry="6" fill={white} stroke={iris} strokeWidth="1.5" />
          <ellipse cx="68" cy="46" rx="5" ry="6" fill={white} stroke={iris} strokeWidth="1.5" />
          <circle cx="45" cy="47" r="2.8" fill={iris} />
          <circle cx="69" cy="47" r="2.8" fill={iris} />
          <circle cx="46.5" cy="45.5" r="1" fill={white} opacity="0.95" />
          <circle cx="70.5" cy="45.5" r="1" fill={white} opacity="0.95" />
        </>
      );
  }
}

function Mouth({ mood }: { mood: CallebiMood }) {
  const lip = "#5c3018";
  switch (mood) {
    case "hype":
      return (
        <ellipse cx="56" cy="62" rx="9" ry="7" fill="#3d1f12" stroke={lip} strokeWidth="1.5" />
      );
    case "drunk":
      return (
        <path
          d="M46 62 q5 5 10 0 q5 -4 10 1"
          fill="none"
          stroke={lip}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    case "thinking":
      return <circle cx="56" cy="62" r="3" fill="none" stroke={lip} strokeWidth="2" />;
    case "sleepy":
      return <path d="M50 62 h12" fill="none" stroke={lip} strokeWidth="2.5" strokeLinecap="round" />;
    case "wink":
      return (
        <path
          d="M47 61 q9 10 18 0"
          fill="none"
          stroke={lip}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M47 61 q9 8 18 0"
          fill="none"
          stroke={lip}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
  }
}

function Eyebrows({ mood }: { mood: CallebiMood }) {
  const brow = "#3d2214";
  const tipsy = mood === "drunk";
  const hype = mood === "hype";
  return (
    <>
      <path
        d={tipsy ? "M36 36 q8 -4 16 2" : hype ? "M36 34 q8 -8 16 -2" : "M36 37 q8 -5 16 0"}
        fill="none"
        stroke={brow}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={tipsy ? "M60 38 q8 -2 16 -4" : hype ? "M60 34 q8 -8 16 -2" : "M60 37 q8 -5 16 0"}
        fill="none"
        stroke={brow}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  );
}

type AvatarProps = {
  mood: CallebiMood;
  blinking: boolean;
  waving: boolean;
  poking: boolean;
};

function CallebiMascot({ mood, blinking, waving, poking }: AvatarProps) {
  const tipsy = mood === "drunk";
  const hype = mood === "hype";

  const motionClass = [
    "callebi-float",
    poking ? "callebi-poke" : "",
    hype ? "callebi-hype" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 120 140"
      className={`h-28 w-28 shrink-0 sm:h-32 sm:w-32 ${motionClass}`}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="callebi-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8b88a" />
          <stop offset="100%" stopColor="#c9855a" />
        </linearGradient>
        <linearGradient id="callebi-shirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a6741" />
          <stop offset="100%" stopColor="#3d5536" />
        </linearGradient>
        <linearGradient id="callebi-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>

      {/* sombra */}
      <ellipse cx="60" cy="134" rx="28" ry="4" fill="#000" opacity="0.08" />

      {/* pernas */}
      <rect x="46" y="108" width="10" height="22" rx="4" fill="#2c3e50" />
      <rect x="64" y="108" width="10" height="22" rx="4" fill="#2c3e50" />
      <ellipse cx="51" cy="131" rx="8" ry="4" fill="#1e293b" />
      <ellipse cx="69" cy="131" rx="8" ry="4" fill="#1e293b" />

      {/* corpo / jaqueta */}
      <path
        d="M34 78 q26 -6 52 0 l8 32 q-34 8 -68 0 Z"
        fill="url(#callebi-shirt)"
        stroke="#2d3f28"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M56 78 v28" stroke="#2d3f28" strokeWidth="1" opacity="0.4" />
      <path
        d="M48 82 h16"
        fill="none"
        stroke="#c9855a"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* braço esquerdo (acenando) */}
      <g className={waving ? "callebi-wave-arm" : undefined}>
        <path
          d="M32 82 q-14 8 -12 22 q8 4 14 -2 q-2 -12 8 -18"
          fill="url(#callebi-skin)"
          stroke="#a66b42"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="104" r="5" fill="url(#callebi-skin)" stroke="#a66b42" strokeWidth="1" />
      </g>

      {/* braço direito + copo */}
      <g className={tipsy ? "callebi-swirl" : undefined}>
        <path
          d="M88 82 q14 6 10 20 q-6 2 -12 0 q4 -10 -6 -18"
          fill="url(#callebi-skin)"
          stroke="#a66b42"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <g>
          <path
            d="M92 88 h18 l-3 20 h-12 Z"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M93.5 96 h15 l-2.5 12 h-10 Z" fill="url(#callebi-liquid)" />
          <ellipse cx="101" cy="96" rx="6" ry="1.5" fill="#fff" opacity="0.25" />
          <circle cx="99" cy="100" r="1.2" fill="#fff" opacity="0.5" />
        </g>
      </g>

      {/* pescoço */}
      <rect x="52" y="68" width="16" height="12" rx="4" fill="url(#callebi-skin)" />

      {/* cabeça */}
      <ellipse cx="60" cy="48" rx="26" ry="28" fill="url(#callebi-skin)" stroke="#a66b42" strokeWidth="1.5" />

      {/* orelhas */}
      <ellipse cx="34" cy="50" rx="4" ry="6" fill="url(#callebi-skin)" stroke="#a66b42" strokeWidth="1" />
      <ellipse cx="86" cy="50" rx="4" ry="6" fill="url(#callebi-skin)" stroke="#a66b42" strokeWidth="1" />

      {/* chapéu fedora */}
      <ellipse cx="60" cy="28" rx="34" ry="6" fill="#3d2914" />
      <path d="M38 28 q22 -22 44 0 q-22 -8 -44 0 Z" fill="#4a3520" stroke="#2c1810" strokeWidth="1" />
      <path d="M48 22 h24" stroke="#6b4f2e" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="60" cy="28" rx="18" ry="3" fill="#2c1810" opacity="0.3" />

      {/* cabelo sob o chapéu */}
      <path d="M38 32 q22 8 44 0" fill="none" stroke="#3d2214" strokeWidth="3" strokeLinecap="round" />

      {/* nariz */}
      <ellipse cx="56" cy="54" rx="3" ry="2.5" fill="#b8734a" opacity="0.7" />

      {/* bochechas */}
      {(tipsy || hype || mood === "happy") && (
        <>
          <circle cx="42" cy="58" r="6" fill="#e87979" opacity="0.35" />
          <circle cx="74" cy="58" r="6" fill="#e87979" opacity="0.35" />
        </>
      )}

      <Eyebrows mood={mood} />
      <Eyes mood={mood} blinking={blinking} />
      <Mouth mood={mood} />

      {/* bigode leve — charme de boteco */}
      <path
        d="M50 57 q6 3 12 0"
        fill="none"
        stroke="#4a3020"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function moodBadge(mood: CallebiMood): string {
  const map: Record<CallebiMood, string> = {
    happy: "😄",
    wink: "😏",
    drunk: "🥃",
    thinking: "🤔",
    hype: "🔥",
    sleepy: "😴",
    neutral: "👋",
  };
  return map[mood];
}

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

  // Piscada automática de tempos em tempos.
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
    <div className="relative rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-amber-500/5 p-4 sm:p-5">
      <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-widest text-primary/70">
        Seu anfitrião oficial (pode clicar nele)
      </p>

      <div className="flex items-start gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handlePoke}
          onMouseEnter={handleHover}
          className="group relative shrink-0 rounded-2xl outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
          aria-label="Callebi — clique para conversar"
          title="Clica aí, não morde"
        >
          <CallebiMascot mood={line.mood} blinking={blinking} waving={waving} poking={poking} />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            Clica! 👆
          </span>
        </button>

        <div
          key={line.id}
          className={`callebi-pop relative mt-1 max-w-md flex-1 rounded-2xl rounded-tl-md border-2 border-primary/20 bg-card px-4 py-3 text-left shadow-md ${bubbleClass}`}
        >
          <span
            className="absolute -left-2.5 top-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-primary/20 bg-card"
            aria-hidden
          />
          <span className="mb-1 inline-block text-lg" aria-hidden>
            {moodBadge(line.mood)}
          </span>
          <p className="text-sm leading-relaxed text-card-foreground sm:text-base" aria-live="polite">
            {shown}
            {typing && <span className="callebi-caret text-primary">▌</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
