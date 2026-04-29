import React, { useEffect, useMemo, useState } from 'react'
import { countryWiseFormFields } from '../utils/datasets'

const initialState = countryWiseFormFields.reduce((acc, field) => {
  acc[field.key] = field.type === 'number' ? '' : ''
  return acc
}, {})

export default function RecordFormModal({ open, mode, initialValues, onClose, onSubmit }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (open) {
      setForm({
        ...initialState,
        ...(initialValues || {})
      })
    }
  }, [open, initialValues])

  const title = useMemo(() => (mode === 'edit' ? 'Edit Country Record' : 'Add Country Record'), [mode])

  if (!open) return null

  const handleChange = (key, type, value) => {
    setForm((current) => ({
      ...current,
      [key]: type === 'number' ? value : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalized = {
      ...form,
      confirmed: form.confirmed === '' ? null : Number(form.confirmed),
      deaths: form.deaths === '' ? null : Number(form.deaths),
      recovered: form.recovered === '' ? null : Number(form.recovered),
      active: form.active === '' ? null : Number(form.active),
      newCases: form.newCases === '' ? null : Number(form.newCases),
      newDeaths: form.newDeaths === '' ? null : Number(form.newDeaths),
      newRecovered: form.newRecovered === '' ? null : Number(form.newRecovered),
      deathsPer100Cases: form.deathsPer100Cases === '' ? null : Number(form.deathsPer100Cases),
      recoveredPer100Cases: form.recoveredPer100Cases === '' ? null : Number(form.recoveredPer100Cases),
      deathsPer100Recovered: form.deathsPer100Recovered === '' ? null : Number(form.deathsPer100Recovered),
      confirmedLastWeek: form.confirmedLastWeek === '' ? null : Number(form.confirmedLastWeek),
      oneWeekChange: form.oneWeekChange === '' ? null : Number(form.oneWeekChange),
      oneWeekPercentIncrease: form.oneWeekPercentIncrease === '' ? null : Number(form.oneWeekPercentIncrease)
    }
    onSubmit(normalized)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 px-4 py-6 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/15 bg-slate-950/96 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">
              Manage detailed country-wise fields from the backend entity.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/20"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {countryWiseFormFields.map((field) => (
            <label key={field.key} className="flex flex-col gap-2">
              <span className="text-sm text-slate-300">{field.label}</span>
              <input
                value={form[field.key] ?? ''}
                onChange={(e) => handleChange(field.key, field.type, e.target.value)}
                type={field.type}
                step={field.step}
                className="rounded-xl border border-white/15 bg-slate-950/65 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
              />
            </label>
          ))}
          <div className="md:col-span-2 mt-2 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/18"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-cyan-200/45 bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_10px_26px_rgba(103,232,249,0.3)]"
            >
              {mode === 'edit' ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
