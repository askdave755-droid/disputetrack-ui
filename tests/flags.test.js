import assert from 'node:assert/strict'
import test from 'node:test'
import { flagEnabled, STRIKES_ENABLED, FREE_MODE } from '../src/flags.js'
import { strikeStateFromUser } from '../src/strikes.js'

test('flagEnabled uses the default when the variable is missing', () => {
  assert.equal(flagEnabled(undefined, false), false)
  assert.equal(flagEnabled(undefined, true), true)
  assert.equal(flagEnabled('', true), true)
  assert.equal(flagEnabled('   ', false), false)
})

test('flagEnabled accepts common true and false strings', () => {
  for (const raw of ['true', 'TRUE', '1', 'yes', 'on']) {
    assert.equal(flagEnabled(raw, false), true)
  }
  for (const raw of ['false', 'FALSE', '0', 'no', 'off']) {
    assert.equal(flagEnabled(raw, true), false)
  }
})

test('flagEnabled falls back when the value is unrecognized', () => {
  assert.equal(flagEnabled('maybe', true), true)
  assert.equal(flagEnabled('maybe', false), false)
})

test('defaults match the temporary product decision', () => {
  assert.equal(STRIKES_ENABLED, false)
  assert.equal(FREE_MODE, true)
})

test('strike reader ignores payloads with nothing to show', () => {
  assert.equal(strikeStateFromUser(null), null)
  assert.equal(strikeStateFromUser({ plan_status: 'trialing' }), null)
  assert.equal(strikeStateFromUser({ strikes: 0 }), null)
})

test('strike reader accepts a count, a block flag, and a nested object', () => {
  assert.deepEqual(strikeStateFromUser({ strikes: 2, strike_message: 'Frivolous dispute' }), {
    count: 2,
    blocked: false,
    reason: 'Frivolous dispute',
  })
  assert.deepEqual(strikeStateFromUser({ strike_count: '3', account_blocked: true, blocked_reason: 'Paused' }), {
    count: 3,
    blocked: true,
    reason: 'Paused',
  })
  assert.deepEqual(strikeStateFromUser({ strikes: { count: 1, blocked: false, message: 'Heads up' } }), {
    count: 1,
    blocked: false,
    reason: 'Heads up',
  })
})
