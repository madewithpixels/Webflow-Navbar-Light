const ROOT_SELECTOR = '[data-mwp-navbar]';

const COLLAPSE_QUERIES = {
  tablet: '(max-width: 991px)',
  'mobile-landscape': '(max-width: 767px)',
  'mobile-portrait': '(max-width: 479px)'
};

const TRUE_VALUES = new Set(['', '1', 'true', 'yes', 'on']);

function booleanAttribute(element, name, fallback) {
  if (!element.hasAttribute(name)) return fallback;
  return TRUE_VALUES.has(String(element.getAttribute(name)).trim().toLowerCase());
}

function validCss(property, value) {
  return Boolean(value && globalThis.CSS?.supports?.(property, value));
}

function milliseconds(value, fallback = 0) {
  const input = String(value || '').trim();
  if (!input) return fallback;
  if (input.endsWith('ms')) return Number.parseFloat(input) || fallback;
  if (input.endsWith('s')) return (Number.parseFloat(input) || 0) * 1000;
  return Number.parseFloat(input) || fallback;
}

function ensureId(element, prefix) {
  if (element.id) return element.id;
  const random = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  element.id = `${prefix}-${random}`;
  return element.id;
}

export class NavbarLight {
  constructor(root) {
    this.root = root;
    this.menu = root.querySelector('[data-mwp-menu], [data-mwp-css-nav]');
    this.trigger = this.menu?.querySelector('[data-mwp-trigger], summary');
    this.panel = root.querySelector('[data-mwp-panel], .mwp-css-nav_panel');
    this.backdrop = root.querySelector('[data-mwp-backdrop]');
    this.items = [...root.querySelectorAll('[data-mwp-item]')];
    this.submenus = [...root.querySelectorAll('[data-mwp-submenu]')];
    this.mediaQuery = null;
    this.stateTimer = null;
    this.lockSnapshot = null;
    this.focusOnOpened = false;
    this.destroyed = false;
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);

