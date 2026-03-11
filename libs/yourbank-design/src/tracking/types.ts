/**
 * YourBank Tracking Schema Types
 *
 * This schema defines which form fields are excluded from Adobe Web SDK event
 * tracking. The TrackingObserver reads this schema at runtime and:
 *   1. Sets `data-tracking-blocked="true"` on matching DOM elements so Adobe
 *      SDK rules can natively filter them out.
 *   2. Suppresses custom `yourbank:*` events for those elements.
 *
 * FIELD IDENTIFICATION
 * --------------------
 * Fields are identified by a CSS `selector`. The recommended convention is to
 * use a `data-field-id` attribute:
 *
 *   <input type="text" data-field-id="first-name" />  ← tracked
 *   <input type="text" data-field-id="ssn" />          ← blocked (see schema)
 *
 * UI components do NOT need to import or reference this schema. The
 * TrackingObserver applies blocking transparently via DOM observation.
 */

/** Categories of sensitive data that should be excluded from tracking */
export type BlockedFieldCategory =
  | 'sensitive_pii'  // Social Security Number, date of birth, government IDs
  | 'credential'     // Passwords, PINs, security questions
  | 'financial'      // Account numbers, card numbers, routing numbers
  | 'custom'         // Application-specific exclusions

/** A single field exclusion rule */
export interface BlockedField {
  /**
   * CSS selector used to identify the element in the DOM.
   * Recommended pattern: `[data-field-id='<id>']`
   * Any valid CSS selector is supported.
   */
  selector: string

  /** Human-readable explanation of why this field is excluded */
  reason: string

  /** Data sensitivity category */
  category: BlockedFieldCategory
}

/**
 * Top-level schema consumed by TrackingObserver.
 * Typically stored in a versioned JSON file (e.g. tracking-schema.json)
 * alongside your application and committed to source control so that
 * product, legal, and privacy teams can review which fields are excluded.
 */
export interface TrackingSchema {
  /** Semantic version of this schema document */
  version: string

  /** Optional human-readable description */
  description?: string

  /**
   * Fields that must NOT generate Adobe Web SDK tracking events.
   * Any element matching one of these selectors — or any ancestor — is skipped.
   */
  blockedFields: BlockedField[]

  /**
   * Prefix applied to all custom DOM events dispatched by the observer.
   * Adobe SDK rules should listen for `${eventPrefix}fieldInteraction`,
   * `${eventPrefix}formSubmit`, and `${eventPrefix}pageView`.
   * Example: "yourbank:"
   */
  eventPrefix: string
}

/** Payload attached to every custom tracking event's `detail` property */
export interface TrackingEventDetail {
  /** The native DOM event type that triggered this (input, change, click, …) */
  eventType: string

  /** Value of the `data-field-id` attribute on the interacted element */
  fieldId?: string

  /** `type` attribute of <input> elements (text, email, tel, …) */
  fieldType?: string

  /** Page/view name set via `TrackingObserver.setPage()` */
  pageName?: string

  /** ISO-8601 timestamp */
  timestamp: string

  /** Lower-cased tag name of the target element */
  elementTag?: string

  /**
   * Visible text of the element — only populated for buttons and links.
   * Input field *values* are never captured.
   */
  elementText?: string
}
