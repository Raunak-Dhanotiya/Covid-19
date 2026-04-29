import React from 'react'

export default function Pagination({ page, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(totalPages || 1, 1)

  const prev = () => onPageChange(Math.max(0, page - 1))
  const next = () => onPageChange(Math.min(safeTotalPages - 1, page + 1))

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={prev}
        disabled={page <= 0}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>
      <div className="rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-200">
        Page {page + 1} of {safeTotalPages}
      </div>
      <button
        type="button"
        onClick={next}
        disabled={page >= safeTotalPages - 1}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
