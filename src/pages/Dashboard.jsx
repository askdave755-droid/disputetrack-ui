import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Dashboard() {
  const [me, setMe] = useState(null)
  const [clients, setClients] = useState([])
  const [disputes, setDisputes] = useState([])
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    api('/api/auth/me').then(setMe).catch(() => {})
    api('/api/clients').then(setClients).catch(() => {})
    api('/api/disputes').then(setDisputes).catch(() => {})
    api('/api/compliance/updates').then(setUpdates).catch(() => {})
  }, [])

  const active = disputes.filter((d) => !['deleted', 'verified', 'updated'].includes(d.status))

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">{me ? me.tenant_name : 'Dashboard'}</h1>
      <p className="text-sm text-slate-400 mb-6">
        Plan: <span className={me?.plan_status === 'active' ? 'text-green-400' : 'text-amber-400'}>{me?.plan_status || '...'}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-3xl font-bold">{clients.length}</p>
          <p className="text-sm text-slate-400">Clients</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-3xl font-bold">{active.length}</p>
          <p className="text-sm text-slate-400">Open disputes</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-3xl font-bold">{disputes.filter((d) => d.status === 'deleted').length}</p>
          <p className="text-sm text-slate-400">Deletions won</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Compliance radar (LegalBrain)</h2>
      {updates.length === 0 ? (
        <p className="text-sm text-slate-500">No regulatory changes detected recently.</p>
      ) : (
        <ul className="space-y-2">
          {updates.map((u) => (
            <li key={u.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <p className="text-sm font-medium">{u.title}</p>
              <p className="text-xs text-slate-400 mt-1">{u.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
