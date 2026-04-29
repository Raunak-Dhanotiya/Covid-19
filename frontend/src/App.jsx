import React from 'react'
import RoutesIndex from './routes/Routes'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <RoutesIndex />
    </AuthProvider>
  )
}

