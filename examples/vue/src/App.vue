<script setup>
import { computed, ref } from 'vue'
import { CubanCard, CubanCardExplorer } from '@cuban-cards/vue'

const mode = ref('compact')
const result = ref(null)
const cdnBase = import.meta.env.VITE_CUBAN_CARDS_CDN || undefined

const summaryText = computed(() => {
  if (!result.value) return ''
  const value = result.value
  return JSON.stringify(
    {
      prefix: value.prefix,
      network: value.network,
      product: value.product,
      currency: value.currency,
      banks: (value.banks || []).map((bank) => bank.id),
      digits: value.n.length,
      luhn: value.luhn,
      pattern: value.validPattern,
      warning: value.warning?.type || null,
    },
    null,
    2,
  )
})

function onResult(value) {
  result.value = value
}
</script>

<template>
  <main class="demo">
    <div class="demo-head">
      <span class="demo-kicker">Vue 3 · Vite</span>
      <a
        class="demo-link"
        href="https://github.com/Chichimokers/cuban-cards-components"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver repositorio
      </a>
    </div>

    <div class="demo-switch" role="tablist" aria-label="Tipo de componente">
      <button
        type="button"
        role="tab"
        :aria-selected="mode === 'compact'"
        :class="mode === 'compact' ? 'demo-tab demo-tab-on' : 'demo-tab'"
        @click="mode = 'compact'"
      >
        Widget compacto
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="mode === 'explorer'"
        :class="mode === 'explorer' ? 'demo-tab demo-tab-on' : 'demo-tab'"
        @click="mode = 'explorer'"
      >
        Explorador completo
      </button>
    </div>

    <CubanCard
      v-if="mode === 'compact'"
      :cdn-base="cdnBase"
      show-examples
      show-branding
      @result="onResult"
    />
    <CubanCardExplorer v-else :cdn-base="cdnBase" @result="onResult" />

    <p class="demo-note">
      Ambos componentes consumen el catálogo desde el CDN de
      <code>qvapay/cuban_cards_prefixes</code>. La identificación ocurre en el
      navegador.
    </p>

    <aside v-if="summaryText" class="demo-result" aria-live="polite">
      <h2>Resultado del callback</h2>
      <pre>{{ summaryText }}</pre>
    </aside>
  </main>
</template>
