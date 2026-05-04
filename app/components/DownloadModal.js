'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { compareMinecraftVersionsDesc } from '@/lib/minecraftVersionSort'

export default function DownloadModal({ mod, versions, contentType = 'mods' }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true)
    }
    window.addEventListener('open-download-modal', handleOpenModal)
    return () => {
      window.removeEventListener('open-download-modal', handleOpenModal)
    }
  }, [])
  const [selectedMcVersion, setSelectedMcVersion] = useState('')
  const [selectedLoader, setSelectedLoader] = useState('')
  const [versionSearch, setVersionSearch] = useState('')
  const [showAllVersions, setShowAllVersions] = useState(false)

  const isReleaseVersion = (version) => {
    return /^\d+\.\d+(\.\d+)?$/.test(version)
  }

  const mcVersions = useMemo(() => {
    const versionsSet = new Set()
    versions.forEach(version => {
      version.game_versions.forEach(v => versionsSet.add(v))
    })
    const allVersions = Array.from(versionsSet).sort(compareMinecraftVersionsDesc)
    
    if (showAllVersions) {
      return allVersions
    }
    return allVersions.filter(v => isReleaseVersion(v))
  }, [versions, showAllVersions])

  const loaders = useMemo(() => {
    if (!selectedMcVersion) return []
    const loadersSet = new Set()
    versions.forEach(version => {
      if (version.game_versions.includes(selectedMcVersion)) {
        version.loaders.forEach(l => loadersSet.add(l))
      }
    })
    return Array.from(loadersSet)
  }, [versions, selectedMcVersion])

  const filteredMcVersions = useMemo(() => {
    if (!versionSearch) return mcVersions
    return mcVersions.filter(v => v.toLowerCase().includes(versionSearch.toLowerCase()))
  }, [mcVersions, versionSearch])

  const matchingVersion = useMemo(() => {
    if (!selectedMcVersion || !selectedLoader) return null
    
    const filtered = versions.filter(version => {
      const mcMatch = version.game_versions.includes(selectedMcVersion)
      const loaderMatch = version.loaders.includes(selectedLoader)
      return mcMatch && loaderMatch
    })
    
    return filtered[0] || null
  }, [versions, selectedMcVersion, selectedLoader])

  const getLoaderName = (loader) => {
    const names = {
      'fabric': 'Fabric',
      'forge': 'Forge',
      'neoforge': 'NeoForge',
      'quilt': 'Quilt',
      'bukkit': 'Bukkit',
      'paper': 'Paper',
      'spigot': 'Spigot',
      'purpur': 'Purpur',
      'folia': 'Folia',
      'sponge': 'Sponge',
      'bungeecord': 'BungeeCord',
      'velocity': 'Velocity',
      'waterfall': 'Waterfall',
      'iris': 'Iris',
      'optifine': 'OptiFine',
      'canvas': 'Canvas',
      'vanilla': 'Vanilla',
    }
    return names[loader] || loader
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        data-download-modal
        className="modrinth-download-button w-full lg:w-auto text-base"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Скачать</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-modrinth-dark rounded-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-fade-in-up transform"
            style={{ maxWidth: '550px', animationDelay: '0ms' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-modrinth-darker p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {mod.icon_url && (
                  <img src={mod.icon_url} alt={mod.title} className="w-10 h-10 rounded-lg" />
                )}
                <div>
                  <h2 className="text-lg font-bold">{mod.title}</h2>
                  <p className="text-xs text-gray-400">Скачать {mod.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-300">Выберите версию игры</h3>
                  
                  {selectedMcVersion ? (
                    <button
                      onClick={() => {
                        setSelectedMcVersion('')
                        setSelectedLoader('')
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-500"
                      title="Отменить"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAllVersions(!showAllVersions)}
                      className="text-xs text-modrinth-green hover:text-modrinth-green-light transition-colors"
                    >
                      {showAllVersions ? 'Только релизы' : 'Показать все'}
                    </button>
                  )}
                </div>
                
                {selectedMcVersion ? (
                  <div className="mb-2 px-3 py-2 bg-modrinth-green/20 border border-modrinth-green/50 rounded-lg text-sm text-modrinth-green font-medium">
                    {selectedMcVersion}
                  </div>
                ) : (
                  <>
                    <div className="relative mb-2">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Поиск версий игры..."
                        value={versionSearch}
                        onChange={(e) => setVersionSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar bg-gray-800/30 rounded-lg p-2">
                      {filteredMcVersions.map(version => (
                        <button
                          key={version}
                          onClick={() => {
                            setSelectedMcVersion(version)
                            setSelectedLoader('')
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedMcVersion === version
                              ? 'bg-modrinth-green text-black'
                              : 'text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          {version}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {loaders.length > 0 && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-300">Выберите загрузчик</h3>
                    
                    {selectedLoader && (
                      <button
                        onClick={() => setSelectedLoader('')}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-500"
                        title="Отменить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {selectedLoader ? (
                    <div className="mb-2 px-3 py-2 bg-modrinth-green/20 border border-modrinth-green/50 rounded-lg text-sm text-modrinth-green font-medium">
                      {getLoaderName(selectedLoader)}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {loaders.map((loader, i) => (
                        <button
                          key={loader}
                          onClick={() => setSelectedLoader(loader)}
                          disabled={!selectedMcVersion}
                          style={{ animationDelay: `${i * 50}ms` }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all animate-fade-in-up ${
                            !selectedMcVersion
                              ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                              : selectedLoader === loader
                                ? 'bg-modrinth-green text-black'
                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          {getLoaderName(loader)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {matchingVersion && matchingVersion.files && matchingVersion.files.length > 0 && (
                <div className="bg-gray-800/30 rounded-xl p-4 space-y-3 animate-fade-in-up">
                  <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="w-10 h-10 bg-modrinth-green rounded-lg flex items-center justify-center text-black font-bold flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
                      R
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{matchingVersion.version_number}</p>
                      <p className="font-semibold text-sm">{matchingVersion.name}</p>
                    </div>
                  </div>
                  
                  <a
                    href={matchingVersion.files[0].url}
                    download
                    className="modrinth-download-button w-full animate-fade-in-up"
                    style={{ animationDelay: '200ms' }}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Скачать {(matchingVersion.files[0].size / 1024).toFixed(0)} KB</span>
                  </a>
                </div>
              )}

              <div className="text-center pt-2 border-t border-gray-800/50 mt-4">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    window.location.href = `/${contentType.replace(/s$/, '')}/${mod.slug}/versions`
                  }}
                  className="text-sm text-modrinth-green hover:text-modrinth-green-light transition-all duration-300 inline-flex items-center gap-1 hover:gap-2 mt-3"
                >
                  <span>Посмотреть все версии</span>
                  <svg className="w-4 h-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


