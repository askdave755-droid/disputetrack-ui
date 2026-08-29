import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    key: 'q1', q: "What's your main goal?",
    options: [
      ['personal', 'Fix my personal credit'],
      ['business', 'Build business credit'],
      ['both', 'Both — personal cleanup, then business funding'],
      ['not_sure', 'Not sure yet'],
    ],
  },
  {
    key: 'q2', q: 'Where is your credit score right now?',
    options: [
      ['above_700', '700 or higher'],
      ['600s', '600–699'],
      ['below_600', 'Below 600'],
      ['unknown', "I don't know"],
    ],
  },
  {
    key: 'q3', q: 'How hands-on do you want to be?',
    options: [
      ['myself', "I'll do it myself with the software"],
      ['guide_me', 'Guide me step by step'],
      ['with_me', 'Do it with me'],
      ['for_me', 'Do it for me'],
    ],
  },
  {
    key: 'q4', q: 'How many negative accounts are on your reports?',
    options: [
      ['none', 'None that I know of'],
      ['few', 'A few (1–3)'],
      ['many', 'A lot (4+)'],
      ['not_sure', "I don't know"],
    ],
  },
]

const TIER_ORDER = ['diy', 'guided', 'dwy', 'd4y']
const TIERS = {
  diy: { name: 'DIY', price: 29, blurb: 'Full software + letter engine. You drive, we provide the machine.' },
  guided: { name: 'Guided', price: 99, blurb: 'DIY + book a counselor call whenever you want one.' },
  dwy: { name: 'Done-With-You', price: 299, blurb: 'A counselor reviews every escalation before it goes out.' },
  d4y: { name: 'Done-For-You', price: 499, blurb: 'White-glove. We run the process end to end.' },
}

// Mirrors the backend scorer in disputetrack-api (routers/wizard.py).
function recommend(a) {
  const base = { myself: 'diy', guide_me: 'guided', with_me: 'dwy', for_me: 'd4y' }[a.q3] || 'diy'
  let bumps = 0
  if (['business', 'both'].includes(a.q1)) bumps++
  if (['below_600', 'unknown'].includes(a.q2)) bumps++
  if (['many', 'not_sure'].includes(a.q4)) bumps++
  const i = TIER_ORDER.indexOf(base) + (bumps >= 2 ? 1 : 0)
  return TIER_ORDER[Math.min(i, TIER_ORDER.length - 1)]
}

export default function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [chosen, setChosen] = useState(null)
  const navigate = useNavigate()

  const done = step >= QUESTIONS.length
  const recommended = done ? recommend(answers) : null
  const selected = chosen || recommended

  const pick = (key, value) => {
    setAnswers({ ...answers, [key]: value })
    setStep(step + 1)
  }

  const finish = () => {
    localStorage.setItem('dt_quiz', JSON.stringify({ answers, tier: selected }))
    navigate('/register')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-slate-900 p-8 rounded-xl border border-slate-800">
        <Link to="/" className="text-amber-400 font-bold">DisputeTrack</Link>

        {!done ? (
          <>
            <div className="flex gap-1 my-6">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded ${i < step ? 'bg-amber-400' : i === step ? 'bg-amber-600' : 'bg-slate-700'}`} />
              ))}
            </div>
            <p className="text-xs text-slate-500 mb-2">Question {step + 1} of {QUESTIONS.length}</p>
            <h1 className="text-xl font-bold mb-6">{QUESTIONS[step].q}</h1>
            <div className="space-y-3">
              {QUESTIONS[step].options.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => pick(QUESTIONS[step].key, value)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-500 hover:bg-slate-750"
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mt-6 mb-1">Your custom credit path</h1>
            <p className="text-sm text-slate-400 mb-6">
              Recommended: <span className="text-amber-400 font-semibold">{TIERS[recommended].name}</span> —
              or self-select any tier.
            </p>
            <div className="space-y-3 mb-6">
              {TIER_ORDER.map((key) => (
                <button
                  key={key}
                  onClick={() => setChosen(key)}
                  className={`w-full text-left px-4 py-3 rounded-lg border ${
                    selected === key ? 'border-amber-500 bg-slate-800' : 'border-slate-700 bg-slate-850 hover:border-slate-500'
                  }`}
                >
                  <span className="flex justify-between items-center">
                    <span className="font-semibold">
                      {TIERS[key].name}
                      {key === recommended && <span className="ml-2 text-xs text-amber-400">★ recommended</span>}
                    </span>
                    <span className="text-amber-400 font-bold">${TIERS[key].price}/mo</span>
                  </span>
                  <span className="block text-xs text-slate-400 mt-1">{TIERS[key].blurb}</span>
                </button>
              ))}
            </div>
            <button onClick={finish} className="w-full py-3 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
              Create your account — start for ${TIERS[selected].price}/mo →
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Already have an account? <Link to="/login" className="text-amber-400">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
