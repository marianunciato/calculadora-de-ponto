import { useEffect, useState, useRef } from 'react'
import { getNowPlaying } from '../utils/spotify'

const HEADER_HEIGHT = 65
const W = 200

export default function SpotifyWidget({ bloqueado = false, tema = 'escuro', cor = 'roxo' }) {
	const claro = tema === 'claro'
	const bgCard = claro ? 'var(--c-card-light, #fff)' : '#181818'
	const bgCapa = claro ? 'var(--c-card2-light, #eee)' : '#2a2a2a'
	const corNome = claro ? 'var(--c-text, #1a1a2e)' : '#fff'
	const corArtista = claro ? 'rgba(26,26,46,0.45)' : 'rgba(255,255,255,0.45)'
	const [track, setTrack] = useState(null)
	const [pos, setPos] = useState(() => {
		try { return JSON.parse(localStorage.getItem('spotify-widget-pos')) ?? { x: 24, y: 100 } }
		catch { return { x: 24, y: 100 } }
	})
	const [arrastando, setArrastando] = useState(false)
	const [hover, setHover] = useState(false)
	const offsetRef = useRef({ x: 0, y: 0 })
	const ref = useRef()

	useEffect(() => {
		let ativo = true
		async function poll() {
			const data = await getNowPlaying()
			if (ativo) setTrack(data)
		}
		poll()
		const id = setInterval(poll, 10000)
		return () => { ativo = false; clearInterval(id) }
	}, [])

	function iniciarArrasto(e) {
		e.preventDefault()
		const clientX = e.touches ? e.touches[0].clientX : e.clientX
		const clientY = e.touches ? e.touches[0].clientY : e.clientY
		offsetRef.current = { x: clientX - pos.x, y: clientY - pos.y }
		setArrastando(true)
	}

	useEffect(() => {
		if (!arrastando) return
		function mover(e) {
			const clientX = e.touches ? e.touches[0].clientX : e.clientX
			const clientY = e.touches ? e.touches[0].clientY : e.clientY
			const H = ref.current?.offsetHeight ?? 280
			const x = Math.min(window.innerWidth - W, Math.max(0, clientX - offsetRef.current.x))
			const y = Math.min(window.innerHeight - H, Math.max(HEADER_HEIGHT, clientY - offsetRef.current.y))
			const novaPos = { x, y }
			setPos(novaPos)
			localStorage.setItem('spotify-widget-pos', JSON.stringify(novaPos))
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

	if (!track) return null

	return (
		<div
			ref={ref}
			style={{
				position: 'fixed', left: pos.x, top: pos.y,
				zIndex: bloqueado ? 10 : 1000, width: W,
				userSelect: 'none', cursor: 'default',
				boxShadow: arrastando ? '0 16px 40px rgba(0,0,0,0.4)' : '0 6px 24px rgba(0,0,0,0.3)',
				transition: arrastando ? 'none' : 'box-shadow 0.2s',
				borderRadius: 16, overflow: 'visible',
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{/* barra de drag */}
			<div
				onMouseDown={iniciarArrasto}
				onTouchStart={iniciarArrasto}
				style={{
					position: 'absolute', top: -16, left: 0, right: 0, height: 16,
					background: '#1db954',
					filter: 'brightness(0.85)',
					borderRadius: '10px 10px 0 0',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					cursor: arrastando ? 'grabbing' : 'grab',
					opacity: hover || arrastando ? 1 : 0,
					transition: 'opacity 0.15s',
					pointerEvents: hover || arrastando ? 'auto' : 'none',
				}}
			>
				<span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 4 }}>• • •</span>
			</div>

			{/* card */}
			<a
				href={track.url}
				target="_blank"
				rel="noreferrer"
				onMouseDown={e => e.stopPropagation()}
				style={{ textDecoration: 'none', display: 'block' }}
			>
				<div style={{
					background: bgCard,
					borderRadius: hover || arrastando ? '0 0 16px 16px' : 16,
					transition: 'border-radius 0.15s',
					padding: 14,
					display: 'flex', flexDirection: 'column', gap: 12,
				}}>
					{/* capa */}
					<div style={{
						width: '100%', aspectRatio: '1',
						borderRadius: 10, overflow: 'hidden',
						background: bgCapa, flexShrink: 0,
					}}>
						{track.capa
							? <img src={track.capa} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
							: <div style={{ width: '100%', height: '100%', background: '#2a2a2a' }} />
						}
					</div>

					{/* info */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							{track.tocando && (
								<span style={{
									width: 6, height: 6, borderRadius: '50%',
									background: '#1db954', flexShrink: 0,
									boxShadow: '0 0 6px #1db954',
								}} />
							)}
							<p style={{
								margin: 0, fontSize: '0.85rem', fontWeight: 700,
								color: corNome, whiteSpace: 'nowrap',
								overflow: 'hidden', textOverflow: 'ellipsis',
							}}>
								{track.nome}
							</p>
						</div>
						<p style={{
							margin: 0, fontSize: '0.75rem',
							color: corArtista,
							whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
						}}>
							{track.artista}
						</p>
					</div>
				</div>
			</a>
		</div>
	)
}
