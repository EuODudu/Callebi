// O "cérebro" do Callebi: assistente virtual do Eduardo + falas contextuais.

import { OWNER_NAME } from "./owner";

export type CallebiMood = "neutral" | "happy" | "wink" | "thinking" | "drunk" | "hype" | "sleepy";

export type CallebiLine = { text: string; mood: CallebiMood };

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function firstName(nome: string): string {
  const n = nome.trim().split(/\s+/)[0] ?? "";
  if (!n) return "";
  return n.charAt(0).toUpperCase() + n.slice(1);
}

// ── Saudações por passo ────────────────────────────────────────────────
const greetings: Record<number, readonly CallebiLine[]> = {
  1: [
    {
      text: `Oi! Sou o Callebi, assistente do ${OWNER_NAME}. Ele tá sempre ocupado — trabalhando, bebendo ou no show. Me conta quem é você.`,
      mood: "happy",
    },
    {
      text: `Bem-vindo! ${OWNER_NAME} me contratou pra filtrar a agenda dele. Spoiler: ele quase nunca para.`,
      mood: "wink",
    },
    {
      text: "Modo escuro ligado — clima de after. O Eduardo adora. Bora marcar com ele?",
      mood: "drunk",
    },
  ],
  2: [
    {
      text: `Agora a parte difícil: achar um dia em que o ${OWNER_NAME} NÃO esteja em deadline, bar ou palco.`,
      mood: "wink",
    },
    {
      text: "Escolhe o dia. As datas riscadas? É melhor nem perguntar... mas pode tocar pra saber 😏",
      mood: "drunk",
    },
  ],
  3: [
    {
      text: `Detalhes! Onde, quanto tempo, quanta gente. O ${OWNER_NAME} precisa saber se vale sair do home office.`,
      mood: "happy",
    },
    {
      text: `Quase lá. Me dá os pormenores que eu já aviso o ${OWNER_NAME} — se ele não estiver no meio de um show.`,
      mood: "thinking",
    },
  ],
  4: [
    {
      text: `Olha que beleza ficou. Confere tudo e manda pro Zap — eu repasso pro ${OWNER_NAME}!`,
      mood: "hype",
    },
    {
      text: `Tá pronto! Se algo tiver errado, corrige aí — o ${OWNER_NAME} é ocupado demais pra adivinhar.`,
      mood: "wink",
    },
  ],
};

export function greetingFor(step: number): CallebiLine {
  return pick(greetings[step] ?? greetings[1]);
}

// ── Reações do passo 1 ─────────────────────────────────────────────────
export function reactToNome(nome: string): CallebiLine | null {
  const f = firstName(nome);
  if (f.length < 2) return null;
  return {
    text: pick([
      `Prazer, ${f}! Vou anotar na fila do ${OWNER_NAME}.`,
      `${f}, hein? Já gostei. O ${OWNER_NAME} também vai gostar.`,
      `Fechou, ${f}. Guardanapo mental atualizado.`,
    ]),
    mood: "happy",
  };
}

export function reactToProximidade(value: string): CallebiLine | null {
  const map: Record<string, CallebiLine> = {
    Família: {
      text: `Família do ${OWNER_NAME}? Ele atende VIP — mas não cobra empréstimo na ceia.`,
      mood: "happy",
    },
    "Amigo(a)": {
      text: `Amigo do ${OWNER_NAME}! Ele prioriza quem já pagou a saideira. 🍺`,
      mood: "wink",
    },
    Cliente: {
      text: `Cliente é rei. O ${OWNER_NAME} só precisa encaixar entre reunião e cerveja.`,
      mood: "thinking",
    },
    Parceiro: {
      text: `Parceria! O ${OWNER_NAME} topo quase tudo — menos acordar cedo.`,
      mood: "happy",
    },
    Trabalho: {
      text: `Trabalho sério? O ${OWNER_NAME} vive nisso. Mas cobra happy hour.`,
      mood: "thinking",
    },
    Outro: {
      text: '"Outro"? Adoro um mistério. O Eduardo adora também.',
      mood: "wink",
    },
  };
  return map[value] ?? null;
}

