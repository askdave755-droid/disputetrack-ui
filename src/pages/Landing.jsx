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
  { key: 'diy', name: 'DIY', price: 29, blurb: 'Full software, letter engine, PDF downloads. You drive.' },
  { key: 'guided', name: 'Guided', price: 99, blurb: 'Everything in DIY + book counselor calls when YOU want.' },
  { key: 'dwy', name: 'Done-With-You', price: 299, blurb: 'Counselor reviews every escalation before it goes out.' },
  { key: 'd4y', name: 'Done-For-You', price: 499, blurb: 'White-glove: we run the process, you watch the dashboard.' },
]

export default function Landing() {
  const authed = !!getToken()
  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center">
        <span className="font-bold text-amber-400">DisputeTrack</span>
        <div className="ml-auto flex items-center gap-4">
          {authed ? (
            <Link to="/wizard" className="text-sm px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">Continue your path</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white">Log in</Link>
              <Link to="/quiz" className="text-sm px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400">Take the quiz</Link>
            </>
          )}
        </div>
      </nav>

      <header className="max-w-3xl mx-auto text-center px-6 pt-20 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Answer 4 questions.<br />Get your custom credit path.<br />
          <span className="text-amber-400">Start for $29.</span>
        </h1>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          AI-personalized dispute letters with live legal citations, certified mail tracking,
          and a step-by-step path from collections to fundable — monitored by LegalBrain.
        </p>
        <Link to="/quiz" className="inline-block px-8 py-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-lg hover:bg-amber-400">
          Take the 4-Question Quiz →
        </Link>
        <p className="text-xs text-slate-500 mt-3">60 seconds. No account needed to see your path.</p>
      </header>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Why not Credit Suite?</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-800 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-900 text-left">
                <th className="p-3"></th>
                <th className="p-3 text-slate-400">Credit Suite</th>
                <th className="p-3 text-amber-400">Your DisputeTrack</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([label, them, us]) => (
                <tr key={label} className="border-t border-slate-800">
                  <td className="p-3 text-slate-400">{label}</td>
                  <td className="p-3 text-slate-500">{them}</td>
                  <td className="p-3">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-8">Pick your level of help</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TIERS.map((t) => (
            <div key={t.key} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
              <p className="font-semibold">{t.name}</p>
              <p className="text-2xl font-bold text-amber-400 my-2">${t.price}<span className="text-sm text-slate-400 font-normal">/mo</span></p>
              <p className="text-sm text-slate-400 flex-1">{t.blurb}</p>
              <Link to="/quiz" className="mt-4 text-center text-sm px-3 py-2 rounded border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-950">
                Start
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-6">
          Not sure? The quiz recommends a tier — you can always self-select instead.
        </p>
      </section>
    </div>
  )
}
