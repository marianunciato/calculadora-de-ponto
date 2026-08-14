import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { ALERTA_STYLES } from '../utils/alertas'

export default function Resultado({ saida, faltam, alertas, onLimpar }) {
  return (
    <>
      <div className="flex flex-col items-center gap-1 py-2">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/60">Seu horário de saída é</p>
      </div>

      <div className="bg-[#1e2030] rounded-xl p-6 flex flex-col items-center gap-2">
        <span className="text-6xl font-thin tracking-widest">{saida}</span>
        <p className="text-xs tracking-widest text-white/70 uppercase">
          Faltam <strong className="text-white">{faltam.horas} horas</strong> e{' '}
          <strong className="text-white">{faltam.minutos} minutos</strong> para a sua saída
        </p>
      </div>

      {alertas.map((alerta, i) => {
        const { bg, text, Icon } = ALERTA_STYLES[alerta.tipo]
        return (
          <div key={i} className={`${bg} ${text} rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-medium`}>
            <Icon fontSize="small" />
            <span>{alerta.msg}</span>
          </div>
        )
      })}

      <div className="flex gap-3">
        <button
          onClick={onLimpar}
          className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 transition-colors rounded-xl py-4 text-xs font-bold tracking-[0.25em] uppercase w-full lg:w-1/3"
        >
          <RestartAltIcon fontSize="small" />
          Limpar
        </button>
        <a
          href="https://stou.ifractal.com.br/fulltime//phonto.php"
          target="_blank"
          rel="noreferrer"
          className="bg-purple-600 hover:bg-purple-700 transition-colors rounded-xl py-4 text-xs font-bold tracking-[0.25em] uppercase flex-1 hidden lg:flex items-center justify-center"
        >
          Ir para página de ponto
        </a>
      </div>
    </>
  )
}
