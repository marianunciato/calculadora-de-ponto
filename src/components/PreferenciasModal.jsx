import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'

const JORNADAS = ['04:00', '06:00', '08:00', '08:48', '12:00']

function Toggle({ checked, onChange }) {
	return (
		<button
			onClick={() => onChange(!checked)}
			className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-purple-500' : 'bg-white/10'}`}
		>
			<span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
		</button>
	)
}

function Row({ label, desc, children }) {
	return (
		<div className="bg-[#1e2030] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
			<div>
				<p className="text-sm font-medium">{label}</p>
				<p className="text-xs text-white/40">{desc}</p>
			</div>
			{children}
		</div>
	)
}

export default function PreferenciasModal({ prefs, onSalvar, onFechar }) {
	const [local, setLocal] = useState(prefs)
	const set = (key, val) => setLocal(p => ({ ...p, [key]: val }))

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onFechar}>
			<div className="bg-[#161827] rounded-2xl w-full max-w-md flex flex-col gap-5 p-6" onClick={e => e.stopPropagation()}>

				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
						<SettingsIcon fontSize="small" />
						<span className="text-white">Preferências</span>
					</div>
					<button onClick={onFechar} className="text-white/40 hover:text-white transition-colors">
						<CloseIcon fontSize="small" />
					</button>
				</div>

				{/* Geral */}
				<div className="flex flex-col gap-2">
					<p className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase">Geral</p>
					<Row label="Salvar dados no navegador" desc="Lembra sua jornada diária (localStorage)">
						<Toggle checked={local.salvarDados} onChange={v => set('salvarDados', v)} />
					</Row>
					<Row label="Tema claro" desc="Alterna entre fundo escuro e claro">
						<Toggle checked={local.tema === 'claro'} onChange={v => set('tema', v ? 'claro' : 'escuro')} />
					</Row>
				</div>

				{/* Cálculo de Ponto */}
				<div className="flex flex-col gap-2">
					<p className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase">Cálculo de Ponto</p>
					<Row label="Jornada Padrão" desc="Meta diária de horas a cumprir">
						<select
							value={local.jornadaPadrao}
							onChange={e => set('jornadaPadrao', e.target.value)}
							className="bg-[#0d0f1a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none"
						>
							{JORNADAS.map(j => <option key={j} value={j}>{j} hrs</option>)}
						</select>
					</Row>
					<Row label="Tolerância de Ponto" desc="Margem de erro para marcações">
						<div className="flex items-center gap-2">
							<input
								type="number"
								min={0}
								max={60}
								value={local.tolerancia}
								onChange={e => set('tolerancia', Number(e.target.value))}
								className="bg-[#0d0f1a] border border-white/10 text-white text-sm rounded-lg w-16 px-3 py-2 outline-none text-center"
							/>
							<span className="text-xs text-white/40">min</span>
						</div>
					</Row>
				</div>

				{/* Alertas */}
				<div className="flex flex-col gap-2">
					<p className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase">Alertas</p>
					<Row label="Notificar fim do expediente" desc="Envia um alerta sonoro quando zerar">
						<Toggle checked={local.notificarFim} onChange={v => set('notificarFim', v)} />
					</Row>
				</div>

				{/* Ações */}
				<div className="flex gap-3 pt-2 border-t border-white/10">
					<button
						onClick={onFechar}
						className="flex-1 py-3 rounded-xl border border-white/10 hover:border-white/30 text-sm font-bold tracking-widest uppercase transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={() => onSalvar(local)}
						className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-sm font-bold tracking-widest uppercase transition-colors"
					>
						Salvar Alterações
					</button>
				</div>

			</div>
		</div>
	)
}
