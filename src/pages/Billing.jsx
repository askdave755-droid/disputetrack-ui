import { useEffect, useState } from 'react'
import { api } from '../api.js'

const TIERS = [
  { key: 'diy', name: 'DIY', price: 29, blurb: 'Full software, letter engine, PDF downloads. You drive.' },
  { key: 'guided', name: 'Guided', price: 99, blurb: 'Everything in DIY + book counselor calls when YOU want.' },
  { key: 'dwy', name: 'Done-With-You', price: 299, blurb: 'Counselor reviews every escalation before it goes out.' },
  { key: 'd4y', name: 'Done-For-You', price: 499, blurb: 'White-glove: we run the process, you watch the dashboard.' },
]

export default function Billing() {
  const [status, setStatus] = useState(null)
  const [wizard, setWizard] = useState(null)
  const [loading, setLoading] = useState('')

  useEffect(() => {
    api('/api/billing/status').then(setStatus).catch(() => {})
    api('/api/wizard').then(setWizard).catch(() => {})
  }, [])

  const subscribe = async (tier) => {
    setLoading(tier)
    try {
      const res = await api('/api/billing/create-checkout-session', { method: 'POST', body: { tier } })
      window.location.href = res.checkout_url
    } catch (e) {
      alert(e.message)
      setLoading('')
    }
  }

  const configured = status?.tiers_configured || {}
  const currentTier = status?.plan_tier
  const recommended = wizard?.recommended_tier
  const params = new URLSearchParams(window.location.search)

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold mb-2">Billing</h1>
      <p className="text-sm text-slate-400 mb-6">
        Plan status:{' '}
        <span className={status?.plan_status === 'active' ? 'text-green-400' : 'text-amber-400'}>
          {status?.plan_status || '...'}
        </span>
        {currentTier && <span className="ml-2 text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400">{TIERS.find((t) => t.key === currentTier)?.name} tier</span>}
      </p>

      {params.get('success') && <p className="text-green-400 text-sm mb-4">✅ Subscription active — welcome aboard.</p>}
      {params.get('canceled') && <p className="text-slate-400 text-sm mb-4">Checkout canceled — no charge made.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIERS.map((t) => {
          const isCurrent = currentTier === t.key && status?.plan_status === 'active'
          const isRec = recommended === t.key
          const ready = configured[t.key]
          return (
            <div key={t.key} className={`bg-slate-900 border rounded-xl p-5 flex flex-col ${isCurrent ? 'border-green-600' : isRec ? 'border-amber-500' : 'border-slate-800'}`}>
              <p className="font-semibold">
                {t.name}
                {isRec && !isCurrent && <span className="ml-2 text-xs text-amber-400">★ quiz recommended</span>}
                {isCurrent && <span className="ml-2 text-xs text-green-400">✓ current plan</span>}
              </p>
              <p className="text-2xl font-bold text-amber-400 my-2">
                ${t.price}<span className="text-sm text-slate-400 font-normal">/mo</span>
              </p>
              <p className="text-sm text-slate-400 flex-1">{t.blurb}</p>
              <button
                onClick={() => subscribe(t.key)}
                disabled={loading !== '' || isCurrent || !ready}
                className="mt-4 w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-40"
              >
                {isCurrent ? 'Active' : !ready ? 'Coming soon' : loading === t.key ? 'Redirecting...' : `Choose ${t.name}`}
              </button>
              {!ready && <p className="text-xs text-slate-500 mt-2">Stripe price for this tier isn't connected yet.</p>}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        CROA note: subscription fees here are for the DisputeTrack software platform,
        not for credit repair services to end consumers.
      </p>
    </div>
  )
}
