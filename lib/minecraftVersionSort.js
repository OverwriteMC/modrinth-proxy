const RANK = Object.freeze({
  snapline: 5,
  semverExact: 4,
  semverPre: 3,
  weekly: 2,
  fuzzy: 1,
  raw: 0,
})

function parseComparableKey(versionString) {
  const s = String(versionString).trim()
  let m

  if ((m = /^(\d+)\.(\d+)-snapshot-(\d+)$/i.exec(s))) {
    return { rank: RANK.snapline, nums: [+m[1], +m[2], +m[3]], raw: null }
  }

  if ((m = /^(\d+)\.(\d+)\.(\d+)$/.exec(s))) {
    return { rank: RANK.semverExact, nums: [+m[1], +m[2], +m[3]], raw: null }
  }

  if ((m = /^(\d+)\.(\d+)$/.exec(s))) {
    return { rank: RANK.semverExact, nums: [+m[1], +m[2], 0], raw: null }
  }

  if ((m = /^(\d+)\.(\d+)\.(\d+)-(.+)$/i.exec(s))) {
    return { rank: RANK.semverPre, nums: [+m[1], +m[2], +m[3]], raw: m[4] }
  }

  if ((m = /^(\d+)\.(\d+)-(?!snapshot-\d+)/i.exec(s))) {
    return { rank: RANK.semverPre, nums: [+m[1], +m[2], 0], raw: s.slice(m[0].length) }
  }

  if ((m = /^(\d+)w(\d+)([a-z]?)$/i.exec(s))) {
    const letter = (m[3] || '`').toLowerCase()
    const ord = letter ? letter.charCodeAt(0) : 96
    return { rank: RANK.weekly, nums: [+m[1], +m[2], ord], raw: null }
  }

  const head = /^[\d.]+/.exec(s)
  const fv = parseFloat(head?.[0] ?? 'NaN')
  if (!Number.isNaN(fv)) {
    return { rank: RANK.fuzzy, nums: [fv, 0, 0], raw: null }
  }

  return { rank: RANK.raw, nums: [], raw: s }
}

export function compareMinecraftVersionsDesc(a, b) {
  const ka = parseComparableKey(a)
  const kb = parseComparableKey(b)

  if (ka.rank !== kb.rank) return kb.rank - ka.rank

  const len = Math.max(ka.nums.length, kb.nums.length)
  for (let i = 0; i < len; i++) {
    const na = ka.nums[i] ?? 0
    const nb = kb.nums[i] ?? 0
    if (na !== nb) return nb - na
  }

  if (ka.raw != null && kb.raw != null && ka.raw !== kb.raw) {
    return String(kb.raw).localeCompare(String(ka.raw), undefined, { numeric: true, sensitivity: 'base' })
  }

  return String(b).localeCompare(String(a))
}

function highestComparableTokenFromCompressedRange(range) {
  const r = String(range).trim()
  const parts = r.split(/\u2013/)
  const leaf = parts.length > 1 ? parts[parts.length - 1].trim() : r
  if (/\.x$/i.test(leaf)) {
    const base = leaf.slice(0, -2).replace(/\.$/, '')
    const segs = base.split('.').filter(Boolean)
    if (segs.length >= 2) return `${segs[0]}.${segs[1]}.999999`
    return base
  }
  return leaf
}

export function sortCompressedRangesDesc(ranges) {
  if (!ranges?.length) return []
  return [...ranges].sort((a, b) =>
    compareMinecraftVersionsDesc(
      highestComparableTokenFromCompressedRange(a),
      highestComparableTokenFromCompressedRange(b)
    )
  )
}

export function versionsForCompressedRange(range, rawVersions) {
  if (!Array.isArray(rawVersions) || rawVersions.length === 0) return []
  const uniq = [...new Set(rawVersions.map(String))]
  const r = String(range).trim()
  if (!r) return []

  const sortDesc = (arr) => [...arr].sort(compareMinecraftVersionsDesc)

  const enParts = r.split(/\u2013/)
  if (enParts.length > 1) {
    const first = enParts[0].trim()
    const last = enParts[enParts.length - 1].trim()
    const matched = uniq.filter(
      (v) =>
        compareMinecraftVersionsDesc(v, first) <= 0 &&
        compareMinecraftVersionsDesc(last, v) <= 0
    )
    return sortDesc(matched)
  }

  const xMatch = /^(\d+\.\d+)\.x$/i.exec(r)
  if (xMatch) {
    const prefix = xMatch[1]
    const matched = uniq.filter((v) => {
      const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v)
      if (!m) return false
      return `${m[1]}.${m[2]}` === prefix
    })
    return sortDesc(matched)
  }

  const twoSeg = /^(\d+\.\d+)$/.exec(r)
  if (twoSeg) {
    const p = twoSeg[1]
    const matched = uniq.filter((v) => v === p || v.startsWith(`${p}.`))
    return sortDesc(matched)
  }

  return uniq.includes(r) ? [r] : []
}

export function facetMcVersionQuery(range, rawVersions) {
  if (!Array.isArray(rawVersions) || rawVersions.length === 0) return null
  const sorted = [...rawVersions].sort(compareMinecraftVersionsDesc)
  const r = String(range).trim()

  if (sorted.includes(r)) return r

  const enParts = r.split(/\u2013/)
  if (enParts.length > 1) {
    const hi = enParts[enParts.length - 1].trim()
    if (sorted.includes(hi)) return hi
    const nested = facetMcVersionQuery(hi, sorted)
    if (nested) return nested
  }

  const xMatch = /^(\d+\.\d+)\.x$/i.exec(r)
  if (xMatch) {
    const prefix = xMatch[1]
    const pick = sorted.find((v) => {
      const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v)
      if (!m) return false
      return `${m[1]}.${m[2]}` === prefix
    })
    return pick ?? null
  }

  const twoSeg = /^(\d+\.\d+)$/.exec(r)
  if (twoSeg) {
    const p = twoSeg[1]
    return sorted.find((v) => v.startsWith(`${p}.`)) ?? null
  }

  return null
}
