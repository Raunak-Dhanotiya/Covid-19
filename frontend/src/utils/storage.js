import { normalizeAuth } from './jwt'

export function setAuth(obj) {
  localStorage.setItem('auth', JSON.stringify(obj))
}

export function getAuth() {
  try {
    return normalizeAuth(localStorage.getItem('auth'))
  } catch {
    return null
  }
}

export function clearAuth() { localStorage.removeItem('auth') }

