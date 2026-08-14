import WorkHistoryIcon from '@mui/icons-material/WorkHistory'

export default function JornadaInput({ value, onChange }) {
  return (
    <div className="bg-[#1e2030] rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <WorkHistoryIcon className="text-purple-400" />
        <div>
          <p className="text-xs font-bold tracking-widest uppercase">Jornada Diária</p>
          <p className="text-xs text-white/40">Meta de horas diárias</p>
        </div>
      </div>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-transparent text-white text-2xl font-light outline-none text-right"
      />
    </div>
  )
}
