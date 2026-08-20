import { useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

const MAX_CHARS = 18

export default function Polaroid({ id, rotate = -3, style = {} }) {
	const [src, setSrc] = useState(() => localStorage.getItem(`polaroid-${id}`) ?? null)
	const [legenda, setLegenda] = useState(() => localStorage.getItem(`polaroid-legenda-${id}`) ?? '')
	const inputRef = useRef()

	function handleFile(e) {
		const file = e.target.files[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = (ev) => {
			setSrc(ev.target.result)
			localStorage.setItem(`polaroid-${id}`, ev.target.result)
		}
		reader.readAsDataURL(file)
	}

	function remover(e) {
		e.stopPropagation()
		setSrc(null)
		localStorage.removeItem(`polaroid-${id}`)
	}

	function handleLegenda(e) {
		const val = e.target.value.slice(0, MAX_CHARS)
		setLegenda(val)
		localStorage.setItem(`polaroid-legenda-${id}`, val)
	}

	return (
		<div
			style={{ transform: `rotate(${rotate}deg)`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', ...style }}
			className="bg-white p-2 pb-2 w-48 shrink-0 cursor-pointer group"
			onClick={() => inputRef.current.click()}
			title={src ? 'Clique para trocar a foto' : 'Clique para adicionar uma foto'}
		>
			<div className="w-full aspect-square bg-black/10 overflow-hidden relative">
				{src ? (
					<>
						<img src={src} alt="" className="w-full h-full object-cover" />
						<button
							onClick={remover}
							title="Remover foto"
							className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
						>
							<DeleteOutlineIcon fontSize="small" />
						</button>
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center text-black/20 group-hover:text-black/40 transition-colors">
						<AddPhotoAlternateIcon />
					</div>
				)}
			</div>
			<div className="h-8 flex items-center justify-center" onClick={e => e.stopPropagation()}>
				<input
					type="text"
					value={legenda}
					onChange={handleLegenda}
					placeholder="legenda..."
					maxLength={MAX_CHARS}
					className="w-full text-center text-black/70 placeholder:text-black/25 bg-transparent outline-none text-md"
					style={{ fontFamily: "'Caveat', cursive", fontSize: '1.3rem' }}
				/>
			</div>
			<input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
		</div>
	)
}
