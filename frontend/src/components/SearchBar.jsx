import React from 'react'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search' }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <label className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-white/15 bg-slate-950/70 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
        />
      </label>
      <button
        type="submit"
        className="h-12 rounded-xl border border-cyan-200/40 bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:min-w-[122px]"
      >
        Search
      </button>
    </form>
  )
}
