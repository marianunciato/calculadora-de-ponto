export default function TimeInput({ label, icon, value, onChange }) {
  return (
    <div className="bg-[#1e2030] rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-transparent text-white text-2xl font-light w-full outline-none"
      />
    </div>
  )
}
