# YourBank Tracking Observer — Spec & Schema Guide

This document describes how the `TrackingObserver` works, how to define the
blocking schema, and how the Adobe Web SDK integrates with custom events.

---

## Overview

The `TrackingObserver` is a framework-agnostic class exported from
`yourbank-design`. It:

1. **Reads a schema** that declares which form fields are excluded from tracking
2. **Stamps blocked fields** with `data-tracking-blocked="true"` via a
   `MutationObserver` so Adobe SDK rules can natively filter them
3. **Delegates events** (input, change, focus, blur, click, submit) at the
   document level and drops events from blocked elements
4. **Dispatches custom DOM events** (`yourbank:*`) that Adobe SDK rules listen
   to — no changes to UI components required

---

## Schema Definition

The schema is a plain TypeScript/JavaScript object (or a parsed JSON file)
conforming to the `TrackingSchema` interface exported from `yourbank-design`:

```ts
import type { TrackingSchema } from 'yourbank-design'

const schema: TrackingSchema = {
  version: '1.0.0',
  description: '…',
  eventPrefix: 'yourbank:',
  blockedFields: [
    {
      selector: "[data-field-id='ssn']",
      reason: 'Social Security Number is sensitive PII',
      category: 'sensitive_pii'
    }
    // …
  ]
}
```

### `TrackingSchema` fields

| Field          | Type            | Description |
|----------------|-----------------|-------------|
| `version`      | `string`        | Semantic version of the schema document |
| `description`  | `string`        | Optional human-readable description |
| `eventPrefix`  | `string`        | Prefix for all custom DOM events (`"yourbank:"`) |
| `blockedFields`| `BlockedField[]`| List of field exclusion rules |

### `BlockedField` fields

| Field      | Type                   | Description |
|------------|------------------------|-------------|
| `selector` | `string`               | CSS selector identifying the element(s) to block |
| `reason`   | `string`               | Why this field is excluded (for audit trail) |
| `category` | `BlockedFieldCategory` | Data sensitivity category (see below) |

### `BlockedFieldCategory` values

| Value           | When to use |
|-----------------|-------------|
| `sensitive_pii` | SSN, date of birth, government IDs, biometrics |
| `credential`    | Passwords, PINs, security question answers |
| `financial`     | Account numbers, card numbers, routing numbers |
| `custom`        | Application-specific exclusions |

---

## Field Identification Convention

Fields are identified by the **`data-field-id` attribute** placed on the HTML
element. This is the recommended convention for this codebase:

```html
<!-- TRACKED — no entry in blockedFields -->
<input type="text" data-field-id="first-name" />
<input type="email" data-field-id="email" />
<input type="number" data-field-id="loan-amount" />

<!-- BLOCKED — matches a blockedFields selector -->
<input type="password" data-field-id="ssn" />
<input type="date"     data-field-id="dob" />
<input type="password" data-field-id="account-number" />
```

The UI component code does **not** need to import the schema or know about
Adobe. The `data-field-id` attribute is the only contract between the component
and the tracking system.

---

## Blocked Fields — Quick Reference

The example app's schema (`example/src/tracking-schema.ts`) blocks:

| `data-field-id`  | Category        | Reason |
|------------------|-----------------|--------|
| `ssn`            | `sensitive_pii` | Social Security Number |
| `password`       | `credential`    | Login / account password |
| `dob`            | `sensitive_pii` | Date of birth (CCPA / GDPR) |
| `account-number` | `financial`     | Bank account number |

All other `data-field-id` values are **tracked by default**.

---

## DOM Attributes Stamped by the Observer

After `observer.start()` runs, every blocked element receives:

| Attribute                       | Value |
|---------------------------------|-------|
| `data-tracking-blocked`         | `"true"` |
| `data-tracking-block-reason`    | The `reason` string from the schema |
| `data-tracking-block-category`  | The `category` string from the schema |

These attributes can be used:
- By Adobe SDK rules as conditions (e.g. "Attribute `data-tracking-blocked`
  does not equal `true`")
- By CSS to add a visual indicator in development/QA builds
- By automated accessibility or privacy audits

---

## Custom Events Dispatched

The observer dispatches `CustomEvent`s on `document`. All events are prefixed
with `eventPrefix` from the schema (default `"yourbank:"`).

### `yourbank:pageView`

Fired when `observer.setPage(pageName)` is called.

```ts
detail: {
  eventType: 'pageView',
  pageName: string,
  timestamp: string   // ISO-8601
}
```

### `yourbank:fieldInteraction`

Fired on `input`, `change`, `focus`, `blur` events on **non-blocked** fields.

```ts
detail: {
  eventType: 'input' | 'change' | 'focus' | 'blur',
  fieldId?: string,    // data-field-id value
  fieldType?: string,  // <input type="...">
  pageName?: string,
  timestamp: string,
  elementTag: string   // "input" | "textarea" | "select"
  // NOTE: field *values* are never included
}
```

### `yourbank:formSubmit`

Fired on form `submit` events where the form is **not** blocked.

```ts
detail: {
  eventType: 'submit',
  fieldId?: string,    // form id or data-form-id
  pageName?: string,
  timestamp: string,
  elementTag: 'form'
}
```

---

## Adobe Web SDK Integration

In Adobe Experience Platform Data Collection (Launch / Tags), create rules like:

**Rule: Track field interaction**
- Event: Custom Event — `yourbank:fieldInteraction`
- Condition: Element Attribute `data-tracking-blocked` does not equal `true`
- Action: Send Beacon — Analytics (pass `event.detail` as context data)

**Rule: Track page view**
- Event: Custom Event — `yourbank:pageView`
- Action: Send Beacon — Page View

**Rule: Track form submit**
- Event: Custom Event — `yourbank:formSubmit`
- Action: Send Beacon — Analytics

---

## Usage

```ts
import { TrackingObserver } from 'yourbank-design'
import schema from './tracking-schema'

// Typically in your app root component (e.g. index.tsx / App.tsx)
const observer = new TrackingObserver(schema)
observer.start()
observer.setPage('landing')

// When navigating to a new view
observer.setPage('loan-application')

// On unmount
observer.stop()
```

---

## Governance

Changes to `tracking-schema.ts` (or its JSON equivalent) should be reviewed by
**Privacy, Legal, and Analytics** teams before merging. The `reason` and
`category` fields on each `BlockedField` entry serve as the audit trail for
why a field is excluded.
