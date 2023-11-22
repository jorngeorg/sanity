import {createBatchedStore, createSessionId} from '@sanity/telemetry'
import {TelemetryProvider} from '@sanity/telemetry/react'
import React, {ReactNode} from 'react'
import {SANITY_VERSION} from '../version'
import {Config} from '../config'
import {StudioMount} from './__telemetry__/studio.telemetry'

const sessionId = createSessionId()

const store = createBatchedStore(sessionId, {
  // submit any pending events every 30s
  flushInterval: 10000,

  // implement user consent resolving
  resolveConsent: () => {
    // @todo(telemetry): replace with actual consent resolving
    return fetch('http://localhost:5001/vX/intake/telemetry-allowed')
      .then((res) => res.json())
      .then((body) => ({status: body.granted ? 'granted' : 'denied'}))
  },

  // implement sending events to backend
  sendEvents: (events) => {
    return fetch('http://localhost:5001/vX/intake/batch', {
      method: 'POST',
      body: JSON.stringify(events),
    }).then((res) => res.json())
  },
  // opt into a different strategy for sending events when the browser close, reload or navigate away from the current page (recommended)
  sendBeacon: (events) => {
    return navigator.sendBeacon(
      'http://localhost:5001/vX/intake/batch',
      new Blob([JSON.stringify(events)], {
        type: 'text/plain',
      }),
    )
  },
})

function arrify<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// Wrap the app in a TelemetryProvider
// This will enable usage of the `useTelemetry()` hook
export function StudioTelemetryProvider(props: {children: ReactNode; config: Config}) {
  store.logger.log(StudioMount, {
    studioVersion: SANITY_VERSION,
    pluginVersions: arrify(props.config).flatMap(
      (config) =>
        config.plugins?.flatMap((plugin) => ({
          pluginName: plugin.name,
          version: 'n/a',
        })) || [],
    ),
  })
  return <TelemetryProvider store={store}>{props.children}</TelemetryProvider>
}
