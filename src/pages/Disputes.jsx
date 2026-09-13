import { useEffect, useState } from 'react'
import { api, API_URL, getToken } from '../api.js'

const STATUSES = ['draft', 'mailed', 'pending', 'deleted', 'verified', 'updated']
const BUREAUS = ['equifax', 'experian', 'transunion']
const TEMPLATES = {
  fcra_611: 'Round 1 — FCRA 611 bureau dispute',
  method_of_verification: 'Round 2 — method of verification',
  fcra_623: 'FCRA 623 — furnisher dispute',
  fdcpa_validation: 'FDCPA — debt validation (collector)',
  goodwill: 'Goodwill adjustment',
  bk_tradeline_cleanup: 'BK file — post-bankruptcy tradeline cleanup',
}
const BUREAU_ADDRESSES = {
  equifax: { name: 'Equifax Information Services LLC', address_line1: 'P.O. Box 740256', address_city: 'Atlanta', address_state: 'GA', address_zip: '30374-0256' },
  experian: { name: 'Experian', address_line1: 'P.O. Box 4500', address_city: 'Allen', address_state: 'TX', address_zip: '75013' },
  transunion: { name: 'TransUnion LLC Consumer Dispute Center', address_line1: 'P.O. Box 2000', address_city: 'Chester', address_state: 'PA', address_zip: '19016' },
}
const EMPTY_ADDR = { name: '', address_line1: '', address_line2: '', address_city: '', address_state: '', address_zip: '' }
const BUREAU_TEMPLATES = ['fcra_611', 'method_of_verification', 'bk_tradeline_cleanup']

const MAIL_PROVIDERS = [
  { name: 'Docsmit', url: 'https://www.docsmit.com/', note: 'Upload PDF → certified + first-class copy, tracking issued online' },
  { name: 'Click2Mail', url: 'https://click2mail.com/', note: 'Free account, no minimums, certified mail online' },
  { name: 'Mailform', url: 'https://www.mailform.io/', note: 'Drag-and-drop PDF, certified option at checkout' },
  { name: 'USPS (in person)', url: 'https://www.usps.com/', note: 'Print the letter, ask for Certified Mail at the counter (~$5)' },
]

const URGENCY_STYLES = {
  overdue: 'border-red-500/60 text-red-400',
  due_soon: 'border-amber-500/60 text-amber-400',
  on_track: 'border-slate-700 text-slate-300',
}
const URGENCY_LABEL = { overdue: 'OVERDUE', due_soon: 'Due soon', on_track: 'On track' }

