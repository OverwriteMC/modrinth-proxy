import Link from 'next/link'
import { formatDownloads } from '@/lib/modrinth'
import { CATEGORIES } from '@/lib/categories'
import { RESOURCEPACK_CATEGORIES } from '@/lib/resourcepackCategories'
import { SHADER_STYLES, SHADER_FEATURES, SHADER_PERFORMANCE } from '@/lib/shaderCategories'
import DownloadModal from './DownloadModal'
import MobileDownloadButton from './MobileDownloadButton'
import MinePluginCheckPromo, { DownloadPromoConnector } from './MinePluginCheckPromo'

const MINEPLUGIN_PROMO_MAX_DOWNLOADS = 100_000

const CONTENT_TYPE_NAMES = {
  mod: 'Моды',
  mods: 'Моды',
  modpack: 'Модпаки',
  modpacks: 'Модпаки',
  plugin: 'Плагины',
  plugins: 'Плагины',
  datapack: 'Датапаки',
  datapacks: 'Датапаки',
  resourcepack: 'Ресурспаки',
  resourcepacks: 'Ресурспаки',
  shader: 'Шейдеры',
  shaders: 'Шейдеры',
}

const CONTENT_TYPE_ROUTES = {
  mod: 'mods',
  modpack: 'modpacks',
  plugin: 'plugins',
  datapack: 'datapacks',
  resourcepack: 'resourcepacks',
  shader: 'shaders',
}

export default function ResourceHeader({ resource, contentType, versions = [] }) {
  const contentTypeName = CONTENT_TYPE_NAMES[contentType] || 'Ресурсы'
  const contentTypeRoute = CONTENT_TYPE_ROUTES[contentType] || contentType
  
  let allCategories = CATEGORIES
  if (contentType === 'resourcepack' || contentType === 'resourcepacks') {
    allCategories = [...CATEGORIES, ...RESOURCEPACK_CATEGORIES]
  } else if (contentType === 'shader' || contentType === 'shaders') {
    allCategories = [...CATEGORIES, ...SHADER_STYLES, ...SHADER_FEATURES, ...SHADER_PERFORMANCE]
  }
  
  const allResourceCategories = [
    ...(resource.categories || []),
    ...(resource.additional_categories || [])
  ]

  const downloads = resource.downloads
  const showMinePluginCheckPromo =
    (contentType === 'mod' || contentType === 'plugin') &&
    (downloads == null || downloads < MINEPLUGIN_PROMO_MAX_DOWNLOADS)

  return (
    <>
      <div className="mb-4 md:mb-6 flex items-center gap-2 text-sm flex-wrap">
        <Link 
          href={`/${contentTypeRoute}`}
          className="text-gray-600 dark:text-gray-400 hover:text-modrinth-green transition-colors duration-200 font-medium"
        >
          {contentTypeName}
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-semibold truncate">{resource.title}</span>
      </div>

      <div className="border-b pb-4 md:pb-6 mb-6 md:mb-8" style={{ borderBottomColor: 'var(--bg-tertiary)' }}>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
          <div className="flex gap-3 md:gap-4 flex-1">
            {resource.icon_url && (
              <img
                src={resource.icon_url}
                alt={resource.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{resource.title}</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm md:text-base">{resource.description}</p>
              
              <div className="hidden lg:flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                {resource.downloads != null && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatDownloads(resource.downloads)}</span>
                  </div>
                )}
                {(resource.followers != null || resource.follows != null) && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatDownloads(resource.followers || resource.follows)}</span>
                  </div>
                )}
                {allResourceCategories.length > 0 && (
                  <div className="hidden sm:flex flex-wrap gap-1.5">
                    {allResourceCategories.slice(0, 4).map((catId) => {
                      try {
                        if (!catId || typeof catId !== 'string') return null
                        const category = allCategories.find(c => c.id === catId)
                        if (!category || !category.icon || !category.name) return null
                        
                        return (
                          <Link
                            key={catId}
                            href={`/${contentTypeRoute}?f=categories:${catId}`}
                            className="px-2 py-1 text-xs font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                          >
                            <div className="h-3.5 w-3.5 flex-shrink-0">{category.icon}</div>
                            <span>{category.name}</span>
                          </Link>
                        )
                      } catch (e) {
                        return null
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col lg:w-auto">
            <div className="w-full lg:flex lg:justify-end">
              {showMinePluginCheckPromo ? (
                <div className="flex flex-col items-center gap-2 lg:inline-flex lg:gap-2">
                  <DownloadModal mod={resource} versions={versions} contentType={contentTypeRoute} />
                  <DownloadPromoConnector className="hidden lg:flex pb-px" />
                </div>
              ) : (
                <DownloadModal mod={resource} versions={versions} contentType={contentTypeRoute} />
              )}
            </div>

            <div className="mt-3 w-full lg:mt-0">
              <div className="flex w-full items-center justify-between gap-3 lg:hidden">
                <div className="flex min-w-0 flex-col gap-2 text-xs">
                  {resource.downloads != null && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatDownloads(resource.downloads)}</span>
                    </div>
                  )}
                  {(resource.followers != null || resource.follows != null) && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatDownloads(resource.followers || resource.follows)}</span>
                    </div>
                  )}
                </div>

                {showMinePluginCheckPromo ? (
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <MobileDownloadButton />
                    <DownloadPromoConnector />
                  </div>
                ) : (
                  <MobileDownloadButton />
                )}
              </div>
            </div>
          </div>
        </div>

        {showMinePluginCheckPromo && (
          <div className="mt-5 w-full min-w-0 lg:mt-4">
            <MinePluginCheckPromo contentType={contentType} />
          </div>
        )}
      </div>
    </>
  )
}

