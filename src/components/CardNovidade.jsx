import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import CelebrationIcon from '@mui/icons-material/Celebration'

const NOVIDADE = 'Adicione imagens de coisas que você sente falta no presencial! Mate a saúdade a qualquer momento, ativando dois ou quatro widgets fofos na modal de preferências.'

const NOVIDADE_ID = 'novidade-paletas-v4'

export default function CardNovidade() {
	const [visivel, setVisivel] = useState(() => localStorage.getItem(NOVIDADE_ID) !== 'fechado')

	if (!visivel) return null

	function fechar() {
		localStorage.setItem(NOVIDADE_ID, 'fechado')
		setVisivel(false)
	}

	return (
		<div className="fixed bottom-6 right-6 z-40 w-72 bg-[#161827] rounded-2xl overflow-hidden shadow-xl" style={{ border: '2px solid var(--accent)' }}>
			<div className="flex items-center justify-between px-4 pt-4 pb-2">
				<div className="flex items-center gap-2 text-white text-xs font-bold tracking-[0.2em] uppercase">
					<span>🎉 Novidade</span>
				</div>
				<button onClick={fechar} className="text-white/20 hover:text-white/60 transition-colors">
					<CloseIcon style={{ fontSize: 14 }} />
				</button>
			</div>
			<p className="text-sm text-white/60 leading-relaxed px-4 pb-4">{NOVIDADE}</p>
		</div>
	)
}
