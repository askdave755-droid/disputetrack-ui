import { Link } from 'react-router-dom'
import { getToken } from '../api.js'

const COMPARISON = [
  ['Price', '$3,000–$10,000 upfront', '$29–$499/month'],
  ['Support', 'Human counselor calls you', 'You book when YOU want'],
  ['Dispute letters', 'Generic templates', 'AI-personalized + LegalBrain updated'],
  ['Software', 'None', 'Full dashboard + PDF generation'],
  ['Fit', 'One-size-fits-all', '4 tiers, self-select or quiz'],
  ['Compliance', 'No monitoring', 'LegalBrain auto-alerts'],
]

const TIERS = [
  { key: 'diy', name: 'DIY', price: 29, blurb: 'Full software, letter engine, PDF downloads. You drive, we provide the machine.' },
  { key: 'guided', name: 'Guided', price: 99, blurb: 'Everything in DIY + book a counselor call whenever you want one.' },
  { key: 'dwy', name: 'Done-With-You', price: 299, blurb: 'A counselor reviews every escalation before it goes out.' },
  { key: 'd4y', name: 'Done-For-You', price: 499, blurb: 'White-glove: we run the process, you watch the dashboard.' },
]

const GATES = [
  ['📊', 'Pull 3-Bureau Reports', '⏱ 10 min'],
  ['🔍', 'Review Negatives', '⏱ 15 min'],
  ['✉️', 'Mail Round 1 Letters', '⏱ 20 min'],
  ['⏳', '30-Day Clock', 'auto-tracked'],
  ['⚔️', 'Response Branch', 'MOV · CFPB · win'],
  ['🏢', 'Business Credit', 'LLC → EIN → DUNS'],
  ['🎉', "You're Fundable", '720+ · $15K+'],
]

export default function Landing() {
  const authed = !!getToken()
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center">
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">DisputeTrack</span>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">LegalBrain inside</span>
          <div className="ml-auto flex items-center gap-3">
            {authed ? (
              <Link to="/wizard" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">Continue your path</Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Log in</Link>
                <Link to="/quiz" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">Take the Quiz →</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 text-white">
        <div className="max-w-4xl mx-auto px-5 pt-16 pb-20 text-center">
          <p className="text-emerald-300 font-bold text-sm uppercase tracking-widest mb-4">The Credit Suite alternative — without the $10,000 invoice</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Answer 4 questions.<br />Get your custom credit path.<br />
            <span className="text-emerald-300">Start for $29.</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            AI-personalized dispute letters with live legal citations, certified-mail tracking,
            and a gated step-by-step path from collections to fundable — watched 24/7 by LegalBrain.
          </p>
          <Link to="/quiz" className="inline-block bg-white text-blue-700 font-extrabold text-lg px-10 py-4 rounded-xl shadow-2xl hover:scale-105 transition">
            Take the 4-Question Quiz →
          </Link>
          <p className="text-blue-200 text-sm mt-4">60 seconds · No account needed to see your path</p>
          <div className="flex flex-wrap justify-center gap-3 mt-10 text-xs font-semibold">
            <span className="bg-white/15 px-3 py-1.5 rounded-full">⚖️ FCRA + FDCPA letter engine</span>
            <span className="bg-white/15 px-3 py-1.5 rounded-full">📬 Certified mail tracking</span>
            <span className="bg-white/15 px-3 py-1.5 rounded-full">🧠 LegalBrain auto-alerts</span>
            <span className="bg-white/15 px-3 py-1.5 rounded-full">📈 Personal → Business funding</span>
          </div>
        </div>
      </header>

      {/* COMPARISON */}
      <section className="max-w-4xl mx-auto px-5 pt-20 pb-8">
        <h2 className="text-3xl font-extrabold text-center mb-2">Why not Credit Suite?</h2>
        <p className="text-center text-slate-500 mb-8">Same destination. Very different invoice.</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-left"></th>
                <th className="p-4 text-left text-slate-400 font-semibold">Credit Suite</th>
                <th className="p-4 text-left font-bold text-emerald-400">DisputeTrack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON.map(([label, them, us], i) => (
                <tr key={label} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="p-4 font-semibold">{label}</td>
                  <td className="p-4 text-red-500">✗ {them}</td>
                  <td className="p-4 text-emerald-600 font-semibold">✓ {us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7-GATE JOURNEY */}
      <section className="bg-slate-50 py-16 mt-12">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-extrabold text-center mb-2">Your 7-Gate Path to Fundable</h2>
          <p className="text-center text-slate-500 mb-10">Every gate unlocks the next. You always know exactly where you are.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {GATES.map(([icon, title, sub], i) => (
              <div key={title} className={i === 6
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 text-center shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition'
                : 'bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm hover:-translate-y-1 hover:shadow-xl transition'}>
                <p className="text-2xl mb-1">{icon}</p>
                <p className={`text-xs font-bold ${i === 6 ? 'text-emerald-100' : 'text-blue-600'}`}>GATE {i + 1}</p>
                <p className="text-sm font-semibold">{title}</p>
                <p className={`text-xs mt-1 ${i === 6 ? 'text-emerald-100' : 'text-slate-400'}`}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-2">Pick your level of help</h2>
        <p className="text-center text-slate-500 mb-10">Cancel anytime. Every tier includes the letter engine, dashboard, and LegalBrain monitoring.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TIERS.map((t) => (
            <div key={t.key} className={t.key === 'd4y'
              ? 'bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 text-white rounded-2xl p-6 flex flex-col shadow-xl shadow-indigo-500/30 hover:-translate-y-1 transition'
              : 'bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col hover:-translate-y-1 hover:shadow-xl transition'}>
              <p className="font-bold text-lg">
                {t.name}
                {t.key === 'd4y' && <span className="ml-1 text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase">white-glove</span>}
              </p>
              <p className={`text-4xl font-extrabold my-3 ${t.key === 'd4y' ? 'text-white' : 'text-blue-600'}`}>
                ${t.price}<span className={`text-base font-semibold ${t.key === 'd4y' ? 'text-blue-200' : 'text-slate-400'}`}>/mo</span>
              </p>
              <p className={`text-sm flex-1 ${t.key === 'd4y' ? 'text-blue-100' : 'text-slate-500'}`}>{t.blurb}</p>
              <Link to="/quiz" className={t.key === 'd4y'
                ? 'mt-5 block text-center py-3 rounded-xl bg-white text-blue-700 font-extrabold hover:scale-[1.02] transition'
                : 'mt-5 block text-center py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition'}>
                Start {t.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 text-white text-center py-16 px-5">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your path is 4 questions away.</h2>
        <Link to="/quiz" className="inline-block bg-white text-blue-700 font-extrabold text-lg px-10 py-4 rounded-xl shadow-2xl hover:scale-105 transition">
          Take the Quiz →
        </Link>
        <p className="text-blue-200 text-xs mt-6 max-w-xl mx-auto">
          DisputeTrack is a software platform. Subscription fees are for software, not credit repair services. Results vary; no outcome is guaranteed.
        </p>
      </section>

      <footer className="text-center text-xs text-slate-400 py-6 bg-white">© 2026 DisputeTrack · Monitored by LegalBrain</footer>
    </div>
  )
}
