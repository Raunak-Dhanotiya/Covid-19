import React from 'react'

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
          className="app-surface rounded-[22px] p-4 transition hover:-translate-y-0.5 hover:border-white/25"
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
    <div className="app-surface overflow-hidden rounded-[22px]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-slate-950/40 text-[11px] uppercase tracking-[0.2em] text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
              {(canEdit || canDelete) && <th className="px-4 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (canEdit || canDelete ? 1 : 0)}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id ?? JSON.stringify(row)} className="transition hover:bg-white/5">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-top text-slate-200">
                      {formatValue(row[column.key])}
                    </td>
                  ))}
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
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
