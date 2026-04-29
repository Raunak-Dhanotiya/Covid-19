import React from 'react'

export default function Loader() {
  return (
    <div className="app-surface flex min-h-64 items-center justify-center rounded-[22px]">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300" />
    </div>
  )
}
