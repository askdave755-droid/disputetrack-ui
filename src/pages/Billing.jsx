import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Billing() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api('/api/billing/status').then(setStatus).catch(() => {})
  }, [])

  const subscribe = async () => {
    setLoading(true)
    try {
      const res = await api('/api/billing/create-checkout-session', { method: 'POST' })
      window.location.href = res.checkout_url
    } catch (e) {
      alert(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold mb-6">Billing</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-sm text-slate-400 mb-1">Current plan status</p>
        <p className={`text-2xl font-bold mb-6 ${status?.plan_status === 'active' ? 'text-green-400' : 'text-amber-400'}`}>
          {status?.plan_status || '...'}
        </p>
        <button onClick={subscribe} disabled={loading} className="w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-50">
          {loading ? 'Redirecting to Stripe...' : 'Subscribe via Stripe'}
        </button>
        <p className="text-xs text-slate-500 mt-4">
          CROA note: subscription fees here are for the DisputeTrack software platform,
          not for credit repair services to end consumers.
        </p>
      </div>
    </div>
  )
}
