import React, {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export default function Register() {
  const {register}=useContext(AuthContext)
  const [username, setUsername]=useState('')
  const [password, setPassword]=useState('')
  const [role, setRole]=useState('USER')
  const [error, setError]=useState('')
  const [loading, setLoading]=useState(false)

  const handle=async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register({username, password, role})
    } catch(err) {
      setError(err.response?.data?.message||err.message||'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] rounded-full  blur-[120px]" />
        <div className="absolute -left-1/4 -bottom-1/4 h-[800px] w-[800px] rounded-full blur-[120px]" />
      </div>

      <section className="relative grid w-full max-w-5xl gap-8 rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-3xl md:grid-cols-[1fr_1fr] md:p-12 overflow-hidden">

        {/* LEFT PANEL: Context */}
        <div className="flex flex-col justify-center p-4 order-2 md:order-1">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></span>
            Create Account
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Join the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">console.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-400">
            Registration supports strict role-based access. Choose USER for standard analytics or ADMIN for full CRUD control.
          </p>
        </div>

        {/* RIGHT PANEL: Form */}
        <form onSubmit={handle} className="flex flex-col justify-center p-4 order-1 md:order-2">
          <div className="space-y-6">
            <label className="flex flex-col gap-2 relative group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Username</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="new_user" className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition-all hover:bg-white/10 focus:border-violet-400 focus:bg-white/10 focus:ring-4 focus:ring-violet-400/10 placeholder:text-slate-600" />
            </label>
            <label className="flex flex-col gap-2 relative group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition-all hover:bg-white/10 focus:border-violet-400 focus:bg-white/10 focus:ring-4 focus:ring-violet-400/10 placeholder:text-slate-600" />
            </label>
            <label className="flex flex-col gap-2 relative group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Role Assignment</span>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition-all hover:bg-white/10 focus:border-violet-400 focus:bg-white/10 focus:ring-4 focus:ring-violet-400/10 appearance-none">
                <option value="USER" className="bg-slate-900">USER (Analytics only)</option>
                <option value="ADMIN" className="bg-slate-900">ADMIN (Full access)</option>
              </select>
            </label>
          </div>
          {error&&<div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-medium text-rose-200 flex items-center gap-3"><svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={loading} className="w-full sm:w-auto rounded-2xl bg-violet-400 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(167,139,250,0.3)] transition-all hover:bg-violet-300 hover:shadow-[0_0_40px_rgba(167,139,250,0.5)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
              {loading? 'Creating...':'Register account'}
            </button>
            <Link to="/login" className="text-sm font-semibold text-slate-400 transition hover:text-violet-300">Sign in instead &rarr;</Link>
          </div>
        </form>
      </section>
    </main>
  )
}

