import React, {useEffect, useMemo, useState} from 'react'
import SectionTabs from './SectionTabs'
import DataTable from './DataTable'
import Pagination from './Pagination'
import Loader from './Loader'
import RecordFormModal from './RecordFormModal'
import SearchBar from './SearchBar'
import {datasets, isHighDeathRatio} from '../utils/datasets'
import useDebounce from '../hooks/useDebounce'
import {
  countryWiseApi,
  worldometerApi,
  covidApi,
  dayWiseApi,
  fullGroupedApi,
  usaCountyApi
} from '../services/dataService'

const apiMap={
  countryWise: countryWiseApi,
  worldometer: worldometerApi,
  covid: covidApi,
  dayWise: dayWiseApi,
  fullGrouped: fullGroupedApi,
  usaCounty: usaCountyApi
}

const toOptions=Object.values(datasets).map((item) => ({value: item.key, label: item.label}))

export default function DatasetBrowser({canEditCountry=false}) {
  const [datasetKey, setDatasetKey]=useState('countryWise')
  const [page, setPage]=useState(0)
  const [size, setSize]=useState(10)
  const [viewMode, setViewMode]=useState('table')
  const [sortByByDataset, setSortByByDataset]=useState(() =>
    Object.fromEntries(Object.values(datasets).map((item) => [item.key, item.defaultSortBy]))
  )
  const [search, setSearch]=useState('')
  const [loading, setLoading]=useState(false)
  const [refreshTick, setRefreshTick]=useState(0)
  const [data, setData]=useState({content: [], totalPages: 0, totalElements: 0})
  const [error, setError]=useState('')
  const [modalOpen, setModalOpen]=useState(false)
  const [modalMode, setModalMode]=useState('create')
  const [selectedRow, setSelectedRow]=useState(null)
  const [dangerZoneOnly, setDangerZoneOnly]=useState(false)

  const config=datasets[datasetKey]
  const api=apiMap[datasetKey]
  const currentSortBy=sortByByDataset[datasetKey]||config.defaultSortBy

  const searchEnabled=config.allowSearch&&Boolean(api.search)
  const sortEnabled=config.allowSort
  const debouncedSearch=useDebounce(search, 450)

  const sortOptions=useMemo(
    () => (config.sortOptions||[config.defaultSortBy]).map((value) => ({value, label: value})),
    [config]
  )

  const loadData=async (overrides={}) => {
    if(!api) return
    setLoading(true)
    setError('')
    try {
      const query=overrides.query??search
      const params={
        page: overrides.page??page,
        size: overrides.size??size,
        sortBy: overrides.sortBy||currentSortBy,
        dangerZone: overrides.dangerZone??dangerZoneOnly
      }

      const response=
        searchEnabled&&query.trim()
          ? await api.search(query.trim(), params)
          :await api.list(params)
      setData(response)
    } catch(err) {
      setError(err.response?.data?.message||'Unable to load data')
      setData({content: [], totalPages: 0, totalElements: 0})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(typeof window!=='undefined'&&window.matchMedia('(max-width: 768px)').matches) {
      setViewMode('cards')
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setSearch('')
  }, [datasetKey])

  useEffect(() => {
    loadData({sortBy: currentSortBy, query: debouncedSearch, dangerZone: dangerZoneOnly})
  }, [datasetKey, page, currentSortBy, size, refreshTick, debouncedSearch, dangerZoneOnly])

  const handleSearch=(event) => {
    setSearch(event.target.value)
  }

  const handleSortChange=(event) => {
    const nextSort=event.target.value
    setSortByByDataset((current) => ({
      ...current,
      [datasetKey]: config.sortOptions.includes(nextSort)? nextSort:config.defaultSortBy
    }))
    setPage(0)
  }

  const handleSizeChange=(event) => {
    setSize(Number(event.target.value))
    setPage(0)
  }

  const runSearch=() => {
    setPage(0)
    loadData({page: 0, sortBy: currentSortBy, query: search})
  }

  const handleRefresh=() => {
    setRefreshTick((current) => current+1)
  }

  const handleCreateClick=() => {
    setSelectedRow(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleEdit=(row) => {
    setSelectedRow(row)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDelete=async (row) => {
    const label=row.countryRegion||row.country||row.date||row.admin2||'this record'
    if(!window.confirm(`Delete ${label}?`)) return
    try {
      await api.remove(row.id)
      await loadData({query: debouncedSearch})
    } catch(err) {
      setError(err.response?.data?.message||'Delete failed')
    }
  }

  const handleSubmitForm=async (values) => {
    try {
      if(modalMode==='edit'&&selectedRow?.id) {
        await api.update(selectedRow.id, values)
      } else {
        await api.create(values)
      }
      setModalOpen(false)
      setSelectedRow(null)
      await loadData({query: debouncedSearch})
    } catch(err) {
      setError(err.response?.data?.message||'Save failed')
    }
  }

  const displayedRows=data.content||[]

  const panelStats=[
    {label: 'Records on page', value: displayedRows.length},
    {label: 'Total records', value: data.totalElements||0},
    {label: 'Columns', value: config.columns.length}
  ]

  return (
    <div className="space-y-4">
      <div className="app-surface rounded-[22px] p-4 flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 shadow-xl border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full 2xl:w-auto">
          <SectionTabs value={datasetKey} options={toOptions} onChange={setDatasetKey} />

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          {searchEnabled&&(
            <div className="w-full md:w-96">
              <SearchBar
                value={search}
                onChange={handleSearch}
                onSubmit={runSearch}
                placeholder={`Search ${config.label.toLowerCase()}`}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full 2xl:w-auto">
          {sortEnabled&&(
            <div className="flex items-center gap-2 border border-white/10 rounded-xl bg-slate-950/60 p-1">
              <select
                value={currentSortBy}
                onChange={handleSortChange}
                className="h-8 bg-transparent px-2 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
              >
                {sortOptions.map((item) => (
                  <option key={item.value} value={item.value}>Sort: {item.label}</option>
                ))}
              </select>
              <div className="h-4 w-px bg-white/20"></div>
              <button
                type="button"
                onClick={() => {
                  setDangerZoneOnly(!dangerZoneOnly)
                  setPage(0)
                }}
                className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${dangerZoneOnly
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                  :'text-slate-400 hover:text-white border border-transparent'
                  }`}
              >
                Danger Zone
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 border border-white/10 rounded-xl bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${viewMode==='table'? 'bg-white/10 text-white':'text-slate-400 hover:text-white'}`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${viewMode==='cards'? 'bg-white/10 text-white':'text-slate-400 hover:text-white'}`}
            >
              Grid
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
          >
            Refresh
          </button>

          {canEditCountry&&(
            <button
              type="button"
              onClick={handleCreateClick}
              className="rounded-xl border border-cyan-200/45 bg-cyan-300 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-cyan-200 shadow-[0_0_15px_rgba(103,232,249,0.2)]"
            >
              + Add Record
            </button>
          )}
        </div>
      </div>

      {error&&(
        <div className="rounded-xl border border-rose-300/30 bg-rose-400/16 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {loading? (
        <Loader />
      ):(
        <DataTable
          columns={config.columns}
          rows={displayedRows}
          canEdit={canEditCountry}
          canDelete={canEditCountry}
          onEdit={handleEdit}
          onDelete={handleDelete}
          viewMode={viewMode}
        />
      )}

      <section className="app-surface flex flex-col gap-4 rounded-[22px] p-4 lg:flex-row lg:items-center lg:justify-between sticky bottom-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border border-white/5">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-300">
            Showing <span className="font-semibold text-white">{displayedRows.length}</span> records out of{' '}
            <span className="font-semibold text-white">{(data.totalElements||0).toLocaleString()}</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <label className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Rows:</span>
            <select
              value={size}
              onChange={handleSizeChange}
              className="h-8 rounded-lg border border-white/15 bg-slate-950/70 px-2 text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
        <Pagination page={page} totalPages={data.totalPages||1} onPageChange={setPage} />
      </section>

      {canEditCountry&&(
        <RecordFormModal
          open={modalOpen}
          mode={modalMode}
          initialValues={selectedRow}
          formFields={config.formFields}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  )
}
