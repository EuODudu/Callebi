// O "cérebro" do Callebi: humores + falas contextuais.
// Mantém o tom descontraído e etílico do resto do app, mas sem exagerar.

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
    { text: "E aí! Eu sou o Callebi. Me conta quem é você que eu já vou gostando.", mood: "happy" },
    { text: "Opa! Chegou bem. Bora começar: como é seu nome?", mood: "happy" },
    { text: "Seja bem-vindo à minha agenda particular. Caprichada, né? Vamos lá.", mood: "wink" },
  ],
  2: [
    { text: "Agora a parte difícil: achar um dia em que eu NÃO esteja no bar.", mood: "wink" },
    {
      text: "Escolhe o dia. As datas riscadas? É melhor nem perguntar... mas pode tocar pra saber 😏",
      mood: "drunk",
    },
  ],
  3: [
    { text: "Detalhes! Onde, quanto tempo, quanta gente. Promete que tem petisco?", mood: "happy" },
    {
      text: "Quase lá. Me dá os pormenores que eu já vou ensaiando a desculpa pra chegar atrasado.",
      mood: "thinking",
    },
  ],
  4: [
    { text: "Olha que beleza ficou. Confere tudo e manda ver no meu Zap!", mood: "hype" },
    {
      text: "Tá pronto! Se algo tiver errado, a culpa é sua — eu só conferi de leve 😜",
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
      `Prazer, ${f}! Nome de quem paga a próxima rodada. 🍻`,
      `${f}, hein? Já tô gostando de você.`,
      `Fechou, ${f}. Vou anotar aqui no meu guardanapo mental.`,
    ]),
    mood: "happy",
  };
}

export function reactToProximidade(value: string): CallebiLine | null {
  const map: Record<string, CallebiLine> = {
    Família: { text: "Família é família! Mas não vale cobrar empréstimo na ceia.", mood: "happy" },
    "Amigo(a)": { text: "Amigo de verdade é o que paga a saideira. Anotado. 🍺", mood: "wink" },
    Cliente: { text: "Cliente é rei. Mas o rei aqui bebe primeiro, combinado?", mood: "thinking" },
    Parceiro: { text: "Parceria! Topo quase tudo — menos acordar cedo.", mood: "happy" },
    Trabalho: { text: "Trabalho sério? Tá... mas eu cobro em happy hour.", mood: "thinking" },
    Outro: { text: '"Outro"? Adoro um mistério. Bora descobrir juntos.', mood: "wink" },
  };
  return map[value] ?? null;
}

export function reactToMotivo(text: string): CallebiLine | null {
  const t = text.toLowerCase();
  if (t.length < 5) return null;
  if (/cerveja|chopp|bar|boteco|drink|happy|cachaça|vinho|breja/.test(t))
    return { text: "Agora você falou MINHA língua! 🍻 Tô dentro.", mood: "drunk" };
  if (/café|cafe|cappuccino/.test(t))
    return { text: "Café eu topo. É tipo a versão sóbria do chopp.", mood: "happy" };
  if (/trabalho|reuni|projeto|negóci|negoci|proposta|contrato/.test(t))
    return { text: "Coisa séria, hein. Tá bom, mas com algo pra beliscar.", mood: "thinking" };
  if (/conselho|ajuda|desabaf|terapia|conversa/.test(t))
    return { text: "Pode desabafar. Sou meio bartender nas horas vagas.", mood: "happy" };
  return {
    text: pick([
      "Boa! Já tô curioso pra esse encontro.",
      "Entendi a missão. Pode deixar comigo.",
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
      "Boa escolha! Esse dia eu tô sóbrio (na teoria).",
      "Esse dia tá livre, fechado. Já tô separando a melhor camisa.",
      "Marcado! Agora só falta a hora.",
    ]),
    mood: "happy",
  };
}

export function reactToHorario(h: string): CallebiLine {
  const hour = Number(h.slice(0, 2));
  if (hour <= 9)
    return {
      text: `${h}?! Essa hora eu ainda tô sonhando. Vou precisar de um café gigante.`,
      mood: "sleepy",
    };
  if (hour >= 19) return { text: `${h}, boa — já emenda direto no happy hour. 😏`, mood: "drunk" };
  if (hour >= 13 && hour < 15)
    return { text: `${h}, hora do almoço! Aceito um rodízio sem pestanejar.`, mood: "happy" };
  return { text: `${h} tá ótimo. Anotado na agenda oficial.`, mood: "happy" };
}

