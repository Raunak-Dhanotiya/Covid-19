import React from 'react'

export default function Card({ title, value, accent }) {
  return (
    <div className="p-4 rounded-xl glass flex flex-col gap-2">
      <div className="text-sm text-slate-300">{title}</div>
      <div className="text-2xl font-semibold" style={{ color: accent }}>{value}</div>
    </div>
  )
}

