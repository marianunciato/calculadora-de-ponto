import { useEffect, useState, useRef } from 'react'
import { getNowPlaying } from '../utils/spotify'

const HEADER_HEIGHT = 65

export default function SpotifyWidget() {
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
			const W = ref.current?.offsetWidth ?? 220
			const H = ref.current?.offsetHeight ?? 64
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
				zIndex: 1000, width: 220,
				userSelect: 'none',
				boxShadow: arrastando ? '0 12px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.3)',
				transition: arrastando ? 'none' : 'box-shadow 0.2s',
				borderRadius: 12, overflow: 'visible',
				cursor: 'default',
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
					borderRadius: '8px 8px 0 0',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					cursor: arrastando ? 'grabbing' : 'grab',
					opacity: hover || arrastando ? 1 : 0,
					transition: 'opacity 0.15s',
					pointerEvents: hover || arrastando ? 'auto' : 'none',
				}}
			>
				<span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 3 }}>• • •</span>
			</div>

			{/* card */}
			<a
				href={track.url}
				target="_blank"
				rel="noreferrer"
				style={{ textDecoration: 'none' }}
				onMouseDown={e => e.stopPropagation()}
			>
				<div style={{
					background: '#121212',
					borderRadius: hover || arrastando ? '0 0 12px 12px' : 12,
					transition: 'border-radius 0.15s',
					display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
					overflow: 'hidden',
				}}>
					{track.capa && (
						<img src={track.capa} alt="" style={{ width: 44, height: 44, borderRadius: 4, flexShrink: 0, objectFit: 'cover' }} />
					)}
					<div style={{ minWidth: 0, flex: 1 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
							{track.tocando && (
								<span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1db954', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
							)}
							<span style={{ fontSize: '0.65rem', color: '#1db954', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
								Spotify
							</span>
						</div>
						<p style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
							{track.nome}
						</p>
						<p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
							{track.artista}
						</p>
					</div>
				</div>
			</a>
		</div>
	)
}
