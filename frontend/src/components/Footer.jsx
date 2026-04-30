import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-300/20 px-2 py-1 text-[10px] font-bold tracking-widest text-cyan-200">
                PANDEMIC
              </span>
              <span className="text-lg font-semibold text-white tracking-wide">COVID-19 Intelligence</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A high-performance situational awareness dashboard delivering real-time epidemiological data, regional spread patterns, and global trajectory analysis.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">Navigation</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-cyan-200 transition">Public Home</Link></li>
              <li><Link to="/user/dashboard" className="hover:text-cyan-200 transition">User Dashboard</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-cyan-200 transition">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">Architecture</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>Spring Boot Data API</li>
              <li>PostgreSQL RDBMS</li>
              <li>React + Tailwind CSS</li>
              <li>Chart.js Visualization</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">System Status</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                <span>API Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                <span>Database Online</span>
              </div>
              <p className="pt-2 text-xs text-slate-500">Live data fetching enabled.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} COVID-19 Intelligence Tracker. Open Source Analysis Workflow.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
