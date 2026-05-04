'use client'

import Link from 'next/link'
import * as Popover from '@radix-ui/react-popover'
import { facetMcVersionQuery, versionsForCompressedRange } from '@/lib/minecraftVersionSort'
import StyledTooltip from './StyledTooltip'

const chipLinkCls =
  'z-[1] inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm font-normal leading-none text-[var(--text-muted)] transition-transform hover:underline active:scale-[0.95] outline-none'

const chipPlainCls =
  'z-[1] inline-flex shrink-0 cursor-default items-center gap-1 whitespace-nowrap rounded-full border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm font-normal leading-none text-[var(--text-muted)] transition-transform active:scale-[0.95] outline-none hover:no-underline'

const chipMoreCls =
  'z-[1] inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm font-normal leading-none text-[var(--text-muted)] transition-transform hover:underline active:scale-[0.95] outline-none'

function VersionRangeChip({ range, browseRoute, rawVersions }) {
  const expanded = versionsForCompressedRange(range, rawVersions)

  let tooltipBody
  if (expanded.length > 1) {
    tooltipBody = (
      <span className="block text-left">
        <span className="block text-[11px] font-semibold">{range}</span>
        <span className="mt-1 block max-h-[min(220px,40vh)] overflow-y-auto overscroll-contain leading-snug">
          {expanded.join(', ')}
        </span>
      </span>
    )
  } else if (expanded.length === 1) {
    tooltipBody = <>Поддерживает {expanded[0]}</>
  } else {
    tooltipBody = <>Поддерживает {range}</>
  }

  const ariaLabel =
    expanded.length > 1
      ? `${range}: ${expanded.join(', ')}`
      : expanded.length === 1
        ? `Поддерживает ${expanded[0]}`
        : `Поддерживает ${range}`

  const v = facetMcVersionQuery(range, rawVersions)
  if (v) {
    return (
      <StyledTooltip
        label={tooltipBody}
        contentClassName={expanded.length > 1 ? '!max-w-[min(380px,calc(100vw-24px))]' : ''}
      >
        <Link
          href={`/${browseRoute}?v=${encodeURIComponent(v)}`}
          className={chipLinkCls}
          tabIndex={0}
          aria-label={ariaLabel}
        >
          {range}
        </Link>
      </StyledTooltip>
    )
  }
  return (
    <StyledTooltip
      label={tooltipBody}
      contentClassName={expanded.length > 1 ? '!max-w-[min(380px,calc(100vw-24px))]' : ''}
    >
      <span className={chipPlainCls} tabIndex={0} aria-label={ariaLabel}>
        {range}
      </span>
    </StyledTooltip>
  )
}

export default function CompressedGameVersionsChips({
  browseRoute,
  rawVersions,
  ranges,
  maxVisible = 6,
}) {
  if (!ranges?.length) return null

  const visible = ranges.slice(0, maxVisible)
  const overflow = ranges.length > maxVisible ? ranges.slice(maxVisible) : []

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((range, idx) => (
        <VersionRangeChip key={`${range}-${idx}`} range={range} browseRoute={browseRoute} rawVersions={rawVersions} />
      ))}
      {overflow.length > 0 && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className={`${chipMoreCls} hover:underline`}
              aria-label={`Ещё ${overflow.length}`}
            >
              +{overflow.length}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={6}
              className="z-[100] max-h-[min(320px,50vh)] max-w-[min(320px,calc(100vw-24px))] overflow-y-auto rounded-xl border border-gray-700 p-2 shadow-xl"
              style={{ backgroundColor: 'var(--bg-primary)' }}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="flex flex-wrap gap-1">
                {overflow.map((range, idx) => (
                  <VersionRangeChip
                    key={`${range}-o-${idx}`}
                    range={range}
                    browseRoute={browseRoute}
                    rawVersions={rawVersions}
                  />
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  )
}
