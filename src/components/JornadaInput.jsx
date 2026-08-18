import WorkHistoryIcon from '@mui/icons-material/WorkHistory'

export default function JornadaInput({ value, onAbrirPrefs }) {
	return (
		<div className="bg-[#1e2030] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#252740] transition-colors" onClick={onAbrirPrefs}>
			<div className="flex items-center gap-3">
				<WorkHistoryIcon className="text-purple-400" />
				<div>
					<p className="text-xs font-bold tracking-widest uppercase">Jornada Diária</p>
					<p className="text-xs text-white/40">Meta de horas diárias</p>
				</div>
			</div>
			<span className="text-2xl font-light text-white">{value || '--:--'}</span>
		</div>
	)
}
