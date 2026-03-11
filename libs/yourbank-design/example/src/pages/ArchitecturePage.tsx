import React, { useState } from 'react'
import { Container, Card } from 'yourbank-design'

// ─── Styles ──────────────────────────────────────────────────────────────────

const pre: React.CSSProperties = {
  background: '#1e1e1e',
  color: '#d4d4d4',
  fontFamily: 'monospace',
  fontSize: 12,
  padding: '16px',
  borderRadius: 6,
  overflowX: 'auto',
  margin: 0,
  lineHeight: 1.6,
  whiteSpace: 'pre'
}

const h2: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  margin: '0 0 12px',
  color: '#1a1a2e'
}

const h3: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  margin: '20px 0 8px',
  color: '#c0392b'
}

const p: React.CSSProperties = {
  margin: '0 0 12px',
  lineHeight: 1.7,
  color: '#444'
}

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
  fontFamily: 'monospace'
}

const th: React.CSSProperties = {
  background: '#2d2d2d',
  color: '#d4d4d4',
  padding: '6px 12px',
  textAlign: 'left',
  fontWeight: 600,
  borderBottom: '2px solid #444'
}

const td: React.CSSProperties = {
  padding: '5px 12px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top'
}

const tdCode: React.CSSProperties = {
  ...td,
  fontFamily: 'monospace',
  color: '#c0392b'
}

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  background: color,
  color: '#fff',
  borderRadius: 4,
  padding: '1px 7px',
  fontSize: 11,
  fontWeight: 600
})

