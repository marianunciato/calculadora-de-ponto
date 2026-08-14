import { useEffect, useState } from 'react'
import { toMinutes } from '../utils/time'

export default function ProgressBar({ entrada, saida }) {
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    function calcular() {
      const entradaMins = toMinutes(entrada)
      const saidaMins = toMinutes(saida)
      const total = saidaMins - entradaMins
      if (!entrada || total <= 0) return setProgresso(0)
      const agora = new Date()
      const agoraMins = agora.getHours() * 60 + agora.getMinutes()
      setProgresso(Math.min(100, Math.max(0, ((agoraMins - entradaMins) / total) * 100)))
    }
    calcular()
    const id = setInterval(calcular, 60000)
    return () => clearInterval(id)
  }, [entrada, saida])

  const cumprido = Math.round(progresso)
  const restante = 100 - cumprido

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs text-white/50 tracking-widest uppercase">
        <span>Cumprido <strong className="text-white">{cumprido}%</strong></span>
        <span>Restante <strong className="text-white">{restante}%</strong></span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${cumprido}%` }}
        />
      </div>
    </div>
  )
}
