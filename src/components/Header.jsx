import { useState, useRef, useEffect } from 'react'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'
import SettingsIcon from '@mui/icons-material/Settings'
import PostAddOutlined from '@mui/icons-material/PostAddOutlined'
import ChecklistIcon from '@mui/icons-material/Checklist'
import NotesIcon from '@mui/icons-material/Notes'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'

export default function Header({ onAbrirPrefs, tab, onTab, onNovaNote }) {
	const [menuAberto, setMenuAberto] = useState(false)
	const menuRef = useRef()

	useEffect(() => {
		if (!menuAberto) return
		function fechar(e) { if (!menuRef.current?.contains(e.target)) setMenuAberto(false) }
		document.addEventListener('mousedown', fechar)
		return () => document.removeEventListener('mousedown', fechar)
	}, [menuAberto])

	return (
		<header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10">
			<div className="flex items-center gap-2 accent-text font-bold text-lg w-18">
				<HistoryToggleOffIcon fontSize="small" />
				<span className="accent-text">Dora</span>
			</div>
			<div className="flex">
				{['calculadora', 'banco'].map(t => (
					<button
						key={t}
						onClick={() => onTab(t)}
						className={`px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
							tab === t ? 'accent-text' : 'border-transparent text-white/40 hover:text-white/70 cursor-pointer'
						}`}
					>
						{t === 'calculadora' ? 'Calculadora' : 'Banco de Horas'}
					</button>
				))}
			</div>
			<div className="flex items-center gap-2 w-18 justify-end">
				<div ref={menuRef} style={{ position: 'relative' }}>
					<button
						onClick={() => setMenuAberto(v => !v)}
						title="Nova nota"
						className="text-white/40 hover:text-white transition-colors cursor-pointer flex"
					>
						<PostAddOutlined fontSize="small" />
					</button>
					{menuAberto && (
						<div className="absolute right-0 top-11 z-20 bg-[#1e2030] border border-white/10 rounded-xl p-2 flex flex-col gap-1 min-w-[10rem] shadow-xl">
							{[{ tipo: 'checklist', label: 'Checklist', Icon: ChecklistIcon }, { tipo: 'comum', label: 'Nota comum', Icon: NotesIcon }, { tipo: 'polaroid', label: 'Polaroid', Icon: PhotoCameraOutlinedIcon }].map(({ tipo, label, Icon }) => (
								<button
									key={tipo}
									onClick={() => { onNovaNote(tipo); setMenuAberto(false) }}
									className="flex items-center gap-2 text-xs text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors cursor-pointer"
								>
									<Icon fontSize="small" /> {label}
								</button>
							))}
						</div>
					)}
				</div>
				<button onClick={onAbrirPrefs} className="text-white/40 hover:text-white transition-colors cursor-pointer flex">
					<SettingsIcon fontSize="small" />
				</button>
			</div>
		</header>
	)
}
