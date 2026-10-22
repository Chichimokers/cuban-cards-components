<script setup>
import { computed, ref, useId, watch } from 'vue'
import {
  REPORT_ORIGIN,
  TILE_COLORS,
  analyzeCard,
  buildExamples,
  formatCardNumber,
  getCardLength,
  getIcon,
} from '@cuban-cards/core'
import CardVisual from './CardVisual.vue'
import Warning from './Warning.vue'
import { useCubanCatalog } from './useCubanCatalog.js'
import { useTheme } from './useTheme.js'

const props = defineProps({
  cdnBase: { type: String, default: undefined },
  fallbackBase: { type: String, default: undefined },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: '' },
  theme: { type: String, default: 'dark' },
  showThemeToggle: { type: Boolean, default: true },
  showExamples: { type: Boolean, default: true },
  showBranding: { type: Boolean, default: true },
  inputId: { type: String, default: undefined },
  style: { type: [String, Object, Array], default: undefined },
})

const emit = defineEmits(['update:modelValue', 'change', 'result'])

const generatedId = useId()
const inputId = computed(
  () => props.inputId || `ccc-card-${generatedId.replace(/:/g, '')}`,
)

const { catalog, validators, issuersById, version, loading, error, reload } =
  useCubanCatalog(() => ({
    cdnBase: props.cdnBase,
    fallbackBase: props.fallbackBase,
    enabled: true,
  }))

const internalValue = ref(formatCardNumber(props.defaultValue))
const { resolvedTheme, toggleTheme } = useTheme(() => props.theme)

const value = computed(() =>
  props.modelValue !== undefined
    ? formatCardNumber(props.modelValue)
    : internalValue.value,
)

const cardLength = computed(() => getCardLength(catalog.value))

const analysis = computed(() => {
  if (!catalog.value || !validators.value) return null
  return analyzeCard(
    value.value,
    catalog.value,
    validators.value,
    issuersById.value,
  )
})

const examples = computed(() =>
  catalog.value ? buildExamples(catalog.value, issuersById.value) : [],
)

const colors = computed(() => analysis.value?.colors || ['#0071e3', '#42a5f5'])
const maxLength = computed(
  () => cardLength.value + Math.floor((cardLength.value - 1) / 4),
)
const versionLabel = computed(() => {
  if (loading.value) return 'cargando…'
  if (error.value) return 'sin conexión'
  if (catalog.value) {
    return `v${version.value || '—'} · ${catalog.value.prefixes.length} prefijos`
  }
  return 'sin datos'
})
const rootStyle = computed(() => ({
  '--ccc-a1': colors.value[0],
  '--ccc-a2': colors.value[1],
}))
const segments = computed(() => splitSegments(analysis.value?.n || ''))

const rows = computed(() => {
  const result = []
  const a = analysis.value

  if (a?.network) result.push({ icon: 'net', label: 'Red', value: a.network })
  if (a?.product) {
    result.push({ icon: 'prod', label: 'Producto', value: a.product })
  }
  if (a?.currency) {
    result.push({
      icon: 'cur',
      label: 'Moneda',
      value: `${a.currency}${a.mlc ? ' con respaldo en MLC' : ''}`,
    })
  }
  if (a?.aliases?.length) {
    result.push({
      icon: 'prod',
      label: 'Alias',
      value: a.aliases.join(', '),
    })
  }
  if (a?.banks?.length) {
    result.push({
      icon: 'bank',
      label: 'Banco',
      value: a.banks.map((bank) => bank.name).join(', '),
    })
  }
  if (a?.n) {
    result.push({
      icon: 'dig',
      label: 'Dígitos',
      value: `${a.n.length} de ${a.cardLength}`,
    })
  }
  if (a?.luhn != null) {
    result.push({
      icon: 'shield',
      label: 'Dígito de control',
      value: a.luhn ? 'Válido' : 'No válido',
      tone: a.luhn ? 'ok' : 'bad',
    })
  }
  if (a?.validPattern != null) {
    result.push({
      icon: 'check',
      label: 'Patrón del catálogo',
      value: a.validPattern ? 'Coincide' : 'No coincide',
      tone: a.validPattern ? 'ok' : 'bad',
    })
  }
  if (!result.length) {
    result.push({
      icon: 'dig',
      label: 'Estado',
      value: loading.value ? 'Cargando…' : 'Escribe o pega un número.',
    })
  }

  return result
})

function splitSegments(n) {
  return [
    { text: n.slice(0, 2), label: 'red' },
    { text: n.slice(2, 4), label: 'producto' },
    { text: n.slice(4, 8), label: 'emisor' },
    { text: n.slice(8, 15), label: 'cuenta' },
    { text: n.slice(15, 16), label: 'control' },
  ]
}

function applyValue(raw) {
  const digits = String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, cardLength.value)
  const formatted = formatCardNumber(digits)

  if (props.modelValue === undefined) internalValue.value = formatted
  emit('update:modelValue', formatted)
  emit('change', formatted, digits)
}

