import {defineTrace} from '@sanity/telemetry'

interface InitTrace {
  step:
    | 'start'
    | 'unsupportedInitPlugin'
    | 'frameworkDetected'
    | 'v2Warning'
    | 'continueV3'
    | 'cancelV3Init'
}

interface FrameworkDetectedStep {
  step: 'frameworkDetected'
  framework: string | undefined
}

type InitData = InitTrace | FrameworkDetectedStep
export const CliInitTrace = defineTrace<InitData>({
  name: 'cliInit',
  version: 1,
  description: 'User ran cli init',
})
