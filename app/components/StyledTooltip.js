'use client'

import * as Tooltip from '@radix-ui/react-tooltip'

export function TooltipProvider({ children }) {
  return (
    <Tooltip.Provider delayDuration={350} skipDelayDuration={120}>
      {children}
    </Tooltip.Provider>
  )
}

/** Текст через портал (не режется overflow родителей), клавиатура и скринридеры через Radix. */
export default function StyledTooltip({ children, label, side = 'top', contentClassName = '' }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          className={['radix-tooltip-content', contentClassName].filter(Boolean).join(' ')}
        >
          {label}
          <Tooltip.Arrow width={11} height={5} className="radix-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
