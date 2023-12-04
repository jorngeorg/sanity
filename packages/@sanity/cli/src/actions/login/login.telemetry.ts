import {defineTrace} from '@sanity/telemetry'

interface LoginTraceStart {
  step: 'start'
}

interface LoginTraceSelectProvider {
  step: 'selectProvider'
  provider: string | undefined
}

interface LoginTraceWaitForToken {
  step: 'waitForToken'
}
interface LoginTraceWaitForTokenComplete {
  step: 'waitForTokenComplete'
}

type LoginTraceData =
  | LoginTraceStart
  | LoginTraceSelectProvider
  | LoginTraceWaitForToken
  | LoginTraceWaitForTokenComplete

export const LoginTrace = defineTrace<LoginTraceData>({
  name: 'cliLogin',
  version: 1,
  description: 'User is getting logged in',
})
