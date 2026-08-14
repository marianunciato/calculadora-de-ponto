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
import { toMinutes, fromMinutes } from './utils/time'
import { getAlertas } from './utils/alertas'

const PREFS_DEFAULT = { salvarDados: true, jornadaPadrao: '08:48', tolerancia: 10, notificarFim: false }
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
  const notificadoRef = useRef(false)

  function salvarPrefs(novasPrefs) {
    setPrefs(novasPrefs)
    localStorage.setItem('preferencias', JSON.stringify(novasPrefs))
    setJornada(novasPrefs.jornadaPadrao)
    if (novasPrefs.notificarFim && Notification.permission === 'default') Notification.requestPermission()
    setModalAberta(false)
  }

  function registrarPonto() {
    if (!entrada || !saida || saida === '00:00') return
    const hoje = new Date().toLocaleDateString('pt-BR')
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
    if (faltam.horas === 0 && faltam.minutos === 0 && entrada) {
      setSaidaReal(prev => prev || saida)
    }
  }, [faltam, entrada, saida])

  useEffect(() => {
    window.addEventListener('beforeunload', registrarPonto)
    return () => window.removeEventListener('beforeunload', registrarPonto)
  }, [entrada, saida, almoco, retorno, jornada, historico])

  useEffect(() => {
    localStorage.setItem('jornada', jornada)
    localStorage.setItem('entrada', entrada)
    localStorage.setItem('almoco', almoco)
    localStorage.setItem('retorno', retorno)
  }, [jornada, entrada, almoco, retorno])

  useEffect(() => {
    const jornadaMins = toMinutes(jornada)
    const intervaloMins = toMinutes(retorno) - toMinutes(almoco)
    const saidaMins = toMinutes(entrada) + jornadaMins + Math.max(0, intervaloMins)
    setSaida(fromMinutes(saidaMins % (24 * 60)))
    const agora = new Date()
    const agoraMins = agora.getHours() * 60 + agora.getMinutes()
    const diff = saidaMins - agoraMins
    setFaltam({ horas: Math.max(0, Math.floor(diff / 60)), minutos: Math.max(0, diff % 60) })
    setAlertas(entrada && almoco && retorno ? getAlertas(entrada, almoco, retorno, jornada, saidaMins, agoraMins) : [])
  }, [jornada, entrada, almoco, retorno])

  useEffect(() => {
    if (!prefs.notificarFim || !entrada) return
    if (faltam.horas === 0 && faltam.minutos === 0) {
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
    <div className="min-h-screen bg-[#0d0f1a] text-white flex flex-col">
      <Header onAbrirPrefs={() => setModalAberta(true)} tab={tab} onTab={setTab} />
      <main className={`flex-1 flex justify-center p-6 ${tab === 'banco' ? 'items-start' : 'items-center'}`}>
        {tab === 'calculadora' ? (
          <div className="bg-[#161827] rounded-3xl p-6 w-full max-w-2xl flex flex-col gap-4">
            <JornadaInput value={jornada} onAbrirPrefs={() => setModalAberta(true)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TimeInput label="Entrada" icon={<MeetingRoomIcon fontSize="small" />} value={entrada} onChange={setEntrada} />
              <TimeInput label="Almoço" icon={<RestaurantIcon fontSize="small" />} value={almoco} onChange={setAlmoco} />
              <TimeInput label="Retorno" icon={<KeyboardReturnIcon fontSize="small" />} value={retorno} onChange={setRetorno} />
            </div>
            <Resultado
              saida={saida}
              entrada={entrada}
              saidaReal={saidaReal}
              onSaidaReal={setSaidaReal}
              faltam={faltam}
              alertas={alertas}
              onRegistrar={() => { registrarPonto(); setTab('banco') }}
              onLimpar={() => {
                setSaidaReal('')
                setEntrada(''); setAlmoco(''); setRetorno(''); setSaida('00:00'); setFaltam({ horas: 0, minutos: 0 })
                ;['entrada', 'almoco', 'retorno'].forEach(k => localStorage.removeItem(k))
              }}
            />
          </div>
        ) : (
          <Historico
            registros={historico}
            onLimparHistorico={() => { setHistorico([]); localStorage.removeItem('historico') }}
          />
        )}
      </main>
      <Footer />
      {modalAberta && <PreferenciasModal prefs={prefs} onSalvar={salvarPrefs} onFechar={() => setModalAberta(false)} />}
    </div>
  )
}
