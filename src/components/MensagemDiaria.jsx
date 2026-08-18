import React from 'react'

const MENSAGENS = [
	{ texto: 'Acredite no seu potencial, até o CSS obedece (às vezes) se você colocar !important.', emoji: '🌟' },
	{ texto: 'Hoje é um bom dia para corrigir um bug que você achou ontem. Ou não. O importante é que você está tentando.', emoji: '💪' },
	{ texto: 'Se o código não funciona, talvez seja hora de dar uma pausa e voltar com a mente fresca. Ou chamar um colega.', emoji: '☕' },
	{ texto: 'CSS é como uma pintura: às vezes você precisa de mais um tom para deixar tudo perfeito.', emoji: '🎨' },
	{ texto: 'O código limpo é como um jardim bem cuidado: sempre há espaço para mais flores (ou menos bugs).', emoji: '🌱' },
	{ texto: 'Você já parou para pensar que o seu código pode ser lido por outro ser humano? Talvez ele esteja te julgando.', emoji: '🤔' },
	{ texto: 'Quando tudo parece estar errado, lembre-se: até o JavaScript tem seus momentos de "undefined".', emoji: '🤯' },
	{ texto: 'O melhor código é aquele que resolve o problema sem criar novos problemas. E sem deixar comentários de "não sei o que fiz".', emoji: '🎯' },
	{ texto: 'Hoje você vai resolver um bug que te deixou confuso por dias. É só seguir o fluxo do console.', emoji: '🔍' },
	{ texto: 'Se o seu código está parecendo um labirinto, talvez seja hora de refatorar. Ou de pedir ajuda.', emoji: '🧭' },
	{ texto: 'Acredite no seu potencial, até o CSS obedece (às vezes) se você colocar `!important`.', emoji: '🌟' },
	{ texto: 'Produtividade é a fina arte de adiar o pânico até a véspera do prazo. Vai que dá!', emoji: '💪' },
	{ texto: 'Beba água. A não ser que você seja uma planta; aí beba água e vá para o sol. Mas beba água para a mente fluir.', emoji: '☕' },
	{ texto: 'Você não é um bug, é uma *feature* revolucionária e não documentada no sistema do universo. Arrase!', emoji: '🚀' },
	{ texto: 'O verdadeiro segredo da produtividade é começar a tarefa antes que o cérebro perceba que dá preguiça.', emoji: '💡' },
	{ texto: 'Se o plano A falhar, relaxa. O alfabeto tem mais 25 letras e o seu teclado é cheio de atalhos.', emoji: '⌨️' },
	{ texto: 'Foque no progresso, não na perfeição. Até porque trabalho perfeito só existe na cabeça de quem não testa todas as variáveis.', emoji: '🎯' },
	{ texto: 'Você consegue! Se as pessoas conseguem entender a diferença entre `padding` e `margin`, você domina o mundo tranquilamente.', emoji: '💪' },
	{ texto: 'Trabalhe duro hoje para poder pagar os boletos amanhã com um sorriso no rosto (ou pelo menos sem chorar).', emoji: '😊' },
	{ texto: 'A inspiração existe, mas ela precisa te encontrar trabalhando. Ou, no mínimo, com a IDE aberta encarando a tela.', emoji: '💻' },
	{ texto: 'Produtividade não é fazer mil coisas ao mesmo tempo, é escolher com sabedoria qual incêndio apagar primeiro.', emoji: '🔥' },
	{ texto: 'Café: a força motriz por trás de **99%** da produtividade mundial e de **100%** da sua paciência diária.', emoji: '☕' },
	{ texto: 'Dê um passo de cada vez. A menos que você esteja atrasada; aí dê uns pulos, corra um pouco e torce para ninguém ver.', emoji: '🏃' },
	{ texto: 'Seus sonhos não têm data de validade, mas infelizmente as suas contas têm. Foco na missão!', emoji: '🏁' },
	{ texto: 'Para cada problema impossível que aparece na frente, há um copo de café te dizendo para não desistir.', emoji: '杯' },
	{ texto: 'Acredite em si mesma com a mesma intensidade que você acredita que o Wi-Fi vai voltar quando a conexão cai.', emoji: '📶' },
	{ texto: 'Produtividade sustentável é ter a sabedoria de fechar as oitenta abas do navegador e ir dormir.', emoji: '😴' },
	{ texto: 'O único lugar onde o sucesso vem antes do trabalho é no dicionário. E talvez na vida dos herdeiros, mas não é o nosso caso.', emoji: '📚' },
	{ texto: 'Lembre-se: grandes projetos levam tempo. Roma não foi construída em um dia, e as suas entregas também não precisam ser.', emoji: '🏗️' },
	{ texto: 'Se a vida te der limões, faça uma limonada. Se te der problemas absurdos, resolve tudo e faça um *deploy* na sexta-feira para viver perigosamente (brincadeira, não faça isso!).', emoji: '🍋' },
	{ texto: 'Foco é ter a coragem de dizer não para cem boas ideias e sim para aquela que não vai travar a sua máquina.', emoji: '🎯' },
	{ texto: 'Não deixe para amanhã a gambiarra que você sabe muito bem que pode (e deve) consertar hoje.', emoji: '🔧' },
	{ texto: 'A maior mentira da produtividade moderna: "Vou só dar uma olhadinha de 5 minutos no celular".', emoji: '📱' },
	{ texto: 'Quando achar que não consegue, lembre de tudo que você já resolveu na vida sem ter a menor ideia de como fez.', emoji: '🥳' },
	{ texto: 'Descanso também é produtividade. Ninguém, absolutamente ninguém, funciona a **100%** com a bateria no vermelho.', emoji: '🔋' },
	{ texto: 'Seja a pessoa que faz as coisas acontecerem, ou pelo menos a pessoa que documenta direito o que fez no processo.', emoji: '📝' },
	{ texto: 'Não espere a motivação chegar em um cavalo branco. Comece na força do ódio mesmo, a motivação corre atrás de você no caminho.', emoji: '🐴' },
	{ texto: 'Seu cérebro tem limite de RAM. Anote as coisas para não dar *crash* nas ideias geniais que surgem do nada!', emoji: '🧠' },
	{ texto: 'Um dia de cada vez, uma tarefa por vez, e muito café correndo no sistema para aguentar o tranco da semana.', emoji: '☕' },
	{ texto: 'Se der medo, vai com medo mesmo. O máximo que pode acontecer é ter que dar um imenso `Ctrl + Z` e tentar de novo amanhã.', emoji: '🔄' }
]

function getMensagemDoDia() {
	const dia = new Date().toDateString()
	const seed = [...dia].reduce((acc, c) => acc + c.charCodeAt(0), 0)
	return MENSAGENS[seed % MENSAGENS.length]
}

export default function MensagemDiaria() {
	const { texto, emoji } = getMensagemDoDia()
	const [visivel, setVisivel] = React.useState(true)
	if (!visivel) return null
	return (
		<div className="bg-[#161827] rounded-3xl px-6 py-4 w-full max-w-2xl flex items-center gap-4">
			<span className="text-2xl">{emoji}</span>
			<p className="text-sm text-white/60 leading-relaxed flex-1">{texto}</p>
			<button onClick={() => setVisivel(false)} className="text-white/20 hover:text-white/60 transition-colors shrink-0">✕</button>
		</div>
	)
}