function handleInput(event) {
  applyValue(event.target.value)
}

watch(
  () => props.defaultValue,
  (next) => {
    if (props.modelValue === undefined) {
      internalValue.value = formatCardNumber(next)
    }
  },
)

watch(cardLength, (length) => {
  const digits = value.value.replace(/\D/g, '')
  if (digits.length > length) applyValue(digits.slice(0, length))
})

watch(analysis, (next) => {
  if (next) emit('result', next)
})
</script>

<template>
  <div
    class="ccc-root"
    :data-theme="resolvedTheme"
    data-variant="explorer"
    :style="[rootStyle, style]"
    :aria-busy="loading"
  >
    <div class="ccc-wrap">
      <div class="ccc-topbar">
        <span class="ccc-eyebrow">Catálogo abierto · Cuba</span>
        <button
          v-if="showThemeToggle"
          class="ccc-themebtn"
          type="button"
          aria-label="Cambiar entre modo claro y oscuro"
          title="Cambiar entre modo claro y oscuro"
          @click="toggleTheme"
        >
          <span
            class="ccc-ic-sun"
            aria-hidden="true"
            v-html="getIcon('sun')"
          ></span>
          <span
            class="ccc-ic-moon"
            aria-hidden="true"
            v-html="getIcon('moon')"
          ></span>
        </button>
      </div>

      <h1 class="ccc-title">
        Explorador de tarjetas cubanas
        <span class="ccc-badge">{{ versionLabel }}</span>
      </h1>
      <p class="ccc-sub">
        Pega un número y el catálogo lo identifica al instante: red, producto,
        moneda y banco. La tarjeta se dibuja como la original de cada banco, sin
        datos personales.
      </p>

      <CardVisual :analysis="analysis" size="default" />

      <div class="ccc-panel">
        <label class="ccc-label" :for="inputId">
          <span
            class="ccc-ic"
            aria-hidden="true"
            v-html="getIcon('card')"
          ></span>
          Número de tarjeta
        </label>
        <input
          :id="inputId"
          class="ccc-input"
          inputmode="numeric"
          autocomplete="off"
          placeholder="9205 0699 0000 0000"
          :maxlength="maxLength"
          :value="value"
          :disabled="loading || !catalog"
          @input="handleInput"
        />

        <div class="ccc-anat">
          <div
            v-for="(segment, index) in segments"
            :key="segment.label"
            class="ccc-seg"
            :class="{ 'ccc-on': segment.text, 'ccc-long': index === 3 }"
          >
            <b>{{ segment.text || '····' }}</b>
            <span>{{ segment.label }}</span>
          </div>
        </div>

        <div v-if="loading" class="ccc-state" role="status">
          Cargando el catálogo desde el CDN…
        </div>
        <div v-else-if="error" class="ccc-state" role="alert">
          No se pudo cargar el catálogo desde el CDN. Revisa tu conexión.
          <button type="button" class="ccc-retry" @click="reload">
            Reintentar
          </button>
        </div>
        <div v-else class="ccc-rows">
          <div
            v-for="row in rows"
            :key="`${row.icon}-${row.label}`"
            class="ccc-row"
          >
            <span class="ccc-k">
              <span
                class="ccc-tile"
                :style="{ background: TILE_COLORS[row.icon] }"
                aria-hidden="true"
                v-html="getIcon(row.icon)"
              ></span>
              {{ row.label }}
            </span>
            <b>
              <span
                v-if="row.tone"
                :class="row.tone === 'ok' ? 'ccc-ok' : 'ccc-bad'"
              >
                {{ row.value }}
              </span>
              <template v-else>{{ row.value }}</template>
            </b>
          </div>
        </div>

        <div v-if="analysis?.notes" class="ccc-notes">
          {{ analysis.notes }}
        </div>

        <Warning v-if="analysis?.warning" :warning="analysis.warning" />

        <div v-if="showExamples && examples.length > 0" class="ccc-ex">
          <button
            v-for="example in examples"
            :key="example.prefix + example.label"
            type="button"
            @click="applyValue(example.value)"
          >
            <span
              class="ccc-dot"
              :style="{ background: example.color }"
            ></span>
            {{ example.label }}
          </button>
        </div>
      </div>

      <p v-if="showBranding" class="ccc-powered">
        Datos:
        <a
          href="https://github.com/qvapay/cuban_cards_prefixes"
          target="_blank"
          rel="noopener noreferrer"
        >
          cuban_cards_prefixes
        </a>
        (MIT) · Estilo basado en
        <a
          href="https://github.com/rblez/explorador-tarjetas-cubanas"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explorador de tarjetas cubanas
        </a>
        ·
        <a :href="REPORT_ORIGIN" target="_blank" rel="noopener noreferrer">
          Código GPL-3.0
        </a>
        <br />
        La identificación ocurre entera en tu navegador: el número no se envía a
        ningún servidor.
      </p>
    </div>
  </div>
</template>
