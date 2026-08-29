import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Calendly from '../components/Calendly.jsx'

const TIER_NAMES = { diy: 'DIY', guided: 'Guided', dwy: 'Done-With-You', d4y: 'Done-For-You' }
const CALL_TIERS = ['guided', 'dwy', 'd4y']
const BUREAUS = ['equifax', 'experian', 'transunion']
const BUREAU_LABEL = { equifax: 'Equifax', experian: 'Experian', transunion: 'TransUnion' }

const GATES = [
  { n: 1, title: 'Pull Your 3-Bureau Reports', time: '10 min' },
  { n: 2, title: 'Review Your Negative Accounts', time: '15 min' },
  { n: 3, title: 'Mail Round 1 Dispute Letters', time: '20 min' },
  { n: 4, title: 'Wait for Bureau Responses', time: '30–45 days' },
  { n: 5, title: 'Bureau Responded — Now What?', time: '' },
  { n: 6, title: 'Build Business Credit', time: '2–3 months' },
  { n: 7, title: "You're Fundable", time: '' },
]

const GATE6_STEPS = [
  ['llc', 'LLC Formation'],
  ['ein', 'EIN Application', 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online'],
  ['duns', 'DUNS Number', 'https://www.dnb.com/duns-number/get-a-duns.html'],
  ['net30', 'Net-30 Accounts (Uline, Quill)'],
  ['banking', 'Business Banking'],
  ['cards', 'Business Credit Cards'],
]

const today = () => new Date().toISOString().slice(0, 10)
const addDays = (iso, days) => {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function Wizard() {
  const [progress, setProgress] = useState(null)
  const [me, setMe] = useState(null)
  const [disputes, setDisputes] = useState([])
  const [err, setErr] = useState('')
  const [mailedOn, setMailedOn] = useState(today())
  const [callDone, setCallDone] = useState(false)
  const [funding, setFunding] = useState({ score: '', tradelines: '', limit: '' })
  const [copied, setCopied] = useState(false)

  const load = () => api('/api/wizard').then(setProgress).catch((e) => setErr(e.message))

  useEffect(() => {
    api('/api/auth/me').then(setMe).catch(() => {})
    api('/api/disputes').then(setDisputes).catch(() => {})
    // One-time sync: quiz taken on the landing page before signup
    const pending = localStorage.getItem('dt_quiz')
    if (pending) {
      try {
        const { answers } = JSON.parse(pending)
        api('/api/wizard/quiz', { method: 'POST', body: { answers } })
          .then((p) => { localStorage.removeItem('dt_quiz'); setProgress(p) })
          .catch(load)
      } catch { load() }
    } else {
      load()
    }
  }, [])

  useEffect(() => {
    const f = progress?.gate_data?.funding
    if (f) setFunding(f)
  }, [progress])

  if (!progress) return <p className="text-slate-400">{err || 'Loading your path...'}</p>

  const gd = progress.gate_data || {}
  const tier = progress.recommended_tier || 'diy'
  const canBook = CALL_TIERS.includes(tier)
  const gateDone = (n) => !!gd[String(n)]?.completed
  const unlocked = (n) => n <= progress.current_gate
  const outcomes = gd.bureau_outcomes || {}
  const g6 = gd.gate6_steps || {}

  const patch = async (data) => {
    setErr('')
    try {
      setProgress(await api('/api/wizard', { method: 'PATCH', body: { gate_data: data } }))
    } catch (e) { setErr(e.message) }
  }

  const complete = async (n, extra) => {
    setErr('')
    try {
      if (extra) await patch({ [String(n)]: extra })
      setProgress(await api(`/api/wizard/gate/${n}/complete`, { method: 'POST' }))
    } catch (e) { setErr(e.message) }
  }

  const setOutcome = (bureau, value) => patch({ bureau_outcomes: { ...outcomes, [bureau]: value } })
  const toggleG6 = (key) => patch({ gate6_steps: { ...g6, [key]: !g6[key] } })

  const saveFunding = () => patch({ funding })

  const copyReferral = async () => {
    const link = `${window.location.origin}/?ref=${me?.id || 'friend'}`
    try { await navigator.clipboard.writeText(link) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPlaybook = () => {
    const lines = [
      '# Your Funding Playbook',
      '',
      `Generated ${today()} by DisputeTrack`,
      `Tier: ${TIER_NAMES[tier] || tier}`,
      '',
      '## Personal credit',
      `- Score target: 720+ (you reported: ${funding.score || '—'})`,
      `- Deletions won so far: ${disputes.filter((d) => d.status === 'deleted').length}`,
      `- Open disputes: ${disputes.filter((d) => !['deleted', 'verified', 'updated'].includes(d.status)).length}`,
      '',
      '## Bureau outcomes (Round 1)',
      ...BUREAUS.map((b) => `- ${BUREAU_LABEL[b]}: ${outcomes[b] || 'pending'}`),
      '',
      '## Business credit',
      ...GATE6_STEPS.map(([k, label]) => `- [${g6[k] ? 'x' : ' '}] ${label}`),
      `- Trade lines reporting: ${funding.tradelines || '—'} (target 3+)`,
      `- Business credit limit: $${funding.limit || '—'} (target $15,000+)`,
      '',
      '## Next steps',
      '1. Keep revolving utilization under 30% (under 10% is better).',
      '2. Let new accounts age 90 days before applying for funding.',
      '3. Stack Net-30 vendor reports before revolving business cards.',
      '4. Re-pull reports monthly and keep the dispute cadence until every negative is resolved.',
    ].join('\n')
    const blob = new Blob([lines], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'funding-playbook.md'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const CallBox = ({ required = false }) => (
    <div className="mt-4 border-t border-slate-800 pt-4">
      <p className="text-sm mb-2">
        📞 {required ? 'Required counselor review before your next step (DWY/D4Y)' : 'Stuck? Book your free 30-min call with a credit counselor'}
      </p>
      {canBook ? (
        <Calendly name={me?.full_name || ''} email={me?.email || ''} />
      ) : (
        <p className="text-xs text-slate-500">
          Live counselor booking is included from the Guided tier up.{' '}
          <Link to="/billing" className="text-amber-400">Upgrade</Link> to book when YOU want.
        </p>
      )}
    </div>
  )

  const mailedDate = gd['3']?.mailed_on
  const dueDate = gd['3']?.due
  const daysLeft = dueDate ? Math.ceil((new Date(dueDate + 'T00:00:00') - Date.now()) / 86400000) : null

  const bodies = {
    1: (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="font-medium mb-1">Connect Credit Monitoring</p>
            <p className="text-xs text-slate-400 mb-3">💡 Tip: IdentityIQ or SmartCredit both offer a $1 trial — pull all 3 bureaus in minutes.</p>
            <div className="flex gap-2">
              <a href="https://www.identityiq.com" target="_blank" rel="noreferrer" className="text-xs px-3 py-2 rounded border border-slate-600 hover:border-amber-500">IdentityIQ</a>
              <a href="https://www.smartcredit.com" target="_blank" rel="noreferrer" className="text-xs px-3 py-2 rounded border border-slate-600 hover:border-amber-500">SmartCredit</a>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="font-medium mb-1">Upload PDFs Manually</p>
            <p className="text-xs text-slate-400 mb-3">Already have your reports? Enter each negative account as a dispute and we take it from there.</p>
            <Link to="/disputes" className="text-xs px-3 py-2 inline-block rounded border border-slate-600 hover:border-amber-500">Enter accounts</Link>
          </div>
        </div>
        <button onClick={() => complete(1)} className="mt-4 px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">
          I have my 3 reports →
        </button>
      </>
    ),

    2: (
      <>
        {disputes.length === 0 ? (
          <p className="text-sm text-slate-400 mb-3">No negative accounts entered yet. Add each one — creditor, amount, bureau — and mark anything you know is accurate as valid (we never dispute accurate info; that protects you under CROA).</p>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-3">We found {disputes.length} account{disputes.length === 1 ? '' : 's'} on your file:</p>
            <ul className="space-y-2 mb-3">
              {disputes.map((d) => (
                <li key={d.id} className="flex justify-between text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                  <span>{d.creditor_name} <span className="text-slate-500">· {BUREAU_LABEL[d.bureau] || d.bureau}</span></span>
                  <span className="text-slate-400">{d.amount != null ? `$${d.amount}` : ''} {d.status === 'valid' ? '(valid — skip)' : ''}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="flex gap-2">
          <Link to="/disputes" className="px-4 py-2 rounded border border-slate-600 hover:border-amber-500 text-sm">Select Accounts to Dispute</Link>
          <button
            onClick={() => complete(2)}
            disabled={disputes.length === 0}
            className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-40 text-sm"
          >
            Accounts reviewed →
          </button>
        </div>
      </>
    ),

    3: (
      <>
        <p className="text-sm text-slate-400 mb-3">
          Generate a Round 1 (FCRA §611) letter per bureau for each selected account — with live LegalBrain citations baked in.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="font-medium mb-1">DIY — print & mail yourself</p>
            <p className="text-xs text-slate-400 mb-2">Download all PDFs, sign, keep copies, send certified, log the date.</p>
            <Link to="/disputes" className="text-xs px-3 py-2 inline-block rounded border border-slate-600 hover:border-amber-500">Download All PDFs + Checklist</Link>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="font-medium mb-1">Premium — we mail it certified</p>
            <p className="text-xs text-slate-400 mb-2">One click per letter. Tracking number auto-saved to your file.</p>
            <Link to="/disputes" className="text-xs px-3 py-2 inline-block rounded border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-950">Mail it certified (Lob)</Link>
          </div>
        </div>
        <label className="block text-sm text-slate-400 mb-1">Letters mailed on:</label>
        <input type="date" value={mailedOn} onChange={(e) => setMailedOn(e.target.value)} className="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm mb-3" />
        <button
          onClick={() => complete(3, { mailed_on: mailedOn, due: addDays(mailedOn, 30) })}
          className="block px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 text-sm"
        >
          Letters are in the mail →
        </button>
        <CallBox />
      </>
    ),

    4: (
      <>
        {mailedDate ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4 text-sm">
            <p>📬 Letters mailed: <span className="font-semibold">{mailedDate}</span></p>
            <p>📅 Responses due: <span className="font-semibold">{dueDate}</span></p>
            {daysLeft != null && daysLeft > 0 && <p className="text-slate-400 mt-1">{daysLeft} day{daysLeft === 1 ? '' : 's'} left in the bureaus' 30-day window.</p>}
            {daysLeft != null && daysLeft <= 0 && (
              <p className="text-green-400 mt-1 font-medium">🎉 The 30-day deadline passed — any bureau that didn't respond is now in violation of the FCRA. That's leverage for deletion.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 mb-4">Mail date not recorded — go back to Gate 3 and stamp it so the 30-day clock is tracked.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => complete(4)} className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 text-sm">I've Received a Response</button>
          <button onClick={() => patch({ '4': { reminder_set: true } })} className="px-4 py-2 rounded border border-slate-600 hover:border-amber-500 text-sm">
            {gd['4']?.reminder_set ? '✅ Auto-reminder set' : 'Nothing Yet (set auto-reminder)'}
          </button>
        </div>
        {gd['4']?.reminder_set && <p className="text-xs text-slate-500 mt-2">We'll surface this gate at day 21, at the day-30 deadline, and auto-draft Round 2 at day 35.</p>}
        <CallBox />
      </>
    ),

    5: (
      <>
        <p className="text-sm text-slate-400 mb-3">Log what each bureau did with Round 1:</p>
        <div className="space-y-2 mb-4">
          {BUREAUS.map((b) => (
            <div key={b} className="flex flex-wrap items-center gap-2 text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <span className="w-28 font-medium">{BUREAU_LABEL[b]}</span>
              {['verified', 'deleted', 'no_response'].map((o) => (
                <button
                  key={o}
                  onClick={() => setOutcome(b, o)}
                  className={`text-xs px-3 py-1 rounded border ${
                    outcomes[b] === o ? 'border-amber-500 text-amber-400 bg-slate-900' : 'border-slate-600 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {o === 'verified' ? '"Verified"' : o === 'deleted' ? 'Deleted ✅' : 'No Response'}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.values(outcomes).includes('verified') && (
            <Link to="/disputes" className="px-4 py-2 rounded border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-sm">
              Generate Round 2 (Method of Verification)
            </Link>
          )}
          {Object.values(outcomes).includes('no_response') && (
            <a href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noreferrer" className="px-4 py-2 rounded border border-slate-600 hover:border-amber-500 text-sm">
              File CFPB Complaint
            </a>
          )}
        </div>
        {['dwy', 'd4y'].includes(tier) ? (
          <>
            <CallBox required />
            <label className="flex items-center gap-2 text-sm mt-3">
              <input type="checkbox" checked={callDone} onChange={(e) => setCallDone(e.target.checked)} />
              My counselor reviewed this file
            </label>
          </>
        ) : (
          <CallBox />
        )}
        <button
          onClick={() => complete(5)}
          disabled={BUREAUS.some((b) => !outcomes[b]) || (['dwy', 'd4y'].includes(tier) && !callDone)}
          className="mt-3 px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-40 text-sm"
        >
          Outcomes logged →
        </button>
      </>
    ),

    6: (
      <>
        <p className="text-sm text-slate-400 mb-3">
          Run this track in parallel with your personal cleanup — each step unlocks the next:
        </p>
        <div className="space-y-2 mb-4">
          {GATE6_STEPS.map(([key, label, url]) => (
            <div key={key} className="flex items-center gap-3 text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <input type="checkbox" checked={!!g6[key]} onChange={() => toggleG6(key)} />
              <span className={g6[key] ? 'line-through text-slate-500' : ''}>{label}</span>
              {url && <a href={url} target="_blank" rel="noreferrer" className="ml-auto text-xs text-amber-400">open ↗</a>}
            </div>
          ))}
        </div>
        <button
          onClick={() => complete(6)}
          disabled={GATE6_STEPS.some(([k]) => !g6[k])}
          className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 disabled:opacity-40 text-sm"
        >
          Business credit track complete →
        </button>
      </>
    ),

    7: (
      <>
        <p className="text-sm text-slate-400 mb-3">Enter your numbers — this is what fundable looks like:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {[
            ['score', 'Personal Score', 720],
            ['tradelines', 'Business Trade Lines', 3],
            ['limit', 'Business Credit Limit ($)', 15000],
          ].map(([key, label, target]) => {
            const val = Number(funding[key]) || 0
            const hit = val >= target
            return (
              <div key={key} className={`bg-slate-800 border rounded-lg p-4 ${hit ? 'border-green-600' : 'border-slate-700'}`}>
                <p className="text-xs text-slate-400 mb-1">{label} {hit && '✅'}</p>
                <input
                  type="number"
                  value={funding[key]}
                  onChange={(e) => setFunding({ ...funding, [key]: e.target.value })}
                  onBlur={saveFunding}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-lg font-bold"
                />
                <p className="text-xs text-slate-500 mt-1">target: {key === 'limit' ? '$15,000+' : `${target}+`}</p>
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadPlaybook} className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 text-sm">Download Funding Playbook</button>
          <button onClick={copyReferral} className="px-4 py-2 rounded border border-slate-600 hover:border-amber-500 text-sm">
            {copied ? '✅ Link copied!' : 'Refer a Friend — $50 credit'}
          </button>
          {tier !== 'd4y' && (
            <Link to="/billing" className="px-4 py-2 rounded border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-sm">
              Upgrade to D4Y for white-glove
            </Link>
          )}
        </div>
      </>
    ),
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-xl font-bold">Your Credit Path</h1>
        {progress.recommended_tier && (
          <span className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400">
            {TIER_NAMES[tier]} tier
          </span>
        )}
        <Link to="/quiz" className="ml-auto text-xs text-slate-400 hover:text-amber-400">retake quiz</Link>
      </div>
      {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

      <div className="space-y-4">
        {GATES.map(({ n, title, time }) => {
          const done = gateDone(n)
          const open = unlocked(n)
          const current = n === progress.current_gate
          return (
            <div
              key={n}
              className={`rounded-xl border p-5 ${
                done ? 'border-green-700 bg-slate-900' : current ? 'border-amber-500 bg-slate-900' : open ? 'border-slate-700 bg-slate-900' : 'border-slate-800 bg-slate-950 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg">{done ? '✅' : open ? (current ? '🔓' : '🔓') : '🔒'}</span>
                <h2 className="font-bold flex-1">
                  GATE {n} — {title}
                </h2>
                {time && <span className="text-xs text-slate-400">⏱ {time}</span>}
                {current && !done && <span className="text-xs px-2 py-1 rounded bg-amber-500 text-slate-950 font-semibold">IN PROGRESS</span>}
              </div>
              {open && <div className="mt-3">{bodies[n]}</div>}
              {!open && <p className="text-xs text-slate-500 mt-1">Complete Gate {n - 1} to unlock.</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
