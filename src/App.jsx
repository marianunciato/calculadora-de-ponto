import { useState, useEffect, useRef } from 'react'
import './App.css'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Header from './components/Header'
import JornadaInput from './components/JornadaInput'
import TimeInput from './components/TimeInput'
import Resultado from './components/Resultado'
import Footer from './components/Footer'
import PreferenciasModal from './components/PreferenciasModal'
import Historico from './components/Historico'
import MensagemDiaria from './components/MensagemDiaria'
import { toMinutes, fromMinutes } from './utils/time'
import { getAlertas } from './utils/alertas'

const PREFS_DEFAULT = { salvarDados: true, jornadaPadrao: '08:48', tolerancia: 10, notificarFim: false, tema: 'escuro' }
function loadPrefs() {
	try { return { ...PREFS_DEFAULT, ...JSON.parse(localStorage.getItem('preferencias')) } }
	catch { return PREFS_DEFAULT }
}

export default function App() {
	const [tab, setTab] = useState('calculadora')
	const [jornada, setJornada] = useState(() => localStorage.getItem('jornada') ?? loadPrefs().jornadaPadrao)
	const [entrada, setEntrada] = useState(() => localStorage.getItem('entrada') ?? '')
	const [almoco, setAlmoco] = useState(() => localStorage.getItem('almoco') ?? '')
	const [retorno, setRetorno] = useState(() => localStorage.getItem('retorno') ?? '')
	const [saida, setSaida] = useState('00:00')
	const [faltam, setFaltam] = useState({ horas: 0, minutos: 0 })
	const [alertas, setAlertas] = useState([])
	const [prefs, setPrefs] = useState(loadPrefs)
	const [modalAberta, setModalAberta] = useState(false)
	const [historico, setHistorico] = useState(() => {
		try { return JSON.parse(localStorage.getItem('historico')) ?? [] }
		catch { return [] }
	})
	const [saidaReal, setSaidaReal] = useState('')
	const notificadoRef = useRef(true)
	const autoRegistradoRef = useRef(false)

	function salvarPrefs(novasPrefs) {
		setPrefs(novasPrefs)
		localStorage.setItem('preferencias', JSON.stringify(novasPrefs))
		setJornada(novasPrefs.jornadaPadrao)
		if (novasPrefs.notificarFim && Notification.permission === 'default') Notification.requestPermission()
		setModalAberta(false)
	}

	function registrarPonto() {
		if (!entrada || !almoco || !retorno) return
		const agora = new Date()
		const saidaFinal = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`
		const hoje = agora.toLocaleDateString('pt-BR')
		const jornadaMins = toMinutes(jornada)
		const intervaloMins = toMinutes(retorno) - toMinutes(almoco)
		const trabalhadoMins = toMinutes(saidaFinal) - toMinutes(entrada) - Math.max(0, intervaloMins)
		const extraMins = trabalhadoMins - jornadaMins
		const novo = { data: hoje, entrada, saida: saidaFinal, saidaEstimada: saida, almoco, retorno, extraMins }
		const atualizado = [...historico, novo]
		setHistorico(atualizado)
		localStorage.setItem('historico', JSON.stringify(atualizado))
	}

	function registrarPontoAuto() {
		if (!entrada || !almoco || !retorno) return
		const hoje = new Date().toLocaleDateString('pt-BR')
		const jaRegistrado = historico.some(r => r.data === hoje)
		if (jaRegistrado || autoRegistradoRef.current) return
		autoRegistradoRef.current = true
		const saidaFinal = saidaReal || saida
		const jornadaMins = toMinutes(jornada)
		const intervaloMins = toMinutes(retorno) - toMinutes(almoco)
		const trabalhadoMins = toMinutes(saidaFinal) - toMinutes(entrada) - Math.max(0, intervaloMins)
		const extraMins = trabalhadoMins - jornadaMins
		const novo = { data: hoje, entrada, saida: saidaFinal, saidaEstimada: saida, almoco, retorno, extraMins }
		const atualizado = [...historico, novo]
		setHistorico(atualizado)
		localStorage.setItem('historico', JSON.stringify(atualizado))
	}

	useEffect(() => {
		if (!entrada || !almoco || !retorno) return
		if (toMinutes(saida) < toMinutes(entrada)) return
		const agora = new Date()
		const meiaNoire = new Date(agora)
		meiaNoire.setHours(24, 0, 0, 0)
		const msAteMeiaNoite = meiaNoire - agora
		const id = setTimeout(() => {
			registrarPontoAuto()
			;['entrada', 'almoco', 'retorno'].forEach(k => localStorage.removeItem(k))
			setEntrada(''); setAlmoco(''); setRetorno('')
			autoRegistradoRef.current = false
		}, msAteMeiaNoite)
		return () => clearTimeout(id)
	}, [entrada, almoco, retorno, saida, saidaReal, jornada, historico])

	useEffect(() => {
		localStorage.setItem('jornada', jornada)
		localStorage.setItem('entrada', entrada)
		localStorage.setItem('almoco', almoco)
		localStorage.setItem('retorno', retorno)
	}, [jornada, entrada, almoco, retorno])

	useEffect(() => {
		if (!entrada || !almoco || !retorno) {
			setSaida('00:00')
			setFaltam({ horas: 0, minutos: 0 })
			setAlertas([])
			return
		}
		const jornadaMins = toMinutes(jornada)
		const intervaloMins = toMinutes(retorno) - toMinutes(almoco)
		const saidaMins = toMinutes(entrada) + jornadaMins + Math.max(0, intervaloMins)
		setSaida(fromMinutes(saidaMins % (24 * 60)))
		function atualizar() {
			const agora = new Date()
			const agoraMins = agora.getHours() * 60 + agora.getMinutes()
			const diff = saidaMins - agoraMins
			setFaltam({ horas: Math.max(0, Math.floor(diff / 60)), minutos: Math.max(0, diff % 60) })
			setAlertas(getAlertas(entrada, almoco, retorno, jornada, saidaMins, agoraMins))
		}
		atualizar()
		const id = setInterval(atualizar, 60000)
		return () => clearInterval(id)
	}, [jornada, entrada, almoco, retorno])

	useEffect(() => {
		if (!prefs.notificarFim || !entrada || !almoco || !retorno) return
		const { horas, minutos } = faltam
		const saidaMins = toMinutes(saida)
		const entradaMins = toMinutes(entrada)
		const total = saidaMins - entradaMins
		const agora = new Date()
		const agoraMins = agora.getHours() * 60 + agora.getMinutes()
		const progresso = total > 0 ? Math.min(100, Math.max(0, ((agoraMins - entradaMins) / total) * 100)) : 0
		if (horas === 0 && minutos === 0 && Math.round(progresso) === 100) {
			if (notificadoRef.current) return
			notificadoRef.current = true
			const notify = () => new Notification('Dora', { body: 'Sua jornada acabou! Hora de bater o ponto. 🎉' })
			if (Notification.permission === 'granted') notify()
			else if (Notification.permission !== 'denied') Notification.requestPermission().then(p => p === 'granted' && notify())
		} else {
			notificadoRef.current = false
		}
	}, [faltam, prefs.notificarFim, entrada])

	return (
		<div className={`min-h-screen bg-[#0d0f1a] text-white flex flex-col${prefs.tema === 'claro' ? ' light' : ''}`}>
			<Header onAbrirPrefs={() => setModalAberta(true)} tab={tab} onTab={setTab} />
			<main className={`flex-1 flex justify-center p-6 ${tab === 'banco' ? 'items-start' : 'items-center'}`}>
				{tab === 'calculadora' ? (
					<div className="w-full max-w-2xl flex flex-col gap-4">
						<div className="animate-card" style={{ animationDelay: '0ms' }}><MensagemDiaria /></div>
						<div className="animate-card bg-[#161827] rounded-3xl p-6 flex flex-col gap-4" style={{ animationDelay: '80ms' }}>
						<JornadaInput value={jornada} onAbrirPrefs={() => setModalAberta(true)} />
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<TimeInput label="Entrada" icon={<MeetingRoomIcon fontSize="small" />} value={entrada} onChange={setEntrada} />
							<TimeInput label="Almoço" icon={<RestaurantIcon fontSize="small" />} value={almoco} onChange={setAlmoco} />
							<TimeInput label="Retorno" icon={<KeyboardReturnIcon fontSize="small" />} value={retorno} onChange={setRetorno} />
						</div>
						<Resultado
							saida={saida}
							entrada={entrada}
							almoco={almoco}
							retorno={retorno}
							saidaReal={saidaReal}
							onSaidaReal={setSaidaReal}
							faltam={faltam}
							alertas={alertas}
							jornada={jornada}
							jaRegistradoHoje={historico.some(r => r.data === new Date().toLocaleDateString('pt-BR'))}
					onRegistrar={() => { registrarPonto(); setTab('banco') }}
							onLimpar={() => {
								setSaidaReal('')
								setEntrada(''); setAlmoco(''); setRetorno(''); setSaida('00:00'); setFaltam({ horas: 0, minutos: 0 })
								;['entrada', 'almoco', 'retorno'].forEach(k => localStorage.removeItem(k))
							}}
						/>
						</div>
					</div>
				) : (
					<Historico
						registros={historico}
						onLimparHistorico={() => { setHistorico([]); localStorage.removeItem('historico') }}
						onExcluirRegistro={(idx) => {
							setHistorico(prev => {
								const atualizado = prev.filter((_, i) => i !== idx)
								localStorage.setItem('historico', JSON.stringify(atualizado))
								return atualizado
							})
						}}
						onEditarRegistro={(idx, atualizado) => {
							setHistorico(prev => {
								const novo = [...prev]
								novo[idx] = atualizado
								localStorage.setItem('historico', JSON.stringify(novo))
								return novo
							})
						}}
					/>
				)}
			</main>
			<Footer />
			{modalAberta && <PreferenciasModal prefs={prefs} onSalvar={salvarPrefs} onFechar={() => setModalAberta(false)} />}
		</div>
	)
}
