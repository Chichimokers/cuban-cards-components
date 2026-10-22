<script setup>
import { computed, ref, useId, watch } from 'vue'
import {
  REPORT_ORIGIN,
  analyzeCard,
  buildExamples,
  formatCardNumber,
  getCardLength,
  getIcon,
} from '@cuban-cards/core'
import CardVisual from './CardVisual.vue'
import DetailSummary from './DetailSummary.vue'
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
  showDetails: { type: Boolean, default: true },
  showExamples: { type: Boolean, default: false },
  showBranding: { type: Boolean, default: false },
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
  catalog.value ? buildExamples(catalog.value, issuersById.value, 4) : [],
)

const maxLength = computed(
  () => cardLength.value + Math.floor((cardLength.value - 1) / 4),
)

const versionLabel = computed(() => {
  if (loading.value) return 'cargando'
  if (error.value) return 'sin conexión'
  if (version.value) return `v${version.value}`
  return 'sin datos'
})

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
    class="ccc-root ccc-widget-root"
    :data-theme="resolvedTheme"
    data-variant="widget"
    :style="style"
    :aria-busy="loading"
  >
    <div class="ccc-widget-panel">
      <div class="ccc-widget-head">
        <div>
          <div class="ccc-widget-title">Identificar tarjeta</div>
          <div class="ccc-widget-subtitle">Catálogo abierto de Cuba</div>
        </div>
        <div class="ccc-widget-actions">
          <span class="ccc-widget-badge">{{ versionLabel }}</span>
          <button
            v-if="showThemeToggle"
            class="ccc-themebtn ccc-themebtn-compact"
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
      </div>

      <div class="ccc-widget-field">
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
        <span class="ccc-widget-hint">
          Se procesa en tu navegador. No se envía el número.
        </span>
      </div>

      <CardVisual :analysis="analysis" size="compact" />

      <div v-if="loading" class="ccc-widget-status" role="status">
        Cargando el catálogo desde el CDN…
      </div>
      <div v-else-if="error" class="ccc-widget-status" role="alert">
        No se pudo cargar el catálogo.
        <button type="button" class="ccc-retry" @click="reload">
          Reintentar
        </button>
      </div>
      <div v-else aria-live="polite">
        <DetailSummary v-if="showDetails" :analysis="analysis" />
      </div>

      <Warning v-if="analysis?.warning" :warning="analysis.warning" />

      <details v-if="analysis?.notes" class="ccc-widget-notes">
        <summary>Notas del catálogo</summary>
        <p>{{ analysis.notes }}</p>
      </details>

      <div v-if="showExamples && examples.length > 0" class="ccc-ex ccc-ex-compact">
        <button
          v-for="example in examples"
          :key="example.prefix + example.label"
          type="button"
          @click="applyValue(example.value)"
        >
          <span class="ccc-dot" :style="{ background: example.color }"></span>
          {{ example.label }}
        </button>
      </div>

      <p v-if="showBranding" class="ccc-powered ccc-powered-compact">
        Datos:
        <a
          href="https://github.com/qvapay/cuban_cards_prefixes"
          target="_blank"
          rel="noopener noreferrer"
        >
          cuban_cards_prefixes
        </a>
        ·
        <a :href="REPORT_ORIGIN" target="_blank" rel="noopener noreferrer">
          GPL-3.0
        </a>
      </p>
    </div>
  </div>
</template>
