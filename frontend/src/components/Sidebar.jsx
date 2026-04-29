import React from 'react'
import { NavLink } from 'react-router-dom'

const navigationItems = (role) => [
  { label: 'Overview', to: '/user/dashboard', icon: '01' },
  { label: 'Public Home', to: '/home', icon: '02' },
  ...(role === 'ADMIN' ? [{ label: 'Admin Panel', to: '/admin/dashboard', icon: '03' }] : []),
  { label: 'Login', to: '/login', icon: '04' }
]

export default function Sidebar({ role }) {
  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'border-cyan-300/45 bg-cyan-300/15 text-cyan-100'
        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
    }`

  return (
    <aside className="hidden w-[290px] shrink-0 lg:block">
      <div className="app-surface sticky top-24 rounded-[26px] p-4">
        <div className="rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/16 to-blue-400/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/85">Navigation</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Control Center</h3>
          <p className="mt-1 text-sm text-slate-300">Role: {role || 'USER'}</p>
        </div>

        <nav className="mt-4 space-y-2">
          {navigationItems(role).map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <span>{item.label}</span>
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] text-slate-300 group-hover:text-white">
                {item.icon}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
