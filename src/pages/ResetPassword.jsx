import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api.js'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      await api('/api/auth/reset-password', { method: 'POST', body: { token, new_password: password } })
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-xl border border-slate-800">
        <h1 className="text-2xl font-bold text-amber-400 mb-6">DisputeTrack</h1>
        {done ? (
          <div>
            <p className="text-sm text-emerald-400">Password updated — you can log in now.</p>
            <p className="text-sm text-slate-400 mt-4">
              <Link to="/login" className="text-amber-400">Go to log in</Link>
            </p>
          </div>
        ) : !token ? (
          <div>
            <p className="text-sm text-red-400">This reset link is missing its token. Use the link from your email, or request a new one.</p>
            <p className="text-sm text-slate-400 mt-4">
              <Link to="/forgot-password" className="text-amber-400">Request a new link</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="text-sm text-slate-400 mb-4">Choose a new password (at least 8 characters).</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <input className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input className="w-full mb-4 px-3 py-2 rounded bg-slate-800 border border-slate-700" type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <button disabled={busy} className="w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-50">
              {busy ? 'Updating…' : 'Set new password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
