import { onMounted, ref, watch } from 'vue'
import { loadCatalog } from '@cuban-cards/core'

export function useCubanCatalog(getOptions) {
  const initialOptions = getOptions()
  const catalog = ref(null)
  const validators = ref(null)
  const issuersById = ref({})
  const version = ref(null)
  const loading = ref(initialOptions.enabled !== false)
  const error = ref(null)
  let requestId = 0

  async function load() {
    const current = ++requestId
    const options = getOptions()

    if (options.enabled === false) {
      catalog.value = null
      validators.value = null
      issuersById.value = {}
      version.value = null
      loading.value = false
      error.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await loadCatalog({
        cdnBase: options.cdnBase,
        fallbackBase: options.fallbackBase,
      })
      if (current !== requestId) return

      catalog.value = data.catalog
      validators.value = data.validators
      issuersById.value = data.issuersById
      version.value = data.version
    } catch (loadError) {
      if (current !== requestId) return
      catalog.value = null
      validators.value = null
      issuersById.value = {}
      version.value = null
      error.value = loadError
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  watch(
    () => {
      const options = getOptions()
      return [options.cdnBase, options.fallbackBase, options.enabled]
    },
    () => load(),
  )

  onMounted(load)

  return {
    catalog,
    validators,
    issuersById,
    version,
    loading,
    error,
    reload: load,
  }
}
