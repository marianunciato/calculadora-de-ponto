import ScheduleIcon from '@mui/icons-material/Schedule'
import SettingsIcon from '@mui/icons-material/Settings'

export default function Header({ onAbrirPrefs, tab, onTab }) {
	return (
		<header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10">
			<div className="flex items-center gap-2 accent-text font-bold text-lg w-18">
				<ScheduleIcon fontSize="small" />
				<span className="accent-text">Dora</span>
			</div>
			<div className="flex">
				{['calculadora', 'banco'].map(t => (
					<button
						key={t}
						onClick={() => onTab(t)}
						className={`px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
							tab === t ? 'accent-text' : 'border-transparent text-white/40 hover:text-white/70'
						}`}
					>
						{t === 'calculadora' ? 'Calculadora' : 'Banco de Horas'}
					</button>
				))}
			</div>
			<button onClick={onAbrirPrefs} className="text-white/40 hover:text-white transition-colors w-18 flex justify-end items-center">
				<SettingsIcon fontSize="small" />
			</button>
		</header>
	)
}
