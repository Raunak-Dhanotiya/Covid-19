import React, {useEffect, useMemo, useState} from 'react'
import {motion} from 'framer-motion'
import {Link, useNavigate} from 'react-router-dom'
import StatCard from '../components/StatCard'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'
import {countryWiseApi, worldometerApi, dayWiseApi} from '../services/dataService'
import {GlobalTrendChart, RegionalDistributionChart, TopCountriesChart} from '../components/DashboardCharts'

const containerVariants={
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {staggerChildren: 0.08}}
}

const itemVariants={
  hidden: {opacity: 0, y: 16},
  visible: {opacity: 1, y: 0, transition: {duration: 0.35}}
}

const metricOptions=[
  {key: 'confirmed', label: 'Confirmed'},
  {key: 'deaths', label: 'Deaths'},
  {key: 'recovered', label: 'Recovered'},
  {key: 'active', label: 'Active'},
  {key: 'oneWeekPercentIncrease', label: '1W Growth %'}
]

const topCountOptions=[6, 8, 12]

const getMetricValue=(country, metric) => {
  if(metric==='active') {
    return Math.max((country.confirmed||0)-(country.recovered||0)-(country.deaths||0), 0)
  }
  return country?.[metric]||0
}

const formatMetricValue=(value, metric) => {
  if(metric==='oneWeekPercentIncrease') {
    return `${Number(value||0).toFixed(1)}%`
  }
  return Math.max(Number(value||0), 0).toLocaleString()
}

