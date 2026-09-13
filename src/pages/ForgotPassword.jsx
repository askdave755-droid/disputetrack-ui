import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email } })
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-xl border border-slate-800">
        <h1 className="text-2xl font-bold text-amber-400 mb-6">DisputeTrack</h1>
        {sent ? (
          <div>
            <p className="text-sm text-slate-300">If that email is registered, a reset link is on its way. The link expires in 30 minutes.</p>
            <p className="text-sm text-slate-400 mt-4">
              <Link to="/login" className="text-amber-400">Back to log in</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="text-sm text-slate-400 mb-4">Enter your account email and we'll send you a reset link.</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <input className="w-full mb-4 px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button disabled={busy} className="w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-50">
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
            <p className="text-sm text-slate-400 mt-4">
              Remembered it? <Link to="/login" className="text-amber-400">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