    if (!this.menu || !this.trigger || !this.panel) return;
    this.configure();
    this.bind();
    this.onBreakpointChange(true);
  }

  configure() {
    const panelId = ensureId(this.panel, 'mwp-navbar-panel');
    this.trigger.setAttribute('aria-controls', panelId);
    this.trigger.setAttribute('aria-haspopup', 'true');

    const rootStyle = this.root.style;
    const duration = this.menu.dataset.mwpDuration || this.root.dataset.duration;
    const openDuration = this.root.dataset.openDuration || duration;
    const closeDuration = this.root.dataset.closeDuration || duration;
    const distance = this.menu.dataset.mwpDistance || this.root.dataset.distance;
    const easing = this.menu.dataset.mwpEase || this.root.dataset.easing;
    const panelWidth = this.root.dataset.panelWidth;
    const stagger = this.root.dataset.stagger;
    const iconDuration = this.root.dataset.iconDuration;

    if (validCss('transition-duration', openDuration)) rootStyle.setProperty('--mwp-nav-duration-open', openDuration);
    if (validCss('transition-duration', closeDuration)) rootStyle.setProperty('--mwp-nav-duration-close', closeDuration);
    if (validCss('transform', `translateY(${distance})`)) rootStyle.setProperty('--mwp-nav-distance', distance);
    if (validCss('transition-timing-function', easing)) rootStyle.setProperty('--mwp-nav-ease', easing);
    if (validCss('width', panelWidth)) rootStyle.setProperty('--mwp-nav-panel-width', panelWidth);
    if (validCss('transition-delay', stagger)) rootStyle.setProperty('--mwp-nav-stagger', stagger);
    if (validCss('transition-duration', iconDuration)) rootStyle.setProperty('--mwp-nav-icon-duration', iconDuration);

    this.items.forEach((item, index) => item.style.setProperty('--mwp-item-index', index));

    const collapse = this.root.dataset.collapse;
    if (COLLAPSE_QUERIES[collapse]) {
      this.mediaQuery = window.matchMedia(COLLAPSE_QUERIES[collapse]);
      this.mediaQuery.addEventListener?.('change', this.onBreakpointChange);
    }

    this.root.mwpNavbarLight = this.publicApi();
    this.menu.mwpNav = this.root.mwpNavbarLight;
  }

  bind() {
    this.menu.addEventListener('toggle', this.onToggle);
    this.backdrop?.addEventListener('click', () => this.close({ focusTrigger: true }));
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeydown);

    this.panel.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && booleanAttribute(this.root, 'data-close-on-link', true)) this.close();
    });

    if (!this.mediaQuery) window.addEventListener('resize', this.onBreakpointChange, { passive: true });
  }

  publicApi() {
    const navbar = this;
    return Object.freeze({
      open: (options) => this.open(options),
      close: (options) => this.close(options),
      toggle: (options) => this.toggle(options),
      destroy: () => this.destroy(),
      get state() { return navbar.root.dataset.state; }
    });
  }

  isCollapsed() {
    const collapse = this.root.dataset.collapse;
    if (collapse === 'always') return true;
    if (collapse === 'never') return false;
    if (this.mediaQuery) return this.mediaQuery.matches;
    return getComputedStyle(this.trigger).display !== 'none';
  }

  usesScrollLock() {
    const requested = this.root.getAttribute('data-scroll-lock');
    if (requested && requested !== 'auto') return TRUE_VALUES.has(requested.trim().toLowerCase());
    return ['left', 'right', 'overlay'].includes(this.root.dataset.layout);
  }

  onBreakpointChange(initial = false) {
    const collapsed = this.isCollapsed();
    const previous = this.root.dataset.mwpCollapsed === 'true';
    this.root.dataset.mwpCollapsed = String(collapsed);

    if (collapsed) {
      if (initial || !previous) {
        this.menu.open = false;
        this.setState('closed', false);
      } else {
        this.syncNative(false);
      }
    } else {
      this.unlockScroll();
      this.menu.open = true;
      this.setState('expanded', false);
      this.submenus.forEach((submenu) => { submenu.open = false; });
    }
  }

  onToggle() {
    if (!this.isCollapsed()) {
      if (!this.menu.open) this.menu.open = true;
      this.setState('expanded', false);
      return;
    }
    this.syncNative(true);
  }

  onDocumentClick(event) {
    if (!this.menu.open || !booleanAttribute(this.root, 'data-close-on-outside', true)) return;
    if (!this.root.contains(event.target)) this.close();
  }

  onKeydown(event) {
    if (event.key !== 'Escape') return;

    const openSubmenu = this.submenus.find((submenu) => submenu.open && submenu.contains(document.activeElement));
    if (openSubmenu) {
      openSubmenu.open = false;
      openSubmenu.querySelector('summary')?.focus();
      event.preventDefault();
      return;
    }

    if (this.menu.open && this.isCollapsed()) {
      this.close({ focusTrigger: true });
      event.preventDefault();
    }
  }

  syncNative(notify) {
    if (this.menu.open) this.transitionToOpen(notify);
    else this.transitionToClosed(notify);
  }

  transitionToOpen(notify = true) {
    this.clearStateTimer();
    this.setState('opening', notify);
    if (this.usesScrollLock()) this.lockScroll();

    const duration = this.motionDuration('open');
    this.stateTimer = window.setTimeout(() => {
      this.setState('open', true);
      if (this.focusOnOpened || booleanAttribute(this.root, 'data-focus-first', false)) {
        this.panel.querySelector('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')?.focus();
      }
      this.focusOnOpened = false;
    }, duration);
  }

  transitionToClosed(notify = true) {
    this.clearStateTimer();
    this.setState('closing', notify);
    const duration = this.motionDuration('close');
    this.stateTimer = window.setTimeout(() => {
      this.setState('closed', true);
      this.unlockScroll();
      this.submenus.forEach((submenu) => { submenu.open = false; });
    }, duration);
  }

  setState(state, notify) {
    const open = ['opening', 'open'].includes(state);
    this.root.dataset.state = state;
    this.menu.dataset.state = state;
    this.panel.dataset.state = state;
    if (this.backdrop) this.backdrop.dataset.state = state;
    this.trigger.setAttribute('aria-expanded', String(open));
    this.panel.setAttribute('aria-hidden', String(!open && state !== 'expanded'));
    this.panel.inert = !open && state !== 'expanded';
    if (notify) this.emit(state);
  }

  emit(state) {
    const eventNames = { opening: 'open', open: 'opened', closing: 'close', closed: 'closed' };
    const eventName = eventNames[state];
    if (!eventName) return;
    const detail = { navbar: this, root: this.root, menu: this.menu, trigger: this.trigger, panel: this.panel, state };
    this.root.dispatchEvent(new CustomEvent(`mwp-nav:${eventName}`, { bubbles: true, detail }));
  }

  motionDuration(direction) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    if (['none', 'custom'].includes(this.root.dataset.motion)) return 0;
    const property = direction === 'open' ? '--mwp-nav-duration-open' : '--mwp-nav-duration-close';
    return milliseconds(getComputedStyle(this.root).getPropertyValue(property), 0);
  }

  open({ focusFirst = false } = {}) {
    if (!this.isCollapsed() || this.menu.open) return;
    this.focusOnOpened = focusFirst;
    this.menu.open = true;
  }

  close({ focusTrigger = false } = {}) {
    if (!this.isCollapsed() || !this.menu.open) return;
    this.menu.open = false;
    if (focusTrigger) this.trigger.focus();
  }

  toggle(options) {
    if (this.menu.open) this.close(options);
    else this.open(options);
  }

  lockScroll() {
    if (this.lockSnapshot) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    this.lockSnapshot = {
      overflow: document.documentElement.style.overflow,
      paddingRight: document.documentElement.style.paddingRight
    };
    document.documentElement.dataset.mwpScrollLocked = 'true';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbar > 0) document.documentElement.style.paddingRight = `${scrollbar}px`;
  }

  unlockScroll() {
    if (!this.lockSnapshot) return;
    document.documentElement.style.overflow = this.lockSnapshot.overflow;
    document.documentElement.style.paddingRight = this.lockSnapshot.paddingRight;
    delete document.documentElement.dataset.mwpScrollLocked;
    this.lockSnapshot = null;
  }

  clearStateTimer() {
    if (this.stateTimer) window.clearTimeout(this.stateTimer);
    this.stateTimer = null;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.clearStateTimer();
    this.unlockScroll();
    this.menu.removeEventListener('toggle', this.onToggle);
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('resize', this.onBreakpointChange);
    this.mediaQuery?.removeEventListener?.('change', this.onBreakpointChange);
    delete this.root.mwpNavbarLight;
    delete this.menu.mwpNav;
  }
}

export function initNavbarLight(root = document) {
  return [...root.querySelectorAll(ROOT_SELECTOR)]
    .filter((element) => !element.mwpNavbarLight)
    .map((element) => new NavbarLight(element));
}

if (typeof document !== 'undefined' && globalThis.MWP_NAVBAR_LIGHT_AUTO_INIT !== false) {
  const start = () => initNavbarLight();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
