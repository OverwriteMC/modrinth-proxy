'use client'

import { TooltipProvider } from './StyledTooltip'

export default function AppTooltipProvider({ children }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
