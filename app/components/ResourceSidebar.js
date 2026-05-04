'use client'

import Link from 'next/link'
import { LOADERS } from '@/lib/loaders'
import { compressVersionRanges } from '@/lib/modrinth'
import { sortCompressedRangesDesc } from '@/lib/minecraftVersionSort'
import CompressedGameVersionsChips from './CompressedGameVersionsChips'

export default function ResourceSidebar({ resource, teamMembers = [], contentType = null }) {
  const gameVersions = resource.game_versions || []
  const loaders = (resource.loaders || []).filter(l => l !== 'minecraft')
  const browseRoute = resolveContentTypeRoute(contentType, resource.project_type)
  const gameVersionRanges = sortCompressedRangesDesc(compressVersionRanges(gameVersions))
  
  const environment = getEnvironment(resource.client_side, resource.server_side)

  return (
    <div className="space-y-4">
      {(gameVersions.length > 0 || loaders.length > 0 || environment) && (
        <div className="bg-modrinth-dark border border-gray-300 dark:border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-modrinth-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Совместимость
          </h3>
          
          <div className="space-y-3">
            {gameVersions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Minecraft: Java Edition</h4>
                <CompressedGameVersionsChips
                  browseRoute={browseRoute}
                  rawVersions={gameVersions}
                  ranges={gameVersionRanges}
                />
              </div>
            )}

            {loaders.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Платформы</h4>
                <div className="flex flex-wrap gap-2">
                  {loaders.map((loaderId) => {
                    const loader = LOADERS.find(l => l.id === loaderId)
                    if (!loader) return null
                    
                    const contentTypeRoute = browseRoute
                    const filterUrl = `/${contentTypeRoute}?g=categories:${loaderId}`
                    
                    return (
                      <Link
                        key={loaderId}
                        href={filterUrl}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors group"
                        title={loader.name}
                      >
                        <div 
                          className="w-4 h-4 flex-shrink-0" 
                          style={loader.color ? { color: loader.color } : { color: 'var(--text-secondary)' }}
                        >
                          {loader.icon}
                        </div>
                        <span 
                          className="text-xs font-medium" 
                          style={loader.color ? { color: loader.color } : { color: 'var(--text-secondary)' }}
                        >
                          {loader.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {environment && (
              <div>
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Поддерживаемые окружения</h4>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg w-fit">
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v-4m0 0V9m0 4h.01" />
                  </svg>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{environment}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(resource.discord_url || resource.source_url || resource.wiki_url || resource.issues_url || (resource.donation_urls && resource.donation_urls.length > 0)) && (
        <div className="bg-modrinth-dark border border-gray-300 dark:border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Ссылки
          </h3>
          <div className="space-y-2">
            {resource.issues_url && (
              <a href={resource.issues_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-red-400 transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="group-hover:underline">Сообщить о проблеме</span>
                <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            )}
            {resource.source_url && (
              <a href={resource.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6l-6 6 6 6M16 18l6-6-6-6" />
                </svg>
                <span className="group-hover:underline">Исходный код</span>
                <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            )}
            {resource.wiki_url && (
              <a href={resource.wiki_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-orange-400 transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="group-hover:underline">Wiki</span>
                <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            )}
            {resource.discord_url && (
              <a href={resource.discord_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span className="group-hover:underline">Сервер Discord</span>
                <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            )}
            
            {resource.donation_urls && resource.donation_urls.length > 0 && (
              <>
                <hr className="border-gray-300 dark:border-gray-700 my-2" />
                {resource.donation_urls.map((donation, idx) => (
                  <a key={idx} href={donation.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-modrinth-green-light transition-colors group">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                    <span className="group-hover:underline">{translateDonationPlatform(donation.platform)}</span>
                    <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                    </svg>
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {teamMembers.length > 0 && (
        <div className="bg-modrinth-dark border border-gray-300 dark:border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Создатели
          </h3>
          <div className="space-y-2">
            {teamMembers.map((member, idx) => (
              <Link
                key={idx}
                href={`/user/${member.user.id}`}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group"
              >
                {member.user.avatar_url ? (
                  <img 
                    src={member.user.avatar_url} 
                    alt={member.user.username}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-modrinth-green to-modrinth-green-light rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {member.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium group-hover:text-modrinth-green transition-colors">{member.user.username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{translateRole(member.role)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-modrinth-dark border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Детали
        </h3>
        <div className="space-y-2 text-xs">
          {resource.license && resource.license.id && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Лицензия:</span>
              <span className="text-gray-900 dark:text-white ml-1 font-medium">{resource.license.id}</span>
            </div>
          )}
          {resource.published && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Опубликован:</span>
              <span className="text-gray-900 dark:text-white ml-1">{formatTimeAgo(resource.published)}</span>
            </div>
          )}
          {resource.updated && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Обновлён:</span>
              <span className="text-gray-900 dark:text-white ml-1">{formatTimeAgo(resource.updated)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function translateRole(role) {
  const roles = {
    'Owner': 'Владелец',
    'Developer': 'Разработчик',
    'Artist': 'Художник',
    'Maintainer': 'Поддержка',
    'Contributor': 'Участник'
  }
  return roles[role] || role
}

function translateDonationPlatform(platform) {
  const platforms = {
    'Other': 'Донат',
    'Patreon': 'Patreon',
    'Ko-fi': 'Ko-fi',
    'PayPal': 'PayPal',
    'Open Collective': 'Open Collective',
    'GitHub Sponsors': 'GitHub Sponsors',
    'Buy Me a Coffee': 'Buy Me a Coffee'
  }
  return platforms[platform] || 'Донат'
}


function resolveContentTypeRoute(contentTypeProp, projectType) {
  const typeMap = {
    'mod': 'mods',
    'mods': 'mods',
    'plugin': 'plugins',
    'plugins': 'plugins',
    'modpack': 'modpacks',
    'modpacks': 'modpacks',
    'resourcepack': 'resourcepacks',
    'resourcepacks': 'resourcepacks',
    'shader': 'shaders',
    'shaders': 'shaders',
    'datapack': 'datapacks',
    'datapacks': 'datapacks'
  }

  if (contentTypeProp && typeMap[contentTypeProp]) {
    return typeMap[contentTypeProp]
  }

  if (projectType && typeMap[projectType]) {
    return typeMap[projectType]
  }

  return 'mods'
}

function getEnvironment(clientSide, serverSide) {
  if (!clientSide && !serverSide) return null
  
  const client = clientSide === 'required' || clientSide === 'optional'
  const server = serverSide === 'required' || serverSide === 'optional'
  
  if (client && server) return 'Клиент и сервер'
  if (client) return 'Клиент'
  if (server) return 'Сервер'
  
  return null
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  const intervals = [
    { label: 'год', seconds: 31536000, plural: 'года', many: 'лет' },
    { label: 'месяц', seconds: 2592000, plural: 'месяца', many: 'месяцев' },
    { label: 'неделю', seconds: 604800, plural: 'недели', many: 'недель' },
    { label: 'день', seconds: 86400, plural: 'дня', many: 'дней' },
    { label: 'час', seconds: 3600, plural: 'часа', many: 'часов' },
    { label: 'минуту', seconds: 60, plural: 'минуты', many: 'минут' },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      const word = count === 1 ? interval.label : 
                   count < 5 ? interval.plural : 
                   interval.many
      return `${count} ${word} назад`
    }
  }
  
  return 'только что'
}

