export function versionChannelLetterRingClass(versionType) {
  if (versionType === 'release') {
    return 'bg-version-release-bg text-version-release-fg'
  }
  if (versionType === 'beta') {
    return 'bg-version-beta-bg text-version-beta-fg'
  }
  return 'bg-red-900 text-red-300'
}
