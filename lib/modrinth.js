const MODRINTH_API = 'https://api.modrinth.com/v3';

function mapFacetStringForSearchApi(facet) {
  if (typeof facet !== 'string') return facet
  if (facet.startsWith('project_type:')) {
    return 'project_types:' + facet.slice('project_type:'.length)
  }
  if (facet.startsWith('versions:')) {
    return 'game_versions:' + facet.slice('versions:'.length)
  }
  return facet
}

function mapFacetsForSearchApi(facets) {
  return facets.map((group) =>
    Array.isArray(group) ? group.map(mapFacetStringForSearchApi) : group,
  )
}

function coerceSideValue(side) {
  if (side == null) return undefined
  if (Array.isArray(side)) return side[0]
  return side
}

const ENV_SIDES = {
  client_only: { client_side: 'required', server_side: 'unsupported' },
  server_only: { client_side: 'unsupported', server_side: 'required' },
  dedicated_server_only: { client_side: 'unsupported', server_side: 'required' },
  client_and_server: { client_side: 'required', server_side: 'required' },
}

function environmentToSides(env) {
  const key = String(coerceSideValue(env) ?? '').toLowerCase().replace(/\s+/g, '_')
  return ENV_SIDES[key] ?? {}
}

function normalizeGalleryImages(gallery) {
  if (!Array.isArray(gallery)) return gallery
  return gallery.map((entry) =>
    typeof entry === 'string' ? { url: entry, raw_url: entry } : entry,
  )
}

function normalizeSearchHit(hit) {
  if (!hit || typeof hit !== 'object') return hit
  const sides = environmentToSides(hit.environment)
  const orgForFilter =
    typeof hit.organization_id === 'string'
      ? hit.organization_id
      : hit.organization
  return {
    ...hit,
    gallery: normalizeGalleryImages(hit.gallery),
    project_id: hit.project_id ?? hit.id,
    title: hit.title ?? hit.name,
    description: hit.summary ?? hit.description ?? '',
    project_type:
      hit.project_type ??
      (Array.isArray(hit.project_types) ? hit.project_types[0] : undefined),
    organization: orgForFilter,
    client_side: coerceSideValue(hit.client_side) ?? sides.client_side,
    server_side: coerceSideValue(hit.server_side) ?? sides.server_side,
    follows: hit.follows ?? hit.followers,
    date_modified: hit.date_modified ?? hit.updated ?? hit.date_created,
  }
}

function normalizeSearchResponse(payload) {
  if (!payload || !Array.isArray(payload.hits)) return payload
  return {
    ...payload,
    hits: payload.hits.map(normalizeSearchHit),
  }
}

export function normalizeProject(project) {
  if (!project || typeof project !== 'object') return project
  const hasV2Body = project.body != null && project.body !== ''
  const envSides = environmentToSides(project.environment)
  const primaryType =
    project.project_type ??
    (Array.isArray(project.project_types) ? project.project_types[0] : undefined)
  return {
    ...project,
    gallery: normalizeGalleryImages(project.gallery),
    title: project.title ?? project.name,
    body: hasV2Body ? project.body : (project.description ?? ''),
    description: hasV2Body
      ? (project.description ?? '')
      : (project.summary ?? ''),
    project_type: primaryType,
    client_side:
      coerceSideValue(project.client_side) ?? envSides.client_side,
    server_side:
      coerceSideValue(project.server_side) ?? envSides.server_side,
    follows: project.follows ?? project.followers,
    date_modified:
      project.date_modified ?? project.updated ?? project.published,
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function searchMods({ query = '', facets = [], limit = 20, offset = 0, index }) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (query) {
    params.append('query', query);
  }

  if (facets.length > 0) {
    params.append('facets', JSON.stringify(mapFacetsForSearchApi(facets)));
  }

  if (index && index !== 'relevance') {
    params.append('index', index);
  }

  const url = `${MODRINTH_API}/search?${params}`
  const maxRetries = 3;
  const retryDelays = [500, 1000, 2000];
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ModrinthProxyExample/1.0',
        },
        next: { revalidate: 10800 },
      });

      if (!response.ok) {
        throw new Error(`Modrinth API error: ${response.status}`);
      }

      return normalizeSearchResponse(await response.json());
    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Modrinth API fetch error after retries:', error);
        throw error;
      }
      
      console.warn(`Modrinth API fetch attempt ${attempt + 1} failed, retrying...`, error.message);
      await sleep(retryDelays[attempt] || 2000);
    }
  }
}

