import { useEffect, useState } from 'react'
import { api } from '../api.js'

const GATE_NAMES = {
  1: 'Pull 3-bureau reports',
  2: 'Review negative accounts',
  3: 'Mail Round 1 letters',
  4: 'Wait for responses',
  5: 'Response branch',
  6: 'Business credit track',
  7: 'Fundable',
}
const TIER_NAMES = { diy: 'DIY', guided: 'Guided', dwy: 'DWY', d4y: 'D4Y' }

function CompPanel() {
  const [email, setEmail] = useState('')
  const [tier, setTier] = useState('d4y')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const comp = async () => {
    if (!email.trim()) return
    setBusy(true)
    setMsg('')
    try {
      const res = await api('/api/billing/comp', { method: 'POST', body: { email: email.trim(), tier } })
      setMsg(`✅ ${res.email} is now active on ${TIER_NAMES[res.plan_tier]} — free, no card.`)
      setEmail('')
    } catch (e) {
      setMsg(`⚠️ ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-amber-700/50 rounded-xl p-4 mb-6">
      <p className="text-sm font-semibold mb-1">🎁 Comp an account <span className="text-xs text-slate-500 font-normal">(free plan, no Stripe, no card — only you can see this)</span></p>
      <div className="flex flex-wrap gap-2 mt-3">
        <input
          className="flex-1 min-w-[200px] px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
          placeholder="their@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm">
          <option value="diy">DIY</option>
          <option value="guided">Guided</option>
          <option value="dwy">DWY</option>
          <option value="d4y">D4Y</option>
        </select>
        <button
          onClick={comp}
          disabled={busy || !email.trim()}
          className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-40 text-sm"
        >
          {busy ? 'Granting...' : 'Grant free access'}
        </button>
      </div>
      {msg && <p className="text-sm mt-3 text-slate-300">{msg}</p>}
    </div>
  )
}

export default function Counselor() {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')

  const load = () => api('/api/wizard/counselor').then(setRows).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  if (err) {
    return (
      <div className="max-w-lg mx-auto mt-16 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-lg font-bold mb-2">Counselor Dashboard</h1>
        <p className="text-sm text-slate-400 mb-3">{err}</p>
        <p className="text-xs text-slate-500">
          To enable it: add <code className="text-amber-400">COUNSELOR_EMAILS</code> (comma-separated) to the
          disputetrack-api variables in Railway, then redeploy. Sign in here with one of those emails.
        </p>
      </div>
    )
  }
  if (!rows) return <p className="text-slate-400">Loading...</p>

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Counselor Dashboard</h1>
      <p className="text-sm text-slate-400 mb-6">{rows.length} user{rows.length === 1 ? '' : 's'} in the funnel</p>

      <CompPanel />

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">No wizard activity yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const stuckDays = Math.floor((Date.now() - new Date(r.updated_at)) / 86400000)
            return (
              <div key={r.user_id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-semibold">{r.full_name || r.email}</p>
                    <p className="text-xs text-slate-400">{r.email} · {r.tenant_name}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400">
                    {TIER_NAMES[r.recommended_tier] || 'no quiz'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700">
                    Gate {r.current_gate}/7 — {GATE_NAMES[r.current_gate]}
                  </span>
                  {stuckDays >= 7 && (
                    <span className="text-xs px-2 py-1 rounded bg-red-950 border border-red-800 text-red-300">
                      idle {stuckDays}d
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <div
                      key={n}
                      title={`Gate ${n}: ${GATE_NAMES[n]}`}
                      className={`h-2 flex-1 rounded ${
                        r.gate_data?.[String(n)]?.completed
                          ? 'bg-green-500'
                          : n === r.current_gate
                            ? 'bg-amber-500'
                            : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Last activity: {new Date(r.updated_at).toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
