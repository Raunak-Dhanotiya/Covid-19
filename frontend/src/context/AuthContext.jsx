import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { clearAuth, getAuth, setAuth } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getAuth())

  useEffect(() => {
    if (user) {
      setAuth(user)
    } else {
      clearAuth()
    }
  }, [user])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    setUser(res)
    navigate(res?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard')
    return res
  }

  const register = async (payload) => {
    const res = await authService.register(payload)
    setUser(res)
    navigate(res?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard')
    return res
  }

  const logout = () => {
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

