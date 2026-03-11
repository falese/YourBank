import { TrackingSchema, TrackingEventDetail } from './types'

/**
 * TrackingObserver v2
 *
 * A framework-agnostic DOM observer that enables analytics event collection
 * across a React application without requiring any changes to individual UI
 * components.
 *
 * HOW IT WORKS
 * ------------
 * 1. **Schema-driven blocking** – On startup (and whenever new nodes are
 *    added to the DOM) the observer walks matching elements and stamps them
 *    with `data-tracking-blocked="true"`. Adobe SDK rules can use this
 *    attribute as a condition to skip those elements natively.
 *
 * 2. **Event delegation** – A single capture-phase listener on `document`
 *    intercepts input, change, focus, blur, click, and submit events. Events
 *    from blocked elements (or their descendants) are silently dropped.
 *
 * 3. **Component type resolution** – Every event payload includes a
 *    `componentType` string (e.g. "input:text", "button:submit") derived
 *    from the element's tag and type attribute. Overridable via data-component.
 *
 * 4. **Field enrichment** – If the schema defines a `fieldMap`, the observer
 *    looks up the interacted element and merges static `meta` key/values into
 *    the event payload. No component code changes required.
 *
 * 5. **Default event filtering** – Each component type fires only meaningful
 *    events by default (e.g. text inputs fire blur/change, not per-keystroke
 *    input). Teams can override per field via fieldMap[].events.
 *
 * 6. **Custom events** – For every allowed interaction a `CustomEvent` is
 *    dispatched on `document` with the prefix defined in the schema
 *    (e.g. `yourbank:fieldInteraction`). Any analytics vendor can listen.
 *
 * USAGE
 * -----
 * ```ts
 * import { TrackingObserver } from 'yourbank-design'
 * import schema from './tracking-schema'
 *
 * const observer = new TrackingObserver(schema)
 * observer.start()
 * observer.setPage('loan-application')
 *
 * // On unmount / SPA navigation:
 * observer.stop()
 * ```
 *
 * VENDOR INTEGRATION
 * ------------------
 * Any vendor can subscribe to custom events on document:
 *
 *   document.addEventListener('yourbank:fieldInteraction', e => {
 *     // e.detail.componentType — "input:text", "button:submit", etc.
 *     // e.detail.meta         — business context from schema fieldMap
 *     // e.detail.fieldId      — data-field-id value
 *     // e.detail.pageName     — from observer.setPage()
 *   })
 *
 * BACKWARD COMPATIBILITY
 * ----------------------
 * V1 schemas (no fieldMap) continue to work. meta and componentType will
 * simply be undefined in event payloads.
 */
export class TrackingObserver {
  private schema: TrackingSchema
  private mutationObserver: MutationObserver | null = null
  private currentPage: string = ''
  private listening = false

  // Bound reference kept so we can cleanly removeEventListener later
  private readonly handleEvent: (event: Event) => void

