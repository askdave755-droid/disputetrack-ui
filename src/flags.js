// Build-time product switches. Vite inlines import.meta.env at build,
// so changing these in Vercel only takes effect on the next deploy.
//
// Defaults (when the variable is unset): strikes off, everything free.
// Revert by setting VITE_FREE_MODE=false and VITE_STRIKES_ENABLED=true, then redeploying.

export function flagEnabled(raw, defaultValue) {
  if (raw === undefined || raw === null || String(raw).trim() === '') return defaultValue
  const value = String(raw).trim().toLowerCase()
  if (['true', '1', 'yes', 'on'].includes(value)) return true
  if (['false', '0', 'no', 'off'].includes(value)) return false
  return defaultValue
}

// Static `import.meta.env.VITE_*` reads are required. Vite inlines those
// exact expressions at build time and drops anything reached only through
// a copied env object. The try/catch covers `node --test`, where `import.meta.env` is absent.
function readViteEnv(name) {
  try {
    if (name === 'VITE_STRIKES_ENABLED') return import.meta.env.VITE_STRIKES_ENABLED
    if (name === 'VITE_FREE_MODE') return import.meta.env.VITE_FREE_MODE
  } catch {
    return undefined
  }
  return undefined
}

// Strike warnings and the account-paused screen. Off until explicitly enabled.
export const STRIKES_ENABLED = flagEnabled(readViteEnv('VITE_STRIKES_ENABLED'), false)

// Bypass checkout, upgrade prompts, and public prices. On until explicitly disabled.
export const FREE_MODE = flagEnabled(readViteEnv('VITE_FREE_MODE'), true)
