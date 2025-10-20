// composables/useEventoAnimal.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useEventoAnimal = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/eventos-animal`
  const token = useCookie('access_token')
  const eventos = ref([])
  const evento = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todos los eventos
  const getAllEventos = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de eventos.'
      console.error('Error fetching eventos:', fetchError.value)
    } else {
      eventos.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener evento por id
  const getEventoById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el evento.'
      console.error('Error fetching evento:', fetchError.value)
    } else {
      evento.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener eventos por animal
  const getEventosPorAnimal = async (animalId) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/por-animal/${animalId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener los eventos del animal.'
      console.error('Error fetching eventos por animal:', fetchError.value)
    } else {
      eventos.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: crear nuevo evento
  const createEvento = async (eventoData) => {
    loading.value = true
    error.value = null
    const { data: newEvento, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventoData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el evento.'
      console.error('Error creating evento:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newEvento.value) {
        eventos.value.push(newEvento.value)
      }
      loading.value = false
      return newEvento.value
    }
  }

  // PATCH: actualizar evento
  const updateEvento = async (id, data) => {
    loading.value = true
    error.value = null
    const { data: updated, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (fetchError.value) {
      error.value = 'Error al actualizar el evento.'
      console.error('Error updating evento:', fetchError.value)
    } else {
      if (evento.value && evento.value.id === id && updated.value) {
        evento.value = updated.value
      }

      const index = eventos.value.findIndex(e => e.id === id)
      if (index !== -1 && updated.value) {
        eventos.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: eliminar evento
  const deleteEvento = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar el evento.'
      console.error('Error deleting evento:', fetchError.value)
    } else {
      eventos.value = eventos.value.filter(e => e.id !== id)
      if (evento.value && evento.value.id === id) {
        evento.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    eventos,
    evento,
    loading,
    error,
    getAllEventos,
    getEventoById,
    getEventosPorAnimal,
    createEvento,
    updateEvento,
    deleteEvento,
  }
}