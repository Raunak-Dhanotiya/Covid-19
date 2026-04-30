import React from 'react'
import { isHighDeathRatio } from '../utils/datasets'

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '--'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number' && Number.isFinite(value)) return value.toLocaleString()
  return value
}

const getPrimaryLabel = (row) =>
  row.countryRegion ||
  row.country ||
  row.provinceState ||
  row.admin2 ||
  row.date ||
  (row.id ? `Record ${row.id}` : 'Record')

function CardView({ columns, rows, canEdit, canDelete, onEdit, onDelete, emptyMessage }) {
  if (rows.length === 0) {
    return (
      <div className="app-surface rounded-[22px] px-4 py-12 text-center text-slate-400">{emptyMessage}</div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <article
          key={row.id ?? JSON.stringify(row)}
          className={`app-surface rounded-[22px] p-4 transition hover:-translate-y-0.5 hover:border-white/25 ${
            isHighDeathRatio(row) ? 'border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : ''
          }`}
        >
          <div className="mb-4 border-b border-white/10 pb-3">
            <p className="text-base font-semibold text-white">{getPrimaryLabel(row)}</p>
          </div>

          <dl className="space-y-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-start justify-between gap-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{column.label}</dt>
                <dd className="max-w-[62%] text-right text-sm text-slate-200">{formatValue(row[column.key])}</dd>
              </div>
            ))}
          </dl>

          {(canEdit || canDelete) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onEdit?.(row)}
                  className="rounded-full border border-cyan-200/40 bg-cyan-300/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 hover:bg-cyan-300/25"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete?.(row)}
                  className="rounded-full border border-rose-200/45 bg-rose-400/14 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-400/22"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function TableView({ columns, rows, canEdit, canDelete, onEdit, onDelete, emptyMessage }) {
  return (
    <div className="app-surface overflow-hidden rounded-[22px] border border-white/5 shadow-2xl">
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md text-[11px] uppercase tracking-[0.2em] text-slate-400 shadow-[0_1px_0_rgba(255,255,255,0.1)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-4 font-semibold">
                  {column.label}
                </th>
              ))}
              {(canEdit || canDelete) && <th className="px-4 py-4 text-right font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (canEdit || canDelete ? 1 : 0)}
                  className="px-4 py-16 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr 
                  key={row.id ?? JSON.stringify(row)} 
                  className={`transition-colors duration-200 group ${
                    isHighDeathRatio(row) 
                      ? 'bg-rose-500/5 hover:bg-rose-500/15' 
                      : 'hover:bg-cyan-950/30'
                  }`}
                >
                  {columns.map((column, idx) => (
                    <td key={column.key} className={`px-4 py-3.5 align-middle ${
                      idx === 0 ? 'font-medium text-white' : 'text-slate-300'
                    } ${isHighDeathRatio(row) && idx === 0 ? 'border-l-2 border-rose-500 text-rose-200 pl-3' : ''}`}>
                      {formatValue(row[column.key])}
                    </td>
                  ))}
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3.5 text-right align-middle">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit?.(row)}
                            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-400/20 transition-colors"
                            title="Edit Record"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete?.(row)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/20 transition-colors"
                            title="Delete Record"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DataTable({
  columns,
  rows,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  loading = false,
  emptyMessage = 'No data available',
  viewMode = 'table'
}) {
  if (loading) {
    return (
      <div className="app-surface space-y-3 rounded-[22px] p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-white/8" />
        ))}
      </div>
    )
  }

  if (viewMode === 'cards') {
    return (
      <CardView
        columns={columns}
        rows={rows}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyMessage={emptyMessage}
      />
    )
  }

  return (
    <TableView
      columns={columns}
      rows={rows}
      canEdit={canEdit}
      canDelete={canDelete}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage={emptyMessage}
    />
  )
}
