import { useId } from "react";
import type { CallebiMood, CallebiPose } from "@/lib/scheduler/callebi";

export type MascotProps = {
  mood: CallebiMood;
  pose: CallebiPose;
  blinking: boolean;
  waving: boolean;
  poking: boolean;
};

function Eyes({ mood, blinking, iris, white }: { mood: CallebiMood; blinking: boolean; iris: string; white: string }) {
  if (blinking) {
    return (
      <>
        <path d="M58 78 Q68 84 78 78" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M88 78 Q98 84 108 78" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
      </>
    );
  }

  switch (mood) {
    case "wink":
      return (
        <>
          <path d="M58 78 Q68 70 78 78" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
          <ellipse cx="98" cy="78" rx="7" ry="8" fill={white} />
          <circle cx="99" cy="79" r="4.2" fill={iris} />
          <circle cx="101" cy="76.5" r="1.6" fill={white} />
        </>
      );
    case "drunk":
      return (
        <>
          <path d="M56 74 L72 86 M72 74 L56 86" stroke={iris} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M86 74 L102 86 M102 74 L86 86" stroke={iris} strokeWidth="2.4" strokeLinecap="round" />
        </>
      );
    case "sleepy":
      return (
        <>
          <path d="M58 80 Q68 84 78 80" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M88 80 Q98 84 108 80" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
          <text x="118" y="72" fill={iris} fontSize="11" opacity="0.35" fontWeight="600">
            z
          </text>
          <text x="126" y="66" fill={iris} fontSize="9" opacity="0.25" fontWeight="600">
            z
          </text>
        </>
      );
    case "thinking":
      return (
        <>
          <ellipse cx="68" cy="78" rx="7" ry="8" fill={white} />
          <ellipse cx="98" cy="78" rx="7" ry="8" fill={white} />
          <circle cx="69" cy="79" r="4" fill={iris} />
          <circle cx="97" cy="79" r="4" fill={iris} />
        </>
      );
    case "hype":
      return (
        <>
          <path d="M58 82 Q68 66 78 82" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M88 82 Q98 66 108 82" fill="none" stroke={iris} strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="52" cy="68" r="2" fill="#fbbf24" className="callebi-sparkle" />
          <circle cx="116" cy="67" r="2.2" fill="#fbbf24" className="callebi-sparkle" style={{ animationDelay: "0.25s" }} />
        </>
      );
    default:
      return (
        <>
          <ellipse cx="68" cy="78" rx="7" ry="8" fill={white} />
          <ellipse cx="98" cy="78" rx="7" ry="8" fill={white} />
          <circle cx="69" cy="79" r="4.2" fill={iris} />
          <circle cx="99" cy="79" r="4.2" fill={iris} />
          <circle cx="71" cy="76.5" r="1.8" fill={white} />
          <circle cx="101" cy="76.5" r="1.8" fill={white} />
        </>
      );
  }
}

function Mouth({ mood }: { mood: CallebiMood }) {
  switch (mood) {
    case "hype":
      return (
        <>
          <path
            d="M72 94 Q83 106 94 94 Q83 100 72 94 Z"
            fill="#5c2e18"
            stroke="#3f1f10"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M76 96 Q83 99 90 96" fill="none" stroke="#fca5a5" strokeWidth="1.2" opacity="0.6" />
        </>
      );
    case "drunk":
      return (
        <path
          d="M74 95 Q83 102 92 95 Q83 90 74 95"
          fill="none"
          stroke="#5c2e18"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      );
    case "thinking":
      return <circle cx="83" cy="96" r="3.5" fill="none" stroke="#5c2e18" strokeWidth="2.2" />;
    case "sleepy":
      return <path d="M76 96 H90" stroke="#5c2e18" strokeWidth="2.6" strokeLinecap="round" />;
    case "wink":
      return (
        <path
          d="M73 94 Q83 104 93 94"
          fill="none"
          stroke="#5c2e18"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <>
          <path
            d="M73 94 Q83 102 93 94"
            fill="none"
            stroke="#5c2e18"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path d="M76 95 Q83 98 90 95" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.45" />
        </>
      );
  }
}

function Eyebrows({ mood }: { mood: CallebiMood }) {
  const brow = "#3f2518";
  if (mood === "drunk")
    return (
      <>
        <path d="M56 66 Q68 60 80 66" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M86 66 Q98 62 110 66" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
      </>
    );
  if (mood === "hype")
    return (
      <>
        <path d="M56 64 Q68 54 80 62" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M86 62 Q98 54 110 64" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
      </>
    );
  if (mood === "thinking")
    return (
      <>
        <path d="M58 67 Q68 62 78 67" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M88 64 Q98 68 108 64" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
      </>
    );
  return (
    <>
      <path d="M58 67 Q68 61 78 67" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M88 67 Q98 61 108 67" fill="none" stroke={brow} strokeWidth="2.6" strokeLinecap="round" />
    </>
  );
}