// ─── Collapsible section ─────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  title, children, defaultOpen = true
}) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', padding: '10px 0', borderBottom: '2px solid #e0e0e0',
          marginBottom: open ? 16 : 0
        }}
      >
        <h2 style={{ ...h2, margin: 0 }}>{title}</h2>
        <span style={{ color: '#888', fontSize: 18 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && children}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const ArchitecturePage: React.FC = () => {
  return (
    <Container>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Card
        headerTitle="Analytics Event System — Architecture"
        style={{ marginBottom: 24 }}
      >
        <p style={p}>
          This system lets any analytics vendor (Adobe, GA4, Segment, etc.) receive
          structured interaction events from a React application — <strong>without
          wiring vendor code into components</strong>. The app never imports Adobe SDK
          or gtag. Vendors listen externally via standard DOM <code>CustomEvent</code>s.
        </p>
        <p style={{ ...p, margin: 0 }}>
          Privacy is enforced by a <strong>schema</strong> that teams own and review.
          Sensitive fields (SSN, DOB, passwords, account numbers) are stamped{' '}
          <code>data-tracking-blocked="true"</code> at runtime — no component changes needed.
        </p>
      </Card>

      {/* ── Architecture Diagram ──────────────────────────────────────────── */}
      <Section title="Architecture">
        <pre style={pre}>{`
  ┌─────────────────────────────────────────────────────────────────┐
  │                         React App                               │
  │                                                                 │
  │   <Input data-field-id="email" />   ← no vendor imports        │
  │   <Input data-field-id="ssn"   />   ← no vendor imports        │
  │   <Button type="submit" />          ← no vendor imports        │
  │                                                                 │
  └────────────────────────┬────────────────────────────────────────┘
                           │  DOM events bubble up
                           │  (input, change, focus, blur, click, submit)
                           ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                    TrackingObserver                             │
  │                                                                 │
  │  1. isBlocked?  ──→ drop event        ← schema.blockedFields   │
  │  2. resolveComponentType()            ← tag + type attribute   │
  │  3. filterByAllowedEvents()           ← schema.fieldMap.events │
  │  4. enrichPayload()                   ← schema.fieldMap.meta   │
  │  5. dispatchCustomEvent()                                       │
  │                                                                 │
  └────────────────────────┬────────────────────────────────────────┘
                           │  document.dispatchEvent(CustomEvent)
                           │  e.g. "yourbank:fieldInteraction"
                           │
           ┌───────────────┼───────────────┬─────────────────┐
           ▼               ▼               ▼                 ▼
      ┌─────────┐   ┌────────────┐  ┌──────────┐   ┌──────────────┐
      │  Adobe  │   │    GA4     │  │ Segment  │   │  Any Vendor  │
      │  Launch │   │  (gtag)    │  │(analytics│   │              │
      │  Rules  │   │            │  │   .js)   │   │              │
      └─────────┘   └────────────┘  └──────────┘   └──────────────┘
      external      external        external        external
      listener      listener        listener        listener

  ┌─────────────────────────────────────────────────────────────────┐
  │                   TrackingSchema (JSON/TS)                      │
  │                                                                 │
  │  blockedFields: [                                               │
  │    { selector: "[data-field-id='ssn']", category: 'pii' }      │
  │    { selector: "[type='password']",     category: 'credential'} │
  │  ]                                                              │
  │                                                                 │
  │  fieldMap: [                                                    │
  │    { selector: "[data-field-id='email']",                       │
  │      meta: { section: 'contact', label: 'Email', step: 1 } }   │
  │  ]                                                              │
  └─────────────────────────────────────────────────────────────────┘
`}</pre>
      </Section>

      {/* ── Component Types ───────────────────────────────────────────────── */}
      <Section title="Component Type Taxonomy">
        <p style={p}>
          Every event payload includes a <code>componentType</code> string derived
          from the element's tag and <code>type</code> attribute. This is more
          semantic than the raw tag — vendors can route and filter on it.
          Override it with <code>data-component="custom-name"</code>.
        </p>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Element</th>
              <th style={th}>type attr</th>
              <th style={th}>componentType</th>
              <th style={th}>Default events fired</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['<input>', 'text / email / tel / search / url', 'input:text', 'focus, blur, change'],
              ['<input>', 'password', 'input:password', '(always blocked)'],
              ['<input>', 'checkbox', 'input:checkbox', 'change'],
              ['<input>', 'radio', 'input:radio', 'change'],
              ['<input>', 'number', 'input:number', 'focus, blur, change'],
              ['<input>', 'hidden', 'input:hidden', '(never fires)'],
              ['<input>', 'date / datetime-local', 'input:date', 'change, blur'],
              ['<button>', 'submit', 'button:submit', 'click'],
              ['<button>', 'button', 'button:button', 'click'],
              ['<button>', 'reset', 'button:reset', 'click'],
              ['<select>', '—', 'select', 'change, focus, blur'],
              ['<textarea>', '—', 'textarea', 'focus, blur, change'],
              ['<a>', '—', 'link', 'click'],
              ['<form>', '—', 'form', 'submit'],
            ].map(([el, type, ct, events]) => (
              <tr key={ct}>
                <td style={tdCode}>{el}</td>
                <td style={tdCode}>{type}</td>
                <td style={{ ...tdCode, color: '#27ae60', fontWeight: 600 }}>{ct}</td>
                <td style={{ ...td, color: ct === 'input:hidden' || type === 'password' ? '#c0392b' : '#555' }}>
                  {events}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ ...p, marginTop: 12, fontSize: 12, color: '#888' }}>
          The <code>events</code> array in a <code>fieldMap</code> entry overrides the defaults above
          for that specific field. Example: <code>events: ['change', 'blur']</code> on a number
          input suppresses <code>focus</code> to reduce noise.
        </p>
      </Section>

      {/* ── Schema v2 ─────────────────────────────────────────────────────── */}
      <Section title="Schema v2 Structure">
        <p style={p}>
          The schema is a plain TypeScript/JSON object consumed by <code>TrackingObserver</code>.
          It has two sections: <code>blockedFields</code> (v1, required) and
          <code>fieldMap</code> (v2, optional).
        </p>
        <pre style={pre}>{`import type { TrackingSchema } from 'yourbank-design'

const schema: TrackingSchema = {
  version: '2.0.0',
  eventPrefix: 'yourbank:',

  // ── v1: Fields that NEVER fire events ──────────────────────────────
  blockedFields: [
    {
      selector: "[data-field-id='ssn']",
      reason:   'Social Security Number — sensitive PII',
      category: 'sensitive_pii'
    },
    {
      selector: "[type='password']",
      reason:   'Password — credential, never track',
      category: 'credential'
    }
  ],

  // ── v2: Per-field enrichment + optional event filter ────────────────
  fieldMap: [
    {
      selector: "[data-field-id='email']",
      meta: {
        section:  'contact-info',   // business context
        label:    'Email Address',  // human-readable name
        required: true,             // form validation state
        step:     1                 // wizard step number
      }
      // events: omitted → uses default for componentType (focus, blur, change)
    },
    {
      selector: "[data-field-id='loan-amount']",
      meta: { section: 'loan-details', label: 'Requested Amount', step: 2 },
      events: ['change', 'blur']   // suppress focus to reduce noise
    }
  ]
}`}</pre>

        <h3 style={h3}>FieldDefinition interface</h3>
        <pre style={pre}>{`interface FieldDefinition {
  selector: string                                    // CSS selector
  meta:     Record<string, string | number | boolean> // merged into event.detail.meta
  events?:  Array<'input'|'change'|'focus'|'blur'|'click'|'submit'>
}`}</pre>

        <h3 style={h3}>Backward compatibility</h3>
        <p style={{ ...p, margin: 0 }}>
          V1 schemas (no <code>fieldMap</code>) continue to work without changes.
          <code>meta</code> and <code>componentType</code> will simply be{' '}
          <code>undefined</code> in event payloads.
        </p>
      </Section>

      {/* ── Event Payloads ────────────────────────────────────────────────── */}
      <Section title="Event Payloads">
        <p style={p}>
          Three custom events are dispatched on <code>document</code>. All are prefixed
          with <code>eventPrefix</code> from the schema.
        </p>

        <h3 style={h3}>yourbank:fieldInteraction — text input blur</h3>
        <pre style={pre}>{`{
  "eventType":     "blur",
  "timestamp":     "2026-03-11T14:23:01.000Z",
  "pageName":      "loan-application",
  "fieldId":       "email",
  "fieldType":     "text",
  "elementTag":    "input",
  "componentType": "input:text",         // ← v2: design system type
  "meta": {                              // ← v2: from schema fieldMap
    "section":  "contact-info",
    "label":    "Email Address",
    "required": true,
    "step":     1
  }
}`}</pre>

        <h3 style={h3}>yourbank:fieldInteraction — submit button click</h3>
        <pre style={pre}>{`{
  "eventType":     "click",
  "timestamp":     "2026-03-11T14:23:45.000Z",
  "pageName":      "loan-application",
  "elementTag":    "button",
  "elementText":   "Submit Application",
  "componentType": "button:submit",
  "meta": {
    "label": "Submit Application",
    "flow":  "loan-application"
  }
}`}</pre>

        <h3 style={h3}>yourbank:pageView</h3>
        <pre style={pre}>{`{
  "eventType": "pageView",
  "pageName":  "loan-application",
  "timestamp": "2026-03-11T14:22:00.000Z"
}`}</pre>
      </Section>

      {/* ── Vendor Integration ────────────────────────────────────────────── */}
      <Section title="Vendor Integration">
        <p style={p}>
          Vendors listen to <code>CustomEvent</code>s on <code>document</code>.
          No app code changes are required per vendor — they wire themselves up externally.
        </p>

        <h3 style={h3}>Adobe Web SDK (Launch / Tags)</h3>
        <p style={p}>
          In Adobe Experience Platform Data Collection, create rules:
        </p>
        <pre style={pre}>{`// Rule: Track field interaction
// Event:     Custom Event → "yourbank:fieldInteraction"
// Condition: Element attribute data-tracking-blocked ≠ "true"
// Action:    Send beacon — pass event.detail + event.detail.meta as context data

// Rule: Track page view
// Event:  Custom Event → "yourbank:pageView"
// Action: Send beacon — page view`}</pre>

        <h3 style={h3}>Google Analytics 4</h3>
        <pre style={pre}>{`document.addEventListener('yourbank:fieldInteraction', e => {
  gtag('event', e.detail.componentType, {
    field_id:   e.detail.fieldId,
    page:       e.detail.pageName,
    section:    e.detail.meta?.section,
    label:      e.detail.meta?.label,
    event_type: e.detail.eventType
  })
})

document.addEventListener('yourbank:pageView', e => {
  gtag('event', 'page_view', { page_title: e.detail.pageName })
})`}</pre>

        <h3 style={h3}>Segment</h3>
        <pre style={pre}>{`document.addEventListener('yourbank:fieldInteraction', e => {
  analytics.track('Field Interaction', {
    ...e.detail,
    ...e.detail.meta   // section, label, step etc. promoted to top level
  })
})

document.addEventListener('yourbank:formSubmit', e => {
  analytics.track('Form Submitted', { formId: e.detail.fieldId })
})`}</pre>
      </Section>

      {/* ── Privacy Guarantees ────────────────────────────────────────────── */}
      <Section title="Privacy Guarantees">
        <p style={p}>
          The following rules are enforced unconditionally by the observer — they
          cannot be overridden by schema configuration.
        </p>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Guarantee</th>
              <th style={th}>How enforced</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Field values are never captured', 'el.value is never read or included in any payload'],
              ['input:hidden never fires events', 'Short-circuited at component type resolution'],
              ['Blocked ancestor propagation', 'Observer walks up the DOM tree — if any ancestor is blocked, all child events are dropped'],
              ['data-tracking-blocked stamp', 'Applied to DOM so vendor rules (e.g. Adobe Launch conditions) can filter independently'],
              ['Blocked fields always excluded', 'blockedFields are checked before fieldMap — a field cannot be both blocked and enriched'],
            ].map(([g, h]) => (
              <tr key={g}>
                <td style={{ ...td, fontWeight: 600, color: '#1a1a2e' }}>
                  <span style={badge('#c0392b')}>guaranteed</span>{' '}{g}
                </td>
                <td style={td}>{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* ── Data Flow ─────────────────────────────────────────────────────── */}
      <Section title="Data Flow — Step by Step" defaultOpen={false}>
        <ol style={{ lineHeight: 2, paddingLeft: 24, color: '#444' }}>
          <li><strong>App mounts</strong> → <code>new TrackingObserver(schema).start()</code></li>
          <li><strong>Observer walks DOM</strong> → stamps <code>data-tracking-blocked="true"</code> on all elements matching <code>blockedFields</code> selectors</li>
          <li><strong>MutationObserver</strong> watches for new DOM nodes (React renders) → stamps them immediately</li>
          <li><strong>User interacts</strong> with a field → DOM event bubbles to <code>document</code></li>
          <li><strong>Observer catches it</strong> in capture phase → checks if target or ancestor is blocked → drops if so</li>
          <li><strong>Resolves componentType</strong> from tag + type → drops if <code>input:hidden</code></li>
          <li><strong>Checks allowed events</strong> for this field → uses <code>fieldMap[].events</code> override or defaults for componentType → drops if event not in list</li>
          <li><strong>Looks up fieldMap</strong> for matching selector → extracts <code>meta</code></li>
          <li><strong>Builds payload</strong> with componentType + meta merged in</li>
          <li><strong>Dispatches CustomEvent</strong> on document (e.g. <code>yourbank:fieldInteraction</code>)</li>
          <li><strong>Vendor listeners</strong> receive it and forward to their analytics backends</li>
        </ol>
      </Section>

      {/* ── Usage ─────────────────────────────────────────────────────────── */}
      <Section title="Usage" defaultOpen={false}>
        <pre style={pre}>{`import { TrackingObserver } from 'yourbank-design'
import schema from './tracking-schema'

// Typically in your app root (index.tsx or App.tsx)
const observer = new TrackingObserver(schema)
observer.start()
observer.setPage('home')

// On SPA navigation / wizard step change
observer.setPage('loan-application')

// On unmount
observer.stop()`}</pre>

        <h3 style={h3}>Marking fields in JSX</h3>
        <pre style={pre}>{`// TRACKED — will fire events with meta from fieldMap
<Input type="text"  data-field-id="email"   />
<Input type="tel"   data-field-id="phone"   />
<Select             data-field-id="loan-purpose" />

// BLOCKED — observer stamps these, no events ever fire
<Input type="text"     data-field-id="ssn"            />
<Input type="date"     data-field-id="dob"            />
<Input type="text"     data-field-id="account-number" />
<Input type="password" data-field-id="password"       />`}</pre>

        <h3 style={h3}>Governance</h3>
        <p style={{ ...p, margin: 0 }}>
          Changes to <code>tracking-schema.ts</code> (or its JSON equivalent) should be
          reviewed by <strong>Privacy, Legal, and Analytics</strong> before merging.
          The <code>reason</code> and <code>category</code> fields on each blocked entry
          serve as the audit trail.
        </p>
      </Section>
    </Container>
  )
}

export default ArchitecturePage
