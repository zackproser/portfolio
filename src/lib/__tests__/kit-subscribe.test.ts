/**
 * @jest-environment node
 */
import { subscribeToKit, isKitSubscriber, _resetTagCacheForTests } from '../kit-subscribe'

const ORIGINAL_FETCH = global.fetch
const ORIGINAL_API_KEY = process.env.KIT_API_KEY

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

function emptyRes(status = 200): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => '',
  }
}

function errorRes(status: number, body: unknown = { error: 'oops' }): MockResponse {
  return {
    ok: false,
    status,
    text: async () => JSON.stringify(body),
  }
}

describe('subscribeToKit', () => {
  beforeEach(() => {
    process.env.KIT_API_KEY = 'test-key'
    _resetTagCacheForTests()
  })

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    if (ORIGINAL_API_KEY === undefined) delete process.env.KIT_API_KEY
    else process.env.KIT_API_KEY = ORIGINAL_API_KEY
  })

  it('rejects empty email without calling Kit', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
    const result = await subscribeToKit({ email: '' })
    expect(result).toEqual({ ok: false, error: 'Missing email' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns error when KIT_API_KEY is missing', async () => {
    delete process.env.KIT_API_KEY
    const result = await subscribeToKit({ email: 'a@b.com' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/KIT_API_KEY/)
    }
  })

  it('creates subscriber and applies tags using cached tag IDs', async () => {
    // Code path: POST /subscribers → GET /tags (warms cache) → POST /tags/{id}/subscribers/{id} per tag
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(
        jsonRes({
          subscriber: {
            id: 1234,
            email_address: 'a@b.com',
            state: 'active',
          },
        }, 201),
      )
      .mockResolvedValueOnce(
        jsonRes({
          tags: [
            { id: 1, name: 'source:blog' },
            { id: 2, name: 'interest:voice-ai' },
          ],
          pagination: { has_next_page: false, end_cursor: null },
        }),
      )
      .mockResolvedValueOnce(jsonRes({ subscriber: { id: 1234 } }, 201))
      .mockResolvedValueOnce(jsonRes({ subscriber: { id: 1234 } }, 201))
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToKit({
      email: 'a@b.com',
      tags: ['source:blog', 'interest:voice-ai'],
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.subscriberId).toBe(1234)
      expect(result.appliedTags).toEqual(['source:blog', 'interest:voice-ai'])
      expect(result.failedTags).toEqual([])
    }

    // Subscriber create is the FIRST call
    const createSubCall = fetchMock.mock.calls[0]
    expect(createSubCall[0]).toBe('https://api.kit.com/v4/subscribers')
    expect(createSubCall[1].method).toBe('POST')
    expect(createSubCall[1].headers['X-Kit-Api-Key']).toBe('test-key')
    expect(JSON.parse(createSubCall[1].body)).toEqual({
      email_address: 'a@b.com',
      state: 'active',
    })

    expect(fetchMock.mock.calls[2][0]).toBe(
      'https://api.kit.com/v4/tags/1/subscribers/1234',
    )
    expect(fetchMock.mock.calls[3][0]).toBe(
      'https://api.kit.com/v4/tags/2/subscribers/1234',
    )
  })

  it('creates a missing tag on the fly via POST /tags', async () => {
    const fetchMock = jest.fn()
      // POST /subscribers
      .mockResolvedValueOnce(
        jsonRes({
          subscriber: { id: 9, email_address: 'a@b.com', state: 'active' },
        }, 201),
      )
      // GET /tags returns empty
      .mockResolvedValueOnce(
        jsonRes({
          tags: [],
          pagination: { has_next_page: false, end_cursor: null },
        }),
      )
      // POST /tags creates the missing tag
      .mockResolvedValueOnce(jsonRes({ tag: { id: 42, name: 'new-tag' } }, 201))
      // POST /tags/42/subscribers/9 applies it
      .mockResolvedValueOnce(jsonRes({ subscriber: { id: 9 } }, 201))
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToKit({ email: 'a@b.com', tags: ['new-tag'] })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.appliedTags).toEqual(['new-tag'])
      expect(result.failedTags).toEqual([])
    }

    const createTagCall = fetchMock.mock.calls[2]
    expect(createTagCall[0]).toBe('https://api.kit.com/v4/tags')
    expect(JSON.parse(createTagCall[1].body)).toEqual({ name: 'new-tag' })
  })

  it('reports per-tag failures without failing the whole subscribe', async () => {
    const fetchMock = jest.fn()
      // POST /subscribers
      .mockResolvedValueOnce(
        jsonRes({
          subscriber: { id: 7, email_address: 'a@b.com', state: 'active' },
        }, 201),
      )
      // GET /tags
      .mockResolvedValueOnce(
        jsonRes({
          tags: [{ id: 1, name: 'source:blog' }],
          pagination: { has_next_page: false, end_cursor: null },
        }),
      )
      // POST tag/sub — fails
      .mockResolvedValueOnce(errorRes(429, { error: 'Retry later' }))
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToKit({
      email: 'a@b.com',
      tags: ['source:blog'],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.subscriberId).toBe(7)
      expect(result.appliedTags).toEqual([])
      expect(result.failedTags).toHaveLength(1)
      expect(result.failedTags[0].tag).toBe('source:blog')
      expect(result.failedTags[0].reason).toMatch(/429/)
    }
  })

  it('returns error when subscriber create fails', async () => {
    // Subscriber create is FIRST — failure short-circuits before any tag call
    const fetchMock = jest.fn().mockResolvedValueOnce(
      errorRes(422, { errors: ['Email is invalid'] }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToKit({ email: 'a@b.com' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/422/)
    }
  })
})

describe('isKitSubscriber', () => {
  beforeEach(() => {
    process.env.KIT_API_KEY = 'test-key'
    _resetTagCacheForTests()
  })

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    if (ORIGINAL_API_KEY === undefined) delete process.env.KIT_API_KEY
    else process.env.KIT_API_KEY = ORIGINAL_API_KEY
  })

  it('returns false for null/empty email without calling Kit', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
    expect(await isKitSubscriber(null)).toBe(false)
    expect(await isKitSubscriber(undefined)).toBe(false)
    expect(await isKitSubscriber('')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns true when email is on the active list (single filtered call)', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      jsonRes({
        subscribers: [
          { id: 2, email_address: 'TARGET@b.com', state: 'active' },
        ],
      }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    expect(await isKitSubscriber('target@b.com')).toBe(true)
    // Confirm the single-call filter pattern, not a paginated scan.
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url: string = fetchMock.mock.calls[0][0]
    expect(url).toContain('email_address=target%40b.com')
  })

  it('returns false when email not present on active list', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      jsonRes({ subscribers: [] }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    expect(await isKitSubscriber('missing@b.com')).toBe(false)
  })

  it('returns false when filter returns the email but in a non-active state', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      jsonRes({
        subscribers: [
          { id: 5, email_address: 'cancelled@b.com', state: 'cancelled' },
        ],
      }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    expect(await isKitSubscriber('cancelled@b.com')).toBe(false)
  })

  it('returns false on Kit API error rather than throwing', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(errorRes(500))
    global.fetch = fetchMock as unknown as typeof fetch
    expect(await isKitSubscriber('a@b.com')).toBe(false)
  })
})