export async function getMod(slugOrId) {
  const url = `${MODRINTH_API}/project/${slugOrId}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ModrinthProxyExample/1.0',
      },
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error(`Mod not found: ${response.status}`);
    }

    return normalizeProject(await response.json());
  } catch (error) {
    const retryResponse = await fetch(url, {
      headers: {
        'User-Agent': 'ModrinthProxyExample/1.0',
      },
      next: { revalidate: 43200 },
    });

    if (!retryResponse.ok) {
      throw new Error(`Mod not found: ${retryResponse.status}`);
    }

    return normalizeProject(await retryResponse.json());
  }
}

export async function getModVersions(slugOrId) {
  const url = `${MODRINTH_API}/project/${slugOrId}/version`
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ModrinthProxyExample/1.0',
      },
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      throw new Error(`Versions not found: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    const retryResponse = await fetch(url, {
      headers: {
        'User-Agent': 'ModrinthProxyExample/1.0',
      },
      next: { revalidate: 21600 },
    });

    if (!retryResponse.ok) {
      throw new Error(`Versions not found: ${retryResponse.status}`);
    }

    return retryResponse.json();
  }
}

export async function getCategories() {
  const response = await fetch(`${MODRINTH_API}/tag/category`, {
    headers: {
      'User-Agent': 'ModrinthProxyExample/1.0',
    },
    next: { revalidate: 604800 },
  });

  if (!response.ok) {
    throw new Error(`Categories not found: ${response.status}`);
  }

  return response.json();
}

function normalizeGameVersionTagRows(rows) {
  if (!Array.isArray(rows)) return rows
  return rows.map((row) => ({
    version: row.value ?? row.version,
    version_type: row.type ?? row.version_type,
    date: row.created ?? row.date,
    major: Boolean(row.major),
  }))
}

export async function getMinecraftVersions() {
  const url = `${MODRINTH_API}/loader_field?loader_field=game_versions`
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ModrinthProxyExample/1.0',
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Minecraft versions not found: ${response.status}`);
  }

  const data = await response.json()
  return normalizeGameVersionTagRows(data)
}

export async function getTeamMembers(projectId) {
  const url = `${MODRINTH_API}/project/${projectId}/members`
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ModrinthProxyExample/1.0',
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    return [];
  }
}

export function formatDownloads(downloads) {
  if (!downloads && downloads !== 0) return '0';
  if (downloads >= 1000000) {
    return `${(downloads / 1000000).toFixed(1)}M`;
  }
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}K`;
  }
  return downloads.toString();
}

