export default function TimeInput({ label, icon, value, onChange }) {
	return (
		<div className="bg-[#1e2030] rounded-2xl p-4 flex flex-col gap-2" style={{ boxShadow: 'inset 0 2px 0 var(--accent-muted), inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 6px rgba(0,0,0,0.1)' }}>
			<div className="flex items-center gap-2 accent-text text-xs font-bold uppercase tracking-widest">
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
