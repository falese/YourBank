/**
 * Example App — YourBank Design System Demo
 *
 * Demonstrates:
 *  1. Form with editable fields and a submit button
 *  2. Navigation between views (Landing → Application → Confirmation)
 *  3. A DOM observer (TrackingObserver) that dispatches custom events that
 *     any analytics vendor can listen to
 *  4. A schema (tracking-schema.ts) that:
 *     - Blocks specific sensitive fields from being tracked (v1)
 *     - Enriches tracked field events with business metadata (v2)
 *  5. An Architecture page explaining the full system design
 *
 * The "Analytics Event Console" panel at the bottom simulates what any
 * vendor (Adobe, GA4, Segment) would receive when listening to `yourbank:*`
 * custom events on document.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Header, { TrackingObserver, TrackingEventDetail } from 'yourbank-design'
import 'yourbank-design/dist/index.css'

import trackingSchema from './tracking-schema'
import LandingPage from './pages/LandingPage'
import ApplicationPage, { ApplicationFormData } from './pages/ApplicationPage'
import ConfirmationPage from './pages/ConfirmationPage'
import ArchitecturePage from './pages/ArchitecturePage'

// ─── Types ─────────────────────────────────────────────────────────────────

type Page = 'landing' | 'application' | 'confirmation' | 'architecture'

interface EventLogEntry {
  id: number
  eventName: string
  detail: TrackingEventDetail
  blocked: boolean
}

// ─── Analytics vendor simulator ─────────────────────────────────────────────
//
// In a real deployment vendor SDKs (Adobe alloy.js, gtag.js, analytics.js) are
// loaded separately. Each vendor registers its own document event listeners.
// Here we simulate what any vendor would receive from the custom events.

function createVendorSimulator(
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

    // Vendor simulation — only sees events that passed through the observer
    const cleanup = createVendorSimulator(addEvent)

    return () => {
      observer.stop()
      cleanup()
    }
  }, [addEvent])

  // Announce page changes to the observer so vendor rules get page context
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
        <button
          className={page === 'architecture' ? 'active' : ''}
          onClick={() => navigateTo('architecture')}
          style={{ marginLeft: 'auto' }}
        >
          Architecture
        </button>
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
        {page === 'architecture' && <ArchitecturePage />}
      </main>

      {/* ── Analytics Event Console ──────────────────────────────────────── */}
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
            Analytics Event Console{' '}
            <span style={{ color: '#888', fontSize: 11 }}>
              (simulated vendor listener — blocked fields never appear)
            </span>
          </span>
          <span style={{ color: '#888' }}>
            {eventLog.length} event{eventLog.length !== 1 ? 's' : ''}{' '}
            {consoleOpen ? '▼' : '▲'}
          </span>
        </div>

        {/* Event log */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
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

const COMPONENT_TYPE_COLORS: Record<string, string> = {
  'input:text':     '#ce9178',
  'input:checkbox': '#b5cea8',
  'input:number':   '#b5cea8',
  'input:date':     '#b5cea8',
  'button:submit':  '#dcdcaa',
  'button:button':  '#d7ba7d',
  'select':         '#9cdcfe',
  'textarea':       '#ce9178',
  'link':           '#569cd6',
  'form':           '#dcdcaa'
}

const EventRow: React.FC<EventRowProps> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false)
  const color = EVENT_COLORS[entry.eventName] ?? '#ce9178'
  const d = entry.detail
  const ctColor = d.componentType ? (COMPONENT_TYPE_COLORS[d.componentType] ?? '#d4d4d4') : '#d4d4d4'

  const summary = [
    d.componentType && `[${d.componentType}]`,
    d.fieldId && `fieldId="${d.fieldId}"`,
    d.pageName && `page="${d.pageName}"`,
    d.elementText && `text="${d.elementText}"`,
    d.meta?.section && `section="${d.meta.section}"`
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
      {d.componentType && (
        <span style={{ color: ctColor, marginLeft: 8, fontSize: 11 }}>
          {d.componentType}
        </span>
      )}
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
