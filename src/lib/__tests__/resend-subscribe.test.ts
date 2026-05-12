/**
 * @jest-environment node
 */
import {
  subscribeToResend,
  isResendSubscriber,
  isGoogleMailbox,
  SIGNUP_EVENT_NAME,
  _resetTopicCacheForTests,
} from '../resend-subscribe'

const ORIGINAL_FETCH = global.fetch
const ORIGINAL_API_KEY = process.env.RESEND_API_KEY
const ORIGINAL_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID
const ORIGINAL_GMAIL_HOLD = process.env.RESEND_GMAIL_HOLD

type MockResponse = {
  ok: boolean
  status: number
  text: () => Promise<string>
}

function jsonRes(body: unknown, status = 200): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  }
}

function errorRes(status: number, body: unknown = { error: 'oops' }): MockResponse {
  return {
    ok: false,
    status,
    text: async () => JSON.stringify(body),
  }
}

const TEST_AUDIENCE = '5f50ed9c-cf50-4a17-8e1e-1b782a4414d1'

function restoreEnv(name: string, original: string | undefined): void {
  if (original === undefined) delete process.env[name]
  else process.env[name] = original
}

// Helper: build the topic-list response shape Resend returns.
function topicsList(items: Array<{ id: string; name: string }>): MockResponse {
  return jsonRes({ object: 'list', has_more: false, data: items })
}

describe('isGoogleMailbox', () => {
  it('matches gmail.com and googlemail.com (case-insensitive)', () => {
    expect(isGoogleMailbox('a@gmail.com')).toBe(true)
    expect(isGoogleMailbox('A@GMAIL.COM')).toBe(true)
    expect(isGoogleMailbox('a@googlemail.com')).toBe(true)
    expect(isGoogleMailbox('  a@gmail.com  ')).toBe(true)
  })
  it('rejects non-Google mailboxes', () => {
    expect(isGoogleMailbox('a@protonmail.com')).toBe(false)
    expect(isGoogleMailbox('a@workos.com')).toBe(false)
    expect(isGoogleMailbox('a@gmail.com.evil.test')).toBe(false)
    expect(isGoogleMailbox('a@yahoo.com')).toBe(false)
  })
})