export function reactToMotivo(text: string): CallebiLine | null {
  const t = text.toLowerCase();
  if (t.length < 5) return null;
  if (/cerveja|chopp|bar|boteco|drink|happy|cachaça|vinho|breja/.test(t))
    return {
      text: `Agora falou a língua do ${OWNER_NAME}! 🍻 Ele provavelmente já topa.`,
      mood: "drunk",
    };
  if (/café|cafe|cappuccino/.test(t))
    return {
      text: `Café o ${OWNER_NAME} aceita — entre uma call e outra.`,
      mood: "happy",
    };
  if (/trabalho|reuni|projeto|negóci|negoci|proposta|contrato/.test(t))
    return {
      text: `Coisa séria, hein. O ${OWNER_NAME} vive trabalhando demais — vai encaixar.`,
      mood: "thinking",
    };
  if (/show|palco|música|musica|banda|concerto/.test(t))
    return {
      text: `Show? O ${OWNER_NAME} tá sempre em algum. Bora alinhar horário.`,
      mood: "hype",
    };
  if (/conselho|ajuda|desabaf|terapia|conversa/.test(t))
    return {
      text: `Pode desabafar. Eu filtro; o ${OWNER_NAME} ouve — quando não tá no bar.`,
      mood: "happy",
    };
  return {
    text: pick([
      "Boa! Já tô curioso pro encontro de vocês.",
      `Entendi. Vou tentar encaixar na agenda caótica do ${OWNER_NAME}.`,
      "Anotado com capricho. Continua aí.",
    ]),
    mood: "happy",
  };
}

// ── Reações do passo 2 ─────────────────────────────────────────────────
export function reactToBlockedDate(reason: string): CallebiLine {
  return { text: reason, mood: "drunk" };
}

export function reactToData(): CallebiLine {
  return {
    text: pick([
      `Boa escolha! Nesse dia o ${OWNER_NAME} tá (relativamente) livre.`,
      `Esse dia parece livre no radar dele. Já tô separando a agenda.`,
      "Marcado! Agora só falta a hora — e torcer pra ele não surpreender.",
    ]),
    mood: "happy",
  };
}

export function reactToHorario(h: string): CallebiLine {
  const hour = Number(h.slice(0, 2));
  if (hour <= 9)
    return {
      text: `${h}?! O ${OWNER_NAME} ainda tá recuperando da noite anterior. Vai precisar de café.`,
      mood: "sleepy",
    };
  if (hour >= 19)
    return {
      text: `${h} — horário nobre. O ${OWNER_NAME} já pode estar no bar ou no after do show. 😏`,
      mood: "drunk",
    };
  if (hour >= 13 && hour < 15)
    return {
      text: `${h}, hora do almoço! O ${OWNER_NAME} aceita — se tiver comida decente.`,
      mood: "happy",
    };
  return {
    text: `${h} tá ótimo. Anotado na agenda oficial do ${OWNER_NAME}.`,
    mood: "happy",
  };
}

// ── Reações do passo 3 ─────────────────────────────────────────────────
export function reactToLocal(local: string): CallebiLine | null {
  const t = local.toLowerCase();
  if (t.length < 2) return null;
  if (/bar|boteco|pub|cervej|botequim/.test(t))
    return {
      text: `BAR? 🍻 O ${OWNER_NAME} aparece em 5 minutos. Conta como milagre.`,
      mood: "drunk",
    };
  if (/café|cafe|padaria/.test(t))
    return {
      text: `Café combina — o ${OWNER_NAME} às vezes finge que é sóbrio.`,
      mood: "wink",
    };
  if (/escritório|escritorio|office|sala/.test(t))
    return {
      text: `Escritório... o ${OWNER_NAME} vive lá. Mas leva café decente.`,
      mood: "thinking",
    };
  if (/show|palco|arena|teatro|estádio|estadio/.test(t))
    return {
      text: `Show? Clássico do ${OWNER_NAME}. Já tô avisando que ele pode chegar atrasado.`,
      mood: "hype",
    };
  return { text: "Lugar anotado. Já imagino o Eduardo aparecendo (ou não).", mood: "happy" };
}

