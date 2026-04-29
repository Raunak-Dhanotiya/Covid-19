import React from 'react'

export default function StatCard({ title, value, hint, tone = 'from-cyan-300 to-blue-400' }) {
  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-white/5 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20">
      <div className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="relative mt-2 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{title}</p>
        <p className="text-3xl font-semibold text-white">{value}</p>
        {hint && <p className="text-sm text-slate-400">{hint}</p>}
      </div>
    </article>
  )
}
