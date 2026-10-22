<script setup>
import { getIcon } from '@cuban-cards/core'

defineProps({
  warning: { type: Object, default: null },
})
</script>

<template>
  <div v-if="warning" class="ccc-warn">
    <div
      class="ccc-warn-ic"
      aria-hidden="true"
      v-html="getIcon('alert')"
    ></div>
    <div class="ccc-warn-tx">
      <b>{{ warning.title }}</b>
      <p>{{ warning.text }}</p>
      <a
        class="ccc-warnbtn"
        :href="warning.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reportar dato en GitHub
      </a>
      <span class="ccc-warnpriv">
        Solo se comparten los 8 primeros dígitos de tu tarjeta.
      </span>
    </div>
  </div>
</template>
