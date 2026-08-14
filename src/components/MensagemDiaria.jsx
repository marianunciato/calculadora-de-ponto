const MENSAGENS = [
  // Motivacional
  { texto: 'Cada hora trabalhada é um passo a mais na sua jornada. 💪', emoji: '🌟' },
  { texto: 'Foco no que você pode controlar. O resto é ruído.', emoji: '🎯' },
  { texto: 'Consistência bate talento quando o talento não é consistente.', emoji: '🔥' },
  { texto: 'Um dia de cada vez. Você está indo bem.', emoji: '✨' },
  { texto: 'O esforço de hoje é o resultado de amanhã.', emoji: '🚀' },
  // Humor
  { texto: 'Café não é vício, é combustível profissional. ☕', emoji: '😄' },
  { texto: 'Reunião que poderia ser e-mail: 0. E-mails que poderiam ser silêncio: muitos.', emoji: '😂' },
  { texto: 'Sexta-feira é só uma teoria até o relógio marcar 18h.', emoji: '😅' },
  { texto: 'Produtividade: fazer parecer que você fez mais do que fez.', emoji: '🤣' },
  { texto: 'O Wi-Fi caiu. Pausa técnica obrigatória. 📡', emoji: '😂' },
  // Produtividade
  { texto: 'Divida tarefas grandes em pequenas. Fica mais fácil de engolir.', emoji: '📋' },
  { texto: 'Pausas curtas aumentam o foco. Você merece 5 minutinhos.', emoji: '⏸️' },
  { texto: 'Priorize o que importa, não o que é urgente.', emoji: '📌' },
  { texto: 'Feito é melhor que perfeito. Entregue, depois melhore.', emoji: '✅' },
  { texto: 'Desligar no fim do dia também faz parte do trabalho.', emoji: '🧘' },
]

function getMensagemDoDia() {
  const dia = new Date().toDateString()
  const seed = [...dia].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return MENSAGENS[seed % MENSAGENS.length]
}

export default function MensagemDiaria() {
  const { texto, emoji } = getMensagemDoDia()
  return (
    <div className="bg-[#161827] rounded-3xl px-6 py-4 w-full max-w-2xl flex items-center gap-4">
      <span className="text-2xl">{emoji}</span>
      <p className="text-sm text-white/60 leading-relaxed">{texto}</p>
    </div>
  )
}
