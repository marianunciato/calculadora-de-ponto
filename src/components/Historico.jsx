import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

function saldoLabel(mins) {
	const abs = Math.abs(mins)
	const h = Math.floor(abs / 60).toString().padStart(2, '0')
	const m = (abs % 60).toString().padStart(2, '0')
	return `${mins >= 0 ? '+' : '-'}${h}:${m}`
}

export default function Historico({ registros, onLimparHistorico, onExcluirRegistro }) {
	const bancoTotal = registros.reduce((acc, r) => acc + r.extraMins, 0)

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
				</div>
			</div>

			{registros.length === 0 ? (
				<p className="text-center text-white/30 text-sm py-8">Nenhum registro ainda.<br />Use o botão "Registrar Dia" na calculadora.</p>
			) : (
				<div className="flex flex-col gap-2">
					{registros.slice().reverse().map((r, i) => {
						const idxOriginal = registros.length - 1 - i
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
				<button
					onClick={onLimparHistorico}
					className="flex items-center justify-center gap-2 py-3 text-xs text-white/30 hover:text-red-400 transition-colors"
				>
					<DeleteOutlineIcon fontSize="small" />
					Limpar histórico
				</button>
			)}
		</div>
	)
}
