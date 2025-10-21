// composables/useControlSanitario.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useControlSanitario = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/controles-sanitarios`
  const token = useCookie('access_token')
  const controles = ref([])
  const control = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // GET: obtener todos los controles
  const getAllControles = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(baseUrl, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de controles sanitarios.'
      console.error('Error fetching controles:', fetchError.value)
    } else {
      controles.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener control por id
  const getControlById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el control sanitario.'
      console.error('Error fetching control:', fetchError.value)
    } else {
      control.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GET: obtener controles por animal
  const getControlesPorAnimal = async (animalId) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/por-animal/${animalId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener los controles del animal.'
      console.error('Error fetching controles por animal:', fetchError.value)
    } else {
      controles.value = Array.isArray(data.value) ? data.value : []
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: crear nuevo control
  const createControl = async (controlData) => {
    loading.value = true
    error.value = null
    const { data: newControl, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(controlData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el control sanitario.'
      console.error('Error creating control:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newControl.value) {
        controles.value.push(newControl.value)
      }
      loading.value = false
      return newControl.value
    }
  }

  // PATCH: actualizar control
  const updateControl = async (id, data) => {
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
      error.value = 'Error al actualizar el control sanitario.'
      console.error('Error updating control:', fetchError.value)
    } else {
      if (control.value && control.value.id === id && updated.value) {
        control.value = updated.value
      }

      const index = controles.value.findIndex(c => c.id === id)
      if (index !== -1 && updated.value) {
        controles.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: eliminar control
  const deleteControl = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar el control sanitario.'
      console.error('Error deleting control:', fetchError.value)
    } else {
      controles.value = controles.value.filter(c => c.id !== id)
      if (control.value && control.value.id === id) {
        control.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  return {
    controles,
    control,
    loading,
    error,
    getAllControles,
    getControlById,
    getControlesPorAnimal,
    createControl,
    updateControl,
    deleteControl,
  }
}