const CLIENT_ID = 'a12f681d4a1b4bd2b4d25e599b9bf661'
const REDIRECT_URI = 'https://dora-ponto.vercel.app/'
const SCOPES = 'user-read-currently-playing user-read-playback-state'

function gerarCodeVerifier() {
	const array = new Uint8Array(64)
	crypto.getRandomValues(array)
	return btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function gerarCodeChallenge(verifier) {
	const data = new TextEncoder().encode(verifier)
	const digest = await crypto.subtle.digest('SHA-256', data)
	return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function iniciarLoginSpotify() {
	const verifier = gerarCodeVerifier()
	const challenge = await gerarCodeChallenge(verifier)
	localStorage.setItem('spotify_verifier', verifier)
	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: 'code',
		redirect_uri: REDIRECT_URI,
		scope: SCOPES,
		code_challenge_method: 'S256',
		code_challenge: challenge,
	})
	window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function trocarCodigoPorToken(code) {
	const verifier = localStorage.getItem('spotify_verifier')
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			grant_type: 'authorization_code',
			code,
			redirect_uri: REDIRECT_URI,
			code_verifier: verifier,
		}),
	})
	const data = await res.json()
	if (data.access_token) {
		localStorage.setItem('spotify_token', data.access_token)
		localStorage.setItem('spotify_refresh', data.refresh_token)
		localStorage.setItem('spotify_expires', Date.now() + data.expires_in * 1000)
	}
	localStorage.removeItem('spotify_verifier')
	return data
}

export async function refreshToken() {
	const refresh = localStorage.getItem('spotify_refresh')
	if (!refresh) return null
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			grant_type: 'refresh_token',
			refresh_token: refresh,
		}),
	})
	const data = await res.json()
	if (data.access_token) {
		localStorage.setItem('spotify_token', data.access_token)
		localStorage.setItem('spotify_expires', Date.now() + data.expires_in * 1000)
		if (data.refresh_token) localStorage.setItem('spotify_refresh', data.refresh_token)
	}
	return data.access_token ?? null
}

export async function getToken() {
	const expires = Number(localStorage.getItem('spotify_expires') ?? 0)
	if (Date.now() < expires - 60000) return localStorage.getItem('spotify_token')
	return refreshToken()
}

export function desconectarSpotify() {
	['spotify_token', 'spotify_refresh', 'spotify_expires', 'spotify_verifier'].forEach(k => localStorage.removeItem(k))
}

export function spotifyConectado() {
	return !!localStorage.getItem('spotify_refresh')
}

export async function getNowPlaying() {
	const token = await getToken()
	if (!token) return null
	const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
		headers: { Authorization: `Bearer ${token}` },
	})
	if (res.status === 204 || res.status === 401) return null
	if (!res.ok) return null
	const data = await res.json()
	if (!data?.item) return null
	return {
		nome: data.item.name,
		artista: data.item.artists.map(a => a.name).join(', '),
		capa: data.item.album.images[1]?.url ?? data.item.album.images[0]?.url,
		tocando: data.is_playing,
		url: data.item.external_urls.spotify,
	}
}
