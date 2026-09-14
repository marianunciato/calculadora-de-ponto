import { useState, useMemo } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { toMinutes } from '../utils/time'

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function mesLabel(mmyyyy) {
	const [m, y] = mmyyyy.split('/')
	return `${MESES[parseInt(m) - 1]} ${y}`
}

function mesAtualStr() {
	const d = new Date()
	return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function navegarMes(mmyyyy, delta) {
	const [m, y] = mmyyyy.split('/').map(Number)
	const d = new Date(y, m - 1 + delta, 1)
	return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function saldoLabel(mins) {
	const abs = Math.abs(mins)
	const h = Math.floor(abs / 60).toString().padStart(2, '0')
	const m = (abs % 60).toString().padStart(2, '0')
	return `${mins >= 0 ? '+' : '-'}${h}:${m}`
}

const inputCls = "w-full max-w-[7rem] bg-[#0d0f1a] text-white text-xs rounded-lg px-2 py-1 outline-none border border-white/10 focus:border-[var(--accent)]"

function FormRegistro({ registro, jornadaPadrao, onConfirmar, onCancelar }) {
	const [form, setForm] = useState({
		data: registro?.data ?? '',
		entrada: registro?.entrada ?? '',
		almoco: registro?.almoco ?? '',
		retorno: registro?.retorno ?? '',
		saida: registro?.saida ?? '',
	})
	const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

	function confirmar() {
		if (!form.data || !form.entrada || !form.saida) return
		const intervaloMins = form.almoco && form.retorno ? Math.max(0, toMinutes(form.retorno) - toMinutes(form.almoco)) : 0
		const trabalhadoMins = toMinutes(form.saida) - toMinutes(form.entrada) - intervaloMins
		const jornadaMins = registro?.jornada ? toMinutes(registro.jornada) : toMinutes(jornadaPadrao)
		const extraMins = trabalhadoMins - jornadaMins
		onConfirmar({ ...(registro ?? {}), ...form, extraMins, jornada: registro?.jornada ?? jornadaPadrao })
	}

	const dataISO = form.data ? form.data.split('/').reverse().join('-') : ''

	return (
		<tr className="bg-[#1e2030] text-center">
			<td className="px-3 py-2 rounded-l-xl">
				<input type="date" value={dataISO} onChange={e => {
					const [y, m, d] = e.target.value.split('-')
					setForm(f => ({ ...f, data: `${d}/${m}/${y}` }))
				}} className={inputCls} />
			</td>
			{[['entrada', 'time'], ['almoco', 'time'], ['retorno', 'time'], ['saida', 'time']].map(([key, type]) => (
				<td key={key} className="px-3 py-2">
					<input type={type} value={form[key]} onChange={set(key)} className={inputCls} />
				</td>
			))}
			<td className="px-3 py-2" />
			<td className="px-3 py-2 rounded-r-xl">
				<div className="flex gap-2 justify-end">
					<button onClick={onCancelar} className="text-white/30 hover:text-white transition-colors"><CloseIcon fontSize="small" /></button>
					<button onClick={confirmar} className="accent-text hover:text-[var(--accent-light)] transition-colors"><CheckIcon fontSize="small" /></button>
				</div>
			</td>
		</tr>
	)
}

export default function Historico({ registros, jornadaPadrao, onLimparHistorico, onExcluirRegistro, onEditarRegistro, onAdicionarRegistro, onImportarRegistros }) {
	const [editando, setEditando] = useState(null)
	const [adicionando, setAdicionando] = useState(false)
	const [confirmandoLimpar, setConfirmandoLimpar] = useState(false)
	const [conflitos, setConflitos] = useState(null)
	const [mes, setMes] = useState(mesAtualStr)
	const [ordemDesc, setOrdemDesc] = useState(true)

	const mesesComRegistro = useMemo(() => {
		const set = new Set(registros.map(r => r.data.slice(3)))
		return set
	}, [registros])

	const registrosFiltrados = useMemo(() =>
		registros.filter(r => r.data.slice(3) === mes)
	, [registros, mes])

	const saldoMes = registrosFiltrados.reduce((acc, r) => acc + r.extraMins, 0)

	function parseLinha(linha) {
		const [data, entrada, almoco, retorno, saida] = linha.split(';').map(s => s.trim())
		if (!data || !entrada || !saida) return null
		const intervaloMins = almoco && retorno ? Math.max(0, toMinutes(retorno) - toMinutes(almoco)) : 0
		const extraMins = toMinutes(saida) - toMinutes(entrada) - intervaloMins - toMinutes(jornadaPadrao)
		return { data, entrada, almoco: almoco || '', retorno: retorno || '', saida, extraMins, jornada: jornadaPadrao }
	}

	function importarCSV(e) {
		const file = e.target.files[0]
		if (!file) return
		e.target.value = ''
		const reader = new FileReader()
		reader.onload = (ev) => {
			const novos = ev.target.result.trim().split('\n').slice(1).map(parseLinha).filter(Boolean)
			const datasExistentes = new Map(registros.map(r => [r.data, r]))
			const semConflito = []
			const fila = []
			for (const r of novos) {
				if (datasExistentes.has(r.data)) fila.push({ existente: datasExistentes.get(r.data), importado: r })
				else semConflito.push(r)
			}
			if (fila.length > 0) setConflitos({ fila, semConflito, escolhas: [] })
			else onImportarRegistros(semConflito)
		}
		reader.readAsText(file)
	}

	function resolverConflito(escolhido) {
		const { fila, semConflito, escolhas } = conflitos
		const novasEscolhas = [...escolhas, escolhido]
		if (fila.length === 1) {
			onImportarRegistros([...semConflito, ...novasEscolhas])
			setConflitos(null)
		} else {
			setConflitos({ fila: fila.slice(1), semConflito, escolhas: novasEscolhas })
		}
	}
	const registrosOrdenados = registrosFiltrados.slice().sort((a, b) => {
		const toDate = d => d.split('/').reverse().join('-')
		const cmp = toDate(a.data) > toDate(b.data) ? 1 : -1
		return ordemDesc ? -cmp : cmp
	})
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
		<div className="bg-[#161827] rounded-3xl p-6 w-full max-w-4xl flex flex-col gap-4">

			<div className="bg-[#1e2030] rounded-2xl p-6 flex items-center justify-between">
				<div>
					<p className="text-xs font-bold tracking-[0.25em] uppercase text-white/60 mb-2">
						{saldoMes >= 0 ? 'Saldo do Mês' : 'Débito do Mês'}
					</p>
					<span className={`text-5xl font-thin tracking-widest ${saldoMes >= 0 ? 'text-green-400' : 'text-red-400'}`}>
						{saldoLabel(saldoMes)}
					</span>
					<p className="text-xs text-white/30 mt-1">total geral: <span className={bancoTotal >= 0 ? 'text-green-400/60' : 'text-red-400/60'}>{saldoLabel(bancoTotal)}</span></p>
				</div>
				<div className="flex flex-col items-end gap-1">
					{registros.length > 0 && (
						<button onClick={exportarCSV} className="flex items-center gap-2 text-xs text-white/30 hover:text-[var(--accent-light)] transition-colors">
							<DownloadIcon fontSize="small" />
							Exportar CSV
						</button>
					)}
					<button onClick={() => document.getElementById('csv-import-input').click()} className="flex items-center gap-2 text-xs text-white/30 hover:text-[var(--accent-light)] transition-colors">
						<UploadIcon fontSize="small" />
						Importar CSV
					</button>
					<input id="csv-import-input" type="file" accept=".csv" className="hidden" onChange={importarCSV} />
				</div>
				<button
					onClick={() => { setAdicionando(true); setEditando(null) }}
					className="mt-3 flex items-center justify-center gap-2 accent-bg accent-bg-hover transition-colors rounded-xl px-4 py-2 text-xs font-bold tracking-widest uppercase"
				>
					<AddIcon fontSize="small" />
					Adicionar dia
				</button>
			</div>

			{registros.length > 0 && (
				<div className="flex items-center justify-between px-1">
					<button onClick={() => setMes(m => navegarMes(m, -1))} disabled={!mesesComRegistro.has(navegarMes(mes, -1))} className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"><ChevronLeftIcon /></button>
					<div className="text-center">
						<span className="text-sm font-semibold text-white/80">{mesLabel(mes)}</span>
						<p className="text-xs text-white/30">{registrosFiltrados.length} dia{registrosFiltrados.length !== 1 ? 's' : ''} registrado{registrosFiltrados.length !== 1 ? 's' : ''}</p>
					</div>
					<button onClick={() => setMes(m => navegarMes(m, 1))} disabled={!mesesComRegistro.has(navegarMes(mes, 1))} className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"><ChevronRightIcon /></button>
				</div>
			)}

			{registros.length === 0 && !adicionando ? (
				<p className="text-center text-white/30 text-sm py-8">Nenhum registro ainda.<br />Use o botão "Registrar Dia" na calculadora.</p>
			) : registrosFiltrados.length === 0 && !adicionando ? (
				<p className="text-center text-white/30 text-sm py-8">Nenhum registro em {mesLabel(mes)}.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-xs text-white/70 border-separate border-spacing-y-1">
						<thead>
							<tr className="text-white/30 uppercase tracking-widest text-center">
								<th className="px-3 py-2 font-medium">
									<button onClick={() => setOrdemDesc(o => !o)} className="flex items-center gap-1 mx-auto text-white/30 hover:text-white/70 transition-colors uppercase tracking-widest">
										Data
										<ArrowUpwardIcon fontSize="inherit" style={{ transition: 'transform 0.2s', transform: ordemDesc ? 'rotate(180deg)' : 'rotate(0deg)' }} />
									</button>
								</th>
								<th className="px-3 py-2 font-medium">Entrada</th>
								<th className="px-3 py-2 font-medium">Almoço</th>
								<th className="px-3 py-2 font-medium">Retorno</th>
								<th className="px-3 py-2 font-medium">Saída</th>
								<th className="px-3 py-2 font-medium">Saldo</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{adicionando && (
								<FormRegistro
									registro={null}
									jornadaPadrao={jornadaPadrao}
									onConfirmar={(novo) => { onAdicionarRegistro(novo); setAdicionando(false) }}
									onCancelar={() => setAdicionando(false)}
								/>
							)}
							{registrosOrdenados.map((r, i) => {
								const idxOriginal = registros.indexOf(r)
								if (editando === idxOriginal) {
									return (
										<FormRegistro
											key={i}
											registro={r}
											jornadaPadrao={jornadaPadrao}
											onConfirmar={(atualizado) => { onEditarRegistro(idxOriginal, atualizado); setEditando(null) }}
											onCancelar={() => setEditando(null)}
										/>
									)
								}
								return (
									<tr key={i} className="bg-[#1e2030] text-center">
										<td className="px-3 py-3 rounded-l-xl text-white/60">{r.data}</td>
										<td className="px-3 py-3 text-white">{r.entrada}</td>
										<td className="px-3 py-3 text-white">{r.almoco || '—'}</td>
										<td className="px-3 py-3 text-white">{r.retorno || '—'}</td>
										<td className="px-3 py-3 text-white">{r.saida}</td>
										<td className={`px-3 py-3 font-bold ${r.extraMins >= 0 ? 'text-green-400' : 'text-red-400'}`}>
											{saldoLabel(r.extraMins)}
										</td>
										<td className="px-3 py-3 rounded-r-xl">
											<div className="flex gap-2 justify-end">
												<button
													onClick={() => { setEditando(idxOriginal); setAdicionando(false) }}
													className="text-white/20 hover:text-[var(--accent-light)] transition-colors"
													title="Editar registro"
												>
													<EditIcon fontSize="small" />
												</button>
												<button
													onClick={() => onExcluirRegistro(idxOriginal)}
													className="text-white/20 hover:text-red-400 transition-colors"
													title="Excluir registro"
												>
													<DeleteOutlineIcon fontSize="small" />
												</button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}

			{conflitos && (() => {
				const { fila } = conflitos
				const { existente, importado } = fila[0]
				const linhaReg = (r) => `${r.entrada} → ${r.saida}${r.almoco ? ` (almoço ${r.almoco}–${r.retorno})` : ''} · ${saldoLabel(r.extraMins)}`
				return (
					<div className="bg-[#1e2030] rounded-2xl p-5 flex flex-col gap-3">
						<p className="text-xs text-white/50 uppercase tracking-widest">
							Conflito em <span className="text-white/80 font-bold">{existente.data}</span>
							{fila.length > 1 && <span className="ml-2 text-white/30">({fila.length} restantes)</span>}
						</p>
						<div className="grid grid-cols-2 gap-3">
							{[['Manter atual', existente], ['Usar importado', importado]].map(([label, reg]) => (
								<button key={label} onClick={() => resolverConflito(reg)}
									className="flex flex-col gap-1 bg-[#0d0f1a] hover:border-[var(--accent)] border border-white/10 rounded-xl px-4 py-3 text-left transition-colors">
									<span className="text-xs font-bold text-white/60 uppercase tracking-widest">{label}</span>
									<span className="text-xs text-white/80">{linhaReg(reg)}</span>
								</button>
							))}
						</div>
						<button onClick={() => setConflitos(null)} className="text-xs text-white/20 hover:text-white/50 transition-colors self-end">Cancelar importação</button>
					</div>
				)
			})()}

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
