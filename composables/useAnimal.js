// composables/useAnimal.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const useAnimal = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/animales`
  const token = useCookie('access_token')
  const animales = ref([])
  const animal = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Get: obtener animales
  const getAnimalesOfFinca = async (fincaId) => {
    let url = fincaId ? `${baseUrl}/finca/${fincaId}` : baseUrl
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch(url, {
      headers: { Authorization: `Bearer ${token.value}` }
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
      headers: { Authorization: `Bearer ${token.value}` }
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
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animalData),
    })

    if (fetchError.value) {
      error.value = 'Error al crear el animal.'
      console.error('Error creating animal:', fetchError.value)
      loading.value = false
      return null
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
      headers: {
        Authorization: `Bearer ${token.value}`,
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
      headers: { Authorization: `Bearer ${token.value}` },
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
  }
}