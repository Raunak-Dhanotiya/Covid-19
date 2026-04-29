import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import DatasetBrowser from '../components/DatasetBrowser'
import StatCard from '../components/StatCard'
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
      <div className="space-y-6">
        <section className="app-surface-strong rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Data Governance Console</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Manage country-wise records directly from this panel while still using the same analysis-first dataset
            experience. Admin tools are scoped to editable datasets only.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-amber-200/45 bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100">
              CRUD enabled
            </span>
            <span className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-xs font-semibold text-slate-200">
              Country-wise edit scope
            </span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Role"
            value="ADMIN"
            hint="Full management privileges"
            tone="from-amber-300 to-orange-400"
          />
          <StatCard
            title="Editable Records"
            value={summary.managedRecords.toLocaleString()}
            hint="Country-wise dataset entries"
            tone="from-cyan-300 to-blue-400"
          />
          <StatCard
            title="Global Dataset Rows"
            value={summary.globalRecords.toLocaleString()}
            hint="Worldometer records in catalog"
            tone="from-emerald-300 to-teal-400"
          />
          <StatCard
            title="Timeline Rows"
            value={summary.timelineRecords.toLocaleString()}
            hint="Day-wise historical rows"
            tone="from-violet-300 to-indigo-400"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="app-surface rounded-[22px] p-5">
            <h2 className="text-xl font-semibold text-white">Editing protocol</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Validate each edit against trusted sources before saving. Delete actions are irreversible and should be
              used only for data quality corrections.
            </p>
          </div>
          <div className="app-surface rounded-[22px] p-5">
            <h2 className="text-xl font-semibold text-white">Audit awareness</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Because upstream reporting can be revised, preserve consistency in naming and numeric precision to avoid
              accidental analytical drift.
            </p>
          </div>
        </section>

        <DatasetBrowser canEditCountry />
      </div>
    </DashboardLayout>
  )
}