describe('subscribeToResend', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_AUDIENCE_ID = TEST_AUDIENCE
    delete process.env.RESEND_GMAIL_HOLD
    _resetTopicCacheForTests()
  })

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    restoreEnv('RESEND_API_KEY', ORIGINAL_API_KEY)
    restoreEnv('RESEND_AUDIENCE_ID', ORIGINAL_AUDIENCE_ID)
    restoreEnv('RESEND_GMAIL_HOLD', ORIGINAL_GMAIL_HOLD)
  })

  it('rejects empty email without calling Resend', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
    const result = await subscribeToResend({ email: '' })
    expect(result).toEqual({ ok: false, error: 'Missing email' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns error when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const result = await subscribeToResend({ email: 'a@b.com' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/RESEND_API_KEY/)
    }
  })

  it('no tags → only contact + event, no topic calls, topicsApplied empty', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(
        jsonRes({ object: 'contact', id: 'c-1', email: 'a@b.com' }, 201),
      )
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({ email: 'a@b.com' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tagsForwarded).toEqual([])
      expect(result.topicsApplied).toEqual([])
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
    }
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('tags + all topics already exist → cache GET, PATCH topics, event fires', async () => {
    const fetchMock = jest.fn()
      // 1) contact create
      .mockResolvedValueOnce(
        jsonRes({ object: 'contact', id: 'c-1' }, 201),
      )
      // 2) topics list — both tags already exist
      .mockResolvedValueOnce(
        topicsList([
          { id: 't-blog', name: 'source:blog' },
          { id: 't-voice', name: 'interest:voice-ai' },
        ]),
      )
      // 3) PATCH contact topics
      .mockResolvedValueOnce(jsonRes({ id: 'c-1' }))
      // 4) event send
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@b.com',
      tags: ['source:blog', 'interest:voice-ai'],
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.contactId).toBe('c-1')
      expect(result.topicsApplied).toEqual(['source:blog', 'interest:voice-ai'])
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
      expect(result.topicWarning).toBeUndefined()
    }

    expect(fetchMock).toHaveBeenCalledTimes(4)

    // Topics list call
    expect(fetchMock.mock.calls[1][0]).toMatch(/^https:\/\/api\.resend\.com\/topics\?/)

    // PATCH /contacts/{id}/topics body shape — Resend wants a BARE ARRAY,
    // NOT the intuitive `{topics: [...]}` wrapper. The wrapped form 422s
    // silently. Discovered during the 1,240-contact Topics backfill run
    // (2026-05-12) where the wrapped shape returned `The `` field must
    // be an `array`.` for every single PATCH.
    const patchCall = fetchMock.mock.calls[2]
    expect(patchCall[0]).toBe('https://api.resend.com/contacts/c-1/topics')
    expect(patchCall[1].method).toBe('PATCH')
    const parsedBody = JSON.parse(patchCall[1].body)
    expect(Array.isArray(parsedBody)).toBe(true) // regression guard
    expect(parsedBody).toEqual([
      { id: 't-blog', subscription: 'opt_in' },
      { id: 't-voice', subscription: 'opt_in' },
    ])
  })

  it('PATCH /topics body is a BARE ARRAY (not wrapped in {topics: [...]})', async () => {
    // Hard regression guard: the wrapped form `{topics: [...]}` returns
    // 422 from Resend and silently fails. This test exists ONLY to ensure
    // applyTopicsToContact never reverts to the wrapped form. If a future
    // refactor wraps the array, this test fails before the bug ships.
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'c-guard' }, 201))
      .mockResolvedValueOnce(
        topicsList([
          { id: 't-blog', name: 'source:blog' },
        ]),
      )
      .mockResolvedValueOnce(jsonRes({ id: 'c-guard' }, 200))
      .mockResolvedValueOnce(jsonRes({ id: 'evt-guard' }, 200))
    ;(global as any).fetch = fetchMock

    await subscribeToResend({
      email: 'guard@example.com',
      tags: ['source:blog'],
    })

    const patchCall = fetchMock.mock.calls[2]
    const body = JSON.parse(patchCall[1].body)

    // 1. Must be a bare array
    expect(Array.isArray(body)).toBe(true)
    // 2. Must NOT be an object with a `topics` key (the broken shape)
    expect(typeof body).not.toBe('object' && body && 'topics' in body ? 'object' : 'never')
    expect((body as any).topics).toBeUndefined()
    // 3. Each entry must have id + subscription only
    for (const entry of body as Array<Record<string, unknown>>) {
      expect(Object.keys(entry).sort()).toEqual(['id', 'subscription'])
      expect(entry.subscription).toBe('opt_in')
      expect(typeof entry.id).toBe('string')
    }
  })

  it('tags with a missing topic → creates it via POST /topics on the fly', async () => {
    const fetchMock = jest.fn()
      // 1) contact create
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'c-2' }, 201))
      // 2) topics list — only one of two exists
      .mockResolvedValueOnce(
        topicsList([{ id: 't-blog', name: 'source:blog' }]),
      )
      // 3) POST /topics to create the missing one
      .mockResolvedValueOnce(
        jsonRes({ object: 'topic', id: 't-new' }, 201),
      )
      // 4) PATCH topics
      .mockResolvedValueOnce(jsonRes({ id: 'c-2' }))
      // 5) event send
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@b.com',
      tags: ['source:blog', 'interest:new-thing'],
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.topicsApplied).toEqual(['source:blog', 'interest:new-thing'])
      expect(result.topicWarning).toBeUndefined()
    }

    // POST /topics call shape
    const createCall = fetchMock.mock.calls[2]
    expect(createCall[0]).toBe('https://api.resend.com/topics')
    expect(createCall[1].method).toBe('POST')
    // CRITICAL regression guard: must be `opt_out`, not `opt_in`.
    // With `opt_in`, every contact in the account is auto-subscribed via
    // the topic default — a tag-targeted broadcast goes to everyone.
    // Discovered 2026-05-12 when a brand-new /subscribe signup (tags: [])
    // showed up in the dashboard subscribed to all 22 topics.
    expect(JSON.parse(createCall[1].body)).toEqual({
      name: 'interest:new-thing',
      default_subscription: 'opt_out',
    })
  })

  it('topic-list failure → topicWarning, contact + event still complete', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'c-3' }, 201))
      .mockResolvedValueOnce(errorRes(500, { error: 'topics down' }))
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@b.com',
      tags: ['source:blog'],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.contactId).toBe('c-3')
      expect(result.topicsApplied).toEqual([])
      expect(result.topicWarning).toMatch(/Failed to resolve/)
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
    }
    consoleWarn.mockRestore()
  })

  it('PATCH-topics failure → topicWarning, topicsApplied cleared, event still fires', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'c-4' }, 201))
      .mockResolvedValueOnce(
        topicsList([{ id: 't-blog', name: 'source:blog' }]),
      )
      .mockResolvedValueOnce(errorRes(503, { error: 'patch down' }))
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@b.com',
      tags: ['source:blog'],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.topicsApplied).toEqual([])
      expect(result.topicWarning).toMatch(/Topic apply failed/)
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
    }
  })

  it('returns error when contact create fails (no topic or event calls)', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      errorRes(422, { error: 'invalid email' }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@b.com',
      tags: ['source:blog'],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/422/)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('event-send failure → warning with topicsApplied preserved', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'c-5' }, 201))
      .mockResolvedValueOnce(
        topicsList([{ id: 't-blog', name: 'source:blog' }]),
      )
      .mockResolvedValueOnce(jsonRes({ id: 'c-5' }))
      .mockResolvedValueOnce(errorRes(500, { error: 'event down' }))
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@b.com',
      tags: ['source:blog'],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.topicsApplied).toEqual(['source:blog'])
      expect(result.eventSendWarning).toMatch(/500/)
    }
  })

  // === Gmail reputation hold ===

  it('Gmail + RESEND_GMAIL_HOLD=true: contact + topics applied, NO event', async () => {
    process.env.RESEND_GMAIL_HOLD = 'true'
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'gmail-c-1' }, 201))
      .mockResolvedValueOnce(
        topicsList([{ id: 't-blog', name: 'source:blog' }]),
      )
      .mockResolvedValueOnce(jsonRes({ id: 'gmail-c-1' }))
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'someone@gmail.com',
      tags: ['source:blog'],
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.eventFired).toBeNull()
      expect(result.heldForReputation).toBe(true)
      expect(result.topicsApplied).toEqual(['source:blog'])
    }
    expect(fetchMock).toHaveBeenCalledTimes(3) // contact + topics-list + PATCH, NO event
  })

  it('non-Gmail + RESEND_GMAIL_HOLD=true: full normal flow (topics + event)', async () => {
    process.env.RESEND_GMAIL_HOLD = 'true'
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'p-c-1' }, 201))
      .mockResolvedValueOnce(
        topicsList([{ id: 't-blog', name: 'source:blog' }]),
      )
      .mockResolvedValueOnce(jsonRes({ id: 'p-c-1' }))
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({
      email: 'a@protonmail.com',
      tags: ['source:blog'],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
      expect(result.heldForReputation).toBe(false)
      expect(result.topicsApplied).toEqual(['source:blog'])
    }
  })

  it('Gmail without RESEND_GMAIL_HOLD: fires event normally', async () => {
    // RESEND_GMAIL_HOLD unset
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(jsonRes({ object: 'contact', id: 'gmail-c-2' }, 201))
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({ email: 'a@gmail.com' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
      expect(result.heldForReputation).toBe(false)
    }
  })
})

