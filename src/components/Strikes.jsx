import { STRIKES_ENABLED } from '../flags.js'

// Rendered only when VITE_STRIKES_ENABLED=true and the account payload
// actually carries strike data. Default (flag off) is to render nothing
// and never replace the page with a block screen.
export default function Strikes({ state }) {
  if (!STRIKES_ENABLED || !state) return null

  if (state.blocked) {
    return (
      <div className="max-w-lg mx-auto mt-16 bg-slate-900 border border-red-800 rounded-xl p-6">
        <h1 className="text-lg font-bold mb-2">Account paused</h1>
        <p className="text-sm text-slate-300">
          This workspace is paused
          {state.count > 0 ? ` after ${state.count} strike${state.count === 1 ? '' : 's'}` : ''}.
          New disputes and letters stay unavailable until the pause is lifted.
        </p>
        {state.reason && <p className="text-sm text-slate-400 mt-3">{state.reason}</p>}
      </div>
    )
  }

  return (
    <div className="mb-4 bg-slate-900 border border-amber-600/70 rounded-xl p-4">
      <p className="text-sm font-semibold text-amber-400">
        Strike warning{state.count > 0 ? `: ${state.count}` : ''}
      </p>
      {state.reason && <p className="text-sm text-slate-300 mt-1">{state.reason}</p>}
    </div>
  )
}
