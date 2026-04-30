import React, {useEffect, useMemo, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

export default function RecordFormModal({open, mode, initialValues, onClose, onSubmit, formFields}) {
  const initialState=useMemo(() => {
    if(!formFields) return {}
    return formFields.reduce((acc, field) => {
      acc[field.key]=field.type==='number'? '':''
      return acc
    }, {})
  }, [formFields])

  const [form, setForm]=useState(initialState)

  useEffect(() => {
    if(open) {
      setForm({
        ...initialState,
        ...(initialValues||{})
      })
    }
  }, [open, initialValues, initialState])

  const title=useMemo(() => (mode==='edit'? 'Edit Record':'Add Record'), [mode])

  if(!formFields) return null

  const handleChange=(key, type, value) => {
    setForm((current) => ({
      ...current,
      [key]: type==='number'? value:value
    }))
  }

  const handleSubmit=(e) => {
    e.preventDefault()

    // Normalize fields
    const normalized={...form}
    formFields.forEach(field => {
      if(field.type==='number') {
        normalized[field.key]=form[field.key]===''||form[field.key]===null||form[field.key]===undefined? null:Number(form[field.key])
      }
    })

    onSubmit(normalized)
  }

  return (
    <AnimatePresence>
      {open&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 10}}
            transition={{type: 'spring', duration: 0.5, bounce: 0}}
            className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-transparent backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* LEFT SIDE: Context Panel */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-transparent p-8 md:w-2/5 border-r border-white/5">
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-cyan-300 shadow-inner">
                  {mode==='edit'? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  ):(
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  )}
                </div>
                <h3 className="text-3xl font-semibold text-white tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {mode==='edit'
                    ? 'Modify the underlying database record. Changes will propagate instantly across all active dashboard views and API endpoints.'
                    :'Create a new entry in the selected dataset. Ensure all required metrics are provided accurately.'}
                </p>
              </div>


            </div>

            {/* RIGHT SIDE: Form Panel */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 flex-1">
                  {formFields.map((field) => (
                    <label key={field.key} className="flex flex-col gap-2 relative group">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">{field.label}</span>
                      <input
                        value={form[field.key]??''}
                        onChange={(e) => handleChange(field.key, field.type, e.target.value)}
                        type={field.type}
                        step={field.step}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="rounded-xl border border-white/20 bg-transparent px-4 py-3.5 text-sm text-white outline-none transition hover:border-white/40 focus:border-cyan-400 focus:bg-white/5 focus:ring-1 focus:ring-cyan-400/50"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                  >
                    {mode==='edit'? 'Save Changes':'Create Record'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
