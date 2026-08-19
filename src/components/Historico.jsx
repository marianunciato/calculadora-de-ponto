import { useState } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import { toMinutes } from '../utils/time'

function saldoLabel(mins) {
	const abs = Math.abs(mins)
	const h = Math.floor(abs / 60).toString().padStart(2, '0')
	const m = (abs % 60).toString().padStart(2, '0')
	return `${mins >= 0 ? '+' : '-'}${h}:${m}`
}

function EditandoRegistro({ registro, onConfirmar, onCancelar }) {
	const [form, setForm] = useState({
		data: registro.data,
		entrada: registro.entrada,
		almoco: registro.almoco ?? '',
		retorno: registro.retorno ?? '',
		saida: registro.saida,
	})
	const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

	function confirmar() {
		const intervaloMins = form.almoco && form.retorno ? Math.max(0, toMinutes(form.retorno) - toMinutes(form.almoco)) : 0
		const trabalhadoMins = toMinutes(form.saida) - toMinutes(form.entrada) - intervaloMins
		const jornadaMins = registro.jornada
			? toMinutes(registro.jornada)
			: toMinutes(registro.saidaEstimada) - toMinutes(form.entrada) - intervaloMins
		const extraMins = trabalhadoMins - jornadaMins
		onConfirmar({ ...registro, ...form, extraMins })
	}

	return (
		<div className="bg-[#1e2030] rounded-xl px-4 py-3 flex flex-col gap-3">
			<div className="flex flex-wrap gap-3 text-xs">
				{[['Entrada', 'entrada'], ['Almoço', 'almoco'], ['Retorno', 'retorno'], ['Saída', 'saida']].map(([label, key]) => (
					<label key={key} className="flex flex-col gap-1 text-white/50">
						{label}
						<input
							type="time"
							value={form[key]}
							onChange={set(key)}
							className="bg-[#0d0f1a] text-white rounded-lg px-2 py-1 outline-none border border-white/10 focus:border-[var(--accent)]"
						/>
					</label>
				))}
			</div>
			<div className="flex gap-2 justify-end">
				<button onClick={onCancelar} className="text-white/30 hover:text-white transition-colors"><CloseIcon fontSize="small" /></button>
				<button onClick={confirmar} className="accent-text hover:text-[var(--accent-light)] transition-colors"><CheckIcon fontSize="small" /></button>
			</div>
		</div>
	)
}

export default function Historico({ registros, onLimparHistorico, onExcluirRegistro, onEditarRegistro }) {
	const [editando, setEditando] = useState(null)
	const [confirmandoLimpar, setConfirmandoLimpar] = useState(false)
	const bancoTotal = registros.reduce((acc, r) => acc + r.extraMins, 0)

	function exportarCSV() {
		const linhas = [
			['Data', 'Entrada', 'Almoço', 'Retorno', 'Saída', 'Saldo'],
			...registros.map(r => [r.data, r.entrada, r.almoco ?? '', r.retorno ?? '', r.saida, saldoLabel(r.extraMins)])
		]
		const csv = linhas.map(l => l.join(';')).join('\n')
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'historico-ponto.csv'
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className="bg-[#161827] rounded-3xl p-6 w-full max-w-2xl flex flex-col gap-4">

			<div className="bg-[#1e2030] rounded-2xl p-6 flex items-center justify-between">
				<div>
					<p className="text-xs font-bold tracking-[0.25em] uppercase text-white/60 mb-2">
						{bancoTotal >= 0 ? 'Banco de Horas' : 'Horas Devendo'}
					</p>
					<span className={`text-5xl font-thin tracking-widest ${bancoTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
						{saldoLabel(bancoTotal)}
					</span>
				</div>
				<div className="text-right">
					<p className="text-xs text-white/40">{registros.length} dia{registros.length !== 1 ? 's' : ''} registrado{registros.length !== 1 ? 's' : ''}</p>
					{registros.length > 0 && (
						<button onClick={exportarCSV} className="mt-2 flex items-center gap-1 text-xs text-white/30 hover:text-[var(--accent-light)] transition-colors ml-auto">
							<DownloadIcon fontSize="small" />
							Exportar CSV
						</button>
					)}
				</div>
			</div>

			{registros.length === 0 ? (
				<p className="text-center text-white/30 text-sm py-8">Nenhum registro ainda.<br />Use o botão "Registrar Dia" na calculadora.</p>
			) : (
				<div className="flex flex-col gap-2">
					{registros.slice().reverse().map((r, i) => {
						const idxOriginal = registros.length - 1 - i
						if (editando === idxOriginal) {
							return (
								<EditandoRegistro
									key={i}
									registro={r}
									onConfirmar={(atualizado) => { onEditarRegistro(idxOriginal, atualizado); setEditando(null) }}
									onCancelar={() => setEditando(null)}
								/>
							)
						}
						return (
							<div key={i} className="bg-[#1e2030] rounded-xl px-4 py-3 flex items-center justify-between gap-2">
								<span className="text-sm text-white/60 w-24 shrink-0">{r.data}</span>
								<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
									<span>Entrada <strong className="text-white">{r.entrada}</strong></span>
									{r.almoco && <span>Almoço <strong className="text-white">{r.almoco}</strong></span>}
									{r.retorno && <span>Retorno <strong className="text-white">{r.retorno}</strong></span>}
									<span>Saída <strong className="text-white">{r.saida}</strong></span>
								</div>
								<span className={`text-sm font-bold shrink-0 ${r.extraMins >= 0 ? 'text-green-400' : 'text-red-400'}`}>
									{saldoLabel(r.extraMins)}
								</span>
								<button
									onClick={() => setEditando(idxOriginal)}
									className="text-white/20 hover:text-[var(--accent-light)] transition-colors shrink-0"
									title="Editar registro"
								>
									<EditIcon fontSize="small" />
								</button>
								<button
									onClick={() => onExcluirRegistro(idxOriginal)}
									className="text-white/20 hover:text-red-400 transition-colors shrink-0"
									title="Excluir registro"
								>
									<DeleteOutlineIcon fontSize="small" />
								</button>
							</div>
						)
					})}
				</div>
			)}

			{registros.length > 0 && (
				confirmandoLimpar ? (
					<div className="flex items-center justify-center gap-3 py-3 text-xs">
						<span className="text-white/40">Tem certeza? Isso não pode ser desfeito.</span>
						<button onClick={() => { onLimparHistorico(); setConfirmandoLimpar(false) }} className="text-red-400 hover:text-red-300 font-bold transition-colors">Sim, limpar</button>
						<button onClick={() => setConfirmandoLimpar(false)} className="text-white/30 hover:text-white transition-colors">Cancelar</button>
					</div>
				) : (
					<button
						onClick={() => setConfirmandoLimpar(true)}
						className="flex items-center justify-center gap-2 py-3 text-xs text-white/30 hover:text-red-400 transition-colors"
					>
						<DeleteOutlineIcon fontSize="small" />
						Limpar histórico
					</button>
				)
			)}
		</div>
	)
}
