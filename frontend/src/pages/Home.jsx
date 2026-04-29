import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import FeatureCard from '../components/FeatureCard'
import { countryWiseApi, worldometerApi, dayWiseApi } from '../services/dataService'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
}

const metricOptions = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'deaths', label: 'Deaths' },
  { key: 'recovered', label: 'Recovered' },
  { key: 'active', label: 'Active' },
  { key: 'oneWeekPercentIncrease', label: '1W Growth %' }
]

const topCountOptions = [6, 8, 12]

const getMetricValue = (country, metric) => {
  if (metric === 'active') {
    return Math.max((country.confirmed || 0) - (country.recovered || 0) - (country.deaths || 0), 0)
  }
  return country?.[metric] || 0
}

const formatMetricValue = (value, metric) => {
  if (metric === 'oneWeekPercentIncrease') {
    return `${Number(value || 0).toFixed(1)}%`
  }
  return Math.max(Number(value || 0), 0).toLocaleString()
}

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')
  const [selectedMetric, setSelectedMetric] = useState('confirmed')
  const [topCount, setTopCount] = useState(topCountOptions[1])

  const loadDashboardData = async ({ initialLoad = false } = {}) => {
    if (initialLoad) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    setRefreshError('')

    try {
      const [countryRes, worldoRes, dayRes] = await Promise.all([
        countryWiseApi.list({ page: 0, size: 60, sortBy: 'confirmed' }),
        worldometerApi.list({ page: 0, size: 30, sortBy: 'totalCases' }),
        dayWiseApi.list({ page: 0, size: 26, sortBy: 'date' })
      ])

      const lastDay = dayRes?.content?.[0] || {}
      const countries = countryRes?.content || []
      const world = worldoRes?.content || []

      const totalConfirmed = countries.reduce((sum, c) => sum + (c.confirmed || 0), 0)
      const totalDeaths = countries.reduce((sum, c) => sum + (c.deaths || 0), 0)
      const totalRecovered = countries.reduce((sum, c) => sum + (c.recovered || 0), 0)
      const recoveryRate = totalConfirmed > 0 ? ((totalRecovered / totalConfirmed) * 100).toFixed(1) : '0.0'
      const mortalityRate = totalConfirmed > 0 ? ((totalDeaths / totalConfirmed) * 100).toFixed(1) : '0.0'

      const regionBreakdown = {}
      countries.forEach((country) => {
        const region = country.whoRegion || 'Unknown'
        if (!regionBreakdown[region]) {
          regionBreakdown[region] = { cases: 0, deaths: 0, countries: 0 }
        }
        regionBreakdown[region].cases += country.confirmed || 0
        regionBreakdown[region].deaths += country.deaths || 0
        regionBreakdown[region].countries += 1
      })

      setData({
        globalStats: {
          totalConfirmed,
          totalDeaths,
          totalRecovered,
          recoveryRate,
          mortalityRate,
          totalCountries: countryRes?.totalElements || 0,
          lastDayConfirmed: lastDay.confirmed || 0,
          lastDayDeaths: lastDay.deaths || 0,
          worldRows: worldoRes?.totalElements || world.length
        },
        countries,
        regionBreakdown: Object.entries(regionBreakdown)
          .map(([region, stats]) => ({ region, ...stats }))
          .sort((a, b) => b.cases - a.cases),
        trendingCountries: countries
          .filter((country) => country.oneWeekPercentIncrease !== null && country.oneWeekPercentIncrease !== undefined)
          .sort((a, b) => (b.oneWeekPercentIncrease || 0) - (a.oneWeekPercentIncrease || 0))
          .slice(0, 4)
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      if (initialLoad || !data) {
        setData(null)
      } else {
        setRefreshError('Refresh failed. Showing last successful snapshot.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData({ initialLoad: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topRegionCases = useMemo(() => {
    if (!data?.regionBreakdown?.length) return 0
    return data.regionBreakdown[0].cases
  }, [data?.regionBreakdown])

  const regionOptions = useMemo(() => {
    if (!data?.countries?.length) return ['All Regions']
    const uniqueRegions = [...new Set(data.countries.map((country) => country.whoRegion || 'Unknown'))]
    return ['All Regions', ...uniqueRegions.sort((a, b) => a.localeCompare(b))]
  }, [data?.countries])

  const filteredCountries = useMemo(() => {
    if (!data?.countries?.length) return []

    let nextCountries = data.countries
    if (selectedRegion !== 'All Regions') {
      nextCountries = nextCountries.filter((country) => (country.whoRegion || 'Unknown') === selectedRegion)
    }

    const keyword = countrySearch.trim().toLowerCase()
    if (keyword) {
      nextCountries = nextCountries.filter((country) => (country.countryRegion || '').toLowerCase().includes(keyword))
    }

    return [...nextCountries].sort((a, b) => getMetricValue(b, selectedMetric) - getMetricValue(a, selectedMetric))
  }, [data?.countries, selectedRegion, countrySearch, selectedMetric])

  const filteredTotals = useMemo(() => {
    return filteredCountries.reduce(
      (acc, country) => {
        acc.confirmed += country.confirmed || 0
        acc.deaths += country.deaths || 0
        acc.recovered += country.recovered || 0
        return acc
      },
      { confirmed: 0, deaths: 0, recovered: 0 }
    )
  }, [filteredCountries])

  const selectedMetricLabel = useMemo(() => {
    return metricOptions.find((option) => option.key === selectedMetric)?.label || 'Confirmed'
  }, [selectedMetric])

  const displayedCountries = useMemo(() => {
    return filteredCountries.slice(0, topCount)
  }, [filteredCountries, topCount])

  const topMetricValue = useMemo(() => {
    if (!displayedCountries.length) return 0
    return getMetricValue(displayedCountries[0], selectedMetric)
  }, [displayedCountries, selectedMetric])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Loader />
        </main>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <div className="app-surface mx-auto max-w-xl rounded-[24px] px-6 py-10">
            <h2 className="text-3xl font-semibold text-white">Unable to load dashboard</h2>
            <p className="mt-3 text-slate-300">Please try again after backend data is available.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => loadDashboardData({ initialLoad: true })}
                type="button"
                className="rounded-full border border-cyan-200/40 bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/login')}
                type="button"
                className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Sign in
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  const { globalStats, regionBreakdown, trendingCountries } = data

  return (
    <>
      <Navbar />

      <main className="pb-14">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 xl:grid-cols-[1.02fr_1fr]"
          >
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-br from-cyan-400/15 via-slate-900/90 to-blue-400/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-8"
            >
              <div className="pointer-events-none absolute -left-14 -top-14 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-8 h-56 w-56 rounded-full bg-blue-400/16 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200/45 bg-cyan-300/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Global COVID-19 Tracker
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                    Public Home Intelligence
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                  Faster pandemic intelligence for teams and decision makers
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor country-level outbreaks, compare regional patterns, and inspect historical trends from a
                  unified analytics surface built for clarity and faster action.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/user/dashboard"
                    className="rounded-full border border-cyan-200/45 bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={() => navigate('/login')}
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Sign in
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-slate-200">
                    Source: Spring Boot API
                  </span>
                  <span className="rounded-full border border-white/20 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-slate-200">
                    Responsive data explorer
                  </span>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/12 bg-slate-950/55 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Countries</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{globalStats.totalCountries.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-slate-950/55 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Latest Day Cases</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{globalStats.lastDayConfirmed.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-slate-950/55 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">World Rows</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{globalStats.worldRows.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-b from-slate-900/88 to-slate-950/88 p-5 shadow-[0_20px_65px_rgba(0,0,0,0.42)] sm:p-6"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-4 h-48 w-48 rounded-full bg-blue-300/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Interactive Explorer</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Filter and rank live country signals</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadDashboardData()}
                    disabled={refreshing}
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                {refreshError && <p className="mt-3 text-xs text-rose-200">{refreshError}</p>}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Search country</span>
                    <input
                      value={countrySearch}
                      onChange={(event) => setCountrySearch(event.target.value)}
                      placeholder="e.g. India, Brazil, US"
                      className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/55"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">WHO region</span>
                    <select
                      value={selectedRegion}
                      onChange={(event) => setSelectedRegion(event.target.value)}
                      className="h-11 w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-cyan-300/55"
                    >
                      {regionOptions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {metricOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSelectedMetric(option.key)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        selectedMetric === option.key
                          ? 'bg-cyan-300 text-slate-950'
                          : 'border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {topCountOptions.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setTopCount(count)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                          topCount === count
                            ? 'border-cyan-200/50 bg-cyan-300/20 text-cyan-100'
                            : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Top {count}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCountrySearch('')
                      setSelectedRegion('All Regions')
                      setSelectedMetric('confirmed')
                      setTopCount(topCountOptions[1])
                    }}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Clear filters
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/12 bg-slate-950/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Live subset totals
                    </p>
                    <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-200">
                      {filteredCountries.length} countries
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Confirmed</p>
                      <p className="mt-1 text-lg font-semibold text-white">{filteredTotals.confirmed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Deaths</p>
                      <p className="mt-1 text-lg font-semibold text-white">{filteredTotals.deaths.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Recovered</p>
                      <p className="mt-1 text-lg font-semibold text-white">{filteredTotals.recovered.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  {displayedCountries.slice(0, 5).map((country, index) => {
                    const metricValue = getMetricValue(country, selectedMetric)
                    const barWidth = topMetricValue > 0 ? Math.max((metricValue / topMetricValue) * 100, 5) : 0
                    return (
                      <div
                        key={country.id || `${country.countryRegion}-${index}`}
                        className="rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{country.countryRegion}</p>
                            <p className="text-xs text-slate-400">{country.whoRegion || 'Unknown'}</p>
                          </div>
                          <p className="text-sm font-semibold text-cyan-100">{formatMetricValue(metricValue, selectedMetric)}</p>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            style={{ width: `${barWidth}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
                          />
                        </div>
                      </div>
                    )
                  })}

                  {displayedCountries.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/20 bg-slate-950/45 px-4 py-5 text-sm text-slate-300">
                      No countries match the current filters. Clear filters to restore full coverage.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                title="Confirmed"
                value={globalStats.totalConfirmed.toLocaleString()}
                hint={`Latest day: ${globalStats.lastDayConfirmed.toLocaleString()}`}
                tone="from-cyan-300 to-blue-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Deaths"
                value={globalStats.totalDeaths.toLocaleString()}
                hint={`Latest day: ${globalStats.lastDayDeaths.toLocaleString()}`}
                tone="from-rose-300 to-red-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Recovered"
                value={globalStats.totalRecovered.toLocaleString()}
                hint={`Recovery rate: ${globalStats.recoveryRate}%`}
                tone="from-emerald-300 to-teal-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Mortality"
                value={`${globalStats.mortalityRate}%`}
                hint="Deaths over confirmed"
                tone="from-amber-300 to-orange-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Coverage"
                value={globalStats.totalCountries}
                hint="Countries in feed"
                tone="from-violet-300 to-indigo-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Top Region Cases"
                value={topRegionCases.toLocaleString()}
                hint={regionBreakdown[0]?.region || 'Region'}
                tone="from-blue-300 to-cyan-400"
              />
            </motion.div>
          </motion.section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="app-surface rounded-[26px] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Highest Impact Countries</h2>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {selectedMetricLabel} • Top {displayedCountries.length}
                </span>
              </div>
              <div className="space-y-2">
                {displayedCountries.map((country, index) => (
                  <div
                    key={country.id || `${country.countryRegion}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-300/22 text-xs font-semibold text-cyan-100">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{country.countryRegion}</p>
                        <p className="text-xs text-slate-400">{country.whoRegion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-100">
                        {formatMetricValue(getMetricValue(country, selectedMetric), selectedMetric)}
                      </p>
                      <p className="text-xs text-slate-400">{(country.deaths || 0).toLocaleString()} deaths</p>
                    </div>
                  </div>
                ))}
                {displayedCountries.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/20 bg-slate-950/45 px-4 py-6 text-center text-sm text-slate-300">
                    No countries found for current filters.
                  </div>
                )}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="app-surface rounded-[26px] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Regional Distribution</h2>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  WHO Regions
                </span>
              </div>
              <div className="space-y-4">
                {regionBreakdown.slice(0, 7).map((region) => {
                  const width = topRegionCases > 0 ? (region.cases / topRegionCases) * 100 : 0
                  return (
                    <div key={region.region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-200">{region.region}</p>
                        <p className="text-sm text-slate-300">{region.cases.toLocaleString()}</p>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          style={{ width: `${width}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.article>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <FeatureCard
              icon="📊"
              title="Interactive Data Explorer"
              description="Switch datasets instantly, run focused search queries, and sort by critical indicators from one analysis-first interface."
              color="cyan"
              link="Open User Dashboard"
              onClick={() => navigate('/user/dashboard')}
            />
            <FeatureCard
              icon="🧭"
              title="Operational Monitoring"
              description="Follow trend changes and compare regional distribution blocks to identify hotspots before they become systemic."
              color="emerald"
              link="Track Regional Signals"
              onClick={() => navigate('/user/dashboard')}
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <FeatureCard
              icon="🛡️"
              title="Role-based Security"
              description="Use controlled access with JWT-backed sessions so analytics and data management remain separated by role."
              color="blue"
              link="Review Access"
              onClick={() => navigate('/login')}
            />
            <FeatureCard
              icon="⚙️"
              title="Admin Record Management"
              description="Admin users can create, edit, and delete country-wise records through a dedicated governance workflow."
              color="amber"
              link="Open Admin Panel"
              onClick={() => navigate('/admin/dashboard')}
            />
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="app-surface rounded-[22px] p-5">
              <h3 className="text-xl font-semibold text-white">Data interpretation note</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Reported counts may be revised by official sources over time. Treat values as monitored indicators and
                verify critical decisions with latest public health bulletins.
              </p>
            </div>
            <div className="app-surface rounded-[22px] p-5">
              <h3 className="text-xl font-semibold text-white">Open analysis workflow</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The dashboard is designed to move from overview to detailed records: global metrics first, then
                country/region drill-down, then dataset-level inspection for action.
              </p>
            </div>
          </section>

          {trendingCountries.length > 0 && (
            <section className="mt-8">
              <h3 className="mb-4 text-2xl font-semibold text-white">Fastest Growing Signals</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {trendingCountries.map((country) => (
                  <div
                    key={country.id}
                    className="app-surface rounded-[20px] p-4 transition hover:-translate-y-0.5"
                  >
                    <p className="text-sm font-semibold text-white">{country.countryRegion}</p>
                    <p className="mt-3 text-3xl font-semibold text-rose-200">
                      +{(country.oneWeekPercentIncrease || 0).toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Weekly increase</p>
                    <p className="mt-4 text-xs text-slate-300">{(country.confirmed || 0).toLocaleString()} confirmed</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
