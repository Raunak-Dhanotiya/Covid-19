import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import DatasetBrowser from '../components/DatasetBrowser'
import { countryWiseApi, worldometerApi, dayWiseApi } from '../services/dataService'

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    managedRecords: 0,
    globalRecords: 0,
    timelineRecords: 0
  })

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [countryRes, worldRes, dayRes] = await Promise.all([
          countryWiseApi.list({ page: 0, size: 1, sortBy: 'confirmed' }),
          worldometerApi.list({ page: 0, size: 1, sortBy: 'totalCases' }),
          dayWiseApi.list({ page: 0, size: 1, sortBy: 'date' })
        ])

        setSummary({
          managedRecords: countryRes?.totalElements || 0,
          globalRecords: worldRes?.totalElements || 0,
          timelineRecords: dayRes?.totalElements || 0
        })
      } catch (error) {
        console.error('Failed to load admin summary:', error)
      }
    }

    loadSummary()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <section className="app-surface-strong relative overflow-hidden rounded-[28px] border border-white/10 p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="pointer-events-none absolute -left-14 -top-14 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-8 h-56 w-56 rounded-full bg-blue-400/16 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-rose-200/45 bg-rose-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-200">
                Admin Console
              </span>
              <span className="rounded-full border border-cyan-200/45 bg-cyan-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Data Governance
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">System Control Center</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Manage core datasets, monitor data health, and configure live system records. Admin tools are scoped to editable datasets only.
            </p>
          </div>

          <div className="relative mt-6 grid gap-3 grid-cols-2 lg:mt-0 lg:w-[480px] lg:shrink-0">
             <div className="rounded-2xl border border-white/12 bg-slate-950/55 p-4 flex flex-col justify-center">
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Editable Records</p>
               <p className="mt-1 text-2xl font-semibold text-cyan-300">{summary.managedRecords.toLocaleString()}</p>
             </div>
             <div className="rounded-2xl border border-white/12 bg-slate-950/55 p-4 flex flex-col justify-center">
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Global Dataset</p>
               <p className="mt-1 text-2xl font-semibold text-emerald-300">{summary.globalRecords.toLocaleString()}</p>
             </div>
             <div className="rounded-2xl border border-white/12 bg-slate-950/55 p-4 flex flex-col justify-center">
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Timeline Rows</p>
               <p className="mt-1 text-2xl font-semibold text-violet-300">{summary.timelineRecords.toLocaleString()}</p>
             </div>
             <div className="rounded-2xl border border-white/12 bg-slate-950/55 p-4 flex flex-col justify-center">
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">System Status</p>
               <div className="flex items-center gap-2 mt-2">
                 <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                 <span className="text-sm font-semibold text-white">Online</span>
               </div>
             </div>
          </div>
        </section>

        <DatasetBrowser canEditCountry />
      </div>
    </DashboardLayout>
  )
}
