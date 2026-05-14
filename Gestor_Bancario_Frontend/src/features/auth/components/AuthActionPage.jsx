import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../../app/layouts/AuthShell.jsx'

const fieldClassName =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(6,182,212,0.12)]'

export const AuthActionPage = ({
  eyebrow,
  title,
  subtitle,
  summaryTitle,
  summaryText,
  fields,
  initialValues,
  submitLabel,
  onSubmit,
  links = [],
  note,
}) => {
  const [form, setForm] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const footerLinks = useMemo(() => links, [links])

  const handleChange = (event) => {
    const { name, value, files, type } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'file' ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await onSubmit(form)
      setSuccess(result?.message || 'Operación completada correctamente')
    } catch (requestError) {
      setError(requestError.message || 'No fue posible completar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      aside={
        <>
          <h3 className="text-2xl font-bold text-slate-950">{summaryTitle}</h3>
          <p className="mt-2 text-sm text-slate-500">{summaryText}</p>
          {success ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {note ? <p className="mt-4 text-xs leading-5 text-slate-500">{note}</p> : null}
          <div className="mt-6 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      }
    >
      <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-white md:text-5xl">
        {summaryTitle}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{summaryText}</p>

      <form className="mt-8 space-y-5 rounded-[1.75rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          {fields.map((field) => (
            <label key={field.name} className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  rows={field.rows || 4}
                  placeholder={field.placeholder}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  className={fieldClassName}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type || 'text'}
                  accept={field.accept}
                  placeholder={field.placeholder}
                  value={field.type === 'file' ? undefined : form[field.name] || ''}
                  onChange={handleChange}
                  className={fieldClassName}
                />
              )}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Procesando...' : submitLabel}
        </button>
      </form>
    </AuthShell>
  )
}