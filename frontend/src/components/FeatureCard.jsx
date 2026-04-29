import React from 'react'
import { motion } from 'framer-motion'

const colorMap = {
  cyan: 'from-cyan-300/16 to-blue-400/10 border-cyan-200/25',
  blue: 'from-blue-300/16 to-indigo-400/10 border-blue-200/25',
  emerald: 'from-emerald-300/16 to-teal-400/10 border-emerald-200/25',
  amber: 'from-amber-300/16 to-orange-400/10 border-amber-200/25',
  rose: 'from-rose-300/16 to-red-400/10 border-rose-200/25',
  violet: 'from-violet-300/16 to-indigo-400/10 border-violet-200/25'
}

export default function FeatureCard({ icon, title, description, color = 'cyan', link, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full rounded-[24px] border bg-gradient-to-br p-6 text-left shadow-[0_16px_36px_rgba(0,0,0,0.25)] backdrop-blur-xl transition ${
        colorMap[color] || colorMap.cyan
      }`}
    >
      <p className="mb-4 text-4xl">{icon}</p>
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      {link && (
        <span className="mt-5 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
          {link}
        </span>
      )}
    </motion.button>
  )
}
