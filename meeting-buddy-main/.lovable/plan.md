# Assistente de Agendamento — Callebi

Aplicativo single-page com wizard de 4 passos. Ao final, abre o WhatsApp `https://wa.me/5511930407700` com a mensagem pré-preenchida.

## Design

- Estilo minimalista elegante: fundo off-white (`#FAF8F5`), tipografia serif para títulos (Fraunces) + sans-serif para corpo (Inter), acento âmbar quente (`#B8865A`).
- Card central com largura máx. ~640px, sombra suave, cantos arredondados.
- Indicador de progresso (4 etapas) no topo, com bolinhas e linha conectando.
- Transições suaves entre passos.
- Mobile-first responsivo.

## Estrutura de rotas

Tudo em `src/routes/index.tsx` — wizard controlado por estado local (`step` 1–4). Sem necessidade de múltiplas rotas.

## Passos

### Passo 1 — Dados da pessoa
Campos: Nome completo, WhatsApp (máscara `(99) 99999-9999`), Cidade, Nível de proximidade (Select: Família, Amigo(a), Cliente, Parceiro, Trabalho, Outro), Motivo do compromisso (Textarea). Botão **Continuar**.

### Passo 2 — Data e horário
- Calendário (`shadcn/ui Calendar`) com datas bloqueadas: 03, 04, 08, 09, 10, 11 de julho/2026 (também desabilita datas passadas). Dias bloqueados aparecem riscados com tooltip "Indisponível".
- Após selecionar data, mostra grid de horários: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 (botões selecionáveis).
- Botões: **Voltar** | **Continuar**.

### Passo 3 — Informações do compromisso
Campos: Local, Endereço (opcional), Duração prevista (ex: "1 hora"), Quantidade de participantes (número), Observações (textarea). Botões: **Voltar** | **Revisar**.

### Passo 4 — Confirmação
Resumo agrupado em dois blocos (Solicitante / Compromisso) com labels e valores. Botões: **Voltar** | **Enviar Solicitação**.

## Envio WhatsApp

Função monta texto com emojis exatamente no formato pedido, faz `encodeURIComponent`, e abre:
```
https://wa.me/5511930407700?text=<mensagem>
```
Via `window.open(url, "_blank")`.

## Validação

Zod schemas por passo. Campos obrigatórios bloqueiam o botão "Continuar". WhatsApp valida formato BR. Erros inline embaixo de cada campo.

## Datas bloqueadas

Array constante:
```ts
const BLOCKED = ["2026-07-03","2026-07-04","2026-07-08","2026-07-09","2026-07-10","2026-07-11"];
```
Passado para `Calendar` via prop `disabled`.

## Arquivos

- `src/routes/index.tsx` — atualizar com o wizard completo + SEO (title "Agendamento — Callebi").
- `src/components/scheduler/StepIndicator.tsx`
- `src/components/scheduler/StepPersonal.tsx`
- `src/components/scheduler/StepDateTime.tsx`
- `src/components/scheduler/StepDetails.tsx`
- `src/components/scheduler/StepReview.tsx`
- `src/lib/scheduler/types.ts` (schemas Zod + tipo `BookingData`)
- `src/lib/scheduler/whatsapp.ts` (montagem da mensagem + URL)
- `src/styles.css` — tokens de cor (off-white, âmbar) e fonte serif.
- Instalar fontes: `bun add @fontsource/fraunces @fontsource/inter`, importar em `src/router.tsx` ou `__root.tsx`.

## Detalhes técnicos

- shadcn já tem: Calendar, Input, Textarea, Select, Button, Label, Card.
- `date-fns` para formatação `dd/MM/yyyy`.
- Estado do wizard em `useState` no componente Index, passado como props.
- Sem backend / sem Cloud (datas fixas, envio via WhatsApp web).