export function formatDownloadsExactRu(downloads) {
  const n = downloads == null || downloads === '' ? NaN : Number(downloads)
  const v = Number.isFinite(n) ? Math.floor(n) : 0
  return new Intl.NumberFormat('ru-RU').format(Math.max(0, v))
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatVersionEnvironment(environment) {
  if (environment == null || environment === '') return '—'
  const key = String(environment).toLowerCase().replace(/\s+/g, '_')
  const labels = {
    unknown: 'Неизвестно',
    dedicated_server_only: 'Только выделенные серверы',
    client_only: 'Клиент',
    server_only: 'Сервер',
    client_and_server: 'Клиент и сервер',
  }
  if (labels[key]) return labels[key]
  return key.replace(/_/g, ' ')
}

export async function getVersion(versionId) {
  const response = await fetch(`${MODRINTH_API}/version/${versionId}`, {
    headers: {
      'User-Agent': 'ModrinthProxyExample/1.0',
    },
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`Version not found: ${response.status}`);
  }

  return response.json();
}

export async function getUser(userId) {
  const response = await fetch(`${MODRINTH_API}/user/${userId}`, {
    headers: {
      'User-Agent': 'ModrinthProxyExample/1.0',
    },
    next: { revalidate: 43200 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KiB', 'MiB', 'GiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export function compressVersionRanges(versions) {
  if (!versions || versions.length === 0) return [];
  if (versions.length === 1) return [versions[0]];

  const sortedVersions = [...versions].sort((a, b) => {
    const aParts = a.split('.').map(n => parseInt(n) || 0);
    const bParts = b.split('.').map(n => parseInt(n) || 0);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const diff = (aParts[i] || 0) - (bParts[i] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  });

  const getMajorMinor = (version) => {
    const parts = version.split('.');
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[1]}`;
    }
    return version;
  };

  const isConsecutive = (v1, v2) => {
    const p1 = v1.split('.').map(n => parseInt(n) || 0);
    const p2 = v2.split('.').map(n => parseInt(n) || 0);
    
    if (p1[0] !== p2[0] || p1[1] !== p2[1]) return false;
    
    const patch1 = p1[2] || 0;
    const patch2 = p2[2] || 0;
    
    return patch2 === patch1 + 1;
  };

  const groups = [];
  let currentGroup = [sortedVersions[0]];
  let currentMajorMinor = getMajorMinor(sortedVersions[0]);
  
  for (let i = 1; i < sortedVersions.length; i++) {
    const versionMajorMinor = getMajorMinor(sortedVersions[i]);
    
    if (versionMajorMinor === currentMajorMinor) {
      currentGroup.push(sortedVersions[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sortedVersions[i]];
      currentMajorMinor = versionMajorMinor;
    }
  }
  groups.push(currentGroup);

  return groups.map(group => {
    if (group.length === 1) {
      return group[0];
    }
    
    const majorMinor = getMajorMinor(group[0]);
    const isAllConsecutive = group.every((v, i) => {
      if (i === 0) return true;
      return isConsecutive(group[i - 1], v);
    });
    
    if (isAllConsecutive && group.length > 2) {
      const firstParts = group[0].split('.').map(n => parseInt(n) || 0);
      const lastParts = group[group.length - 1].split('.').map(n => parseInt(n) || 0);
      
      if (firstParts[0] === lastParts[0] && firstParts[1] === lastParts[1]) {
        const firstPatch = firstParts[2] || 0;
        const lastPatch = lastParts[2] || 0;
        const expectedCount = lastPatch - firstPatch + 1;
        
        if (group.length === expectedCount && firstPatch <= 1) {
          return `${majorMinor}.x`;
        }
      }
    }
    
    const first = group[0];
    const last = group[group.length - 1];
    return `${first}–${last}`;
  });
}

export function groupVersionsByMajor(versions) {
  if (!versions || versions.length === 0) return [];
  
  const snapshotVersions = [];
  const majorVersionGroups = new Map();
  
  versions.forEach(version => {
    const isSnapshot = /^\d+w\d+[a-z]/.test(version);
    
    if (isSnapshot) {
      snapshotVersions.push(version);
    } else {
      const match = version.match(/^(\d+\.\d+)/);
      if (match) {
        const major = match[1];
        if (!majorVersionGroups.has(major)) {
          majorVersionGroups.set(major, []);
        }
        majorVersionGroups.get(major).push(version);
      } else {
        snapshotVersions.push(version);
      }
    }
  });
  
  const result = [];
  
  const sortedSnapshots = snapshotVersions.sort((a, b) => {
    const aMatch = a.match(/^(\d+)w(\d+)/);
    const bMatch = b.match(/^(\d+)w(\d+)/);
    if (aMatch && bMatch) {
      const aYear = parseInt(aMatch[1]);
      const bYear = parseInt(bMatch[1]);
      if (aYear !== bYear) return bYear - aYear;
      return parseInt(bMatch[2]) - parseInt(aMatch[2]);
    }
    return b.localeCompare(a);
  });
  
  if (sortedSnapshots.length > 0) {
    result.push(sortedSnapshots[0]);
  }
  
  const sortedMajors = Array.from(majorVersionGroups.keys()).sort((a, b) => {
    const aParts = a.split('.').map(n => parseInt(n));
    const bParts = b.split('.').map(n => parseInt(n));
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const diff = (bParts[i] || 0) - (aParts[i] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  });
  
  sortedMajors.forEach(major => {
    result.push(`${major}.x`);
  });
  
  return result;
}

