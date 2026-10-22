export const DEFAULT_CDN_BASE =
  'https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main/'

export const DEFAULT_FALLBACK_BASE =
  'https://raw.githubusercontent.com/qvapay/cuban_cards_prefixes/main/'

const catalogCache = new Map()

async function fetchJson(url, fetchImpl) {
  const response = await fetchImpl(url, { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url} (HTTP ${response.status})`)
  }
  return response.json()
}

function normalizeBase(base) {
  if (!base) return null
  return base.endsWith('/') ? base : `${base}/`
}

/**
 * Carga prefixes.json y validators.json desde el CDN de la librería.
 * Si el CDN falla, intenta con el fallback (raw.githubusercontent.com por defecto).
 *
 * @param {object} [options]
 * @param {string} [options.cdnBase]
 * @param {string|null} [options.fallbackBase]
 * @param {typeof fetch} [options.fetchImpl]
 * @param {boolean} [options.cache]
 */
export async function loadCatalog(options = {}) {
  const {
    cdnBase = DEFAULT_CDN_BASE,
    fallbackBase = DEFAULT_FALLBACK_BASE,
    fetchImpl = globalThis.fetch,
    cache = true,
  } = options

  if (typeof fetchImpl !== 'function') {
    throw new Error('Este entorno no tiene fetch disponible.')
  }

  const bases = [normalizeBase(cdnBase), normalizeBase(fallbackBase)].filter(
    (base, index, list) => base && list.indexOf(base) === index,
  )

  let lastError = null

  for (const base of bases) {
    const cacheKey = `${base}|${fetchImpl === globalThis.fetch ? 'global' : 'custom'}`
    if (cache && catalogCache.has(cacheKey)) {
      return catalogCache.get(cacheKey)
    }

    const request = Promise.all([
      fetchJson(`${base}prefixes.json`, fetchImpl),
      fetchJson(`${base}validators.json`, fetchImpl),
    ]).then(([catalog, validators]) => {
      if (!catalog || !Array.isArray(catalog.prefixes)) {
        throw new Error('prefixes.json no tiene el formato esperado.')
      }
      if (!validators || !validators.patterns || !validators.normalize) {
        throw new Error('validators.json no tiene el formato esperado.')
      }

      const issuersById = Object.fromEntries(
        (catalog.issuers || []).map((issuer) => [issuer.id, issuer]),
      )

      return {
        catalog,
        validators,
        issuersById,
        source: base,
        version: catalog.version || null,
      }
    })

    if (cache) catalogCache.set(cacheKey, request)

    try {
      return await request
    } catch (error) {
      if (cache) catalogCache.delete(cacheKey)
      lastError = error
    }
  }

  throw lastError || new Error('No se pudo cargar el catálogo.')
}

export function clearCatalogCache() {
  catalogCache.clear()
}