export function reactToParticipantes(n: number): CallebiLine | null {
  if (!Number.isFinite(n) || n < 1) return null;
  if (n === 1)
    return {
      text: `Só vocês dois com o ${OWNER_NAME}? Que íntimo. 👀`,
      mood: "wink",
    };
  if (n <= 5)
    return {
      text: "Turma boa! O Eduardo aguenta mesa média — se não tiver reunião no meio.",
      mood: "happy",
    };
  return {
    text: `Eita, quase um show. O ${OWNER_NAME} vai precisar de agenda dupla.`,
    mood: "hype",
  };
}

// ── Reação do passo 4 ──────────────────────────────────────────────────
export function reactToReview(): CallebiLine {
  return {
    text: pick([
      `Ficou impecável. Manda ver que eu repasso pro ${OWNER_NAME}!`,
      "Tá tudo certo. Aperta o botão e eu abro o Zap pra você.",
      `Pronto pra decolar. O ${OWNER_NAME} (talvez) responde rápido. 🚀`,
    ]),
    mood: "hype",
  };
}

export function reactToSent(): CallebiLine {
  return {
    text: pick([
      `Mandado! Abri o WhatsApp. Se o ${OWNER_NAME} sumir, tá trabalhando, bebendo ou no show. 🍻`,
      `Enviado! Agora é com o ${OWNER_NAME} — eu só sou o assistente bonito.`,
      `Pronto! O ${OWNER_NAME} deve responder... quando sair do deadline.`,
    ]),
    mood: "drunk",
  };
}

// ── Conversa fiada quando o usuário some ───────────────────────────────
const idleLines: readonly CallebiLine[] = [
  {
    text: `Ainda por aí? Sem pressa... o ${OWNER_NAME} também nunca para.`,
    mood: "neutral",
  },
  {
    text: `Tô aqui esperando. O ${OWNER_NAME} tá numa call — ou num bar, difícil saber.`,
    mood: "thinking",
  },
  { text: "Cochilei? Não... só descansando os olhos. Continua aí.", mood: "sleepy" },
  { text: "Psiu! Não me deixa falando sozinho.", mood: "wink" },
  {
    text: `Enquanto isso o ${OWNER_NAME} deve estar em algum show. Segue preenchendo.`,
    mood: "hype",
  },
  { text: "No escuro eu brilho menos, mas organizo agenda igual. Segue aí.", mood: "wink" },
  {
    text: `Essa penumbra é estilo after do ${OWNER_NAME}. Gostou?`,
    mood: "drunk",
  },
];

export function idleLine(): CallebiLine {
  return pick(idleLines);
}

// ── Quando o usuário clica no mascote ────────────────────────────────────
const pokeLines: readonly CallebiLine[] = [
  { text: "Ei! Cuidado com o chapéu — herança de família, viu?", mood: "wink" },
  {
    text: `Clica de novo e eu conto onde o ${OWNER_NAME} tá bebendo hoje.`,
    mood: "drunk",
  },
  {
    text: `Tô trabalhando aqui! Organizando a vida do ${OWNER_NAME}. Ele que tá na farra.`,
    mood: "happy",
  },
  {
    text: `Curioso, hein? Foca no formulário — o ${OWNER_NAME} agradece.`,
    mood: "thinking",
  },
  { text: "AAAA! Assustou o Callebi! ...Brincadeira, eu sou casca grossa.", mood: "hype" },
  {
    text: `Se continuar clicando eu te coloco atrás do ${OWNER_NAME} na fila do boteco.`,
    mood: "wink",
  },
  { text: "Isso aí é carinho ou você tá testando se eu sou real?", mood: "happy" },
  {
    text: `Mais um clique e eu conto quantos shows o ${OWNER_NAME} tem esse mês.`,
    mood: "drunk",
  },
  { text: "No escuro eu pareço mais misterioso. Ou assistente cansado. Tanto faz.", mood: "wink" },
];

