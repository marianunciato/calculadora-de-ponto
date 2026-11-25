import WorkHistoryIcon from '@mui/icons-material/WorkHistory'

export default function JornadaInput({ value, onAbrirPrefs }) {
	return (
		<div className="bg-[#1e2030] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#252740] transition-colors" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 12px rgba(0,0,0,0.2)', background: 'linear-gradient(135deg, var(--c-card2, #1e2030) 0%, var(--c-card3, #252740) 100%)' }} onClick={onAbrirPrefs}>
			<div className="flex items-center gap-3">
				<WorkHistoryIcon className="accent-text" />
				<div>
					<p className="text-xs font-bold tracking-widest uppercase">Jornada Diária</p>
					<p className="text-xs text-white/40">Meta de horas diárias</p>
				</div>
			</div>
			<span className="text-2xl font-light text-white">{ value || '--:--' }</span>
		</div>
	)
}
