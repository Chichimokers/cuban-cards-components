<script setup>
import { computed } from 'vue'
import { buildSummary } from '@cuban-cards/core'

const props = defineProps({
  analysis: { type: Object, default: null },
})

const summary = computed(() => buildSummary(props.analysis))
</script>

<template>
  <div v-if="analysis?.n && (summary.items.length || summary.checks.length)" class="ccc-summary-wrap">
    <div v-if="summary.items.length > 0" class="ccc-summary">
      <div
        v-for="item in summary.items"
        :key="item.key"
        class="ccc-summary-item"
      >
        <span>{{ item.label }}</span>
        <b>{{ item.value }}</b>
      </div>
    </div>

    <div v-if="summary.checks.length > 0" class="ccc-checks">
      <span
        v-for="check in summary.checks"
        :key="check.key"
        class="ccc-check"
        :class="check.tone ? `ccc-${check.tone}` : ''"
      >
        {{ check.label }}
      </span>
    </div>
  </div>
</template>
