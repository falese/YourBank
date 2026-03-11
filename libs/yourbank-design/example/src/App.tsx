/**
 * Example App — YourBank Design System Demo
 *
 * Demonstrates:
 *  1. Form with editable fields and a submit button
 *  2. Navigation between views (Landing → Application → Confirmation)
 *  3. A DOM observer (TrackingObserver) that dispatches custom events the
 *     Adobe Web SDK can listen to
 *  4. A schema (tracking-schema.ts) that blocks specific sensitive fields from
 *     being tracked — without any changes to the form components themselves
 *
 * The "Adobe SDK Event Console" panel at the bottom simulates what the real
 * Adobe Web SDK would receive when its rules listen to `yourbank:*` events.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Header, { TrackingObserver, TrackingEventDetail } from 'yourbank-design'
import 'yourbank-design/dist/index.css'

import trackingSchema from './tracking-schema'
import LandingPage from './pages/LandingPage'
import ApplicationPage, { ApplicationFormData } from './pages/ApplicationPage'
import ConfirmationPage from './pages/ConfirmationPage'

// ─── Types ─────────────────────────────────────────────────────────────────

type Page = 'landing' | 'application' | 'confirmation'

interface EventLogEntry {
  id: number
  eventName: string
  detail: TrackingEventDetail
  blocked: boolean
}

// ─── Mock Adobe SDK ─────────────────────────────────────────────────────────
//
// In a real deployment the Adobe Web SDK (alloy.js) is loaded separately and
// configured via Adobe Experience Platform Data Collection (Launch/Tags).
// SDK rules listen for custom events like `yourbank:fieldInteraction` and
// fire send-beacon / analytics actions.
//
// Here we register the same event listeners a typical Launch rule would use,
// and surface them in the on-page debug console below.

function createAdobeSDKSimulator(
  onEvent: (entry: Omit<EventLogEntry, 'id'>) => void
) {
  const prefix = trackingSchema.eventPrefix // 'yourbank:'

  const handle = (eventName: string) => (e: Event) => {
    const customEvent = e as CustomEvent<TrackingEventDetail>
    onEvent({
      eventName,
      detail: customEvent.detail,
      blocked: false // only non-blocked events reach here
    })
  }

  const listeners: [string, EventListener][] = [
    [`${prefix}pageView`, handle('pageView')],
    [`${prefix}fieldInteraction`, handle('fieldInteraction')],
    [`${prefix}formSubmit`, handle('formSubmit')]
  ]

  listeners.forEach(([type, fn]) => document.addEventListener(type, fn))

  return () => listeners.forEach(([type, fn]) => document.removeEventListener(type, fn))
}

// ─── App ───────────────────────────────────────────────────────────────────

let _eventId = 0

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing')
  const [formData, setFormData] = useState<ApplicationFormData | null>(null)
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([])
  const [consoleOpen, setConsoleOpen] = useState(true)
  const observerRef = useRef<TrackingObserver | null>(null)

  const addEvent = useCallback((entry: Omit<EventLogEntry, 'id'>) => {
    setEventLog(prev => [{ ...entry, id: ++_eventId }, ...prev].slice(0, 50))
  }, [])

  // Initialise the TrackingObserver once on mount
  useEffect(() => {
    const observer = new TrackingObserver(trackingSchema)
    observer.start()
    observerRef.current = observer

    // Adobe SDK simulation — only sees events that passed through the observer
    const cleanup = createAdobeSDKSimulator(addEvent)

    return () => {
      observer.stop()
      cleanup()
    }
  }, [addEvent])

  // Announce page changes to the observer so Adobe SDK rules get page context
  useEffect(() => {
    observerRef.current?.setPage(page)
  }, [page])

  const navigateTo = (next: Page) => setPage(next)

  const handleSubmit = (data: ApplicationFormData) => {
    setFormData(data)
    navigateTo('confirmation')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0' }}>
      <Header>
        <button
          className={page === 'landing' ? 'active' : ''}
          onClick={() => navigateTo('landing')}
        >
          Home
        </button>
        <button
          className={page === 'application' ? 'active' : ''}
          onClick={() => navigateTo('application')}
        >
          Apply Now
        </button>
        {formData && (
          <button
            className={page === 'confirmation' ? 'active' : ''}
            onClick={() => navigateTo('confirmation')}
          >
            Confirmation
          </button>
        )}
      </Header>

      <main>
        {page === 'landing' && (
          <LandingPage onApply={() => navigateTo('application')} />
        )}
        {page === 'application' && (
          <ApplicationPage
            onSubmit={handleSubmit}
            onBack={() => navigateTo('landing')}
          />
        )}
        {page === 'confirmation' && formData && (
          <ConfirmationPage
            formData={formData}
            onBack={() => navigateTo('landing')}
          />
        )}
      </main>

      {/* ── Adobe SDK Event Console ──────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'monospace',
          fontSize: 12,
          zIndex: 9999,
          borderTop: '3px solid #c0392b',
          maxHeight: consoleOpen ? 260 : 36,
          transition: 'max-height 0.25s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Console header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            background: '#2d2d2d',
            cursor: 'pointer',
            flexShrink: 0
          }}
          onClick={() => setConsoleOpen(o => !o)}
        >
          <span>
            <span style={{ color: '#c0392b', fontWeight: 700 }}>●</span>{' '}
            Adobe Web SDK Event Console{' '}
            <span style={{ color: '#888', fontSize: 11 }}>
              (simulated — only non-blocked fields appear here)
            </span>
          </span>
          <span style={{ color: '#888' }}>
            {eventLog.length} event{eventLog.length !== 1 ? 's' : ''}{' '}
            {consoleOpen ? '▼' : '▲'}
          </span>
        </div>

        {/* Event log */}
        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: '4px 0'
          }}
        >
          {eventLog.length === 0 && (
            <div style={{ padding: '12px 16px', color: '#666' }}>
              Interact with the form to see tracking events…
            </div>
          )}
          {eventLog.map(entry => (
            <EventRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {/* Spacer so content isn't hidden behind the console */}
      <div style={{ height: consoleOpen ? 260 : 36 }} />
    </div>
  )
}

// ─── Console row ──────────────────────────────────────────────────────────

interface EventRowProps {
  entry: EventLogEntry
}

const EVENT_COLORS: Record<string, string> = {
  pageView: '#569cd6',
  fieldInteraction: '#4ec9b0',
  formSubmit: '#dcdcaa'
}

const EventRow: React.FC<EventRowProps> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false)
  const color = EVENT_COLORS[entry.eventName] ?? '#ce9178'
  const d = entry.detail

  const summary = [
    d.fieldId && `fieldId="${d.fieldId}"`,
    d.fieldType && `type="${d.fieldType}"`,
    d.pageName && `page="${d.pageName}"`,
    d.elementText && `text="${d.elementText}"`
  ]
    .filter(Boolean)
    .join('  ')

  return (
    <div
      style={{
        padding: '3px 16px',
        borderBottom: '1px solid #2a2a2a',
        cursor: 'pointer',
        lineHeight: 1.6
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <span style={{ color: '#888', marginRight: 8 }}>
        {d.timestamp ? d.timestamp.slice(11, 23) : ''}
      </span>
      <span style={{ color, fontWeight: 600 }}>{entry.eventName}</span>
      {summary && (
        <span style={{ color: '#d4d4d4', marginLeft: 12 }}>{summary}</span>
      )}
      {expanded && (
        <pre
          style={{
            margin: '4px 0 4px 24px',
            color: '#9cdcfe',
            background: '#252526',
            padding: '8px 12px',
            borderRadius: 4,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}
        >
          {JSON.stringify(d, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App
