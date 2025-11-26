// composables/useAnimal.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useAnimal = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/animales`
  // const token = useCookie('access_token') // Token is in httpOnly cookie
  const animales = ref([])
  const animal = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Get: obtener animales
  const getAnimalesOfFinca = async (fincaId) => {
    if (!fincaId) {
      error.value = 'Se requiere un ID de finca válido.'
      loading.value = false
      return { data: null, error: error.value }
    }
    const url = `${baseUrl}/finca/${fincaId}`
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(url, {
      credentials: 'include'
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de animales.'
      console.error('Error fetching animales:', fetchError.value)
    } else {
      animales.value = Array.isArray(data.value) ? data.value : []
      console.log('Fetched animales:', animales.value)
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // GetById: obtener animal por id
  const getAnimalById = async (id) => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      credentials: 'include'
    })
    if (fetchError.value) {
      error.value = 'No se pudo obtener el animal.'
      console.error('Error fetching animal:', fetchError.value)
    } else {
      animal.value = data.value
    }
    loading.value = false
    return { data, error: fetchError }
  }

  // POST: Crear un nuevo animal
  const createAnimal = async (animalData) => {
    loading.value = true
    error.value = null
    const { data: newAnimal, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animalData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el animal.'
      console.error('Error creating animal:', fetchError.value)
      loading.value = false
      const errorObj = new Error(fetchError.value.data?.message || fetchError.value.message || 'Error desconocido')
      errorObj.statusCode = fetchError.value.statusCode
      errorObj.data = fetchError.value.data
      throw errorObj
    } else {
      if (newAnimal.value) {
        animales.value.push(newAnimal.value)
      }
      loading.value = false
      return newAnimal.value
    }
  }

  // PATCH: Actualiza animal
  const updateAnimal = async (id, data) => {
    loading.value = true
    error.value = null
    const { data: updated, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (fetchError.value) {
      error.value = 'Error al actualizar el animal.'
      console.error('Error updating animal:', fetchError.value)
    } else {
      if (animal.value && animal.value.id === id && updated.value) {
        animal.value = updated.value
      }

      const index = animales.value.findIndex(a => a.id === id)
      if (index !== -1 && updated.value) {
        animales.value[index] = updated.value
      }
    }
    loading.value = false
    return { data: updated.value, error: fetchError.value }
  }

  // DELETE: Eliminar animal
  const deleteAnimal = async (id) => {
    loading.value = true
    error.value = null
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (fetchError.value) {
      error.value = 'Error al eliminar el animal.'
      console.error('Error deleting animal:', fetchError.value)
    } else {
      animales.value = animales.value.filter(a => a.id !== id)
      if (animal.value && animal.value.id === id) {
        animal.value = null
      }
    }
    loading.value = false
    return { error: fetchError }
  }

  // NUEVOS MÉTODOS

  // Obtener animales con alertas sanitarias
  const getAlertasSanitarias = async (fincaId) => {
    loading.value = true
    error.value = null
    const url = fincaId ? `${baseUrl}/alertas-sanitarias?finca_id=${fincaId}` : `${baseUrl}/alertas-sanitarias`
    const { data, error: fetchError } = await useFetch(url, {
      credentials: 'include'
    })
    loading.value = false
    if (fetchError.value) {
      error.value = 'Error al obtener alertas sanitarias'
      console.error('Error fetching alertas:', fetchError.value)
    }
    return { data, error: fetchError }
  }

  // Obtener animales próximos a parir
  const getProximosPartos = async (dias = 30, fincaId) => {
    loading.value = true
    error.value = null
    let url = `${baseUrl}/proximos-partos?dias=${dias}`
    if (fincaId) url += `&finca_id=${fincaId}`
    const { data, error: fetchError } = await useFetch(url, {
      credentials: 'include'
    })
    loading.value = false
    if (fetchError.value) {
      error.value = 'Error al obtener próximos partos'
      console.error('Error fetching partos:', fetchError.value)
    }
    return { data, error: fetchError }
  }

  // Obtener estadísticas de etapas de vida
  const getEstadisticasEtapas = async (fincaId) => {
    loading.value = true
    error.value = null
    const url = fincaId ? `${baseUrl}/estadisticas/etapas-vida?finca_id=${fincaId}` : `${baseUrl}/estadisticas/etapas-vida`
    const { data, error: fetchError } = await useFetch(url, {
      credentials: 'include'
    })
    loading.value = false
    if (fetchError.value) {
      error.value = 'Error al obtener estadísticas'
      console.error('Error fetching stats:', fetchError.value)
    }
    return { data, error: fetchError }
  }

  return {
    animales,
    animal,
    loading,
    error,
    getAnimalesOfFinca,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getAlertasSanitarias,
    getProximosPartos,
    getEstadisticasEtapas,
  }
}