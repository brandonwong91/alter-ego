export type PollinationsMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const USER_KEY_STORAGE = 'alterEgo.pollinations.userKey'
const AUTH_STATE_STORAGE = 'alterEgo.pollinations.authState'

export function getPollinationsUserKey() {
  if (typeof window === 'undefined') return null
  const key = window.localStorage.getItem(USER_KEY_STORAGE)
  return key && key.startsWith('sk_') ? key : null
}

export function setPollinationsUserKey(apiKey: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USER_KEY_STORAGE, apiKey)
}

export function clearPollinationsUserKey() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(USER_KEY_STORAGE)
}

export function beginPollinationsAuthState() {
  if (typeof window === 'undefined') return ''
  const state = `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
  window.localStorage.setItem(AUTH_STATE_STORAGE, state)
  return state
}

export function consumePollinationsRedirect(): { apiKey?: string; error?: string } {
  if (typeof window === 'undefined') return {}
  if (!window.location.hash) return {}

  const params = new URLSearchParams(window.location.hash.slice(1))
  const apiKey = params.get('api_key') ?? undefined
  const error = params.get('error') ?? undefined
  const state = params.get('state') ?? undefined

  const expectedState = window.localStorage.getItem(AUTH_STATE_STORAGE) ?? undefined
  if (expectedState && state && expectedState !== state) {
    return { error: 'state_mismatch' }
  }

  if (apiKey && apiKey.startsWith('sk_')) {
    setPollinationsUserKey(apiKey)
  }

  window.localStorage.removeItem(AUTH_STATE_STORAGE)

  const nextUrl = `${window.location.pathname}${window.location.search}`
  window.history.replaceState({}, '', nextUrl)

  return apiKey ? { apiKey } : error ? { error } : {}
}

export function buildPollinationsAuthorizeUrl(input: {
  redirectUri: string
  clientId?: string
  state?: string
}) {
  const params = new URLSearchParams({
    redirect_uri: input.redirectUri,
  })
  if (input.clientId) params.set('client_id', input.clientId)
  if (input.state) params.set('state', input.state)
  return `https://enter.pollinations.ai/authorize?${params.toString()}`
}

export async function pollinationsChatCompletion(input: {
  apiKey: string
  model?: string
  messages: PollinationsMessage[]
}) {
  const res = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: input.model ?? 'openai',
      messages: input.messages,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Pollinations request failed (${res.status})`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Pollinations response missing content')
  return content
}

export function buildPollinationsImageUrl(input: {
  prompt: string
  apiKey?: string
  model?: string
}) {
  const url = new URL(`https://gen.pollinations.ai/image/${encodeURIComponent(input.prompt)}`)
  url.searchParams.set('model', input.model ?? 'flux')
  if (input.apiKey) url.searchParams.set('key', input.apiKey)
  return url.toString()
}

