'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher'

const EXTERNAL_LINKS = [
  {
    href: 'https://client.modrinth.black',
    tooltip: 'Скачать Minecraft клиент и сервер всех версий',
    children: (
      <>
        Клиент<span className="top-nav-separator">/</span>Сервер
      </>
    ),
  },
  {
    href: 'https://rp.modrinth.black',
    tooltip: 'Перепаковка защищённых ресурспаков',
    children: 'RP Перепак',
  },
  {
    href: 'https://jar.modrinth.black',
    tooltip: 'Перевод плагинов онлайн (InJarTranslator)',
    children: 'Перевод Плагинов',
  },
  {
    href: 'https://dm.modrinth.black',
    tooltip: 'Редактор DeluxeMenu и AbstractMenus',
    children: 'Редактор DeluxeMenu',
  },
  {
    href: 'https://ping.modrinth.black',
    tooltip: 'Пинг серверов (мб недоступен в РФ)',
    children: 'Пинг Серверов',
  },
]

const RAIL_MS = 520
const ROT_MS = 300
const PANEL_MS = 420

export default function TopNav() {
  const panelId = useId()
  const timersRef = useRef([])

  const [railExtended, setRailExtended] = useState(false)
  const [chevronDown, setChevronDown] = useState(false)
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [busy, setBusy] = useState(false)

  const schedule = useCallback((fn, ms) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const runOpen = useCallback(() => {
    clearTimers()
    if (prefersReducedMotion()) {
      setRailExtended(true)
      setChevronDown(true)
      setPanelExpanded(true)
      return
    }
    setBusy(true)
    setRailExtended(false)
    setChevronDown(false)
    setPanelExpanded(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRailExtended(true))
    })
    schedule(() => {
      setChevronDown(true)
      schedule(() => {
        setPanelExpanded(true)
        schedule(() => setBusy(false), PANEL_MS)
      }, ROT_MS)
    }, RAIL_MS)
  }, [clearTimers, prefersReducedMotion, schedule])

  const runClose = useCallback(() => {
    clearTimers()
    if (prefersReducedMotion()) {
      setPanelExpanded(false)
      setChevronDown(false)
      setRailExtended(false)
      return
    }
    setBusy(true)
    setPanelExpanded(false)
    schedule(() => {
      setChevronDown(false)
      schedule(() => {
        setRailExtended(false)
        setBusy(false)
      }, ROT_MS)
    }, PANEL_MS)
  }, [clearTimers, prefersReducedMotion, schedule])

  const toggle = useCallback(() => {
    if (busy) return
    if (panelExpanded) runClose()
    else runOpen()
  }, [busy, panelExpanded, runClose, runOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) {
        clearTimers()
        setRailExtended(false)
        setChevronDown(false)
        setPanelExpanded(false)
        setBusy(false)
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [clearTimers])

  return (
    <nav className="top-nav">
      <div className="top-nav-content top-nav-content--stack">
        <div className="top-nav-mobile-stack md:hidden">
          <div className="top-nav-mobile-toolbar">
            <button
              type="button"
              className="top-nav-mobile-trigger-v2"
              aria-expanded={panelExpanded}
              aria-busy={busy}
              aria-controls={panelId}
              aria-label={
                panelExpanded
                  ? 'Скрыть ссылки на сервисы'
                  : 'Показать ссылки на сервисы'
              }
              onClick={toggle}
            >
              <span className="top-nav-mobile-title-area">
                <span className="top-nav-dot" aria-hidden />
                <span className="truncate">ModrinthProxy</span>
              </span>
              <span className="top-nav-mobile-strip" aria-hidden>
                <span
                  className={`top-nav-mobile-rail ${railExtended ? 'top-nav-mobile-rail--extended' : ''}`}
                />
                <span
                  className={`top-nav-mobile-chevrider ${railExtended ? 'top-nav-mobile-chevrider--end' : ''}`}
                >
                  <span
                    className={`top-nav-mobile-chevrider-inner ${chevronDown ? 'top-nav-mobile-chevrider-inner--down' : ''}`}
                  >
                    <svg
                      className="h-5 w-5 text-[var(--color-green)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </span>
              </span>
            </button>
            <ThemeSwitcher />
          </div>

          <div
            id={panelId}
            className={`top-nav-mobile-panel ${panelExpanded ? 'top-nav-mobile-panel--open' : 'top-nav-mobile-panel--collapsed'}`}
            style={{ gridTemplateRows: panelExpanded ? '1fr' : '0fr' }}
            aria-hidden={!panelExpanded}
          >
            <div className="top-nav-mobile-panel-inner">
              <div className="top-nav-mobile-links">
                {EXTERNAL_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="top-nav-link top-nav-link--mobile-sheet"
                    data-tooltip={link.tooltip}
                    tabIndex={panelExpanded ? undefined : -1}
                  >
                    {link.children}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="top-nav-links top-nav-links--desktop">
          <span
            className="top-nav-link top-nav-link-here"
            data-tooltip="Я здесь"
          >
            <span className="top-nav-dot" aria-hidden />
            ModrinthProxy
          </span>
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="top-nav-link"
              data-tooltip={link.tooltip}
            >
              {link.children}
            </a>
          ))}
        </div>

        <div className="top-nav-theme-desktop">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}
