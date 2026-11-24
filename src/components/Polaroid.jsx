import { useRef, useState, useEffect } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

const HEADER_HEIGHT = 65
const MAX_CHARS = 18

export default function Polaroid({ nota, onChange, onRemover, bloqueado = false }) {
	const [arrastando, setArrastando] = useState(false)
	const [hover, setHover] = useState(false)
	const offsetRef = useRef({ x: 0, y: 0 })
	const ref = useRef()
	const inputRef = useRef()

	const rotate = nota.rotate ?? -3

	function iniciarArrasto(e) {
		if (bloqueado) return
		e.preventDefault()
		const clientX = e.touches ? e.touches[0].clientX : e.clientX
		const clientY = e.touches ? e.touches[0].clientY : e.clientY
		offsetRef.current = { x: clientX - nota.x, y: clientY - nota.y }
		setArrastando(true)
	}

	useEffect(() => {
		if (!arrastando) return
		function mover(e) {
			const clientX = e.touches ? e.touches[0].clientX : e.clientX
			const clientY = e.touches ? e.touches[0].clientY : e.clientY
			const W = ref.current?.offsetWidth ?? 192
			const H = ref.current?.offsetHeight ?? 220
			const x = Math.min(window.innerWidth - W, Math.max(0, clientX - offsetRef.current.x))
			const y = Math.min(window.innerHeight - H, Math.max(HEADER_HEIGHT, clientY - offsetRef.current.y))
			onChange({ ...nota, x, y })
		}
		function soltar() { setArrastando(false) }
		window.addEventListener('mousemove', mover)
		window.addEventListener('mouseup', soltar)
		window.addEventListener('touchmove', mover, { passive: true })
		window.addEventListener('touchend', soltar)
		return () => {
			window.removeEventListener('mousemove', mover)
			window.removeEventListener('mouseup', soltar)
			window.removeEventListener('touchmove', mover)
			window.removeEventListener('touchend', soltar)
		}
	}, [arrastando])

	function handleFile(e) {
		const file = e.target.files[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = (ev) => onChange({ ...nota, src: ev.target.result })
		reader.readAsDataURL(file)
	}

	return (
		<div
			ref={ref}
			style={{
				position: 'fixed', left: nota.x, top: nota.y,
				zIndex: bloqueado ? 10 : 1000,
				'--rotate': `${rotate}deg`,
				transform: `rotate(${rotate}deg)`,
				boxShadow: arrastando ? '0 12px 32px rgba(0,0,0,0.35)' : '0 5px 20px rgba(0,0,0,0.2)',
				transition: arrastando ? 'none' : 'box-shadow 0.2s',
				cursor: 'default',
				userSelect: 'none',
				width: 192,
			}}
			className={`bg-white p-2 pb-2 rounded-sm group${nota.src ? ' animate-polaroid' : ''}`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => !nota.src && inputRef.current.click()}
			title={nota.src ? '' : 'Clique para adicionar uma foto'}
		>
			{/* barra de drag */}
			<div
				onMouseDown={iniciarArrasto}
				onTouchStart={iniciarArrasto}
				style={{
					height: 14, margin: '-8px -8px 6px -8px',
					background: 'rgba(0,0,0,0.06)',
					borderRadius: '2px 2px 0 0',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					cursor: arrastando ? 'grabbing' : 'grab',
					opacity: hover || arrastando ? 1 : 0,
					transition: 'opacity 0.15s',
				}}
			>
				<MoreHorizIcon style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.3)', pointerEvents: 'none' }} />
			</div>
			{/* botão fechar */}
			<button
				onMouseDown={e => e.stopPropagation()}
				onClick={e => { e.stopPropagation(); onRemover() }}
				className="absolute -top-2 -right-2 bg-white rounded-full shadow text-black/30 hover:text-black/70 transition-colors opacity-0 group-hover:opacity-100 flex"
				style={{ zIndex: 2, padding: 2 }}
				title="Remover polaroid"
			>
				<CloseIcon style={{ fontSize: '0.9rem' }} />
			</button>

			<div className="w-full aspect-square bg-black/10 overflow-hidden relative rounded-xs">
				{nota.src ? (
					<>
						<img src={nota.src} alt="" className="w-full h-full object-cover" />
						<button
							onMouseDown={e => e.stopPropagation()}
							onClick={e => { e.stopPropagation(); inputRef.current.click() }}
							title="Trocar foto"
							className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
						>
							<AddPhotoAlternateIcon fontSize="small" />
						</button>
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center text-black/20 group-hover:text-black/40 transition-colors">
						<AddPhotoAlternateIcon />
					</div>
				)}
			</div>

			<div className="h-8 flex items-center justify-center relative" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
				<input
					type="text"
					value={nota.legenda ?? ''}
					onChange={e => onChange({ ...nota, legenda: e.target.value.slice(0, MAX_CHARS) })}
					placeholder="legenda..."
					maxLength={MAX_CHARS}
					className="w-full text-center text-black/70 placeholder:text-black/25 bg-transparent outline-none"
					style={{ fontFamily: "'Kalam', cursive", fontSize: '1rem' }}
				/>
				{nota.legenda && (
					<button
						onClick={() => onChange({ ...nota, legenda: '' })}
						className="absolute right-0 text-black/20 opacity-0 group-hover:opacity-100 hover:text-black/50 transition-all"
						title="Limpar legenda"
					>
						<DeleteOutlineIcon style={{ fontSize: '0.9rem' }} />
					</button>
				)}
			</div>

			<input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
		</div>
	)
}
