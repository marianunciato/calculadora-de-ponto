import ScheduleIcon from '@mui/icons-material/Schedule'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10">
      <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
        <ScheduleIcon fontSize="small" />
        <span className="text-purple-200">Dora</span>
      </div>
      <span className="hidden sm:block text-md font-bold tracking-[0.3em] text-white/70 uppercase">Calculadora de Ponto</span>
      <div className="hidden sm:block w-20" />
    </header>
  )
}