function WhiskeyGlass({ id }: { id: string }) {
  return (
    <g>
      <path
        d="M122 98 L142 98 L138 128 Q130 131 122 128 Z"
        fill={`url(#${id}-glass)`}
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M124 104 H140 L137.5 122 H126.5 Z" fill={`url(#${id}-whiskey)`} />
      <rect x="127" y="106" width="4" height="4" rx="1" fill="#fff" opacity="0.55" transform="rotate(12 129 108)" />
      <rect x="134" y="110" width="3.5" height="3.5" rx="0.8" fill="#fff" opacity="0.4" transform="rotate(-8 135.5 111.5)" />
      <ellipse cx="132" cy="104" rx="8" ry="2" fill="#fff" opacity="0.22" />
      <path d="M124 98 H140" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="136" cy="101" r="1.2" fill="#fff" opacity="0.65" />
    </g>
  );
}

function LeftArm({
  pose,
  waving,
  skinId,
}: {
  pose: CallebiPose;
  waving: boolean;
  skinId: string;
}) {
  if (pose === "calendar") {
    return (
      <g>
        <path
          d="M42 122 Q28 120 22 132 Q26 140 36 134 Q40 128 44 126"
          fill={`url(#${skinId}-skin)`}
          stroke="#b8734a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <rect x="8" y="118" width="20" height="22" rx="2" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={11 + col * 5}
              y={122 + row * 5}
              width="3.5"
              height="3.5"
              rx="0.5"
              fill={row === 0 && col === 1 ? "#f59e0b" : "#fde68a"}
            />
          )),
        )}
      </g>
    );
  }

  if (pose === "notes") {
    return (
      <g>
        <path
          d="M40 124 Q24 122 18 134 Q24 142 34 136 Q38 130 42 126"
          fill={`url(#${skinId}-skin)`}
          stroke="#b8734a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <rect x="4" y="120" width="18" height="24" rx="2" fill="#fef3c7" stroke="#ca8a04" strokeWidth="1" />
        <path d="M7 126 H19 M7 131 H17 M7 136 H19" stroke="#ca8a04" strokeWidth="1" opacity="0.6" />
        <path d="M20 128 L24 132 L20 136" fill="none" stroke="#57534e" strokeWidth="1.2" />
      </g>
    );
  }

  if (pose === "cheers") {
    return (
      <path
        d="M38 118 Q20 100 28 82 Q36 78 42 88 Q40 104 44 118"
        fill={`url(#${skinId}-skin)`}
        stroke="#b8734a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    );
  }

  return (
    <g className={waving ? "callebi-wave-arm" : undefined}>
      <path
        d="M42 122 Q18 118 14 138 Q20 146 32 138 Q36 128 44 126"
        fill={`url(#${skinId}-skin)`}
        stroke="#b8734a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="140" r="7" fill={`url(#${skinId}-skin)`} stroke="#b8734a" strokeWidth="1" />
      <ellipse cx="16" cy="139" rx="2" ry="1.2" fill="#fca5a5" opacity="0.35" />
    </g>
  );
}

function RightArm({
  pose,
  tipsy,
  skinId,
}: {
  pose: CallebiPose;
  tipsy: boolean;
  skinId: string;
}) {
  if (pose === "cheers") {
    return (
      <g className={tipsy ? "callebi-swirl" : undefined}>
        <path
          d="M118 118 Q132 96 118 78 Q108 72 102 86 Q108 102 116 118"
          fill={`url(#${skinId}-skin)`}
          stroke="#b8734a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <g transform="translate(-8, -18)">
          <WhiskeyGlass id={skinId} />
        </g>
      </g>
    );
  }

  return (
    <g className={tipsy ? "callebi-swirl" : undefined}>
      <path
        d="M118 122 Q138 118 144 132 Q138 142 126 136 Q120 128 116 124"
        fill={`url(#${skinId}-skin)`}
        stroke="#b8734a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="142" cy="134" r="7" fill={`url(#${skinId}-skin)`} stroke="#b8734a" strokeWidth="1" />
      <WhiskeyGlass id={skinId} />
    </g>
  );
}

