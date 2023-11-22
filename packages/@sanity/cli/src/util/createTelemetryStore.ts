import {createClient, SanityClient} from '@sanity/client'
import {ConsentStatus, createBatchedStore, createSessionId, TelemetryEvent} from '@sanity/telemetry'
import {debug as baseDebug} from '../debug'
import {getCliToken} from './clientWrapper'

const debug = baseDebug.extend('telemetry')

function isTrueish(value: string | undefined) {
  if (value === undefined) return false
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false
  const number = parseInt(value, 10)
  if (isNaN(number)) return false
  return number > 0
}

const VALID_STATUSES: ConsentStatus[] = ['granted', 'denied', 'unset']
function parseConsent(value: string): ConsentStatus {
  if (VALID_STATUSES.includes(value.toLowerCase() as any)) {
    return value as ConsentStatus
  }
  throw new Error(
    'Invalid value provided for environment variable MOCK_CONSENT. Must be either "0", "1", "true", "false", "granted", "denied" or "unset"',
  )
}

function createTelemetryClient(token: string) {
  return createClient({
    apiVersion: '2023-10-22',
    token,
    useProjectHostname: false,
    useCdn: false,
  })
}

let _client: SanityClient | null = null
function getCachedClient(token: string) {
  if (!_client) {
    _client = createTelemetryClient(token)
  }
  return _client
}

export function createTelemetryStore(options: {env: {[key: string]: string | undefined}}) {
  debug('Initializing telemetry')
  const {env} = options

  function fetchConsent(client: SanityClient) {
    if (env.MOCK_CONSENT) {
      return Promise.resolve({
        status: isTrueish(env.MOCK_CONSENT) ? 'granted' : parseConsent(env.MOCK_CONSENT),
      })
    }
    return client.request({uri: '/users/me/consents/telemetry'})
  }

  function resolveConsent(): Promise<{status: ConsentStatus}> {
    debug('Resolving consent…')
    if (isTrueish(env.DO_NOT_TRACK)) {
      debug('DO_NOT_TRACK is set, consent is denied')
      return Promise.resolve({status: 'denied'})
    }
    const token = getCliToken()
    if (!token) {
      debug('User is not logged in, consent is undetermined')
      return Promise.resolve({status: 'undetermined'})
    }
    const client = getCachedClient(token)
    return fetchConsent(client)
      .then((response) => {
        debug('User consent status is %s', response.status)
        return {status: parseConsent(response.status)}
      })
      .catch((err) => {
        debug('Failed to fetch user consent status, treating it as "undetermined": %s', err.stack)
        return {status: 'undetermined'}
      })
  }
  function sendEvents(entries: TelemetryEvent[]) {
    debug('Pretend submitting events:', JSON.stringify(entries))
    return Promise.resolve()
  }
  const sessionId = createSessionId()
  debug('session id: %s', sessionId)

  const store = createBatchedStore(sessionId, {
    resolveConsent,
    sendEvents,
  })
  process.once('beforeExit', () => store.flush())
  return store.logger
}
