/**
 * tracking-schema.ts
 *
 * This file is the canonical source of truth for which form fields are
 * excluded from Adobe Web SDK event tracking in the YourBank example app.
 *
 * HOW TO IDENTIFY BLOCKED FIELDS
 * ──────────────────────────────
 * Each entry in `blockedFields` contains a CSS `selector`. The recommended
 * convention for this codebase is the `data-field-id` attribute:
 *
 *   <input type="text" data-field-id="first-name" />   ← TRACKED
 *   <input type="password" data-field-id="password" /> ← BLOCKED (see below)
 *
 * UI components do not need to import this schema or know about Adobe.
 * The TrackingObserver reads the schema and stamps blocked elements with
 * `data-tracking-blocked="true"` at runtime.
 *
 * GOVERNANCE
 * ──────────
 * Changes to this file should be reviewed by Privacy, Legal, and Analytics
 * before merging. The `reason` and `category` fields document *why* a field
 * is blocked so reviewers can quickly assess the impact of any change.
 *
 * CATEGORIES
 * ──────────
 * sensitive_pii  – Government IDs, biometrics, date of birth, SSN
 * credential     – Passwords, PINs, security answers
 * financial      – Account / card / routing numbers
 * custom         – Application-specific exclusions
 */

import type { TrackingSchema } from 'yourbank-design'

const trackingSchema: TrackingSchema = {
  version: '1.0.0',
  description:
    'YourBank Adobe Web SDK field tracking exclusion schema. ' +
    'Fields listed under blockedFields will have data-tracking-blocked="true" ' +
    'set by the TrackingObserver, preventing Adobe Analytics from capturing ' +
    'events on these elements.',

  /** Custom DOM event prefix. Adobe SDK rules should listen for:
   *  - yourbank:pageView
   *  - yourbank:fieldInteraction
   *  - yourbank:formSubmit
   */
  eventPrefix: 'yourbank:',

  blockedFields: [
    {
      selector: "[data-field-id='ssn']",
      reason: 'Social Security Number is sensitive PII — must never be tracked',
      category: 'sensitive_pii'
    },
    {
      selector: "[data-field-id='password']",
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
  ]
}

export default trackingSchema

/**
 * BLOCKED FIELD QUICK-REFERENCE
 * ──────────────────────────────
 * data-field-id        category        reason
 * ───────────────────  ──────────────  ────────────────────────────────────────
 * ssn                  sensitive_pii   Social Security Number
 * password             credential      Login / account password
 * dob                  sensitive_pii   Date of birth
 * account-number       financial       Bank account number
 *
 * All other data-field-id values (first-name, last-name, email, phone,
 * loan-amount, loan-purpose, monthly-income) are TRACKED by default.
 */
