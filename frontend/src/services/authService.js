import api from './api'
import { normalizeAuth } from '../utils/jwt'

const login = async ({ username, password }) => {
  const { data } = await api.post('/auth/login', { username, password })
  const payload = normalizeAuth({ token: data.token, message: data.message, user: data.user })
  localStorage.setItem('auth', JSON.stringify(payload))
  return payload
}

const register = async (payload) => {
  const body = {
    username: payload.username,
    password: payload.password,
    role: payload.role || 'USER'
  }

  const { data } = await api.post('/auth/register', body)
  if (typeof data === 'string') {
    if (data.toLowerCase().includes('success')) {
      return login({ username: payload.username, password: payload.password })
    }
    throw new Error(data)
  }

  if (data && data.token) {
    const out = normalizeAuth({ token: data.token, message: data.message, user: data.user })
    localStorage.setItem('auth', JSON.stringify(out))
    return out
  }

  return login({ username: payload.username, password: payload.password })
}

export default { login, register }

