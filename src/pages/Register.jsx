import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setToken } from '../api.js'

export default function Register() {
  const [form, setForm] = useState({ agency_name: '', full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Arriving from the quiz? Pre-fill nothing but acknowledge the path.
  const pending = localStorage.getItem('dt_quiz')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api('/api/auth/register', { method: 'POST', body: form })
      setToken(res.access_token)
      // Sync quiz answers taken before signup into the wizard state
      if (pending) {
        try {
          const { answers } = JSON.parse(pending)
          await api('/api/wizard/quiz', { method: 'POST', body: { answers } })
          localStorage.removeItem('dt_quiz')
        } catch { /* wizard will retry the sync on first load */ }
      }
      navigate('/wizard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 p-8 rounded-xl border border-slate-800">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">{pending ? 'Your path is ready' : 'Start your agency'}</h1>
        <p className="text-sm text-slate-400 mb-6">
          {pending ? 'Create your account to unlock Gate 1.' : 'Creates your tenant workspace + owner account.'}
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Agency or business name" value={form.agency_name} onChange={set('agency_name')} />
        <input className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Your full name" value={form.full_name} onChange={set('full_name')} />
        <input className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Email" value={form.email} onChange={set('email')} />
        <input className="w-full mb-6 px-3 py-2 rounded bg-slate-800 border border-slate-700" type="password" placeholder="Password" value={form.password} onChange={set('password')} />
        <button className="w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">Create account</button>
        <p className="text-sm text-slate-400 mt-4">
          Already registered? <Link to="/login" className="text-amber-400">Log in</Link>
        </p>
      </form>
    </div>
  )
}
