import React, { useContext, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [open, setOpen] = useState(false)

  const displayName = useMemo(
    () => user?.user?.username || user?.user?.name || user?.role || 'Guest',
    [user]
  )

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-cyan-300 text-slate-950 shadow-[0_8px_24px_rgba(103,232,249,0.35)]'
        : 'text-slate-200 hover:bg-white/10 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-400 text-base font-bold text-slate-950 shadow-[0_10px_26px_rgba(103,232,249,0.32)]">
            CV
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Pandemic</p>
            <p className="text-base font-semibold text-white sm:text-lg">COVID-19 Intelligence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/user/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin/dashboard" className={navClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <Link
              to="/login"
              className="rounded-full border border-cyan-200/40 bg-cyan-300/90 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Sign in
            </Link>
          ) : (
            <>
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
                {displayName}
              </div>
              <button
                onClick={logout}
                className="rounded-full border border-rose-300/35 bg-rose-400/15 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/22"
                type="button"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 md:hidden"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" onClick={() => setOpen(false)} className={navClass}>
              Home
            </NavLink>
            <NavLink to="/user/dashboard" onClick={() => setOpen(false)} className={navClass}>
              Dashboard
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className={navClass}>
                Admin
              </NavLink>
            )}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-cyan-300 px-4 py-2 text-center text-sm font-semibold text-slate-950"
              >
                Sign in
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="rounded-xl border border-rose-300/35 bg-rose-400/15 px-4 py-2 text-sm font-semibold text-rose-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
