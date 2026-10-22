export const REPORT_ORIGIN =
  'https://github.com/Chichimokers/cuban-cards-components'

export const BANK_THEMES = {
  'Banco de Crédito y Comercio': 'bandec',
  'Banco Popular de Ahorro': 'bpa',
  'Banco Metropolitano': 'metropolitano',
  'Financiera CIMEX S.A.': 'clasica',
  'Banco Internacional de Comercio S.A.': 'bicsa',
}

export const BANK_COLORS = {
  'Banco de Crédito y Comercio': ['#c01430', '#8f0f1c'],
  'Banco Popular de Ahorro': ['#00594f', '#0b5563'],
  'Banco Metropolitano': ['#86b52a', '#6f9c1f'],
  'Financiera CIMEX S.A.': ['#c99a2e', '#8a6414'],
  'Banco Internacional de Comercio S.A.': ['#0891b2', '#155e75'],
}

export const PRODUCT_COLORS = {
  Clásica: ['#c99a2e', '#8a6414'],
}

export const DEFAULT_COLORS = ['#0071e3', '#42a5f5']

export const TILE_COLORS = {
  net: '#0071e3',
  prod: '#8944ab',
  cur: '#1a7f37',
  bank: '#54608a',
  dig: '#8e8e93',
  shield: '#1a7f37',
  check: '#54608a',
}

export function getCardLength(catalog) {
  const length = Number(catalog?.card_length)
  return Number.isFinite(length) && length > 0 ? length : 16
}

export function normalizeNumber(raw, validators) {
  const source = String(raw ?? '')
  const strip = validators?.normalize?.strip_pattern
  let digits = source

  if (strip) {
    try {
      digits = source.replace(new RegExp(strip, 'g'), '')
    } catch {
      digits = source
    }
  }

  return digits.replace(/\D/g, '')
}

export function formatCardNumber(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits.replace(/(.{4})(?=.)/g, '$1 ').trim()
}

export function formatDisplayNumber(value, length = 16) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, length)
  if (!digits) return '•••• •••• •••• ••••'
  const padded = digits.padEnd(length, '•')
  return padded.match(/.{1,4}/g)?.join(' ') || ''
}

export function luhn(number) {
  const digits = String(number ?? '').replace(/\D/g, '')
  let sum = 0
  let double = false

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }

  return digits.length > 0 && sum % 10 === 0
}

function safePatternTest(pattern, number) {
  if (!pattern) return null
  try {
    return new RegExp(pattern).test(number)
  } catch {
    return null
  }
}

function issuerMapFrom(catalog, issuersById) {
  if (issuersById) return issuersById
  return Object.fromEntries(
    (catalog?.issuers || []).map((issuer) => [issuer.id, issuer]),
  )
}

function resolveBanks(entry, variant, issuerByCode, issuersById) {
  const ids = variant?.issuers?.length
    ? variant.issuers
    : entry?.issuers?.length
      ? entry.issuers
      : []

  let banks = ids.map((id) => issuersById[id]).filter(Boolean)

  if (
    issuerByCode &&
    (banks.length === 0 || banks.some((bank) => bank.id === issuerByCode.id))
  ) {
    banks = [issuerByCode]
  }

  const seen = new Set()
  return banks.filter((bank) => {
    if (seen.has(bank.id)) return false
    seen.add(bank.id)
    return true
  })
}

export function getCardTheme(analysis) {
  if (!analysis) return 'default'
  if ((analysis.aliases || []).includes('Tropical')) return 'tropical'
  if (String(analysis.product || '').startsWith('Clásica')) return 'clasica'

  for (const bank of analysis.banks || []) {
    const theme = BANK_THEMES[bank.name]
    if (theme) return theme
  }

  return 'default'
}

export function getCardColors(analysis) {
  const bank = analysis?.banks?.[0]
  if (bank && BANK_COLORS[bank.name]) return BANK_COLORS[bank.name]

  const product = analysis?.product
  if (product && PRODUCT_COLORS[product]) return PRODUCT_COLORS[product]
  if (String(product || '').startsWith('Clásica')) return PRODUCT_COLORS.Clásica

  return DEFAULT_COLORS
}