export default function Disputes() {
  const [disputes, setDisputes] = useState([])
  const [clients, setClients] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [letter, setLetter] = useState(null)
  const [templateFor, setTemplateFor] = useState({})
  const [mailTo, setMailTo] = useState(EMPTY_ADDR)
  const [mailFrom, setMailFrom] = useState(EMPTY_ADDR)
  const [mailResult, setMailResult] = useState(null)
  const [mailError, setMailError] = useState('')
  const [sending, setSending] = useState(false)
  const [selfTrack, setSelfTrack] = useState('')
  const [selfVia, setSelfVia] = useState('docsmit')
  const [selfDate, setSelfDate] = useState('')
  const [logResult, setLogResult] = useState(null)
  const [form, setForm] = useState({ client_id: '', bureau: 'equifax', creditor_name: '', account_number_masked: '', amount: '', reason: '' })

  const load = () => {
    api('/api/disputes').then(setDisputes).catch(() => {})
    api('/api/clients').then(setClients).catch(() => {})
    api('/api/disputes/follow-ups').then(setFollowUps).catch(() => {})
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const add = async (e) => {
    e.preventDefault()
    await api('/api/disputes', { method: 'POST', body: { ...form, amount: form.amount ? Number(form.amount) : null } })
    setForm({ ...form, creditor_name: '', account_number_masked: '', amount: '', reason: '' })
    load()
  }

  const setStatus = async (id, status) => {
    await api(`/api/disputes/${id}`, { method: 'PATCH', body: { status } })
    load()
  }

  const generateLetter = async (id, templateOverride) => {
    const template = templateOverride || templateFor[id] || 'fcra_611'
    const res = await api(`/api/disputes/${id}/generate-letter?template=${template}`, { method: 'POST' })
    setLetter(res)
    setMailResult(null)
    setMailError('')
    setLogResult(null)
    setSelfTrack('')
    setSelfDate('')
    // Prefill mail form
    const dispute = disputes.find((x) => x.id === id)
    const client = dispute && clients.find((c) => c.id === dispute.client_id)
    if (dispute && BUREAU_TEMPLATES.includes(template) && BUREAU_ADDRESSES[dispute.bureau]) {
      setMailTo({ ...EMPTY_ADDR, ...BUREAU_ADDRESSES[dispute.bureau] })
    } else {
      setMailTo({ ...EMPTY_ADDR, name: dispute ? dispute.creditor_name : '' })
    }
    setMailFrom({ ...EMPTY_ADDR, name: client ? `${client.first_name} ${client.last_name}` : '', address_line1: client ? client.address : '' })
    load()
  }

  const addrSet = (setter, obj) => (k) => (e) => setter({ ...obj, [k]: e.target.value })

  const downloadPdf = async () => {
    const res = await fetch(`${API_URL}/api/disputes/${letter.dispute_id}/letters/${letter.id}/pdf`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok) { setMailError('PDF download failed'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `disputetrack-${letter.template}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const logSelfMail = async () => {
    setSending(true)
    setMailError('')
    try {
      const res = await api(`/api/disputes/${letter.dispute_id}/letters/${letter.id}/log-mail`, {
        method: 'POST',
        body: {
          tracking_number: selfTrack,
          mailed_via: selfVia,
          mailed_to_name: mailTo.name,
          mailed_on: selfDate ? new Date(`${selfDate}T12:00:00Z`).toISOString() : null,
        },
      })
      setLogResult(res)
      setLetter({ ...letter, tracking_number: selfTrack, mail_status: 'mailed' })
      load()
    } catch (e) {
      setMailError(e.message)
    }
    setSending(false)
  }

  const sendMail = async () => {
    setSending(true)
    setMailError('')
    try {
      const res = await api(`/api/disputes/${letter.dispute_id}/letters/${letter.id}/mail`, {
        method: 'POST',
        body: { to: mailTo, sender: mailFrom },
      })
      setMailResult(res)
      setLetter({ ...letter, tracking_number: res.tracking_number, mail_status: res.mail_status })
      load()
    } catch (e) {
      setMailError(e.message)
    }
    setSending(false)
  }

  const refreshMailStatus = async () => {
    try {
      const res = await api(`/api/disputes/${letter.dispute_id}/letters/${letter.id}/mail-status`)
      setMailResult(res)
      setLetter({ ...letter, mail_status: res.mail_status })
    } catch (e) {
      setMailError('Delivery refresh is only available for platform-mailed letters — track self-mailed letters at usps.com with your tracking number.')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Dispute pipeline</h1>

      {followUps.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-2">Follow-up clock</h2>
          <div className="space-y-2">
            {followUps.map((f) => (
              <div key={f.letter_id} className={`bg-slate-900 border rounded-xl p-3 flex flex-wrap items-center gap-3 ${URGENCY_STYLES[f.urgency]}`}>
                <div className="flex-1 min-w-[220px]">
                  <p className="text-sm font-medium text-white">
                    {f.creditor_name} <span className="text-xs text-slate-500">{TEMPLATES[f.template] || f.template}</span>
                  </p>
                  <p className="text-xs mt-1">
                    {URGENCY_LABEL[f.urgency]} — mailed {f.days_since_mailed}d ago, {f.days_left >= 0 ? `${f.days_left}d left of ${f.deadline_days}` : `${Math.abs(f.days_left)}d past the ${f.deadline_days}-day mark`}
                  </p>
                  {(f.urgency !== 'on_track') && <p className="text-xs text-slate-400 mt-1">{f.next_action}</p>}
                </div>
                {f.suggested_template && f.urgency !== 'on_track' && (
                  <button
                    onClick={() => generateLetter(f.dispute_id, f.suggested_template)}
                    className="px-3 py-1 rounded bg-amber-500 text-slate-950 text-xs font-semibold hover:bg-amber-400"
                  >
                    Generate next letter
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={add} className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="px-3 py-2 rounded bg-slate-800 border border-slate-700" value={form.client_id} onChange={set('client_id')} required>
          <option value="">Select client...</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
        </select>
        <select className="px-3 py-2 rounded bg-slate-800 border border-slate-700" value={form.bureau} onChange={set('bureau')}>
          {BUREAUS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Creditor / furnisher" value={form.creditor_name} onChange={set('creditor_name')} required />
        <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Account (masked)" value={form.account_number_masked} onChange={set('account_number_masked')} />
        <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Amount" value={form.amount} onChange={set('amount')} />
        <input className="px-3 py-2 rounded bg-slate-800 border border-slate-700" placeholder="Reason" value={form.reason} onChange={set('reason')} />
        <button className="md:col-span-3 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">Add dispute</button>
      </form>

      <div className="space-y-3">
        {disputes.map((d) => (
          <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <p className="font-medium">{d.creditor_name} <span className="text-slate-500 text-xs">{d.bureau.toUpperCase()}</span></p>
              <p className="text-xs text-slate-400">{d.reason || 'No reason noted'} {d.amount ? `| $${d.amount}` : ''}</p>
            </div>
            <select className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm" value={d.status} onChange={(e) => setStatus(d.id, e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm"
              value={templateFor[d.id] || 'fcra_611'}
              onChange={(e) => setTemplateFor({ ...templateFor, [d.id]: e.target.value })}
            >
              {Object.entries(TEMPLATES).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            </select>
            <button onClick={() => generateLetter(d.id)} className="px-3 py-1 rounded bg-slate-800 border border-amber-500/50 text-amber-400 text-sm hover:bg-slate-700">
              Generate letter
            </button>
          </div>
        ))}
        {disputes.length === 0 && <p className="text-slate-500 text-sm">No disputes yet.</p>}
      </div>

      {letter && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6" onClick={() => setLetter(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold mb-3">
              Generated letter <span className="text-xs text-amber-400">{TEMPLATES[letter.template] || letter.template}</span>
              <span className="text-xs text-slate-500"> — citations current at generation time</span>
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-slate-300">{letter.content}</pre>

            <div className="mt-5 border-t border-slate-800 pt-4">
              {letter.tracking_number ? (
                <div className="text-sm">
                  <p className="text-emerald-400">Mailed — USPS tracking: <span className="font-mono">{letter.tracking_number}</span></p>
                  <p className="text-slate-400 text-xs mt-1">Status: {mailResult?.mail_status || letter.mail_status || 'mailed'}{mailResult?.expected_delivery ? ` — expected ${mailResult.expected_delivery}` : ''}</p>
                  <p className="text-slate-500 text-xs mt-1">Track delivery at usps.com with your tracking number.</p>
                  <button onClick={refreshMailStatus} className="mt-2 px-3 py-1 rounded bg-slate-800 text-xs">Refresh delivery status</button>
                  {mailError && <p className="text-slate-500 text-xs mt-2">{mailError}</p>}
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Step 1 — Download your letter</h3>
                  <button onClick={downloadPdf} className="px-4 py-2 rounded bg-slate-800 border border-amber-500/50 text-amber-400 text-sm hover:bg-slate-700">
                    Download print-ready PDF
                  </button>

                  <h3 className="text-sm font-semibold mt-5 mb-1">Step 2 — Mail it certified, yourself</h3>
                  <p className="text-xs text-slate-500 mb-2">
                    You are always the sender — DisputeTrack never contacts bureaus or creditors for you.
                    Upload your PDF to any of these, or take it to the post office:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {MAIL_PROVIDERS.map((p) => (
                      <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="block bg-slate-800/60 border border-slate-700 rounded-lg p-3 hover:border-amber-500/50">
                        <p className="text-sm font-medium text-amber-400">{p.name} ↗</p>
                        <p className="text-xs text-slate-400 mt-1">{p.note}</p>
                      </a>
                    ))}
                  </div>
                  <div className="mt-2 bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Mail to:</p>
                    <p className="text-sm text-slate-200">{mailTo.name}</p>
                    <p className="text-xs text-slate-400">{[mailTo.address_line1, mailTo.address_city && `${mailTo.address_city}, ${mailTo.address_state} ${mailTo.address_zip}`].filter(Boolean).join(' · ')}</p>
                  </div>

                  <h3 className="text-sm font-semibold mt-5 mb-2">Step 3 — Log your mailing (starts the follow-up clock)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <input className="px-2 py-2 rounded bg-slate-800 border border-slate-700 text-xs" placeholder="USPS tracking number" value={selfTrack} onChange={(e) => setSelfTrack(e.target.value)} />
                    <select className="px-2 py-2 rounded bg-slate-800 border border-slate-700 text-xs" value={selfVia} onChange={(e) => setSelfVia(e.target.value)}>
                      <option value="docsmit">Docsmit</option>
                      <option value="click2mail">Click2Mail</option>
                      <option value="mailform">Mailform</option>
                      <option value="usps">USPS in person</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="date" className="px-2 py-2 rounded bg-slate-800 border border-slate-700 text-xs" value={selfDate} onChange={(e) => setSelfDate(e.target.value)} />
                  </div>
                  {mailError && <p className="text-red-400 text-xs mt-2">{mailError}</p>}
                  <button onClick={logSelfMail} disabled={sending || !selfTrack} className="mt-2 w-full py-2 rounded bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 disabled:opacity-50">
                    {sending ? 'Saving…' : 'Log mailing & start deadline clock'}
                  </button>
                  {logResult?.follow_up && (
                    <p className="text-emerald-400 text-xs mt-2">
                      Logged. {logResult.follow_up.deadline_days}-day response window — check back {logResult.follow_up.days_left >= 0 ? `in ${logResult.follow_up.days_left} days` : 'now'}.
                    </p>
                  )}

                  <details className="mt-5 text-xs text-slate-500">
                    <summary className="cursor-pointer hover:text-slate-300">Advanced: send via connected Lob account (owner use)</summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">To</p>
                        {['name', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip'].map((k) => (
                          <input key={k} className="w-full mb-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs" placeholder={k.replace('address_', '').replace('_', ' ')} value={mailTo[k]} onChange={addrSet(setMailTo, mailTo)(k)} />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">From (return address)</p>
                        {['name', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip'].map((k) => (
                          <input key={k} className="w-full mb-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs" placeholder={k.replace('address_', '').replace('_', ' ')} value={mailFrom[k]} onChange={addrSet(setMailFrom, mailFrom)(k)} />
                        ))}
                      </div>
                      <button onClick={sendMail} disabled={sending} className="md:col-span-2 py-2 rounded bg-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-600 disabled:opacity-50">
                        {sending ? 'Sending…' : 'Mail via Lob (bills platform account)'}
                      </button>
                    </div>
                  </details>
                </div>
              )}
            </div>

            <button onClick={() => setLetter(null)} className="mt-4 px-4 py-2 rounded bg-slate-800 text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