export default function Home() {
  const navigate=useNavigate()
  const [loading, setLoading]=useState(true)
  const [data, setData]=useState(null)
  const [refreshing, setRefreshing]=useState(false)
  const [refreshError, setRefreshError]=useState('')
  const [countrySearch, setCountrySearch]=useState('')
  const [selectedRegion, setSelectedRegion]=useState('All Regions')
  const [selectedMetric, setSelectedMetric]=useState('confirmed')
  const [topCount, setTopCount]=useState(topCountOptions[1])
  const [timelineRange, setTimelineRange]=useState('all')

  const loadDashboardData=async ({initialLoad=false}={}) => {
    if(initialLoad) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    setRefreshError('')

    try {
      const [countryRes, worldoRes, dayRes]=await Promise.all([
        countryWiseApi.list({page: 0, size: 1000, sortBy: 'confirmed'}),
        worldometerApi.list({page: 0, size: 1000, sortBy: 'totalCases'}),
        dayWiseApi.list({page: 0, size: 1000, sortBy: 'date'})
      ])

      const lastDay=dayRes?.content?.[0]||{}
      const countries=countryRes?.content||[]
      const world=worldoRes?.content||[]

      const totalConfirmed=countries.reduce((sum, c) => sum+(c.confirmed||0), 0)
      const totalDeaths=countries.reduce((sum, c) => sum+(c.deaths||0), 0)
      const totalRecovered=countries.reduce((sum, c) => sum+(c.recovered||0), 0)
      const recoveryRate=totalConfirmed>0? ((totalRecovered/totalConfirmed)*100).toFixed(1):'0.0'
      const mortalityRate=totalConfirmed>0? ((totalDeaths/totalConfirmed)*100).toFixed(1):'0.0'

      const regionBreakdown={}
      countries.forEach((country) => {
        const region=country.whoRegion||'Unknown'
        if(!regionBreakdown[region]) {
          regionBreakdown[region]={cases: 0, deaths: 0, countries: 0, region}
        }
        regionBreakdown[region].cases+=country.confirmed||0
        regionBreakdown[region].deaths+=country.deaths||0
        regionBreakdown[region].countries+=1
      })

      setData({
        globalStats: {
          totalConfirmed,
          totalDeaths,
          totalRecovered,
          recoveryRate,
          mortalityRate,
          totalCountries: countryRes?.totalElements||0,
          lastDayConfirmed: lastDay.confirmed||0,
          lastDayDeaths: lastDay.deaths||0,
          worldRows: worldoRes?.totalElements||world.length
        },
        countries,
        dayWise: dayRes?.content||[],
        regionBreakdown: Object.values(regionBreakdown).sort((a, b) => b.cases-a.cases),
        trendingCountries: countries
          .filter((country) => country.oneWeekPercentIncrease!==null&&country.oneWeekPercentIncrease!==undefined)
          .sort((a, b) => (b.oneWeekPercentIncrease||0)-(a.oneWeekPercentIncrease||0))
          .slice(0, 4)
      })
    } catch(error) {
      console.error('Failed to load dashboard data:', error)
      if(initialLoad||!data) {
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
    loadDashboardData({initialLoad: true})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topRegionCases=useMemo(() => {
    if(!data?.regionBreakdown?.length) return 0
    return data.regionBreakdown[0].cases
  }, [data?.regionBreakdown])

  const regionOptions=useMemo(() => {
    if(!data?.countries?.length) return ['All Regions']
    const uniqueRegions=[...new Set(data.countries.map((country) => country.whoRegion||'Unknown'))]
    return ['All Regions', ...uniqueRegions.sort((a, b) => a.localeCompare(b))]
  }, [data?.countries])

  const filteredCountries=useMemo(() => {
    if(!data?.countries?.length) return []

    let nextCountries=data.countries
    if(selectedRegion!=='All Regions') {
      nextCountries=nextCountries.filter((country) => (country.whoRegion||'Unknown')===selectedRegion)
    }

    const keyword=countrySearch.trim().toLowerCase()
    if(keyword) {
      nextCountries=nextCountries.filter((country) => (country.countryRegion||'').toLowerCase().includes(keyword))
    }

    return [...nextCountries].sort((a, b) => getMetricValue(b, selectedMetric)-getMetricValue(a, selectedMetric))
  }, [data?.countries, selectedRegion, countrySearch, selectedMetric])

  const filteredTotals=useMemo(() => {
    return filteredCountries.reduce(
      (acc, country) => {
        acc.confirmed+=country.confirmed||0
        acc.deaths+=country.deaths||0
        acc.recovered+=country.recovered||0
        return acc
      },
      {confirmed: 0, deaths: 0, recovered: 0}
    )
  }, [filteredCountries])

  const filteredRegionBreakdown=useMemo(() => {
    const breakdown={}
    filteredCountries.forEach((country) => {
      const region=country.whoRegion||'Unknown'
      if(!breakdown[region]) {
        breakdown[region]={value: 0, region}
      }
      breakdown[region].value+=getMetricValue(country, selectedMetric)
    })
    return Object.values(breakdown).sort((a, b) => b.value-a.value)
  }, [filteredCountries, selectedMetric])

  const selectedMetricLabel=useMemo(() => {
    return metricOptions.find((option) => option.key===selectedMetric)?.label||'Confirmed'
  }, [selectedMetric])

  const displayedCountries=useMemo(() => {
    return filteredCountries.slice(0, topCount)
  }, [filteredCountries, topCount])

  const filteredDayWise=useMemo(() => {
    if(!data?.dayWise||data.dayWise.length===0) return []
    const sorted=[...data.dayWise].sort((a, b) => new Date(a.date)-new Date(b.date))
    if(timelineRange==='30') return sorted.slice(-30)
    if(timelineRange==='90') return sorted.slice(-90)
    return sorted
  }, [data?.dayWise, timelineRange])

  if(loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <Loader />
        </main>
      </>
    )
  }

  if(!data) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1400px] px-4 py-14 text-center sm:px-6 lg:px-8">
          <div className="app-surface mx-auto max-w-xl rounded-[24px] px-6 py-10">
            <h2 className="text-3xl font-semibold text-white">Unable to load dashboard</h2>
            <p className="mt-3 text-slate-300">Please try again after backend data is available.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => loadDashboardData({initialLoad: true})}
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

  const {globalStats, regionBreakdown, trendingCountries, dayWise}=data

  return (
    <>
      <Navbar />

      <main className="pb-14">
        <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8 space-y-6">

          {/* COMPACT HERO SECTION */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[24px] border border-white/15 bg-gradient-to-br from-cyan-400/15 via-slate-900/90 to-blue-400/10 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] lg:flex lg:items-center lg:justify-between lg:gap-8"
            >
              <div className="pointer-events-none absolute -left-14 -top-14 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-8 h-56 w-56 rounded-full bg-blue-400/16 blur-3xl" />

              <div className="relative max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200/45 bg-cyan-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Global Intelligence
                  </span>

                </div>

                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  COVID-19 Pandemic Analysis
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Monitor live country-level outbreaks, compare regional patterns, and inspect historical trends from a unified, high-performance analytics surface.
                </p>
              </div>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:w-72 lg:shrink-0">
                <div className="rounded-2xl border border-white/12 bg-slate-950/55 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Total Countries</p>
                  <p className="mt-1.5 text-2xl font-semibold text-white">{globalStats.totalCountries.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-slate-950/55 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Database Rows</p>
                  <p className="mt-1.5 text-2xl font-semibold text-white">{globalStats.worldRows.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* GLOBAL STATS GRID */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                title="Confirmed"
                value={globalStats.totalConfirmed.toLocaleString()}
                hint={`Today: +${globalStats.lastDayConfirmed.toLocaleString()}`}
                tone="from-cyan-300 to-blue-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Deaths"
                value={globalStats.totalDeaths.toLocaleString()}
                hint={`Today: +${globalStats.lastDayDeaths.toLocaleString()}`}
                tone="from-rose-300 to-red-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Recovered"
                value={globalStats.totalRecovered.toLocaleString()}
                hint={`Rate: ${globalStats.recoveryRate}%`}
                tone="from-emerald-300 to-teal-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Mortality"
                value={`${globalStats.mortalityRate}%`}
                hint="Global average"
                tone="from-amber-300 to-orange-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Top Region"
                value={topRegionCases.toLocaleString()}
                hint={regionBreakdown[0]?.region||'Region'}
                tone="from-blue-300 to-cyan-400"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Coverage"
                value={globalStats.totalCountries}
                hint="Active regions"
                tone="from-violet-300 to-indigo-400"
              />
            </motion.div>
          </motion.section>

          {/* GLOBAL TREND CHART */}
          <motion.section variants={itemVariants} className="app-surface rounded-[24px] p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Global Pandemic Timeline</h2>
                <p className="mt-1 text-xs text-slate-400">Progression globally (Click legend to filter datasets)</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={timelineRange}
                  onChange={(e) => setTimelineRange(e.target.value)}
                  className="rounded-xl border border-white/15 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white outline-none transition focus:border-cyan-300/55"
                >
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            <div className="h-[300px] sm:h-[400px] w-full">
              <GlobalTrendChart dayWiseData={filteredDayWise} />
            </div>
          </motion.section>

          {/* INTERACTIVE EXPLORER & CHARTS */}
          <section className="grid gap-6 xl:grid-cols-[1fr_2fr]">

            {/* EXPLORER FILTERS */}
            <motion.article
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              className="app-surface rounded-[24px] p-5 sm:p-6 flex flex-col h-full"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">Explorer</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Live Signals</h2>
                </div>
                <button
                  type="button"
                  onClick={() => loadDashboardData()}
                  disabled={refreshing}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshing? '...':'Refresh'}
                </button>
              </div>
              {refreshError&&<p className="mt-2 text-xs text-rose-200">{refreshError}</p>}

              <div className="mt-5 grid gap-4">
                <label className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Search</span>
                  <input
                    value={countrySearch}
                    onChange={(event) => setCountrySearch(event.target.value)}
                    placeholder="e.g. India, Brazil..."
                    className="h-10 w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/55"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Region</span>
                  <select
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                    className="h-10 w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-cyan-300/55"
                  >
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </label>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Metric</span>
                  <div className="flex flex-wrap gap-2">
                    {metricOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSelectedMetric(option.key)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${selectedMetric===option.key
                          ? 'bg-cyan-300 text-slate-950'
                          :'border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2 rounded-2xl border border-white/12 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Subset Totals</p>
                    <span className="text-[10px] font-semibold text-slate-300">{filteredCountries.length} found</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Conf</p>
                      <p className="mt-1 text-sm font-semibold text-white">{filteredTotals.confirmed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Death</p>
                      <p className="mt-1 text-sm font-semibold text-white">{filteredTotals.deaths.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Recv</p>
                      <p className="mt-1 text-sm font-semibold text-white">{filteredTotals.recovered.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.article>

            {/* DASHBOARD CHARTS ROW */}
            <div className="grid gap-6 md:grid-cols-2">
              <motion.article
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                className="app-surface rounded-[24px] p-5 sm:p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">Top Impacted</h2>
                  <p className="mt-1 text-xs text-slate-400">Highest {selectedMetricLabel} countries</p>
                </div>
                <div className="h-[280px] w-full">
                  <TopCountriesChart
                    countries={displayedCountries.slice(0, 10)}
                    metric={selectedMetric}
                    metricLabel={selectedMetricLabel}
                  />
                </div>
              </motion.article>

              <motion.article
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                className="app-surface rounded-[24px] p-5 sm:p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">Regional Spread</h2>
                  <p className="mt-1 text-xs text-slate-400">{selectedMetricLabel} by WHO region</p>
                </div>
                <div className="h-[280px] w-full flex justify-center">
                  {filteredRegionBreakdown.length>0? (
                    <RegionalDistributionChart regionData={filteredRegionBreakdown} metricLabel={selectedMetricLabel} />
                  ):(
                    <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-slate-400">
                      No data to display
                    </div>
                  )}
                </div>
              </motion.article>
            </div>
          </section>

          {trendingCountries.length>0&&(
            <section className="mt-2">
              <h3 className="mb-4 text-xl font-semibold text-white">Fastest Growing Signals (Weekly)</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {trendingCountries.map((country) => (
                  <div
                    key={country.id}
                    className="app-surface rounded-[20px] p-5 transition hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-white">{country.countryRegion}</p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{country.whoRegion}</p>
                      </div>
                      <span className="rounded-md bg-rose-500/20 border border-rose-500/30 px-2 py-1 text-xs font-bold tracking-wide text-rose-300">
                        +{(country.oneWeekPercentIncrease||0).toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">New (1W)</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">+{(country.oneWeekChange||0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Conf</p>
                        <p className="mt-0.5 text-sm font-semibold text-cyan-100">{(country.confirmed||0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Deaths</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-300">{(country.deaths||0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Active</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-300">{(country.active||0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