export function makeExampleNumber(entry, issuersById) {
  const firstIssuer = entry?.issuers?.[0]
    ? issuersById?.[entry.issuers[0]]
    : null
  const code =
    firstIssuer?.code && String(firstIssuer.code).length === 4
      ? String(firstIssuer.code)
      : '0000'

  const base = `${entry?.prefix || '9200'}${code}`
    .padEnd(15, '0')
    .slice(0, 15)

  for (let digit = 0; digit <= 9; digit += 1) {
    if (luhn(`${base}${digit}`)) return `${base}${digit}`
  }

  return `${base}0`
}

export function buildSummary(analysis) {
  if (!analysis) return { items: [], checks: [] }

  const items = []
  if (analysis.network) {
    items.push({ key: 'network', label: 'Red', value: analysis.network })
  }
  if (analysis.product) {
    items.push({ key: 'product', label: 'Producto', value: analysis.product })
  }
  if (analysis.currency) {
    items.push({
      key: 'currency',
      label: 'Moneda',
      value: `${analysis.currency}${analysis.mlc ? ' · MLC' : ''}`,
    })
  }
  if (analysis.banks?.length) {
    items.push({
      key: 'bank',
      label: 'Banco',
      value: analysis.banks.map((bank) => bank.name).join(', '),
    })
  }

  const checks = []
  if (analysis.luhn != null) {
    checks.push({
      key: 'luhn',
      label: analysis.luhn ? 'Luhn válido' : 'Luhn no válido',
      tone: analysis.luhn ? 'ok' : 'bad',
    })
  }
  if (analysis.validPattern != null) {
    checks.push({
      key: 'pattern',
      label: analysis.validPattern ? 'Patrón coincide' : 'Patrón no coincide',
      tone: analysis.validPattern ? 'ok' : 'bad',
    })
  }

  return { items, checks }
}

export function buildExamples(catalog, issuersById, limit = 6) {
  const seen = new Set()

  return (catalog?.prefixes || [])
    .filter((entry) => {
      if (!entry.product || seen.has(entry.product)) return false
      seen.add(entry.product)
      return true
    })
    .slice(0, limit)
    .map((entry) => {
      const firstIssuer = entry.issuers?.[0]
        ? issuersById?.[entry.issuers[0]]
        : null
      const colors =
        (firstIssuer && BANK_COLORS[firstIssuer.name]) ||
        (String(entry.product || '').startsWith('Clásica')
          ? PRODUCT_COLORS.Clásica
          : DEFAULT_COLORS)

      return {
        label: `${entry.product} · ${entry.currency || '—'}`,
        value: makeExampleNumber(entry, issuersById),
        prefix: entry.prefix,
        color: colors[0],
      }
    })
}

function buildIssueUrl(title, body) {
  return `https://github.com/qvapay/cuban_cards_prefixes/issues/new?title=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(body)}`
}

