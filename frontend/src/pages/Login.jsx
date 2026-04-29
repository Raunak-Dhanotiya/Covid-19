import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ username, password })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-violet-500/25 via-slate-950 to-cyan-500/20 p-8">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
            Welcome back
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Sign in to your dashboard</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
            Access your role-based dashboard, view live analytics, and manage COVID data efficiently.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 px-4 py-3">JWT authentication and automatic role-based redirect</div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">Responsive UI with modern analytics styling</div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">Protected admin routes and CRUD record management</div>
          </div>
        </div>

        <form onSubmit={handle} className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Sign in</h2>
          <p className="mt-2 text-sm text-slate-400">Use your backend user credentials.</p>
          <div className="mt-6 space-y-4">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60" />
          </div>
          {error && <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:scale-[1.01] disabled:opacity-60">
              {loading ? 'Signing in...' : 'Login'}
            </button>
            <Link to="/register" className="text-sm text-cyan-200 hover:text-cyan-100">Create a new account</Link>
          </div>
        </form>
      </section>
    </main>
  )
}

