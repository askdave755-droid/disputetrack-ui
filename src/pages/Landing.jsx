import { Link } from 'react-router-dom'
import { getToken } from '../api.js'

const COMPARISON = [
  ['Price', '$3,000–$10,000 upfront', '$29–$499/month'],
  ['Support', 'Human counselor calls you', 'You book when YOU want'],
  ['Dispute letters', 'Generic templates', 'AI-personalized + live legal citations'],
  ['Software', 'None', 'Full dashboard + PDF generation'],
  ['Fit', 'One-size-fits-all', '4 tiers, self-select or quiz'],
  ['Status alerts', 'No monitoring', 'LegalBrain auto-alerts'],
  ['You stay in control of every action', 'No', 'Yes — you sign & mail every letter'],
]

const TIERS = [
  { key: 'diy', name: 'DIY', price: 29, blurb: 'Full software, letter engine, PDF downloads. You drive, we provide the machine.' },
  { key: 'guided', name: 'Guided', price: 99, blurb: 'Everything in DIY + book a guidance call on your schedule. Educational coaching — you take every action.' },
  { key: 'dwy', name: 'Done-With-You', price: 299, blurb: 'A counselor reviews your draft letters with you before they go out — you still sign and mail every one.' },
  { key: 'd4y', name: 'Done-With-You Prep', price: 499, blurb: 'White-glove prep: we assemble your complete letter packets — personalized letters, legal citations, mailing labels, certified-mail tracking. You review, sign, and mail every letter.' },
]

const SENDER_FOOTNOTE = 'You are the sender of every letter. DisputeTrack never contacts a creditor or bureau on your behalf.'

const GATES = [
  ['📊', 'Pull 3-Bureau Reports', '⏱ 10 min'],
  ['🔍', 'Review Negatives', '⏱ 15 min'],
  ['✉️', 'Mail Round 1 Letters', 'print, sign & mail ⏱ 20 min'],
  ['⏳', '30-Day Clock', 'auto-tracked'],
  ['⚔️', 'Response Branch', 'MOV · CFPB · next round'],
  ['🏢', 'Business Credit', 'LLC → EIN → DUNS'],
  ['🎉', "You're Fundable (target)", '720+ · $15K+ — targets, not promises'],
]

const FAQ = [
  ['What is DisputeTrack?',
    'A self-service software workspace where you review your own credit report, identify items you want to challenge under your FCRA rights, and prepare your own consumer letters. You stay in control of every action. DisputeTrack never contacts a creditor or bureau on your behalf.'],
  ['Will DisputeTrack raise my score or guarantee a result?',
    'No. No one can legally guarantee credit score changes. Outcomes depend on what is on your report and how the bureaus respond to your letters. The actions and outcomes are entirely yours.'],
  ['Who sends the dispute letters?',
    'You do. Every letter is generated for your review; you edit, sign, and mail it yourself — with certified-mail tracking for letters you send. DisputeTrack prepares and organizes. You act.'],
  ['Can I cancel anytime?',
    'Yes. There is no long-term contract. Cancel your membership at any time in your account settings.'],
  ['Is my information secure?',
    'Payment fields are handled by our payment processor, and sensitive identity data by our data providers. DisputeTrack never sees or stores your SSN.'],
  ["Isn't this what credit repair companies do?",
    'No. Credit repair organizations act on your behalf and charge for that. DisputeTrack never acts on your behalf — it gives you the tools and letter templates to exercise your own FCRA rights yourself.'],
]

