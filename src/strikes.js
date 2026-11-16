// Strike payloads are not part of the current API. This reader accepts the
// shapes a later backend is likely to send, so the UI can ignore them while
// VITE_STRIKES_ENABLED is off and render them only when that flag is on.
//
// Recognized fields (top-level, or nested under `strikes` / `strike`):
//   strikes | strike_count | count          number of strikes
//   strikes_blocked | strike_blocked |
//   account_blocked | blocked              lock the workspace
//   strike_message | strike_reason |
//   blocked_reason | message               explanation shown with the notice

function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '')
}

export function strikeStateFromUser(user) {
  if (!asRecord(user)) return null
  const nested = asRecord(user.strikes) || asRecord(user.strike)
  const source = nested ? { ...user, ...nested } : user

  const countRaw = firstDefined(source.strike_count, source.count, typeof source.strikes === 'number' || typeof source.strikes === 'string' ? source.strikes : undefined)
  const count = countRaw == null ? null : Number(countRaw)
  const countKnown = count != null && !Number.isNaN(count)
  const blocked = Boolean(firstDefined(source.strikes_blocked, source.strike_blocked, source.account_blocked, source.blocked))
  const reason = String(firstDefined(source.strike_message, source.strike_reason, source.blocked_reason, source.message) || '')

  if (!blocked && !reason && (!countKnown || count <= 0)) return null
  return { count: countKnown ? count : 0, blocked, reason }
}
