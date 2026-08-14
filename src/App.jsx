import { useState, useEffect } from 'react'
import './App.css'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Header from './components/Header'
import JornadaInput from './components/JornadaInput'
import TimeInput from './components/TimeInput'
import Resultado from './components/Resultado'
import { toMinutes, fromMinutes } from './utils/time'
import { getAlertas } from './utils/alertas'

export default function App() {
  const [jornada, setJornada] = useState(() => localStorage.getItem('jornada') ?? '')
  const [entrada, setEntrada] = useState(() => localStorage.getItem('entrada') ?? '')
  const [almoco, setAlmoco] = useState(() => localStorage.getItem('almoco') ?? '')
  const [retorno, setRetorno] = useState(() => localStorage.getItem('retorno') ?? '')
  const [saida, setSaida] = useState('00:00')
  const [faltam, setFaltam] = useState({ horas: 0, minutos: 0 })
  const [alertas, setAlertas] = useState([])

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

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#161827] rounded-2xl p-6 w-full max-w-2xl flex flex-col gap-4">
          <JornadaInput value={jornada} onChange={setJornada} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TimeInput label="Entrada" icon={<MeetingRoomIcon fontSize="small" />} value={entrada} onChange={setEntrada} />
            <TimeInput label="Almoço" icon={<RestaurantIcon fontSize="small" />} value={almoco} onChange={setAlmoco} />
            <TimeInput label="Retorno" icon={<KeyboardReturnIcon fontSize="small" />} value={retorno} onChange={setRetorno} />
          </div>
          <Resultado
            saida={saida}
            faltam={faltam}
            alertas={alertas}
            onLimpar={() => { setEntrada(''); setAlmoco(''); setRetorno(''); setSaida('00:00'); setFaltam({ horas: 0, minutos: 0 }); ['entrada','almoco','retorno'].forEach(k => localStorage.removeItem(k)) }}
          />
        </div>
      </main>
    </div>
  )
}