export function CallebiMascot({ mood, pose, blinking, waving, poking }: MascotProps) {
  const rawId = useId().replace(/:/g, "");
  const tipsy = mood === "drunk";
  const hype = mood === "hype";
  const blush = tipsy || hype || mood === "happy" || mood === "wink";

  const motionClass = ["callebi-float", poking && "callebi-poke", hype && "callebi-hype"]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 160 180"
      className={`h-[148px] w-[148px] shrink-0 sm:h-[168px] sm:w-[168px] ${motionClass}`}
      role="img"
      aria-hidden
    >
      <defs>
        <radialGradient id={`${rawId}-halo`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#d97706" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${rawId}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3c89a" />
          <stop offset="55%" stopColor="#e8a86a" />
          <stop offset="100%" stopColor="#c98552" />
        </linearGradient>
        <linearGradient id={`${rawId}-skin-shadow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#7c4a2a" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${rawId}-vest`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id={`${rawId}-shirt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id={`${rawId}-hat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c4033" />
          <stop offset="100%" stopColor="#3f2a22" />
        </linearGradient>
        <linearGradient id={`${rawId}-whiskey`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${rawId}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
        </linearGradient>
        <filter id={`${rawId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#78350f" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* holofote quente atrás do personagem */}
      <ellipse cx="80" cy="92" rx="72" ry="68" fill={`url(#${rawId}-halo)`} />

      <g filter={`url(#${rawId}-shadow)`} style={{ transform: tipsy ? "rotate(-5deg)" : undefined, transformOrigin: "80px 95px" }}>
        {/* sombra no chão */}
        <ellipse cx="80" cy="168" rx="34" ry="5" fill="#78350f" opacity="0.12" />

        {/* pernas */}
        <path d="M64 142 L64 158 Q64 164 70 164 L74 164 Q78 164 78 158 L78 142 Z" fill="#334155" />
        <path d="M82 142 L82 158 Q82 164 88 164 L92 164 Q98 164 98 158 L98 142 Z" fill="#334155" />
        <ellipse cx="71" cy="165" rx="10" ry="4.5" fill="#1e293b" />
        <ellipse cx="89" cy="165" rx="10" ry="4.5" fill="#1e293b" />
        <path d="M66 164 H76" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M84 164 H94" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* corpo — colete de bartender */}
        <path
          d="M44 118 Q80 108 116 118 L122 148 Q80 158 38 148 Z"
          fill={`url(#${rawId}-vest)`}
          stroke="#5c1d0a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M52 118 Q80 114 108 118 L112 148 Q80 152 48 148 Z"
          fill={`url(#${rawId}-shirt)`}
          stroke="#fcd34d"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* colarinho */}
        <path d="M68 118 L80 126 L92 118" fill="#fffbeb" stroke="#fbbf24" strokeWidth="1.2" strokeLinejoin="round" />
        {/* botões dourados */}
        {[124, 132, 140].map((y) => (
          <circle key={y} cx="80" cy={y} r="2.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
        ))}
        {/* gravata borboleta */}
        <path d="M74 126 L80 132 L86 126 L80 138 Z" fill="#b45309" stroke="#92400e" strokeWidth="1" strokeLinejoin="round" />
        <circle cx="80" cy="132" r="2.5" fill="#f59e0b" />

        <LeftArm pose={pose} waving={waving} skinId={rawId} />

        <RightArm pose={pose} tipsy={tipsy} skinId={rawId} />

        {/* pescoço */}
        <rect x="72" y="108" width="16" height="12" rx="5" fill={`url(#${rawId}-skin)`} />

        {/* cabeça */}
        <ellipse cx="83" cy="78" rx="34" ry="36" fill={`url(#${rawId}-skin)`} />
        <ellipse cx="83" cy="78" rx="34" ry="36" fill={`url(#${rawId}-skin-shadow)`} />

        {/* cabelo lateral */}
        <path
          d="M50 72 Q48 88 54 98 Q56 82 58 70 Z"
          fill="#4a2c1a"
          stroke="#3f2518"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <path
          d="M116 72 Q118 88 112 98 Q110 82 108 70 Z"
          fill="#4a2c1a"
          stroke="#3f2518"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* orelhas */}
        <ellipse cx="50" cy="80" rx="5" ry="7" fill={`url(#${rawId}-skin)`} stroke="#b8734a" strokeWidth="0.8" />
        <ellipse cx="116" cy="80" rx="5" ry="7" fill={`url(#${rawId}-skin)`} stroke="#b8734a" strokeWidth="0.8" />

        {/* chapéu fedora */}
        <ellipse cx="83" cy="48" rx="46" ry="7" fill="#2c1810" />
        <path
          d="M48 48 Q83 14 118 48 Q83 38 48 48 Z"
          fill={`url(#${rawId}-hat)`}
          stroke="#2c1810"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="M58 48 H108" stroke="#92400e" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <ellipse cx="83" cy="48" rx="22" ry="4" fill="#000" opacity="0.15" />
        {/* carta na aba do chapéu */}
        <rect x="94" y="36" width="10" height="7" rx="1" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" transform="rotate(18 99 39.5)" />
        <path d="M96 38 H102" stroke="#d97706" strokeWidth="0.8" transform="rotate(18 99 39.5)" />

        {/* nariz */}
        <ellipse cx="79" cy="86" rx="4" ry="3.5" fill="#d4956a" opacity="0.85" />
        <path d="M77 87 Q79 89 81 87" fill="none" stroke="#b8734a" strokeWidth="1" opacity="0.5" />

        {/* bochechas */}
        {blush && (
          <>
            <ellipse cx="58" cy="90" rx="8" ry="5" fill="#fb7185" opacity="0.22" />
            <ellipse cx="108" cy="90" rx="8" ry="5" fill="#fb7185" opacity="0.22" />
          </>
        )}

        <Eyebrows mood={mood} />
        <Eyes mood={mood} blinking={blinking} iris="#3f2518" white="#fffdf8" />
        <Mouth mood={mood} />

        {/* sardas leves — charme */}
        <circle cx="62" cy="84" r="0.9" fill="#b8734a" opacity="0.35" />
        <circle cx="66" cy="88" r="0.7" fill="#b8734a" opacity="0.3" />
        <circle cx="100" cy="85" r="0.8" fill="#b8734a" opacity="0.3" />
      </g>
    </svg>
  );
}