  constructor(schema: TrackingSchema) {
    this.schema = schema
    this.handleEvent = this._handleEvent.bind(this)
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Announce a page/view transition.
   * Call this whenever the visible page changes (SPA route change, wizard step, etc.)
   */
  setPage(pageName: string): void {
    this.currentPage = pageName
    this._dispatch('pageView', {
      eventType: 'pageView',
      pageName,
      timestamp: new Date().toISOString()
    })
  }

  /** Begin observing DOM events and mutations. Safe to call multiple times. */
  start(): void {
    if (this.listening) return
    this.listening = true

    const events = ['input', 'change', 'focus', 'blur', 'click', 'submit']
    events.forEach(type => document.addEventListener(type, this.handleEvent, true))

    // Watch for newly-mounted nodes and stamp them immediately
    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this._stampBlocked(node as Element)
          }
        })
      })
    })

    this.mutationObserver.observe(document.body, { childList: true, subtree: true })

    // Stamp any elements already present
    this._stampBlocked(document.body)
  }

  /** Stop observing and clean up all listeners. */
  stop(): void {
    if (!this.listening) return
    this.listening = false

    const events = ['input', 'change', 'focus', 'blur', 'click', 'submit']
    events.forEach(type => document.removeEventListener(type, this.handleEvent, true))

    this.mutationObserver?.disconnect()
    this.mutationObserver = null
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /**
   * Walk `root` and apply `data-tracking-blocked` attributes to every element
   * that matches a blocked-field selector from the schema.
   */
  private _stampBlocked(root: Element): void {
    for (const rule of this.schema.blockedFields) {
      try {
        root.querySelectorAll(rule.selector).forEach(el => {
          el.setAttribute('data-tracking-blocked', 'true')
          el.setAttribute('data-tracking-block-reason', rule.reason)
          el.setAttribute('data-tracking-block-category', rule.category)
        })
        if (root.matches?.(rule.selector)) {
          root.setAttribute('data-tracking-blocked', 'true')
          root.setAttribute('data-tracking-block-reason', rule.reason)
          root.setAttribute('data-tracking-block-category', rule.category)
        }
      } catch {
        // Tolerate invalid selectors so a bad schema entry doesn't break the page
      }
    }
  }

  /**
   * Returns true when `element` or any of its ancestors is blocked.
   */
  private _isBlocked(element: Element): boolean {
    let node: Element | null = element
    while (node) {
      if (node.getAttribute('data-tracking-blocked') === 'true') return true
      for (const rule of this.schema.blockedFields) {
        try {
          if (node.matches(rule.selector)) return true
        } catch {
          // ignore
        }
      }
      node = node.parentElement
    }
    return false
  }

  /**
   * Resolve the design system component type for an element.
   *
   * Resolution order:
   * 1. data-component attribute (explicit override)
   * 2. Derived from tagName + type attribute
   */
  private _resolveComponentType(el: Element): string {
    const override = el.getAttribute('data-component')
    if (override) return override

    const tag = el.tagName.toUpperCase()
    const type = (el as HTMLInputElement).type?.toLowerCase() ?? ''

    if (tag === 'INPUT') {
      if (['text', 'email', 'tel', 'search', 'url'].includes(type)) return 'input:text'
      if (type === 'password') return 'input:password'
      if (type === 'checkbox') return 'input:checkbox'
      if (type === 'radio') return 'input:radio'
      if (type === 'number') return 'input:number'
      if (type === 'hidden') return 'input:hidden'
      if (['date', 'datetime-local', 'month', 'week', 'time'].includes(type)) return 'input:date'
      return `input:${type || 'text'}`
    }
    if (tag === 'BUTTON') {
      if (type === 'submit') return 'button:submit'
      if (type === 'reset') return 'button:reset'
      return 'button:button'
    }
    if (tag === 'SELECT') return 'select'
    if (tag === 'TEXTAREA') return 'textarea'
    if (tag === 'A') return 'link'
    if (tag === 'FORM') return 'form'
    return tag.toLowerCase()
  }

  /**
   * Return the default set of event types that should fire for a given
   * component type. Avoids per-keystroke noise on text inputs by default.
   */
  private _getDefaultEvents(componentType: string): string[] {
    if (componentType === 'input:hidden') return []
    if (componentType === 'input:checkbox' || componentType === 'input:radio') return ['change']
    if (componentType === 'input:date') return ['change', 'blur']
    if (componentType.startsWith('input:') || componentType === 'textarea') return ['focus', 'blur', 'change']
    if (componentType.startsWith('button:') || componentType === 'link') return ['click']
    if (componentType === 'select') return ['change', 'focus', 'blur']
    if (componentType === 'form') return ['submit']
    return ['click', 'change', 'blur']
  }

  /**
   * Look up the first matching FieldDefinition in schema.fieldMap for el.
   * Returns the meta object, or undefined if no match / no fieldMap.
   */
  private _findFieldMeta(
    el: Element
  ): { meta: Record<string, string | number | boolean>; events?: string[] } | undefined {
    if (!this.schema.fieldMap) return undefined
    for (const def of this.schema.fieldMap) {
      try {
        if (el.matches(def.selector)) {
          return { meta: def.meta, events: def.events }
        }
      } catch {
        // ignore invalid selectors
      }
    }
    return undefined
  }

  private _handleEvent(event: Event): void {
    const target = event.target as HTMLElement
    if (!target?.tagName) return

    const tag = target.tagName.toUpperCase()
    const isField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
    const isButton = tag === 'BUTTON'
    const isAnchor = tag === 'A'
    const isForm = tag === 'FORM'

    // Only handle relevant element/event pairings (coarse pre-filter)
    if (['input', 'change', 'focus', 'blur'].includes(event.type) && !isField) return
    if (event.type === 'submit' && !isForm) return
    if (event.type === 'click' && !isButton && !isAnchor && !target.dataset.trackClick) return

    // Drop events from blocked elements
    if (this._isBlocked(target)) return

    // Resolve component type — hidden inputs never fire
    const componentType = this._resolveComponentType(target)
    if (componentType === 'input:hidden') return

    // Determine allowed events: fieldMap override → default for componentType
    const fieldDef = this._findFieldMeta(target)
    const allowedEvents = fieldDef?.events ?? this._getDefaultEvents(componentType)
    if (!allowedEvents.includes(event.type)) return

    const detail: TrackingEventDetail = {
      eventType: event.type,
      timestamp: new Date().toISOString(),
      pageName: this.currentPage,
      fieldId: target.dataset.fieldId,
      fieldType: isField ? (target as HTMLInputElement).type : undefined,
      elementTag: tag.toLowerCase(),
      componentType
    }

    // Merge field enrichment metadata
    if (fieldDef?.meta) {
      detail.meta = fieldDef.meta
    }

    // Capture visible label text for buttons/links — never capture input values
    if (isButton || isAnchor) {
      detail.elementText = target.textContent?.trim()
    }

    if (isForm) {
      detail.fieldId = target.id || target.dataset.formId
      this._dispatch('formSubmit', detail)
    } else {
      this._dispatch('fieldInteraction', detail)
    }
  }

  private _dispatch(
    name: string,
    detail: TrackingEventDetail | Record<string, unknown>
  ): void {
    const type = `${this.schema.eventPrefix}${name}`
    document.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }))
  }
}
