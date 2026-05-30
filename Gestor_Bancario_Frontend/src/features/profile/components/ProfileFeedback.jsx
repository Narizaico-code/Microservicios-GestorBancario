export const ProfileFeedback = ({ submitError, notice }) => {
  if (!submitError && !notice?.text) return null

  return (
    <div className="space-y-3">
      {submitError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}
      {notice?.text ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            notice.tone === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {notice.text}
        </div>
      ) : null}
    </div>
  )
}
