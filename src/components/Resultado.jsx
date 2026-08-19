import { useState, useEffect } from 'react'
import Delete from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { ALERTA_STYLES } from '../utils/alertas'
import ProgressBar from './ProgressBar'

export default function Resultado({ saida, faltam, alertas, onLimpar, onRegistrar, entrada, almoco, retorno, saidaReal, onSaidaReal, jornada, jaRegistradoHoje, tick }) {
	const todosPreenchidos = entrada && almoco && retorno
	const encerrado = todosPreenchidos && faltam.horas === 0 && faltam.minutos === 0
	const [agoraTooltip, setAgoraTooltip] = useState('')
	const [agoraMobile, setAgoraMobile] = useState(() => {
		const agora = new Date()
		return `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`
	})
	const [toast, setToast] = useState(false)
	const [confirmandoLimpar, setConfirmandoLimpar] = useState(false)
	const [confirmandoRegistrar, setConfirmandoRegistrar] = useState(false)

	useEffect(() => {
		function atualizar() {
			const agora = new Date()
			setAgoraMobile(`${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`)
		}
		const id = setInterval(atualizar, 60000)
		return () => clearInterval(id)
	}, [])

	function handleRegistrarMouseEnter() {
		if (encerrado || !todosPreenchidos) return
		const agora = new Date()
		setAgoraTooltip(`${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`)
	}

	function handleRegistrar() {
		onRegistrar()
		setToast(true)
		setTimeout(() => setToast(false), 3000)
	}

	return (
		<>
			<div className="flex flex-col items-center gap-1 py-2">
				<p className="text-xs font-bold tracking-[0.25em] uppercase text-white/60">Seu horário de saída é</p>
			</div>

			<div className="bg-[#1e2030] rounded-2xl p-6 flex flex-col items-center gap-2">
				{todosPreenchidos ? (
					<>
						<span className="text-6xl font-thin tracking-widest">{saida}</span>
						<p className="text-xs tracking-widest text-white/70 uppercase">
							Faltam <strong className="text-white">{faltam.horas} horas</strong> e{' '}
							<strong className="text-white">{faltam.minutos} minutos</strong> para a sua saída
						</p>
					</>
				) : (
					<p className="text-sm text-white/30 tracking-widest uppercase">Preencha todos os horários</p>
				)}
			</div>

			<ProgressBar entrada={entrada} saida={saida} almoco={almoco} retorno={retorno} jornada={jornada} tick={tick} />

			{todosPreenchidos && (
				<div className="bg-[#1e2030] rounded-2xl p-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<ExitToAppIcon className="text-green-400" fontSize="small" />
						<div>
							<p className="text-xs font-bold tracking-widest uppercase">Saída Real</p>
							<p className="text-xs text-white/40">Horário que você realmente saiu</p>
						</div>
					</div>
					<input
						type="time"
						value={saidaReal}
						onChange={e => onSaidaReal(e.target.value)}
						className="bg-transparent text-white text-2xl font-light outline-none text-right"
					/>
				</div>
			)}

			{alertas.map((alerta, i) => {
				const { bg, text, Icon } = ALERTA_STYLES[alerta.tipo]
				return (
					<div key={i} className={`${bg} ${text} rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-medium`}>
						<Icon fontSize="small" />
						<span>{alerta.msg}</span>
					</div>
				)
			})}

			{toast && (
				<div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-medium">
					<CheckCircleOutlineIcon fontSize="small" />
					<span>Dia registrado com sucesso!</span>
				</div>
			)}

			<div className="flex gap-3">
				{confirmandoLimpar ? (
					<div className="flex items-center justify-center gap-3 flex-1 border border-white/10 rounded-2xl py-4 text-xs">
						<span className="text-white/40">Tem certeza?</span>
						<button onClick={() => { onLimpar(); setConfirmandoLimpar(false) }} className="text-red-400 hover:text-red-300 font-bold transition-colors">Sim</button>
						<button onClick={() => setConfirmandoLimpar(false)} className="text-white/30 hover:text-white transition-colors">Cancelar</button>
					</div>
				) : (
					<button
						onClick={() => setConfirmandoLimpar(true)}
						className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 transition-colors rounded-2xl py-4 text-sm font-bold tracking-[0.25em] uppercase flex-1"
					>
						<Delete fontSize="small" />
						Limpar
					</button>
				)}
				{confirmandoRegistrar ? (
					<div className="flex items-center justify-center gap-3 flex-1 border border-white/10 rounded-2xl py-4 text-xs">
						<span className="text-white/40">Isso limpará os campos.</span>
						<button onClick={() => { handleRegistrar(); setConfirmandoRegistrar(false) }} className="text-[var(--accent)] hover:text-[var(--accent-light)] font-bold transition-colors">Confirmar</button>
						<button onClick={() => setConfirmandoRegistrar(false)} className="text-white/30 hover:text-white transition-colors">Cancelar</button>
					</div>
				) : (
					<div className="relative flex-1" onMouseEnter={handleRegistrarMouseEnter} onMouseLeave={() => setAgoraTooltip('')}>
						<button
							onClick={() => setConfirmandoRegistrar(true)}
							disabled={!entrada || !almoco || !retorno || jaRegistradoHoje}
							className="w-full flex items-center justify-center gap-2 accent-bg accent-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-2xl py-4 text-sm font-bold tracking-[0.25em] uppercase"
						>
							<SaveIcon fontSize="small" />
							{jaRegistradoHoje ? 'Já Registrado' : 'Registrar Dia'}
						</button>
						{!encerrado && todosPreenchidos && agoraTooltip && !jaRegistradoHoje && (
							<div className="absolute tooltip:top-1/2 tooltip:-translate-y-1/2 tooltip:left-[calc(100%+8px)] tooltip:translate-x-0 top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0d0f1a] border border-white/10 text-white/70 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap pointer-events-none z-10">
								Sua saída será registrada como <strong className="text-white">{agoraTooltip}</strong>
							</div>
						)}
					</div>
				)}
			</div>
			{!encerrado && todosPreenchidos && !jaRegistradoHoje && (
				<p className="md:hidden text-center text-xs text-white/40">
					Sua saída será registrada como <strong className="text-white/70">{agoraMobile}</strong>
				</p>
			)}
			<a
				href="https://stou.ifractal.com.br/fulltime//phonto.php"
				target="_blank"
				rel="noreferrer"
				className="hidden lg:flex items-center justify-center accent-bg accent-bg-hover transition-colors rounded-2xl py-4 text-sm font-bold tracking-[0.25em] uppercase w-full"
			>
				Ir para página de ponto
			</a>
		</>
	)
}
