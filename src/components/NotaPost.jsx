import { useRef, useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

const LINHA_VAZIA = () => ({ id: Date.now() + Math.random(), texto: '', feito: false })
const HEADER_HEIGHT = 65
const MIN_W = 200
const MAX_W = 400

const CORES = [
	{ nome: 'laranja',  header: '#f0c080', corpo: '#fdf6e8', texto: '#7a4a10', sub: '#c08030' },
	{ nome: 'rosa',     header: '#f0b8c8', corpo: '#fdf0f4', texto: '#7a2e45', sub: '#c07090' },
	{ nome: 'verde',    header: '#b8d4b0', corpo: '#f0f8ee', texto: '#2e5a38', sub: '#70a078' },
	{ nome: 'azul',     header: '#b0c8e8', corpo: '#eef4fc', texto: '#2e4a7a', sub: '#6080b8' },
	{ nome: 'lilás',    header: '#cdb8e8', corpo: '#f4f0fc', texto: '#4a2e7a', sub: '#9070c0' },
	{ nome: 'vermelho', header: '#f0a8a8', corpo: '#fdf0f0', texto: '#7a2e2e', sub: '#c07070' },
	{ nome: 'preto',    header: '#2a2a2a', corpo: '#1a1a1a', texto: '#ffffff', sub: '#aaaaaa' },
	{ nome: 'branco',   header: '#e8e8e8', corpo: '#ffffff', texto: '#111111', sub: '#777777' },
]

const alcaResize = {
	position: 'absolute', top: 0, bottom: 0, width: 8,
	cursor: 'ew-resize', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export default function NotaPost({ nota, onChange, onRemover, bloqueado = false }) {
	const [arrastando, setArrastando] = useState(false)
	const [hover, setHover] = useState(false)
	const [corPopover, setCorPopover] = useState(false)
	const [redimensionando, setRedimensionando] = useState(null)
	const offsetRef = useRef({ x: 0, y: 0 })
	const resizeRef = useRef({ startX: 0, startW: 0, startNX: 0 })
	const ref = useRef()
	const textareaRef = useRef()

	const cor = CORES.find(c => c.nome === nota.cor) ?? CORES[0]
	const feitos = nota.linhas?.filter(l => l.feito).length ?? 0
	const total = nota.linhas?.length ?? 0
	const minimizado = nota.minimizado ?? false
	const largura = nota.largura ?? 220

	function iniciarArrasto(e) {
		if (bloqueado || redimensionando) return
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
			const W = ref.current?.offsetWidth ?? largura
			const H = ref.current?.offsetHeight ?? 300
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

	function iniciarResize(e, lado) {
		e.stopPropagation()
		e.preventDefault()
		const clientX = e.touches ? e.touches[0].clientX : e.clientX
		resizeRef.current = { startX: clientX, startW: largura, startNX: nota.x }
		setRedimensionando(lado)
	}

	useEffect(() => {
		if (!redimensionando) return
		function mover(e) {
			const clientX = e.touches ? e.touches[0].clientX : e.clientX
			const dx = clientX - resizeRef.current.startX
			if (redimensionando === 'right') {
				const novaW = Math.min(MAX_W, Math.max(MIN_W, resizeRef.current.startW + dx))
				onChange({ ...nota, largura: novaW })
			} else {
				const novaW = Math.min(MAX_W, Math.max(MIN_W, resizeRef.current.startW - dx))
				const novaNX = resizeRef.current.startNX + (resizeRef.current.startW - novaW)
				onChange({ ...nota, largura: novaW, x: novaNX })
			}
		}
		function soltar() { setRedimensionando(null) }
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
	}, [redimensionando])

	useEffect(() => {
		if (!corPopover) return
		function fechar(e) { if (!ref.current?.contains(e.target)) setCorPopover(false) }
		document.addEventListener('mousedown', fechar)
		return () => document.removeEventListener('mousedown', fechar)
	}, [corPopover])

	useEffect(() => {
		if (nota.tipo !== 'comum' || !textareaRef.current) return
		const el = textareaRef.current
		el.style.height = 'auto'
		el.style.height = el.scrollHeight + 'px'
	}, [nota.tipo, nota.texto, minimizado])

	function setLinhas(linhas) { onChange({ ...nota, linhas }) }
	function toggleFeito(id) { setLinhas(nota.linhas.map(l => l.id === id ? { ...l, feito: !l.feito } : l)) }
	function setTexto(id, texto) { setLinhas(nota.linhas.map(l => l.id === id ? { ...l, texto } : l)) }
	function addLinha() { setLinhas([...nota.linhas, LINHA_VAZIA()]) }
	function removerLinha(id) {
		const novas = nota.linhas.filter(l => l.id !== id)
		setLinhas(novas.length ? novas : [LINHA_VAZIA()])
	}
	function handleKeyDown(e, id, idx) {
		if (e.key === 'Enter') {
			e.preventDefault()
			const novas = [...nota.linhas]
			novas.splice(idx + 1, 0, LINHA_VAZIA())
			setLinhas(novas)
			setTimeout(() => ref.current?.querySelectorAll('.nota-linha-input')?.[idx + 1]?.focus(), 0)
		}
		if (e.key === 'Backspace' && nota.linhas[idx].texto === '' && nota.linhas.length > 1) {
			e.preventDefault()
			removerLinha(id)
			setTimeout(() => ref.current?.querySelectorAll('.nota-linha-input')?.[Math.max(0, idx - 1)]?.focus(), 0)
		}
	}

	const inputStyle = {
		flex: 1, background: 'transparent', border: 'none', outline: 'none',
		fontFamily: "'Kalam', cursive", fontSize: '1rem',
		cursor: 'text', minWidth: 0,
	}

	return (
		<div
			ref={ref}
			style={{
				position: 'fixed', left: nota.x, top: nota.y,
				zIndex: bloqueado ? 10 : 1000,
				width: largura,
				cursor: 'default',
				userSelect: 'none',
				boxShadow: arrastando ? '0 12px 32px rgba(0,0,0,0.35)' : '0 4px 18px rgba(0,0,0,0.25)',
				transition: arrastando ? 'none' : 'box-shadow 0.2s',
				fontFamily: "'Kalam', cursive",
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{/* barra de drag — flutua acima do widget */}
			<div
				onMouseDown={iniciarArrasto}
				onTouchStart={iniciarArrasto}
				style={{
					position: 'absolute', top: -18, left: 0, right: 0, height: 18,
					background: cor.header,
					filter: 'brightness(0.95)',
					borderRadius: '4px 4px 0 0',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					cursor: arrastando ? 'grabbing' : 'grab',
					opacity: hover || arrastando ? 1 : 0,
					transition: 'opacity 0.15s',
					pointerEvents: hover || arrastando ? 'auto' : 'none',
				}}
			>
				<MoreHorizIcon style={{ fontSize: '1rem', color: cor.sub, pointerEvents: 'none' }} />
			</div>

			{/* alças de resize — só no checklist */}
			{nota.tipo === 'checklist' && !minimizado && (
				<>
					<div style={{ ...alcaResize, left: -4 }} onMouseDown={e => iniciarResize(e, 'left')} onTouchStart={e => iniciarResize(e, 'left')}>
						<div style={{ width: 3, height: 24, borderRadius: 2, background: cor.sub, opacity: hover ? 0.5 : 0, transition: 'opacity 0.15s' }} />
					</div>
					<div style={{ ...alcaResize, right: -4 }} onMouseDown={e => iniciarResize(e, 'right')} onTouchStart={e => iniciarResize(e, 'right')}>
						<div style={{ width: 3, height: 24, borderRadius: 2, background: cor.sub, opacity: hover ? 0.5 : 0, transition: 'opacity 0.15s' }} />
					</div>
				</>
			)}

			{/* cabeçalho */}
			<div style={{ background: cor.header, borderRadius: minimizado ? '4px' : hover || arrastando ? '0' : '4px 4px 0 0', padding: '4px 8px 4px', display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
				<input
					type="text"
					value={nota.titulo}
					onChange={e => onChange({ ...nota, titulo: e.target.value })}
					placeholder="título..."
					onMouseDown={e => e.stopPropagation()}
					onClick={e => e.stopPropagation()}
					style={{ ...inputStyle, fontWeight: 700, fontSize: '1.1rem', color: cor.texto }}
				/>
				{!minimizado && nota.tipo === 'checklist' && (
					<span style={{ fontSize: '0.8rem', color: cor.sub, flexShrink: 0, fontWeight: 600 }}>
						{feitos}/{total}
					</span>
				)}
				<button
					onMouseDown={e => e.stopPropagation()}
					onClick={e => { e.stopPropagation(); setCorPopover(v => !v) }}
					title="Trocar cor"
					style={{ color: cor.sub, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, lineHeight: 1 }}
				>
					<PaletteOutlinedIcon style={{ fontSize: '1rem' }} />
				</button>
				<button
					onMouseDown={e => e.stopPropagation()}
					onClick={e => { e.stopPropagation(); onChange({ ...nota, minimizado: !minimizado }) }}
					title={minimizado ? 'Expandir' : 'Minimizar'}
					style={{ color: cor.sub, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, lineHeight: 1 }}
				>
					{minimizado ? <AddIcon style={{ fontSize: '1rem' }} /> : <RemoveIcon style={{ fontSize: '1rem' }} />}
				</button>
				<button
					onMouseDown={e => e.stopPropagation()}
					onClick={e => { e.stopPropagation(); onRemover() }}
					style={{ color: cor.sub, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, lineHeight: 1 }}
				>
					<CloseIcon style={{ fontSize: '1rem' }} />
				</button>

				{corPopover && (
					<div
						onMouseDown={e => e.stopPropagation()}
						onClick={e => e.stopPropagation()}
						style={{
							position: 'absolute', top: 'calc(100% + 6px)', right: 0,
							background: '#1e2030', border: '1px solid rgba(255,255,255,0.1)',
							borderRadius: 10, padding: '6px 8px', zIndex: 10,
							boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
							display: 'flex', gap: 6, alignItems: 'center',
						}}
					>
						{CORES.map(c => (
							<button
								key={c.nome}
								onClick={() => { onChange({ ...nota, cor: c.nome }); setCorPopover(false) }}
								title={c.nome}
								style={{
									width: 16, height: 16, borderRadius: '50%',
									background: c.header,
									border: (nota.cor === c.nome || (!nota.cor && c.nome === 'laranja'))
										? '2px solid #fff'
										: c.nome === 'branco' ? '2px solid #888' : '2px solid transparent',
									cursor: 'pointer', padding: 0, flexShrink: 0,
								}}
							/>
						))}
					</div>
				)}
			</div>

			{/* corpo */}
			{!minimizado && (
				<div style={{ background: cor.corpo, borderRadius: '0 0 4px 4px', padding: '4px 0 6px' }}>
					{nota.tipo === 'checklist' ? (
						<>
							{nota.linhas.map((linha, idx) => (
								<div key={linha.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #b8d4f0', padding: '3px 8px', gap: 6, minHeight: 32 }}>
									<input
										type="checkbox"
										checked={linha.feito}
										onChange={() => toggleFeito(linha.id)}
										onMouseDown={e => e.stopPropagation()}
										style={{ accentColor: cor.header, cursor: 'pointer', flexShrink: 0, width: 14, height: 14 }}
									/>
									<input
										type="text"
										value={linha.texto}
										onChange={e => setTexto(linha.id, e.target.value)}
										onKeyDown={e => handleKeyDown(e, linha.id, idx)}
										onMouseDown={e => e.stopPropagation()}
										placeholder="..."
										className="nota-linha-input"
										style={{ ...inputStyle, color: linha.feito ? cor.sub : cor.texto, textDecoration: linha.feito ? 'line-through' : 'none' }}
									/>
								</div>
							))}
							<button
								onMouseDown={e => e.stopPropagation()}
								onClick={addLinha}
								style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2, marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: cor.sub, fontFamily: "'Kalam', cursive", fontSize: '0.9rem', padding: '2px 0' }}
							>
								<AddIcon style={{ fontSize: '0.9rem' }} /> adicionar
							</button>
						</>
					) : (
						<textarea
							ref={textareaRef}
							value={nota.texto ?? ''}
							onChange={e => onChange({ ...nota, texto: e.target.value })}
							onMouseDown={e => e.stopPropagation()}
							placeholder="escreva aqui..."
							rows={4}
							style={{
								width: '100%', boxSizing: 'border-box',
								background: 'transparent', border: 'none', outline: 'none', resize: 'none',
								fontFamily: "'Kalam', cursive", fontSize: '1rem',
								color: cor.texto, padding: '4px 10px',
								lineHeight: '2', backgroundImage: `repeating-linear-gradient(transparent, transparent calc(2em - 1px), #b8d4f0 calc(2em - 1px), #b8d4f0 2em)`,
								overflow: 'hidden',
							}}
						/>
					)}
				</div>
			)}
		</div>
	)
}