export default function Landing() {
  const authed = !!getToken()
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center">
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">DisputeTrack</span>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">LegalBrain alerts</span>
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
          <p className="text-emerald-300 font-bold text-sm uppercase tracking-widest mb-4">Inaccurate items holding your report back?</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Review your report.<br />Exercise your FCRA rights.<br />
            <span className="text-emerald-300">You stay in control.</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            DisputeTrack is a guided self-service workspace: review every item on your 3-bureau report,
            prepare your own consumer letters with live legal citations, and track every letter you mail —
            with automated alerts so nothing slips.
          </p>
          <Link to="/quiz" className="inline-block bg-white text-blue-700 font-extrabold text-lg px-10 py-4 rounded-xl shadow-2xl hover:scale-105 transition">
            Take the 4-Question Quiz →
          </Link>
          <p className="text-blue-200 text-sm mt-4">60 seconds · No account needed to see your path</p>
          <p className="text-blue-200 text-xs mt-2 max-w-xl mx-auto">
            DisputeTrack is a software tool, not a credit repair service. We never contact a creditor
            or bureau on your behalf — you are the sender of every letter.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10 text-xs font-semibold">
            <span className="bg-white/15 px-3 py-1.5 rounded-full">⚖️ FCRA + FDCPA letter engine</span>
            <span className="bg-white/15 px-3 py-1.5 rounded-full">📬 Certified-mail tracking for letters you mail</span>
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
        <p className="text-center text-xs text-slate-400 mt-4 max-w-2xl mx-auto">
          FCRA Section 611 grants every consumer the right to challenge inaccurate items directly with
          the bureaus, at no cost. DisputeTrack is a self-service workspace — you keep control, and
          outcomes depend on you and the bureaus.
        </p>
      </section>

      {/* 7-GATE JOURNEY */}
      <section className="bg-slate-50 py-16 mt-12">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-extrabold text-center mb-2">Your 7-Gate Path to Fundable</h2>
          <p className="text-center text-slate-500 mb-10">Every gate unlocks the next. You always know exactly where you are — and you take every action yourself.</p>
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
          <p className="text-center text-xs text-slate-400 mt-8">
            Gate milestones are targets, not promises. Outcomes vary; no score or funding result is guaranteed.
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-2">Pick your level of help</h2>
        <p className="text-center text-slate-500 mb-3">Cancel anytime. No setup fees. No long-term contract. Every tier includes the letter engine, dashboard, and LegalBrain alerts.</p>
        <p className="text-center text-sm font-semibold text-blue-700 mb-10 max-w-2xl mx-auto">
          Letters are prepared for your review in every tier — you sign and mail every one. You are always the sender.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TIERS.map((t) => (
            <div key={t.key} className={t.key === 'd4y'
              ? 'bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 text-white rounded-2xl p-6 flex flex-col shadow-xl shadow-indigo-500/30 hover:-translate-y-1 transition'
              : 'bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col hover:-translate-y-1 hover:shadow-xl transition'}>
              <p className="font-bold text-lg">
                {t.name}
                {t.key === 'd4y' && <span className="ml-1 text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase">white-glove prep</span>}
              </p>
              <p className={`text-4xl font-extrabold my-3 ${t.key === 'd4y' ? 'text-white' : 'text-blue-600'}`}>
                ${t.price}<span className={`text-base font-semibold ${t.key === 'd4y' ? 'text-blue-200' : 'text-slate-400'}`}>/mo</span>
              </p>
              <p className={`text-sm flex-1 ${t.key === 'd4y' ? 'text-blue-100' : 'text-slate-500'}`}>{t.blurb}</p>
              <p className={`text-[11px] mt-3 ${t.key === 'd4y' ? 'text-blue-200' : 'text-slate-400'}`}>{SENDER_FOOTNOTE}</p>
              <Link to="/quiz" className={t.key === 'd4y'
                ? 'mt-5 block text-center py-3 rounded-xl bg-white text-blue-700 font-extrabold hover:scale-[1.02] transition'
                : 'mt-5 block text-center py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition'}>
                Start {t.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-extrabold text-center mb-2">Common questions, straight answers</h2>
          <p className="text-center text-slate-500 mb-10">The things people ask before they take control of their own report.</p>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="bg-white rounded-xl border border-slate-200 shadow-sm group">
                <summary className="cursor-pointer p-5 font-bold text-slate-800 list-none flex items-center justify-between">
                  {q}
                  <span className="text-blue-600 group-open:rotate-45 transition text-xl leading-none">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 text-white text-center py-16 px-5">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your path is 4 questions away.</h2>
        <Link to="/quiz" className="inline-block bg-white text-blue-700 font-extrabold text-lg px-10 py-4 rounded-xl shadow-2xl hover:scale-105 transition">
          Take the Quiz →
        </Link>
        <p className="text-blue-200 text-xs mt-6 max-w-xl mx-auto">
          DisputeTrack is a self-service software platform. Subscription fees are for software tools,
          organization, and education — not for acting on your behalf.
        </p>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs leading-relaxed">
            DisputeTrack is a self-service software platform. It is not a law firm and does not provide
            credit, legal, or financial advice. We do not act on your behalf and never contact any credit
            bureau, creditor, or furnisher for you — you are the sender of every letter. Exercising your
            rights under FCRA Section 611 is free for every consumer; subscription fees are for software
            tools, organization, and education only. Results vary; no outcome is guaranteed. Cancel anytime.
          </p>
          <p className="text-xs mt-4 text-slate-500">© 2026 DisputeTrack</p>
        </div>
      </footer>
    </div>
  )
}
