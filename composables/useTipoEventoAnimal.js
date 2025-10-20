// composables/useTipoEventoAnimal.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useTipoEventoAnimal = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/tipos-evento-animal`
  const token = useCookie('access_token')
  const tiposEvento = ref([])
  const tipoEvento = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todos los tipos de evento
  const getAllTiposEvento = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de tipos de evento.'
      console.error('Error fetching tipos evento:', fetchError.value)
    } else {
      tiposEvento.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener tipo de evento por id
  const getTipoEventoById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el tipo de evento.'
      console.error('Error fetching tipo evento:', fetchError.value)
    } else {
      tipoEvento.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  return {
    tiposEvento,
    tipoEvento,
    loading,
    error,
    getAllTiposEvento,
    getTipoEventoById,
  }
}