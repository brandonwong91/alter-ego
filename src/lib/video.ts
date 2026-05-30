export function normalizeVideoUrl(value: string) {
  return value.trim()
}

function stripQueryAndHash(url: string) {
  return url.split('#')[0].split('?')[0]
}

export function isDirectVideoUrl(url: string) {
  const cleaned = normalizeVideoUrl(url)
  if (!cleaned) return false

  if (
    cleaned.startsWith('/') ||
    cleaned.startsWith('./') ||
    cleaned.startsWith('../')
  ) {
    const pathname = stripQueryAndHash(cleaned).toLowerCase()
    return pathname.endsWith('.mp4') || pathname.endsWith('.webm')
  }

  try {
    const u = new URL(cleaned)
    const pathname = stripQueryAndHash(u.pathname).toLowerCase()
    return pathname.endsWith('.mp4') || pathname.endsWith('.webm')
  } catch {
    return false
  }
}
