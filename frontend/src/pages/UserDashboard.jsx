import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import DatasetBrowser from '../components/DatasetBrowser'
import StatCard from '../components/StatCard'
import { countryWiseApi, worldometerApi, dayWiseApi } from '../services/dataService'

export default function UserDashboard() {
  const [summary, setSummary] = useState({
    datasets: 6,
    countries: 0,
    weeklyRecords: 0,
    updatedLabel: 'Live API'
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
          datasets: 6,
          countries: countryRes?.totalElements || 0,
          weeklyRecords: dayRes?.totalElements || 0,
          updatedLabel: worldRes?.content?.[0]?.countryRegion ? 'Synchronized' : 'Live API'
        })
      } catch (error) {
        console.error('Failed to load dashboard summary:', error)
      }
    }

    loadSummary()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="app-surface-strong rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">User Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">COVID-19 Data Command View</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Scan high-level indicators first, then drill into each dataset with search and sort controls. The layout is
            optimized for quick comparison, consistent with modern product dashboards.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-200/45 bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
              Read-only workspace
            </span>

          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Available Datasets"
            value={summary.datasets}
            hint="Country, Worldometer, Covid, Day, Full grouped, USA county"
            tone="from-cyan-300 to-blue-400"
          />
          <StatCard
            title="Countries Indexed"
            value={summary.countries.toLocaleString()}
            hint="Distinct country-wise records"
            tone="from-emerald-300 to-teal-400"
          />
          <StatCard
            title="Timeline Records"
            value={summary.weeklyRecords.toLocaleString()}
            hint="Day-wise historical entries"
            tone="from-amber-300 to-orange-400"
          />
          <StatCard
            title="Sync Status"
            value={summary.updatedLabel}
            hint="Based on latest API response"
            tone="from-violet-300 to-indigo-400"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="app-surface rounded-[22px] p-5">
            <h2 className="text-xl font-semibold text-white">Recommended workflow</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Start with dataset tabs to pick the perspective, then apply search and sort to isolate trends. Use
              pagination to walk through long tails without overloading one screen.
            </p>
          </div>
          <div className="app-surface rounded-[22px] p-5">
            <h2 className="text-xl font-semibold text-white">Data reliability note</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Figures can shift as upstream records are corrected. Interpret metrics as monitored indicators rather than
              immutable final counts.
            </p>
          </div>
        </section>

        <DatasetBrowser />
      </div>
    </DashboardLayout>
  )
}
