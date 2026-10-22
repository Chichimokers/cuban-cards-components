<script setup>
import { computed, watch } from 'vue'
import { analyzeCard } from '@cuban-cards/core'
import CardVisual from './CardVisual.vue'
import DetailSummary from './DetailSummary.vue'
import Warning from './Warning.vue'
import { useCubanCatalog } from './useCubanCatalog.js'
import { useTheme } from './useTheme.js'

const props = defineProps({
  number: { type: String, default: '' },
  analysis: { type: Object, default: null },
  cdnBase: { type: String, default: undefined },
  fallbackBase: { type: String, default: undefined },
  theme: { type: String, default: 'dark' },
  size: { type: String, default: 'compact' },
  showDetails: { type: Boolean, default: false },
  showBranding: { type: Boolean, default: false },
  style: { type: [String, Object, Array], default: undefined },
})

const emit = defineEmits(['result'])

const { catalog, validators, issuersById, loading } = useCubanCatalog(() => ({
  cdnBase: props.cdnBase,
  fallbackBase: props.fallbackBase,
  enabled: !props.analysis && Boolean(props.number),
}))

const loadedAnalysis = computed(() => {
  if (props.analysis || !props.number || !catalog.value || !validators.value) {
    return null
  }
  return analyzeCard(
    props.number,
    catalog.value,
    validators.value,
    issuersById.value,
  )
})

const analysis = computed(() => props.analysis || loadedAnalysis.value)
const { resolvedTheme } = useTheme(() => props.theme)

watch(
  analysis,
  (next) => {
    if (next) emit('result', next)
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="ccc-root ccc-bare"
    :data-theme="resolvedTheme"
    data-variant="bare"
    :style="style"
    :aria-busy="loading"
  >
    <CardVisual :analysis="analysis" :size="size" />

    <DetailSummary v-if="showDetails" :analysis="analysis" />
    <Warning v-if="analysis?.warning" :warning="analysis.warning" />

    <p v-if="showBranding" class="ccc-powered">
      Datos:
      <a
        href="https://github.com/qvapay/cuban_cards_prefixes"
        target="_blank"
        rel="noopener noreferrer"
      >
        cuban_cards_prefixes
      </a>
    </p>
  </div>
</template>
