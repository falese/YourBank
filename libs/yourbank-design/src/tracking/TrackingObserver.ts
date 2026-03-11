import { TrackingSchema, TrackingEventDetail } from './types'

/**
 * TrackingObserver
 *
 * A framework-agnostic DOM observer that enables Adobe Web SDK event
 * collection across a React application without requiring any changes to
 * individual UI components.
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
 * 3. **Custom events** – For every allowed interaction a `CustomEvent` is
 *    dispatched on `document` with the prefix defined in the schema
 *    (e.g. `yourbank:fieldInteraction`). Adobe SDK Data Collection rules
 *    can listen to these events and forward them to Adobe Analytics /
 *    Adobe Experience Platform.
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
 * ADOBE SDK INTEGRATION
 * ---------------------
 * In Adobe Experience Platform Data Collection (Launch/Tags), create rules
 * that listen for these custom events:
 *
 *   - `yourbank:pageView`         – fired when setPage() is called
 *   - `yourbank:fieldInteraction` – fired on input / change / focus / blur
 *   - `yourbank:formSubmit`       – fired on form submit
 *
 * Add a condition on each rule: Element Attribute `data-tracking-blocked`
 * Does Not Equal `true` (belt-and-suspenders guard in addition to the
 * observer's own filtering).
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
   * that matches a blocked-field selector from the schema. Adobe SDK and CSS
   * can use this attribute without any further JavaScript.
   */
  private _stampBlocked(root: Element): void {
    for (const rule of this.schema.blockedFields) {
      try {
        root.querySelectorAll(rule.selector).forEach(el => {
          el.setAttribute('data-tracking-blocked', 'true')
          el.setAttribute('data-tracking-block-reason', rule.reason)
          el.setAttribute('data-tracking-block-category', rule.category)
        })
        // Also check the root node itself
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
   * Returns true when `element` or any of its ancestors is blocked — either
   * via the stamped attribute (fast path) or by direct selector match (covers
   * the case where the element was in the DOM before start() was called).
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

  private _handleEvent(event: Event): void {
    const target = event.target as HTMLElement
    if (!target?.tagName) return

    const tag = target.tagName.toUpperCase()
    const isField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
    const isButton = tag === 'BUTTON'
    const isAnchor = tag === 'A'
    const isForm = tag === 'FORM'

    // Only handle relevant element/event pairings
    if (['input', 'change', 'focus', 'blur'].includes(event.type) && !isField) return
    if (event.type === 'submit' && !isForm) return
    if (event.type === 'click' && !isButton && !isAnchor && !target.dataset.trackClick) return

    // Drop events from blocked elements
    if (this._isBlocked(target)) return

    const detail: TrackingEventDetail = {
      eventType: event.type,
      timestamp: new Date().toISOString(),
      pageName: this.currentPage,
      fieldId: target.dataset.fieldId,
      fieldType: isField ? (target as HTMLInputElement).type : undefined,
      elementTag: tag.toLowerCase()
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
