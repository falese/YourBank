# YourBank Tracking Observer — Spec & Schema Guide (v2)

This document describes how the `TrackingObserver` works, how to define the
schema, and how analytics vendors integrate with custom events.

---

## Overview

The `TrackingObserver` is a framework-agnostic class exported from
`yourbank-design`. It:

1. **Reads a schema** that declares which fields are blocked and how tracked fields should be enriched
2. **Stamps blocked fields** with `data-tracking-blocked="true"` via a `MutationObserver` so vendor rules can natively filter them
3. **Resolves component types** — derives a semantic type string (`input:text`, `button:submit`, etc.) for every event
4. **Enriches event payloads** — merges static metadata from `schema.fieldMap` into events for matching fields
5. **Filters events by component type** — only fires meaningful events per type (e.g. text inputs don't fire per-keystroke `input` events by default)
6. **Dispatches custom DOM events** (`yourbank:*`) that any vendor can listen to — no changes to UI components required

---

## Architecture

```
  DOM Events (input / change / focus / blur / click / submit)
         │  capture phase, single listener on document
         ▼
  ┌────────────────────────────────────────────────┐
  │              TrackingObserver                  │
  │                                                │
  │  1. isBlocked?           → drop               │  ← schema.blockedFields
  │  2. resolveComponentType()                     │  ← tag + type + data-component
  │  3. input:hidden?        → drop               │
  │  4. eventAllowed?        → drop if not        │  ← fieldMap.events || defaults
  │  5. findFieldMeta()                            │  ← schema.fieldMap
  │  6. dispatchCustomEvent()                      │
  └─────────────────┬──────────────────────────────┘
                    │  document.dispatchEvent(CustomEvent)
                    │
         ┌──────────┼──────────┬─────────────┐
         ▼          ▼          ▼             ▼
      Adobe        GA4      Segment      Any Vendor
     (Launch)    (gtag)   (analytics)    (external listener)
```

---

## Schema Definition

The schema is a plain TypeScript/JavaScript object (or a parsed JSON file)
conforming to the `TrackingSchema` interface exported from `yourbank-design`.

### v1 — blockedFields only (still works)

```ts
import type { TrackingSchema } from 'yourbank-design'

const schema: TrackingSchema = {
  version: '1.0.0',
  eventPrefix: 'yourbank:',
  blockedFields: [
    { selector: "[data-field-id='ssn']", reason: 'SSN is sensitive PII', category: 'sensitive_pii' }
  ]
}
```

### v2 — blockedFields + fieldMap

```ts
import type { TrackingSchema } from 'yourbank-design'

const schema: TrackingSchema = {
  version: '2.0.0',
  eventPrefix: 'yourbank:',

  blockedFields: [
    { selector: "[data-field-id='ssn']",      reason: 'SSN',           category: 'sensitive_pii' },
    { selector: "[type='password']",           reason: 'Password',      category: 'credential'    },
    { selector: "[data-field-id='dob']",       reason: 'Date of birth', category: 'sensitive_pii' },
    { selector: "[data-field-id='account-number']", reason: 'Account #', category: 'financial'   }
  ],

  fieldMap: [
    {
      selector: "[data-field-id='email']",
      meta: { section: 'contact-info', label: 'Email Address', required: true, step: 1 }
    },
    {
      selector: "[data-field-id='loan-amount']",
      meta: { section: 'loan-details', label: 'Requested Amount', step: 2 },
      events: ['change', 'blur']   // suppress focus events
    }
  ]
}
```

---

## TrackingSchema fields

| Field          | Type              | Required | Description |
|----------------|-------------------|----------|-------------|
| `version`      | `string`          | yes      | Semantic version of the schema document |
| `description`  | `string`          | no       | Optional human-readable description |
| `eventPrefix`  | `string`          | yes      | Prefix for all custom DOM events (`"yourbank:"`) |
| `blockedFields`| `BlockedField[]`  | yes      | Fields that must NEVER generate events |
| `fieldMap`     | `FieldDefinition[]` | no     | Per-field enrichment metadata (v2) |

---

## BlockedField fields

| Field      | Type                   | Description |
|------------|------------------------|-------------|
| `selector` | `string`               | CSS selector identifying the element(s) to block |
| `reason`   | `string`               | Why this field is excluded (audit trail) |
| `category` | `BlockedFieldCategory` | Data sensitivity category |

### BlockedFieldCategory values

| Value           | When to use |
|-----------------|-------------|
| `sensitive_pii` | SSN, date of birth, government IDs, biometrics |
| `credential`    | Passwords, PINs, security question answers |
| `financial`     | Account numbers, card numbers, routing numbers |
| `custom`        | Application-specific exclusions |

---

## FieldDefinition fields (v2)

| Field      | Type | Required | Description |
|------------|------|----------|-------------|
| `selector` | `string` | yes | CSS selector — same convention as blockedFields |
| `meta`     | `Record<string, string \| number \| boolean>` | yes | Merged into `event.detail.meta` |
| `events`   | `Array<'input'\|'change'\|'focus'\|'blur'\|'click'\|'submit'>` | no | Override default events for this field |

---

## Component Type Taxonomy (v2)

Every event payload includes a `componentType` string. Resolution order:
1. `data-component` attribute (explicit override)
2. Derived from `tagName` + `type` attribute

| Element | type attr | componentType | Default events |
|---|---|---|---|
| `<input>` | text / email / tel / search / url | `input:text` | focus, blur, change |
| `<input>` | password | `input:password` | (always blocked) |
| `<input>` | checkbox | `input:checkbox` | change |
| `<input>` | radio | `input:radio` | change |
| `<input>` | number | `input:number` | focus, blur, change |
| `<input>` | hidden | `input:hidden` | **(never fires)** |
| `<input>` | date / datetime-local | `input:date` | change, blur |
| `<button>` | submit | `button:submit` | click |
| `<button>` | button | `button:button` | click |
| `<button>` | reset | `button:reset` | click |
| `<select>` | — | `select` | change, focus, blur |
| `<textarea>` | — | `textarea` | focus, blur, change |
| `<a>` | — | `link` | click |
| `<form>` | — | `form` | submit |

---

## Field Identification Convention

Fields are identified by the **`data-field-id` attribute**:

```html
<!-- TRACKED — will fire events with meta from fieldMap -->
<input type="text"  data-field-id="first-name" />
<input type="email" data-field-id="email" />
<select             data-field-id="loan-purpose" />

<!-- BLOCKED — observer stamps these, no events ever fire -->
<input type="text"     data-field-id="ssn" />
<input type="date"     data-field-id="dob" />
<input type="password" data-field-id="password" />
```

UI components do **not** need to import the schema. The `data-field-id`
attribute is the only contract between the component and the tracking system.

---

## DOM Attributes Stamped by the Observer

After `observer.start()` runs, every blocked element receives:

| Attribute                       | Value |
|---------------------------------|-------|
| `data-tracking-blocked`         | `"true"` |
| `data-tracking-block-reason`    | The `reason` string from the schema |
| `data-tracking-block-category`  | The `category` string from the schema |

---

## Custom Events Dispatched

### `yourbank:pageView`

Fired when `observer.setPage(pageName)` is called.

```ts
detail: {
  eventType: 'pageView',
  pageName:  string,
  timestamp: string   // ISO-8601
}
```

### `yourbank:fieldInteraction`

Fired on allowed events for **non-blocked** fields.

```ts
detail: {
  eventType:     'input' | 'change' | 'focus' | 'blur' | 'click',
  fieldId?:      string,    // data-field-id value
  fieldType?:    string,    // <input type="...">
  pageName?:     string,
  timestamp:     string,
  elementTag:    string,    // "input" | "textarea" | "select" | "button"
  elementText?:  string,    // buttons/links only — input values never captured
  componentType?: string,   // v2: "input:text", "button:submit", etc.
  meta?:         Record<string, string | number | boolean>  // v2: from fieldMap
}
```

### `yourbank:formSubmit`

Fired on form `submit` events where the form is **not** blocked.

```ts
detail: {
  eventType:      'submit',
  fieldId?:       string,   // form id or data-form-id
  pageName?:      string,
  timestamp:      string,
  elementTag:     'form',
  componentType?: 'form'
}
```

---

## Vendor Integration

### Adobe Web SDK (Launch / Tags)

Create rules in Adobe Experience Platform Data Collection:

**Rule: Track field interaction**
- Event: Custom Event — `yourbank:fieldInteraction`
- Condition: Element Attribute `data-tracking-blocked` does not equal `true`
- Action: Send Beacon — pass `event.detail` + `event.detail.meta` as context data

**Rule: Track page view**
- Event: Custom Event — `yourbank:pageView`
- Action: Send Beacon — Page View

### Google Analytics 4

```js
document.addEventListener('yourbank:fieldInteraction', e => {
  gtag('event', e.detail.componentType, {
    field_id:   e.detail.fieldId,
    page:       e.detail.pageName,
    section:    e.detail.meta?.section,
    label:      e.detail.meta?.label,
    event_type: e.detail.eventType
  })
})
```

### Segment

```js
document.addEventListener('yourbank:fieldInteraction', e => {
  analytics.track('Field Interaction', {
    ...e.detail,
    ...e.detail.meta
  })
})
```

---

## Usage

```ts
import { TrackingObserver } from 'yourbank-design'
import schema from './tracking-schema'

const observer = new TrackingObserver(schema)
observer.start()
observer.setPage('landing')

// SPA navigation
observer.setPage('loan-application')

// Unmount
observer.stop()
```

---

## Privacy Guarantees

1. **Field values are never captured** — `el.value` is never read or included in any payload
2. **`input:hidden` never fires** — filtered at component type resolution
3. **Password fields are always blocked** — `[type="password"]` is covered by blockedFields
4. **Blocked ancestor propagation** — if any parent element is blocked, all child events are dropped
5. **`data-tracking-blocked` stamp** — applied to DOM for belt-and-suspenders vendor filtering

---

## Governance

Changes to `tracking-schema.ts` (or its JSON equivalent) should be reviewed by
**Privacy, Legal, and Analytics** teams before merging. The `reason` and
`category` fields on each `BlockedField` entry serve as the audit trail for
why a field is excluded.
