import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setToken } from '../api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api('/api/auth/login', { method: 'POST', body: { email, password } })
      setToken(res.access_token)
      navigate('/wizard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 p-8 rounded-xl border border-slate-800">
        <h1 className="text-2xl font-bold text-amber-400 mb-6">DisputeTrack</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full mb-2 px-3 py-2 rounded bg-slate-800 border border-slate-700" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="text-right text-xs mb-4">
          <Link to="/forgot-password" className="text-slate-400 hover:text-amber-400">Forgot password?</Link>
        </p>
        <button className="w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">Log in</button>
        <p className="text-sm text-slate-400 mt-4">
          New here? <Link to="/quiz" className="text-amber-400">Take the 4-question quiz</Link>
        </p>
      </form>
    </div>
  )
}
