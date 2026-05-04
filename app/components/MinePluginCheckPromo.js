const BOT_URL = 'https://bm.wtf/bot'

/** Узкая стрелка вниз сразу под кнопкой «Скачать» / FAB — центрируй через родителя `flex flex-col items-center`. */
export function DownloadPromoConnector({ className = '' }) {
  return (
    <div className={`flex flex-col items-center text-modrinth-green ${className}`} aria-hidden>
      <div className="h-7 w-[2px] rounded-full bg-gradient-to-b from-modrinth-green via-modrinth-green/70 to-transparent" />
      <svg
        className="-mt-1 h-3 w-3 shrink-0 text-modrinth-green"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}

export default function MinePluginCheckPromo({ contentType = 'mod' }) {
  const isPlugin = contentType === 'plugin'

  const pluginParagraph =
    'Иногда там могут скрываться хаки, которые могут взломать твой сервер. Проверь плагин в нашем боте на проверку плагинов Minecraft.'

  const title = 'Не ставь моды к себе на компьютер сразу'
  const modBody =
    'Проверь их сначала на наличие бекдоров в нашем боте на проверку модов.'

  const fileKind = isPlugin ? 'плагина' : 'мода'

  const lead = (
    <>
      <span className="text-gray-900 dark:text-gray-100">Скачал? Не торопись ставить.</span>{' '}
      <span className="text-gray-800 dark:text-gray-200">
        Всегда проверяй файл {fileKind} на наличие бекдоров.
      </span>
    </>
  )

  return (
    <a
      href={BOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        isPlugin
          ? 'Проверить файл плагина на бекдоры в Telegram.'
          : 'Проверить файл мода на бекдоры в Telegram.'
      }
      className="group flex w-full max-w-none flex-col gap-3 rounded-2xl border border-gray-600/80 bg-[var(--bg-tertiary)] p-4 text-left transition-colors duration-200 hover:border-modrinth-green/50 hover:bg-modrinth-green/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 dark:border-gray-700"
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        {isPlugin ? (
          <>
            <p className="text-sm font-bold leading-snug sm:text-[15px]">{lead}</p>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[13px]">
              {pluginParagraph}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold leading-snug sm:text-[15px]">{lead}</p>
            <p className="text-sm font-bold leading-snug text-gray-900 dark:text-gray-100 sm:text-[15px]">{title}</p>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[13px]">{modBody}</p>
          </>
        )}
      </div>

      <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-600/60 bg-[var(--bg-primary)] px-3 py-2.5 text-xs font-semibold text-modrinth-green transition-colors group-hover:border-modrinth-green/40 sm:border-transparent sm:bg-modrinth-green/10 sm:py-2 sm:pr-4 dark:border-gray-600">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2AABEE]/12 text-[#2AABEE]"
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.37.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </span>
        <span className="leading-tight group-hover:text-modrinth-green-light">Открыть в Telegram</span>
        <svg
          className="h-4 w-4 shrink-0 text-modrinth-green transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12l4-4-4-4" />
        </svg>
      </span>
    </a>
  )
}
