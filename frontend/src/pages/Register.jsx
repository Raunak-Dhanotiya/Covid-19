import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const { register } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register({ username, password, role })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl lg:grid-cols-[1fr_0.95fr] lg:p-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-950 to-violet-500/25 p-8 order-2 lg:order-1">
          <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-violet-200/80">
            Create account
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Register with your role.</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
            Registration now matches the backend contract, including a role field that defaults to USER and supports ADMIN when allowed.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 px-4 py-3">Username + password are required</div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">Role is submitted with the backend register request</div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">Auto-login after successful registration</div>
          </div>
        </div>

        <form onSubmit={handle} className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 sm:p-8 order-1 lg:order-2">
          <h2 className="text-2xl font-semibold text-white">Create account</h2>
          <p className="mt-2 text-sm text-slate-400">Choose USER for normal access or ADMIN if you need record management.</p>
          <div className="mt-6 space-y-4">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/60">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {error && <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:scale-[1.01] disabled:opacity-60">
              {loading ? 'Creating...' : 'Register'}
            </button>
            <Link to="/login" className="text-sm text-cyan-200 hover:text-cyan-100">Already have an account?</Link>
          </div>
        </form>
      </section>
    </main>
  )
}

