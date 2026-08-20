import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

const VIDEO_ID = '6W7HauaG3Bg'

function isSexta() {
	return new Date().getDay() === 5
}

function jaViuHoje() {
	return localStorage.getItem('sextou-visto') === new Date().toLocaleDateString('pt-BR')
}

export default function SextouModal() {
	const [aberto, setAberto] = useState(() => isSexta() && !jaViuHoje())

	function fechar() {
		localStorage.setItem('sextou-visto', new Date().toLocaleDateString('pt-BR'))
		setAberto(false)
	}

	if (!aberto) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={fechar}>
			<div className="relative w-full max-w-3xl" onClick={e => e.stopPropagation()}>
				<button
					onClick={fechar}
					className="absolute -top-8 right-0 text-white/50 hover:text-white transition-colors"
				>
					<CloseIcon />
				</button>
				<div className="w-full aspect-video rounded-2xl overflow-hidden">
					<iframe
						src={`https://www.youtube.com/embed/${VIDEO_ID}`}
						allow="autoplay; encrypted-media"
						allowFullScreen
						className="w-full h-full"
					/>
				</div>
			</div>
		</div>
	)
}
