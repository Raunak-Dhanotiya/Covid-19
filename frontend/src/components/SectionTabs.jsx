import React from 'react'

export default function SectionTabs({ value, options, onChange }) {
  return (
    <div className="app-surface overflow-x-auto rounded-[22px] p-2">
      <div className="flex min-w-max gap-2">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-cyan-300 text-slate-950 shadow-[0_8px_24px_rgba(103,232,249,0.35)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