export function pokeLine(): CallebiLine {
  return pick(pokeLines);
}

const hoverLines: readonly CallebiLine[] = [
  { text: "Opa, chegou perto! Não cheira meu copo, por favor.", mood: "wink" },
  {
    text: `E aí! Quer marcar com o ${OWNER_NAME}? Bora pro próximo passo.`,
    mood: "happy",
  },
  {
    text: `Só o hálito de uísque — culpa do ${OWNER_NAME}, não minha. Continua aí.`,
    mood: "drunk",
  },
];

export function hoverLine(): CallebiLine {
  return pick(hoverLines);
}

// ── Reações a erros de validação ─────────────────────────────────────────
export function reactToValidationErrors(errors: Record<string, string>): CallebiLine {
  const field = Object.keys(errors)[0];
  const byField: Record<string, CallebiLine> = {
    nome: { text: "Sem nome eu não te chamo de nada... preenche aí!", mood: "wink" },
    whatsapp: { text: "Esse Zap tá torto. Formato: (11) 99999-9999", mood: "thinking" },
    cidade: { text: "Preciso saber de onde você fala — GPS não lê mente.", mood: "thinking" },
    proximidade: { text: "Qual é a relação de vocês com o Eduardo?", mood: "wink" },
    motivo: {
      text: `Conta o motivo — o ${OWNER_NAME} precisa saber se vale sair do trabalho.`,
      mood: "happy",
    },
    data: {
      text: `Ô, escolhe uma data livre! Nessa o ${OWNER_NAME} tá ocupado demais.`,
      mood: "drunk",
    },
    horario: { text: "Falta o horário! Não vou adivinhar que horas você quer.", mood: "sleepy" },
    local: {
      text: `Sem local o ${OWNER_NAME} para no primeiro bar que aparecer.`,
      mood: "drunk",
    },
    duracao: { text: "Quanto tempo vai durar? 5 min ou até o Eduardo sumir pro show?", mood: "thinking" },
    participantes: {
      text: "Quantas pessoas? Sozinho com o Eduardo eu desconfio 👀",
      mood: "wink",
    },
  };
  return (
    (field && byField[field]) ?? {
      text: "Tem campos pendentes. Revisa com carinho!",
      mood: "happy",
    }
  );
}

// ── Pose do mascote por passo do wizard ─────────────────────────────────
export type CallebiPose = "wave" | "calendar" | "notes" | "cheers";

export function poseForStep(step: number): CallebiPose {
  if (step === 2) return "calendar";
  if (step === 3) return "notes";
  if (step === 4) return "cheers";
  return "wave";
}

// ── Modo escuro / claro ──────────────────────────────────────────────────
const darkModeLines: readonly CallebiLine[] = [
  {
    text: `Pronto! Clima de boteco fechado — estilo ${OWNER_NAME} depois do show.`,
    mood: "drunk",
  },
  { text: "Escureci tudo. Luz forte é coisa de quem acordou cedo.", mood: "wink" },
  { text: "Modo escuro ativado. O uísque brilha mais, eu também.", mood: "happy" },
];

const lightModeLines: readonly CallebiLine[] = [
  { text: "UAU, luz! Meus olhos! ...Tá, continua, mas com pena de mim.", mood: "sleepy" },
  {
    text: `Clareou demais. Parece que o ${OWNER_NAME} abriu o notebook às 8h.`,
    mood: "drunk",
  },
  { text: "Modo claro? Tá bom... mas eu vou precisar de óculos escuros.", mood: "wink" },
  { text: "Isso aí me lembra ressaca iluminada. Volta pro escuro quando puder.", mood: "thinking" },
];

export function reactToThemeChange(toDark: boolean): CallebiLine {
  return pick(toDark ? darkModeLines : lightModeLines);
}

export function darkModeWelcome(): CallebiLine {
  return pick(darkModeLines);
}
