/**
 * tracking-schema.ts — v2
 *
 * This file is the canonical source of truth for field tracking governance
 * in the YourBank example app.
 *
 * V2 ADDITIONS
 * ────────────
 * fieldMap: per-field enrichment metadata merged into event payloads.
 * Each entry maps a CSS selector to business context (section, label, step, etc.)
 * Teams can also restrict which events fire per field via the `events` property.
 *
 * HOW TO IDENTIFY BLOCKED FIELDS
 * ──────────────────────────────
 * Each entry in `blockedFields` contains a CSS `selector`. The recommended
 * convention for this codebase is the `data-field-id` attribute:
 *
 *   <input type="text" data-field-id="first-name" />   ← TRACKED
 *   <input type="password" data-field-id="password" /> ← BLOCKED (see below)
 *
 * UI components do not need to import this schema or know about any vendor.
 * The TrackingObserver reads the schema and stamps blocked elements with
 * `data-tracking-blocked="true"` at runtime.
 *
 * GOVERNANCE
 * ──────────
 * Changes to this file should be reviewed by Privacy, Legal, and Analytics
 * before merging. The `reason` and `category` fields document *why* a field
 * is blocked so reviewers can quickly assess the impact of any change.
 */

import type { TrackingSchema } from 'yourbank-design'

const trackingSchema: TrackingSchema = {
  version: '2.0.0',
  description:
    'YourBank analytics field tracking schema v2. ' +
    'blockedFields prevent any events from sensitive fields. ' +
    'fieldMap enriches tracked field events with business context metadata.',

  /** Custom DOM event prefix. Any vendor should listen for:
   *  - yourbank:pageView
   *  - yourbank:fieldInteraction
   *  - yourbank:formSubmit
   */
  eventPrefix: 'yourbank:',

  // ── Blocked fields ──────────────────────────────────────────────────────
  // These fields NEVER generate events. Matching elements are stamped with
  // data-tracking-blocked="true" so vendor rules can filter them natively too.
  blockedFields: [
    {
      selector: "[data-field-id='ssn']",
      reason: 'Social Security Number is sensitive PII — must never be tracked',
      category: 'sensitive_pii'
    },
    {
      selector: "[type='password']",
      reason: 'Password is a credential — capturing it would be a security violation',
      category: 'credential'
    },
    {
      selector: "[data-field-id='dob']",
      reason: 'Date of birth is sensitive PII under CCPA/GDPR',
      category: 'sensitive_pii'
    },
    {
      selector: "[data-field-id='account-number']",
      reason: 'Account number is sensitive financial data',
      category: 'financial'
    }
  ],

  // ── Field map ────────────────────────────────────────────────────────────
  // Per-field enrichment: static metadata merged into event.detail.meta.
  // Only tracked (non-blocked) fields should be listed here.
  // The optional `events` array restricts which DOM events fire for that field.
  fieldMap: [
    {
      selector: "[data-field-id='first-name']",
      meta: { section: 'personal-info', label: 'First Name', required: true, step: 1 }
    },
    {
      selector: "[data-field-id='last-name']",
      meta: { section: 'personal-info', label: 'Last Name', required: true, step: 1 }
    },
    {
      selector: "[data-field-id='email']",
      meta: { section: 'personal-info', label: 'Email Address', required: true, step: 1 }
    },
    {
      selector: "[data-field-id='phone']",
      meta: { section: 'personal-info', label: 'Phone Number', required: false, step: 1 }
    },
    {
      selector: "[data-field-id='loan-amount']",
      meta: { section: 'loan-details', label: 'Requested Amount', required: true, step: 2 },
      // Only fire on change/blur — avoid per-keystroke noise on numeric inputs
      events: ['change', 'blur']
    },
    {
      selector: "[data-field-id='loan-purpose']",
      meta: { section: 'loan-details', label: 'Loan Purpose', required: true, step: 2 }
    },
    {
      selector: "[data-field-id='monthly-income']",
      meta: { section: 'loan-details', label: 'Monthly Gross Income', required: true, step: 2 },
      events: ['change', 'blur']
    },
    {
      selector: "button[type='submit']",
      meta: { label: 'Submit Application', flow: 'loan-application' }
    }
  ]
}

export default trackingSchema

/**
 * BLOCKED FIELDS QUICK-REFERENCE
 * ────────────────────────────────
 * data-field-id        category        reason
 * ───────────────────  ──────────────  ────────────────────────────────────────
 * ssn                  sensitive_pii   Social Security Number
 * [type=password]      credential      Any password field
 * dob                  sensitive_pii   Date of birth
 * account-number       financial       Bank account number
 *
 * TRACKED FIELDS (with enrichment)
 * ─────────────────────────────────
 * data-field-id        section          step  events
 * ───────────────────  ───────────────  ────  ──────────────
 * first-name           personal-info    1     focus,blur,change (default)
 * last-name            personal-info    1     focus,blur,change (default)
 * email                personal-info    1     focus,blur,change (default)
 * phone                personal-info    1     focus,blur,change (default)
 * loan-amount          loan-details     2     change,blur (override)
 * loan-purpose         loan-details     2     change,focus,blur (default select)
 * monthly-income       loan-details     2     change,blur (override)
 */
