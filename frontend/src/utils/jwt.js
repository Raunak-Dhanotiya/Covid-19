export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export function getRoleFromToken(token) {
  const payload = decodeJwt(token)
  return payload?.role || 'USER'
}

export function normalizeAuth(raw) {
  if (!raw) return null
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!parsed) return null
    const role = parsed.role || (parsed.token ? getRoleFromToken(parsed.token) : 'USER')
    return {
      token: parsed.token || '',
      role,
      user: parsed.user || null,
      message: parsed.message || ''
    }
  } catch {
    return null
  }
}