describe('isResendSubscriber', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_AUDIENCE_ID = TEST_AUDIENCE
  })

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    restoreEnv('RESEND_API_KEY', ORIGINAL_API_KEY)
    restoreEnv('RESEND_AUDIENCE_ID', ORIGINAL_AUDIENCE_ID)
  })

  it('returns false for null/empty email without calling Resend', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
    expect(await isResendSubscriber(null)).toBe(false)
    expect(await isResendSubscriber(undefined)).toBe(false)
    expect(await isResendSubscriber('')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns true when contact exists and is not unsubscribed', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      jsonRes({ id: 'c-3', email: 'target@b.com', unsubscribed: false }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    expect(await isResendSubscriber('TARGET@b.com')).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url: string = fetchMock.mock.calls[0][0]
    expect(url).toBe(
      `https://api.resend.com/audiences/${TEST_AUDIENCE}/contacts/target%40b.com`,
    )
  })

  it('returns false when contact exists but is unsubscribed', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      jsonRes({ id: 'c-4', email: 'gone@b.com', unsubscribed: true }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    expect(await isResendSubscriber('gone@b.com')).toBe(false)
  })

  it('returns false on 404', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      errorRes(404, { statusCode: 404, message: 'Contact not found' }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    expect(await isResendSubscriber('missing@b.com')).toBe(false)
  })

  it('swallows errors and returns false', async () => {
    const fetchMock = jest.fn().mockRejectedValueOnce(new Error('network down'))
    global.fetch = fetchMock as unknown as typeof fetch
    const consoleErr = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    expect(await isResendSubscriber('a@b.com')).toBe(false)
    consoleErr.mockRestore()
  })
})