function buildWarning(analysis, issuersById) {
  const { entry, n, issuerByCode } = analysis
  if (!entry || !issuerByCode || entry.network !== 'RED') {
    if (!entry && n.length === analysis.cardLength) {
      const prefix = n.slice(0, 4)
      const first8 = `${n.slice(0, 4)} ${n.slice(4, 8)}`
      const title = `[dato] Prefijo ${prefix} no está en el catálogo`
      const body = `## Qué pasa

Una tarjeta con los dígitos **${first8}** no se identifica en el componente: el prefijo \`${prefix}\` no aparece en \`prefixes.json\`.

## Fuente

Tarjeta real del titular que lo reporta. Se comparten solo los 8 primeros dígitos; el resto del número nunca sale del navegador.

Reportado desde Cuban Cards Components: ${REPORT_ORIGIN}`

      return {
        type: 'unknown',
        title: 'Este prefijo no está en el catálogo',
        text: 'Si tu tarjeta es cubana y real, falta el dato en el catálogo. Repórtala para añadirla.',
        url: buildIssueUrl(title, body),
      }
    }

    return null
  }

  const listedIds = entry.issuers || []
  if (listedIds.includes(issuerByCode.id)) return null

  const prefix = n.slice(0, 4)
  const first8 = `${n.slice(0, 4)} ${n.slice(4, 8)}`
  const product = entry.product || 'sin producto confirmado'
  const currency = entry.currency || '—'

  if (!listedIds.length) {
    const title = `[dato] Prefijo ${prefix}: asignar ${issuerByCode.name} (código emisor ${issuerByCode.code})`
    const body = `## Qué pasa

Una tarjeta con los dígitos **${first8}** usa el prefijo \`${prefix}\`, que no tiene un banco asignado en \`prefixes.json\`. El código emisor (dígitos 5-8) es **${issuerByCode.code}**, que corresponde a **${issuerByCode.name}**.

## Dato propuesto

Añadir \`${issuerByCode.id}\` a los emisores del prefijo \`${prefix}\` (${product}, ${currency}).

## Fuente

Tarjeta real del titular que lo reporta. Se comparten solo los 8 primeros dígitos; el resto del número nunca sale del navegador.

Reportado desde Cuban Cards Components: ${REPORT_ORIGIN}`

    return {
      type: 'unassigned',
      title: 'El catálogo aún no asigna banco a este prefijo',
      text: `El prefijo ${prefix} no lista un banco, pero el código emisor ${issuerByCode.code} (dígitos 5 al 8) es de ${issuerByCode.name}. Puede faltar el dato.`,
      url: buildIssueUrl(title, body),
    }
  }

  const listed = listedIds
    .map((id) => issuersById[id]?.name || id)
    .join(' y ')
  const title = `[dato] Prefijo ${prefix}: falta ${issuerByCode.name} (código emisor ${issuerByCode.code})`

  const body = `## Qué pasa

Una tarjeta con los dígitos **${first8}** se identifica en el componente como ${listed}, porque el prefijo \`${prefix}\` solo lista ese emisor en el catálogo. Pero el código emisor (dígitos 5-8) es **${issuerByCode.code}**, que corresponde a **${issuerByCode.name}**: la tarjeta es de ese banco.

## Dato propuesto

Añadir \`${issuerByCode.id}\` a los emisores del prefijo \`${prefix}\` (${product}, ${currency}).

## Fuente

Tarjeta real del titular que lo reporta. Se comparten solo los 8 primeros dígitos; el resto del número nunca sale del navegador.

Reportado desde Cuban Cards Components: ${REPORT_ORIGIN}`

  return {
    type: 'mismatch',
    title: '¿Tu tarjeta no es de este banco?',
    text: `El catálogo lista el prefijo ${prefix} solo con ${listed}, pero el código emisor ${issuerByCode.code} (dígitos 5 al 8) es de ${issuerByCode.name}. Puede ser un dato incompleto del catálogo.`,
    url: buildIssueUrl(title, body),
  }
}

/**
 * Analiza un número de tarjeta usando el catálogo y los validadores cargados.
 *
 * @param {string} raw
 * @param {object} catalog
 * @param {object} validators
 * @param {Record<string, object>} [issuersById]
 */
export function analyzeCard(raw, catalog, validators, issuersById) {
  const cardLength = getCardLength(catalog)
  const n = normalizeNumber(raw, validators)
  const prefix = n.slice(0, 4)
  const entry = (catalog?.prefixes || []).find((item) => item.prefix === prefix) || null
  const variant =
    entry?.variants?.find((item) => n.startsWith(item.prefix)) || null
  const issuerByCode =
    n.length >= 8
      ? (catalog?.issuers || []).find(
          (issuer) => issuer.code && issuer.code === n.slice(4, 8),
        ) || null
      : null
  const issuers = issuerMapFrom(catalog, issuersById)
  const banks = resolveBanks(entry, variant, issuerByCode, issuers)

  const analysis = {
    raw: String(raw ?? ''),
    n,
    prefix,
    entry,
    variant,
    cardLength,
    network:
      entry?.network ||
      (n.length >= 2
        ? n.startsWith('92')
          ? 'RED'
          : n.startsWith('97')
            ? 'AIS'
            : null
        : null),
    currency: entry?.currency || null,
    mlc: Boolean(entry?.mlc_backed),
    product: variant?.product || entry?.product || null,
    aliases: variant?.aliases || entry?.aliases || [],
    notes: variant?.notes || entry?.notes || null,
    sources: variant?.sources || entry?.sources || [],
    banks,
    bank: banks[0] || null,
    issuerCode: n.length >= 8 ? n.slice(4, 8) : null,
    issuerByCode,
    isComplete: n.length === cardLength,
    luhn: n.length === cardLength ? luhn(n) : null,
    validPattern:
      n.length === cardLength
        ? safePatternTest(validators?.patterns?.any, n)
        : null,
    displayNumber: formatDisplayNumber(n, cardLength),
    formattedNumber: formatCardNumber(n),
  }

  analysis.theme = getCardTheme(analysis)
  analysis.colors = getCardColors(analysis)
  analysis.warning = buildWarning(analysis, issuers)

  return analysis
}
