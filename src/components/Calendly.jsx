export default function Calendly({ name = '', email = '', height = 620 }) {
  const base = import.meta.env.VITE_CALENDLY_URL || ''
  if (!base) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
        Booking calendar isn't connected yet. Once VITE_CALENDLY_URL is set, your
        counselor calendar appears right here — prefilled with your name and email.
      </div>
    )
  }
  const sep = base.includes('?') ? '&' : '?'
  const url = `${base}${sep}hide_gdpr_banner=1&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
  return (
    <iframe
      src={url}
      title="Book a counselor call"
      className="w-full rounded-lg border border-slate-700 bg-white"
      style={{ height }}
    />
  )
}
