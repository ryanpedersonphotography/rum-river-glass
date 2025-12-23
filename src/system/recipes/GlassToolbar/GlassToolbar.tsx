/* FILE: src/system/recipes/GlassToolbar/GlassToolbar.tsx */
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  EnvelopeIcon,
  ChevronDoubleRightIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"

import styles from "./GlassToolbar.module.css"
import { ThemeToggle } from "./ThemeToggle"

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ")
}

// Avoid fragile className selector escaping; we’ll use data-* selectors instead.
// (If you do need escaping elsewhere, prefer CSS.escape when available.)
function cssEscape(value: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyCSS = (globalThis as any).CSS as { escape?: (v: string) => string } | undefined
  if (anyCSS?.escape) return anyCSS.escape(value)
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, "\\$& ")
}

function sel(className: string) {
  return `.${cssEscape(className)}`
}

type ToolbarItem = {
  id: string
  label: string
  description?: string
  href?: string
}

export type ToolbarSection = {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items?: ToolbarItem[]
}

export type GlassToolbarProps = {
  sections?: ToolbarSection[]
  activeSectionId?: string
  onSectionChange?: (sectionId: string) => void
  onItemSelect?: (sectionId: string, itemId: string) => void
  initialExpanded?: boolean
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SECTIONS: ToolbarSection[] = [
  {
    id: "home",
    label: "Home",
    description: "Welcome",
    icon: HomeIcon,
  },
  {
    id: "spaces",
    label: "Spaces",
    description: "Explore our venues",
    icon: BuildingStorefrontIcon,
    items: [
      { id: "barn", label: "The Barn", description: "Main reception space" },
      { id: "lawn", label: "The Lawn", description: "Ceremony & games" },
      { id: "loft", label: "The Loft", description: "Bridal suite & prep" },
    ],
  },
  {
    id: "weddings",
    label: "Weddings",
    description: "Real love stories",
    icon: HeartIcon,
    items: [
      { id: "gallery", label: "Gallery" },
      { id: "stories", label: "Real Weddings" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    description: "Plan your visit",
    icon: EnvelopeIcon,
    items: [
      { id: "inquire", label: "Inquiry Form" },
      { id: "visit", label: "Schedule a Visit" },
    ],
  },
]

const PANEL_VARIANTS_EXPRESSIVE: Variants = {
  collapsed: {
    x: "-100%",
    opacity: 0,
    boxShadow: "none",
    pointerEvents: "none",
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 36,
      bounce: 0,
      restDelta: 0.5,
      restSpeed: 0.5,
      opacity: { duration: 0.2, delay: 0.04 },
    },
    transitionEnd: { pointerEvents: "none" },
  },
  expanded: {
    x: "0%",
    opacity: 1,
    boxShadow: "var(--glass-toolbar-shadow)",
    pointerEvents: "auto",
    transition: {
      type: "spring",
      stiffness: 308,
      damping: 43,
      bounce: 0,
      restDelta: 0.5,
      restSpeed: 0.5,
      opacity: { duration: 0.24, delay: 0.06 },
    },
    transitionEnd: { pointerEvents: "auto" },
  },
}

const PANEL_VARIANTS_REDUCED: Variants = {
  collapsed: {
    x: "-100%",
    opacity: 0,
    boxShadow: "none",
    pointerEvents: "none",
    transition: { duration: 0.01 },
    transitionEnd: { pointerEvents: "none" },
  },
  expanded: {
    x: "0%",
    opacity: 1,
    boxShadow: "var(--glass-toolbar-shadow)",
    pointerEvents: "auto",
    transition: { duration: 0.01 },
    transitionEnd: { pointerEvents: "auto" },
  },
}

const subnavVariants = {
  collapsed: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  expanded: { opacity: 1, transition: { delayChildren: 0.06, staggerChildren: 0.05 } },
}

const subnavItemVariants = {
  collapsed: { opacity: 0, x: -8 },
  expanded: { opacity: 1, x: 0 },
}

const GlassToolbar = React.forwardRef<HTMLElement, GlassToolbarProps>(function GlassToolbar(
  {
    sections = DEFAULT_SECTIONS,
    activeSectionId,
    onSectionChange,
    onItemSelect,
    initialExpanded = false,
    className,
    style,
  },
  ref,
) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  const [manualPinned, setManualPinned] = React.useState(initialExpanded)
  const [internalActive, setInternalActive] = React.useState(() => activeSectionId ?? sections[0]?.id ?? "")
  const [pointerInside, setPointerInside] = React.useState(false)
  const [focusInside, setFocusInside] = React.useState(false)
  const [hoverLock, setHoverLock] = React.useState(false)
  const [transientHover, setTransientHover] = React.useState(false)

  const pointerFocusGate = React.useRef(false)
  const transientHoverTimeout = React.useRef<number | null>(null)
  const panelId = React.useId()

  const activeSection = React.useMemo(
    () => sections.find((section) => section.id === internalActive) ?? sections[0],
    [internalActive, sections],
  )

  // If you're deep-linked into a route, allow hover-locking so the rail feels sticky while navigating.
  const pathSegments = React.useMemo(() => pathname?.split("/").filter(Boolean) ?? [], [pathname])
  const allowPersistentHover = pathSegments.length > 0

  const updateHoverLock = React.useCallback(
    (next: boolean) => {
      setHoverLock(next && allowPersistentHover)
    },
    [allowPersistentHover],
  )

  React.useEffect(() => {
    if (!allowPersistentHover) setHoverLock(false)
  }, [allowPersistentHover])

  // Clean up global layout offset var on unmount
  React.useEffect(() => {
    const root = document.documentElement
    return () => {
      root.style.removeProperty("--glass-toolbar-offset")
    }
  }, [])

  // Controlled active section support
  React.useEffect(() => {
    if (activeSectionId) setInternalActive(activeSectionId)
  }, [activeSectionId])

  const autoExpand = React.useMemo(
    () => pointerInside || focusInside || hoverLock || transientHover,
    [pointerInside, focusInside, hoverLock, transientHover],
  )
  const expanded = manualPinned || autoExpand

  const primeTransientHover = React.useCallback(() => {
    if (allowPersistentHover) return
    if (transientHoverTimeout.current) window.clearTimeout(transientHoverTimeout.current)
    setTransientHover(true)
    transientHoverTimeout.current = window.setTimeout(() => {
      setTransientHover(false)
      transientHoverTimeout.current = null
    }, 900)
  }, [allowPersistentHover])

  // Keep the layout offset var updated so your main content can shift (GlobalCanvas / layout wrapper)
  React.useEffect(() => {
    const root = document.documentElement
    const computed = getComputedStyle(root)
    const railWidth = computed.getPropertyValue("--glass-toolbar-rail-width").trim() || "78px"
    const panelWidth = computed.getPropertyValue("--glass-toolbar-panel-width").trim() || "320px"
    const expandedWidth = `calc(${railWidth} + ${panelWidth})`
    root.style.setProperty("--glass-toolbar-offset", expanded ? expandedWidth : railWidth)
  }, [expanded])

  // Reduced-motion friendly animation config
  const panelVariants = prefersReducedMotion ? PANEL_VARIANTS_REDUCED : PANEL_VARIANTS_EXPRESSIVE

  const menuVariants = React.useMemo<Variants>(() => {
    if (prefersReducedMotion) return { hidden: { opacity: 1 }, enter: { opacity: 1 }, exit: { opacity: 1 } }
    return {
      hidden: { opacity: 0 },
      enter: { opacity: 1, transition: { duration: 0.24, ease: [0.2, 0.0, 0.0, 1.0], delay: 0.05 } },
      exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0.0, 1.0, 1.0], delay: 0.02 } },
    }
  }, [prefersReducedMotion])

  const handleItemClick = React.useCallback(
    (itemId: string) => {
      if (!activeSection) return
      updateHoverLock(true)
      onItemSelect?.(activeSection.id, itemId)
    },
    [activeSection, onItemSelect, updateHoverLock],
  )

  const handleSectionClick = React.useCallback(
    (sectionId: string, hasChildren: boolean) => {
      setInternalActive(sectionId)

      if (hasChildren) {
        updateHoverLock(true)
        onSectionChange?.(sectionId)

        const section = sections.find((candidate) => candidate.id === sectionId)
        const firstItem = section?.items?.[0]
        if (firstItem) onItemSelect?.(sectionId, firstItem.id)

        // If you click a section with children, ensure the panel opens.
        setPointerInside(true)
        primeTransientHover()
        return
      }

      // If section has no children, collapse unless pinned.
      if (!manualPinned) {
        updateHoverLock(false)
        setPointerInside(false)
        setFocusInside(false)
      } else {
        updateHoverLock(false)
      }

      onSectionChange?.(sectionId)
    },
    [manualPinned, onItemSelect, onSectionChange, primeTransientHover, sections, updateHoverLock],
  )

  const handleSectionPointerEnter = React.useCallback(
    (sectionId: string, hasChildren: boolean) => {
      setPointerInside(true)

      if (hasChildren) {
        updateHoverLock(true)
        primeTransientHover()
      } else {
        updateHoverLock(false)
        if (!allowPersistentHover) {
          setHoverLock(false)
          primeTransientHover()
        }
      }

      setInternalActive(sectionId)
      onSectionChange?.(sectionId)
    },
    [allowPersistentHover, onSectionChange, primeTransientHover, updateHoverLock],
  )

  return (
    <aside
      ref={ref}
      className={cx(styles.root, className)}
      data-glass-toolbar-root
      data-expanded={expanded ? "true" : "false"}
      style={style}
      onPointerLeave={() => {
        setPointerInside(false)
        pointerFocusGate.current = false
        if (!manualPinned) {
          setFocusInside(false)
          if (!allowPersistentHover) setHoverLock(false)
        }
        setTransientHover(false)
        if (transientHoverTimeout.current) {
          window.clearTimeout(transientHoverTimeout.current)
          transientHoverTimeout.current = null
        }
      }}
      onPointerEnter={() => {
        setPointerInside(true)
        primeTransientHover()
      }}
      onPointerDownCapture={(event) => {
        pointerFocusGate.current = true
        if (manualPinned) return
        const target = event.target as HTMLElement | null
        const withinPill = Boolean(target?.closest('[data-glass-toolbar="pill"]'))
        const withinPanel = Boolean(target?.closest('[data-glass-toolbar="panel"]'))
        const isUtility = Boolean(target?.closest(`.${cssEscape(styles.railFooter)}`))
        if (withinPill || withinPanel || isUtility) setPointerInside(true)
        else setPointerInside(false)
      }}
      onPointerUpCapture={() => {
        pointerFocusGate.current = false
      }}
      onPointerCancelCapture={() => {
        pointerFocusGate.current = false
      }}
      onFocusCapture={() => {
        if (!pointerFocusGate.current) setFocusInside(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusInside(false)
        }
      }}
    >
      <div className={styles.rail}>
        <div className={styles.railTop}>
          <div className={styles.logo} aria-hidden="true">
            <Image
              src="/images/barn-logo.svg"
              alt="Rum River Barn Logo"
              width={32}
              height={32}
              className={styles.logoImage}
              priority={false}
            />
          </div>
          <span className={styles.railLabel}>HOME</span>
        </div>

        <nav className={styles.primary} aria-label="Primary navigation">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection?.id === section.id
            const hasChildren = Boolean(section.items?.length)
            return (
              <button
                key={section.id}
                type="button"
                className={cx(styles.pill, isActive && styles.pillActive)}
                onClick={() => handleSectionClick(section.id, hasChildren)}
                onPointerEnter={() => handleSectionPointerEnter(section.id, hasChildren)}
                aria-pressed={isActive}
                aria-label={section.label}
                title={section.label}
                data-has-children={hasChildren ? "true" : "false"}
                data-glass-toolbar="pill"
              >
                {isActive && (
                  <motion.span
                    layoutId="glass-toolbar-active-pill"
                    className={styles.pillActiveBg}
                    transition={{ type: "spring", stiffness: 520, damping: 40 }}
                  />
                )}
                <div className={styles.pillIcon}>
                  <Icon aria-hidden="true" />
                </div>
                <span className={styles.pillLabel}>{section.label}</span>
              </button>
            )
          })}
        </nav>

        <div className={styles.railFooter}>
          <ThemeToggle className={styles.themeToggle} iconClassName={styles.themeIcon} />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setManualPinned((prev) => !prev)}
            aria-controls={panelId}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse toolbar" : "Expand toolbar"}
          >
            {expanded ? <XMarkIcon aria-hidden="true" /> : <ChevronDoubleRightIcon aria-hidden="true" />}
          </button>
        </div>
      </div>

      <motion.div
        className={styles.panel}
        id={panelId}
        aria-hidden={!expanded}
        data-glass-toolbar="panel"
        initial={expanded ? "expanded" : "collapsed"}
        animate={expanded ? "expanded" : "collapsed"}
        variants={panelVariants}
        onPointerEnter={() => {
          setPointerInside(true)
          primeTransientHover()
        }}
      >
        <div className={styles.panelBody}>
          <AnimatePresence initial={false} mode="wait">
            {activeSection?.items && activeSection.items.length > 0 ? (
              <motion.div
                key={activeSection.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.22 } }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.16 } }}
              >
                <motion.ul
                  className={styles.subnav}
                  aria-label={`${activeSection.label} shortcuts`}
                  variants={subnavVariants}
                  initial="collapsed"
                  animate="expanded"
                >
                  {activeSection.items.map((item) => (
                    <motion.li key={item.id} variants={subnavItemVariants}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onPointerEnter={() => {
                            setPointerInside(true)
                            updateHoverLock(true)
                            primeTransientHover()
                          }}
                          onFocus={() => {
                            setPointerInside(true)
                            updateHoverLock(true)
                            primeTransientHover()
                          }}
                        >
                          <span>{item.label}</span>
                          {item.description ? <small>{item.description}</small> : null}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onPointerEnter={() => {
                            setPointerInside(true)
                            updateHoverLock(true)
                            primeTransientHover()
                          }}
                          onFocus={() => {
                            setPointerInside(true)
                            updateHoverLock(true)
                            primeTransientHover()
                          }}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <span>{item.label}</span>
                          {item.description ? <small>{item.description}</small> : null}
                        </button>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : (
              <motion.p
                key={`${activeSection?.id ?? "none"}-empty`}
                className={styles.empty}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={menuVariants}
              >
                Nothing here yet.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.footerCta}
            onClick={() => {
              window.location.href = "/faq"
            }}
          >
            <QuestionMarkCircleIcon aria-hidden="true" />
            <span>FAQ</span>
          </button>

          <button type="button" className={styles.footerCta}>
            <ArrowLeftOnRectangleIcon aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </footer>
      </motion.div>
    </aside>
  )
})

GlassToolbar.displayName = "GlassToolbar"
export default GlassToolbar