// ── Reações do passo 3 ─────────────────────────────────────────────────
export function reactToLocal(local: string): CallebiLine | null {
  const t = local.toLowerCase();
  if (t.length < 2) return null;
  if (/bar|boteco|pub|cervej|botequim/.test(t))
    return { text: "BAR? 🍻 Você definitivamente entende as coisas.", mood: "drunk" };
  if (/café|cafe|padaria/.test(t))
    return { text: "Café é sempre um bom começo. (O fim a gente vê depois.)", mood: "wink" };
  if (/escritório|escritorio|office|sala/.test(t))
    return { text: "Escritório... tá. Mas leva um café decente, por favor.", mood: "thinking" };
  return { text: "Lugar anotado. Já tô imaginando o cenário.", mood: "happy" };
}

export function reactToParticipantes(n: number): CallebiLine | null {
  if (!Number.isFinite(n) || n < 1) return null;
  if (n === 1) return { text: "Só nós dois? Que íntimo. 👀", mood: "wink" };
  if (n <= 5) return { text: "Turma boa! Dá pra dividir a conta numa boa.", mood: "happy" };
  return { text: "Eita, vai ser quase um show. Já reservo a mesa grande.", mood: "hype" };
}

// ── Reação do passo 4 ──────────────────────────────────────────────────
export function reactToReview(): CallebiLine {
  return {
    text: pick([
      "Ficou impecável. Manda ver que eu (provavelmente) respondo rapidinho!",
      "Tá tudo certo. Aperta o botão e me chama no Zap!",
      "Pronto pra decolar. Te espero do outro lado. 🚀",
    ]),
    mood: "hype",
  };
}

export function reactToSent(): CallebiLine {
  return {
    text: "Mandado! Abri o WhatsApp aí pra você. Se eu sumir, é compromisso etílico. 🍻",
    mood: "drunk",
  };
}

// ── Conversa fiada quando o usuário some ───────────────────────────────
const idleLines: readonly CallebiLine[] = [
  { text: "Ainda por aí? Sem pressa... mas o bar fecha 1h. 🍺", mood: "sleepy" },
  { text: "Tô aqui esperando, viu. Pode preencher com calma.", mood: "neutral" },
  { text: "Cochilei? Não, não... só descansando os olhos. Continua aí.", mood: "sleepy" },
  { text: "Psiu! Não me deixa falando sozinho.", mood: "wink" },
  { text: "Tô contando quantas gotas tem no meu copo. Spoiler: poucas.", mood: "drunk" },
];

export function idleLine(): CallebiLine {
  return pick(idleLines);
}

// ── Quando o usuário clica no mascote ────────────────────────────────────
const pokeLines: readonly CallebiLine[] = [
  { text: "Ei! Cuidado com o chapéu — herança de família, viu?", mood: "wink" },
  { text: "Clica de novo e eu cobro entrada na mesa.", mood: "happy" },
  { text: "Tô trabalhando aqui! ...Mentira, tô só bebericando.", mood: "drunk" },
  { text: "Curioso, hein? Foca no formulário que eu foco no uísque.", mood: "thinking" },
  { text: "AAAA! Assustou o Callebi! ...Brincadeira, eu sou casca grossa.", mood: "hype" },
  { text: "Se continuar clicando vou te colocar na fila do boteco.", mood: "wink" },
  { text: "Isso aí é carinho ou você tá testando se eu sou real?", mood: "happy" },
  { text: "Mais um clique e eu conto aquela história do chopp infinito.", mood: "drunk" },
];

export function pokeLine(): CallebiLine {
  return pick(pokeLines);
}

const hoverLines: readonly CallebiLine[] = [
  { text: "Opa, chegou perto! Não cheira meu copo, por favor.", mood: "wink" },
  { text: "E aí, parceiro! Tá precisando de coragem pro próximo passo?", mood: "happy" },
  { text: "Só o hálito de uísque, prometo. Continua aí.", mood: "drunk" },
];

export function hoverLine(): CallebiLine {
  return pick(hoverLines);
}
