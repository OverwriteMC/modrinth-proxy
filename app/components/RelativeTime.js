'use client'

import StyledTooltip from './StyledTooltip'

function formatAbsoluteRussian(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export default function RelativeTime({ dateString, className = '' }) {
  const date = new Date(dateString)
  const now = new Date()

  if (isNaN(date.getTime())) {
    return <span className={className}>неизвестно</span>
  }

  const absolute = formatAbsoluteRussian(date)
  const hintCls = `${className} cursor-help rounded-sm outline-none`.trim()

  const diffMs = now - date

  if (diffMs < 0) {
    return (
      <StyledTooltip label={absolute}>
        <span className={hintCls} tabIndex={0} aria-label={absolute}>
          {date.toLocaleDateString('ru-RU')}
        </span>
      </StyledTooltip>
    )
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let timeText
  if (diffMinutes < 60) {
    timeText = `${Math.max(1, diffMinutes)} мин. назад`
  } else if (diffHours < 24) {
    timeText = `${diffHours} ч. назад`
  } else if (diffDays === 1) {
    timeText = 'вчера'
  } else if (diffDays < 7) {
    timeText = `${diffDays} дн. назад`
  } else if (diffDays < 30) {
    timeText = `${Math.floor(diffDays / 7)} нед. назад`
  } else if (diffDays < 365) {
    timeText = `${Math.floor(diffDays / 30)} мес. назад`
  } else {
    timeText = `${Math.floor(diffDays / 365)} г. назад`
  }

  return (
    <StyledTooltip label={absolute}>
      <span className={hintCls} tabIndex={0} aria-label={`${absolute}, ${timeText}`}>
        {timeText}
      </span>
    </StyledTooltip>
  )
}
