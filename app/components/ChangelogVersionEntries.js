import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { formatDate } from '@/lib/modrinth'
import { filterVersionChangelog } from '@/lib/contentFilter'

function changelogBarClass(versionType) {
  if (versionType === 'release') return 'release'
  if (versionType === 'beta') return 'beta'
  return 'alpha'
}

export function ChangelogTimelineRow({ channel, isLast, header, children }) {
  const barMod = changelogBarClass(channel)

  return (
    <li
      className={`changelog-item ${!isLast ? 'pb-2.5' : ''}`}
    >
      <div className="flex gap-x-2">
        <div className="changelog-bar-cell relative w-[1.625rem] shrink-0 self-stretch pt-0.5">
          <div className={`changelog-bar ${barMod}`} aria-hidden />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          {header}
          <div className="changelog-version-body mt-2">{children}</div>
        </div>
      </div>
    </li>
  )
}

export default function ChangelogVersionEntries({ versions, slug, contentType }) {
  const versionHref = (version) => {
    const id = version.id ?? version.version_number
    if (!id) return null
    return `/${contentType}/${slug}/version/${encodeURIComponent(id)}`
  }

  return (
    <ul className="m-0 list-none p-0">
      {versions.map((version, index) => {
        const href = versionHref(version)
        const title = version.name || version.version_number
        const isLast = index === versions.length - 1
        return (
          <ChangelogTimelineRow
            key={version.id ?? version.version_number}
            channel={version.version_type}
            isLast={isLast}
            header={
              <div className="mb-0 flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {href ? (
                    <Link
                      href={href}
                      className="transition-colors hover:text-modrinth-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-modrinth-green focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] rounded-sm"
                    >
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                </h3>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    version.version_type === 'release'
                      ? 'bg-green-900 text-green-300'
                      : version.version_type === 'beta'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-red-900 text-red-300'
                  }`}
                >
                  {version.version_type}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(version.date_published)}
                </span>
              </div>
            }
          >
            <div className="prose prose-invert prose-sm max-w-none text-sm text-gray-300">
              {version.changelog ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {filterVersionChangelog(version.changelog)}
                </ReactMarkdown>
              ) : (
                <p className="italic text-gray-500">Нет описания изменений</p>
              )}
            </div>
          </ChangelogTimelineRow>
        )
      })}
    </ul>
  )
}
