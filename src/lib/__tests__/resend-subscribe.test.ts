/**
 * @jest-environment node
 */
import {
  subscribeToResend,
  isResendSubscriber,
  SIGNUP_EVENT_NAME,
} from '../resend-subscribe'

const ORIGINAL_FETCH = global.fetch
const ORIGINAL_API_KEY = process.env.RESEND_API_KEY
const ORIGINAL_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

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

describe('subscribeToResend', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_AUDIENCE_ID = TEST_AUDIENCE
  })

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    if (ORIGINAL_API_KEY === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = ORIGINAL_API_KEY
    if (ORIGINAL_AUDIENCE_ID === undefined) delete process.env.RESEND_AUDIENCE_ID
    else process.env.RESEND_AUDIENCE_ID = ORIGINAL_AUDIENCE_ID
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

  it('creates contact and fires signup event with tag metadata', async () => {
    const fetchMock = jest.fn()
      // POST /audiences/{id}/contacts
      .mockResolvedValueOnce(
        jsonRes(
          {
            object: 'contact',
            id: 'contact-uuid-123',
            email: 'a@b.com',
          },
          201,
        ),
      )
      // POST /events/send
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
      expect(result.contactId).toBe('contact-uuid-123')
      expect(result.eventFired).toBe(SIGNUP_EVENT_NAME)
      expect(result.tagsForwarded).toEqual(['source:blog', 'interest:voice-ai'])
    }

    expect(fetchMock).toHaveBeenCalledTimes(2)

    const contactCall = fetchMock.mock.calls[0]
    expect(contactCall[0]).toBe(
      `https://api.resend.com/audiences/${TEST_AUDIENCE}/contacts`,
    )
    expect(contactCall[1].method).toBe('POST')
    expect(contactCall[1].headers.Authorization).toBe('Bearer test-key')
    expect(JSON.parse(contactCall[1].body)).toEqual({
      email: 'a@b.com',
      unsubscribed: false,
    })

    const eventCall = fetchMock.mock.calls[1]
    expect(eventCall[0]).toBe('https://api.resend.com/events/send')
    expect(eventCall[1].method).toBe('POST')
    expect(JSON.parse(eventCall[1].body)).toEqual({
      event: SIGNUP_EVENT_NAME,
      email: 'a@b.com',
      payload: {
        source: 'source:blog',
        tags: ['source:blog', 'interest:voice-ai'],
      },
    })
  })

  it('passes first_name when provided and defaults source when no tags', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(
        jsonRes({ object: 'contact', id: 'c-1', email: 'x@y.com' }, 201),
      )
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({ email: 'x@y.com', firstName: 'Pat' })
    expect(result.ok).toBe(true)

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      email: 'x@y.com',
      first_name: 'Pat',
      unsubscribed: false,
    })

    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      event: SIGNUP_EVENT_NAME,
      email: 'x@y.com',
      payload: { source: 'newsletter', tags: [] },
    })
  })

  it('treats duplicate-email 201 as success (idempotency)', async () => {
    // Resend's behavior live-verified: posting an existing email returns 201
    // with the same contact id and no error. The lib must not treat that as
    // a failure.
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(
        jsonRes({ object: 'contact', id: 'existing-id' }, 201),
      )
      .mockResolvedValueOnce(
        jsonRes({ object: 'event', event: SIGNUP_EVENT_NAME }, 202),
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({ email: 'dup@b.com' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.contactId).toBe('existing-id')
  })

  it('returns error when contact create fails', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      errorRes(422, { error: 'invalid email' }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({ email: 'a@b.com' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/422/)
    // Event MUST NOT fire if contact create failed.
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('surfaces event-send failure as warning when contact is already created', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(
        jsonRes({ object: 'contact', id: 'c-2' }, 201),
      )
      .mockResolvedValueOnce(errorRes(500, { error: 'down' }))
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await subscribeToResend({ email: 'a@b.com' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.contactId).toBe('c-2')
      expect(result.eventSendWarning).toMatch(/500/)
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
    if (ORIGINAL_API_KEY === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = ORIGINAL_API_KEY
    if (ORIGINAL_AUDIENCE_ID === undefined) delete process.env.RESEND_AUDIENCE_ID
    else process.env.RESEND_AUDIENCE_ID = ORIGINAL_AUDIENCE_ID
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
      jsonRes({
        id: 'c-3',
        email: 'target@b.com',
        unsubscribed: false,
      }),
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
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
    global.fetch = fetchMock as unknown as typeof fetch
    const consoleErr = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    expect(await isResendSubscriber('a@b.com')).toBe(false)
    consoleErr.mockRestore()
  })
})
