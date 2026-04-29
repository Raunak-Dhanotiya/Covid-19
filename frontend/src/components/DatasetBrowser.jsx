import React, { useEffect, useMemo, useState } from 'react'
import SectionTabs from './SectionTabs'
import DataTable from './DataTable'
import Pagination from './Pagination'
import Loader from './Loader'
import RecordFormModal from './RecordFormModal'
import SearchBar from './SearchBar'
import { datasets } from '../utils/datasets'
import useDebounce from '../hooks/useDebounce'
import {
  countryWiseApi,
  worldometerApi,
  covidApi,
  dayWiseApi,
  fullGroupedApi,
  usaCountyApi
} from '../services/dataService'

const apiMap = {
  countryWise: countryWiseApi,
  worldometer: worldometerApi,
  covid: covidApi,
  dayWise: dayWiseApi,
  fullGrouped: fullGroupedApi,
  usaCounty: usaCountyApi
}

const toOptions = Object.values(datasets).map((item) => ({ value: item.key, label: item.label }))

export default function DatasetBrowser({ canEditCountry = false }) {
  const [datasetKey, setDatasetKey] = useState('countryWise')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [viewMode, setViewMode] = useState('table')
  const [sortByByDataset, setSortByByDataset] = useState(() =>
    Object.fromEntries(Object.values(datasets).map((item) => [item.key, item.defaultSortBy]))
  )
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedRow, setSelectedRow] = useState(null)

  const config = datasets[datasetKey]
  const api = apiMap[datasetKey]
  const currentSortBy = sortByByDataset[datasetKey] || config.defaultSortBy

  const searchEnabled = config.allowSearch && Boolean(api.search)
  const sortEnabled = config.allowSort
  const debouncedSearch = useDebounce(search, 450)

  const sortOptions = useMemo(
    () => (config.sortOptions || [config.defaultSortBy]).map((value) => ({ value, label: value })),
    [config]
  )

  const loadData = async (overrides = {}) => {
    if (!api) return
    setLoading(true)
    setError('')
    try {
      const query = overrides.query ?? search
      const params = {
        page: overrides.page ?? page,
        size: overrides.size ?? size,
        sortBy: overrides.sortBy || currentSortBy
      }

      const response =
        searchEnabled && query.trim()
          ? await api.search(query.trim(), params)
          : await api.list(params)
      setData(response)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load data')
      setData({ content: [], totalPages: 0, totalElements: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
      setViewMode('cards')
    }
  }, [])

  useEffect(() => {
    setPage(0)
    setSearch('')
  }, [datasetKey])

  useEffect(() => {
    loadData({ sortBy: currentSortBy, query: debouncedSearch })
  }, [datasetKey, page, currentSortBy, size, refreshTick])

  useEffect(() => {
    if (!searchEnabled) return
    setPage(0)
    loadData({ page: 0, sortBy: currentSortBy, query: debouncedSearch })
  }, [debouncedSearch])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleSortChange = (event) => {
    const nextSort = event.target.value
    setSortByByDataset((current) => ({
      ...current,
      [datasetKey]: config.sortOptions.includes(nextSort) ? nextSort : config.defaultSortBy
    }))
    setPage(0)
  }

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value))
    setPage(0)
  }

  const runSearch = () => {
    setPage(0)
    loadData({ page: 0, sortBy: currentSortBy, query: search })
  }

  const handleRefresh = () => {
    setRefreshTick((current) => current + 1)
  }

  const handleCreateClick = () => {
    setSelectedRow(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleEdit = (row) => {
    setSelectedRow(row)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDelete = async (row) => {
    const label = row.countryRegion || row.country || row.date || row.admin2 || 'this record'
    if (!window.confirm(`Delete ${label}?`)) return
    try {
      await api.remove(row.id)
      await loadData({ query: debouncedSearch })
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleSubmitForm = async (values) => {
    try {
      if (modalMode === 'edit' && selectedRow?.id) {
        await api.update(selectedRow.id, values)
      } else {
        await api.create(values)
      }
      setModalOpen(false)
      setSelectedRow(null)
      await loadData({ query: debouncedSearch })
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  const panelStats = [
    { label: 'Records on page', value: data.content?.length || 0 },
    { label: 'Total records', value: data.totalElements || 0 },
    { label: 'Columns', value: config.columns.length }
  ]

  return (
    <div className="space-y-6">
      <section className="app-surface-strong rounded-[28px] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100/80">Data Workspace</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{config.label}</h2>
            <p className="text-sm leading-6 text-slate-300">
              Explore, filter, and compare backend records in a single control surface. Search updates automatically and
              the view adapts for mobile cards or desktop tables.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {panelStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              viewMode === 'table'
                ? 'border-cyan-200/45 bg-cyan-300 text-slate-950'
                : 'border-white/20 bg-white/8 text-slate-200 hover:bg-white/14'
            }`}
          >
            Table view
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              viewMode === 'cards'
                ? 'border-cyan-200/45 bg-cyan-300 text-slate-950'
                : 'border-white/20 bg-white/8 text-slate-200 hover:bg-white/14'
            }`}
          >
            Card view
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:bg-white/14"
          >
            Refresh
          </button>
          {canEditCountry && datasetKey === 'countryWise' && (
            <button
              type="button"
              onClick={handleCreateClick}
              className="rounded-full border border-cyan-200/45 bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Add Country Record
            </button>
          )}
        </div>
      </section>

      <SectionTabs value={datasetKey} options={toOptions} onChange={setDatasetKey} />

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="app-surface rounded-[22px] p-4">
          {searchEnabled ? (
            <SearchBar
              value={search}
              onChange={handleSearch}
              onSubmit={runSearch}
              placeholder={`Search ${config.label.toLowerCase()}`}
            />
          ) : (
            <div className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-slate-400">
              Search is not available for this dataset.
            </div>
          )}
        </div>

        <div className="app-surface rounded-[22px] p-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {sortEnabled ? (
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sort by</span>
                <select
                  value={currentSortBy}
                  onChange={handleSortChange}
                  className="h-12 rounded-xl border border-white/15 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-cyan-300/65"
                >
                  {sortOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="text-sm text-slate-400">Sorting not available for this dataset.</p>
            )}

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Rows per page</span>
              <select
                value={size}
                onChange={handleSizeChange}
                className="h-12 rounded-xl border border-white/15 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-cyan-300/65"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-300/30 bg-rose-400/16 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={config.columns}
          rows={data.content || []}
          canEdit={canEditCountry && datasetKey === 'countryWise'}
          canDelete={canEditCountry && datasetKey === 'countryWise'}
          onEdit={handleEdit}
          onDelete={handleDelete}
          viewMode={viewMode}
        />
      )}

      <section className="app-surface flex flex-col gap-4 rounded-[22px] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-300">
          Showing <span className="font-semibold text-white">{data.content?.length || 0}</span> records out of{' '}
          <span className="font-semibold text-white">{(data.totalElements || 0).toLocaleString()}</span>
        </div>
        <Pagination page={page} totalPages={data.totalPages || 1} onPageChange={setPage} />
      </section>

      {datasetKey === 'countryWise' && canEditCountry && (
        <RecordFormModal
          open={modalOpen}
          mode={modalMode}
          initialValues={selectedRow}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  )
}
