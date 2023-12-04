import {defineEvent, defineTrace} from '@sanity/telemetry'

export const CliStart = defineEvent<{
  nodeVersion: string
  cliVersion: string
}>({
  name: 'cliStartEvent',
  version: 1,
  description: 'User ran the sanity cli',
})

export const CliCommand = defineTrace<{commandName: string}>({
  name: 'cliCommand',
  version: 1,
  description: 'User ran a cli action',
})
