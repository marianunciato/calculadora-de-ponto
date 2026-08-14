import { toMinutes } from './time'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined'
import CoffeeIcon from '@mui/icons-material/Coffee'

export function getAlertas(entrada, almoco, retorno, jornada, saidaMins, agoraMins) {
  const alertas = []
  const entradaMins = toMinutes(entrada)
  const almocoMins = toMinutes(almoco)
  const retornoMins = toMinutes(retorno)
  const jornadaMins = toMinutes(jornada)
  const intervaloMins = retornoMins - almocoMins

  if (jornadaMins === 0)
    return [{ tipo: 'erro', msg: 'Jornada diária não pode ser zero.' }]

  if (almocoMins <= entradaMins)
    alertas.push({ tipo: 'erro', msg: 'O horário de almoço deve ser após a entrada.' })

  if (retornoMins <= almocoMins)
    alertas.push({ tipo: 'erro', msg: 'O retorno deve ser após o horário de almoço.' })

  if (intervaloMins > 0 && intervaloMins < 15)
    alertas.push({ tipo: 'aviso', msg: 'Intervalo muito curto (menos de 15 minutos).' })

  if (saidaMins >= 24 * 60)
    alertas.push({ tipo: 'aviso', msg: 'Horário de saída passa da meia-noite.' })

  if (alertas.length > 0) return alertas

  if (agoraMins >= almocoMins && agoraMins < retornoMins)
    return [{ tipo: 'info', msg: 'Você está no intervalo de almoço.' }]

  if (agoraMins >= saidaMins)
    return [{ tipo: 'concluido', msg: 'Você já pode ter batido o ponto de saída!' }]

  return []
}

export const ALERTA_STYLES = {
  erro:      { bg: 'bg-red-500/10 border border-red-500/30',       text: 'text-red-400',    Icon: ErrorOutlineIcon },
  aviso:     { bg: 'bg-yellow-500/10 border border-yellow-500/30', text: 'text-yellow-400', Icon: WarningAmberIcon },
  info:      { bg: 'bg-blue-500/10 border border-blue-500/30',     text: 'text-blue-400',   Icon: CoffeeIcon },
  concluido: { bg: 'bg-green-500/10 border border-green-500/30',   text: 'text-green-400',  Icon: CheckCircleOutlineIcon },
}
