import { useEffect, useState } from 'react'
import { api } from '../api.js'

const empty = { first_name: '', last_name: '', email: '', phone: '', address: '', ssn_last4: '' }

export default function Clients() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => api('/api/clients').then(setClients).catch(() => {})
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const startAdd = () => {
    setForm(empty)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const startEdit = (c) => {
    setForm({
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email || '',
      phone: c.phone || '',
      address: c.address || '',
      ssn_last4: c.ssn_last4 || '',
    })
    setEditingId(c.id)
    setError('')
    setShowForm(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await api(`/api/clients/${editingId}`, { method: 'PATCH', body: form })
      else await api('/api/clients', { method: 'POST', body: form })
      setForm(empty)
      setEditingId(null)
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const letterReady = (c) => (c.address || '').trim() !== '' && (c.ssn_last4 || '').trim().length === 4

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Clients</h1>
        <button onClick={startAdd} className="px-4 py-2 rounded bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400">
          + Add client
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="First name" value={form.first_name} onChange={set('first_name')} required />
          <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Last name" value={form.last_name} onChange={set('last_name')} required />
          <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Email" value={form.email} onChange={set('email')} />
          <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Phone" value={form.phone} onChange={set('phone')} />
          <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Mailing address (street, city, state, zip)" value={form.address} onChange={set('address')} />
          <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="SSN last 4" maxLength={4} inputMode="numeric" value={form.ssn_last4} onChange={set('ssn_last4')} />
          {error && <p className="md:col-span-3 text-red-400 text-sm">{error}</p>}
          <div className="md:col-span-3 flex gap-3">
            <button className="flex-1 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">
              {editingId ? 'Update client' : 'Save client'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(empty); setError('') }} className="px-4 py-2 rounded bg-slate-800 border border-slate-700 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Letter-ready</th>
              <th className="text-left p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-slate-800/50">
                <td className="p-3">{c.first_name} {c.last_name}</td>
                <td className="p-3 text-slate-400">{c.email}</td>
                <td className="p-3 text-slate-400">{c.phone}</td>
                <td className="p-3">
                  {letterReady(c)
                    ? <span className="text-green-400">✓</span>
                    : <span className="text-amber-400" title="Letters need mailing address + SSN last 4">⚠ needs address/SSN</span>}
                </td>
                <td className="p-3">{c.status}</td>
                <td className="p-3 text-right">
                  <button onClick={() => startEdit(c)} className="text-xs px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:border-amber-500">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td className="p-6 text-slate-500" colSpan={6}>No clients yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
