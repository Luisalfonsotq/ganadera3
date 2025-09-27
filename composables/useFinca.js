// composables/useFinca.js
import { useFetch, useCookie} from '#app'

export const useFinca = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/fincas`
  const token = useCookie('access_token')

  // Para traer las fincas del usuario
  const getAllFincas = async (userId, rol) => {
    let url = baseUrl
    if (rol === 'Administrador') {
      url = `${baseUrl}?propietario_id=${userId}`
    } else {
      // Para otros roles, no traer fincas o usar otro endpoint
      return { data: ref([]), error: ref(null) }
    }
    const { data, error } = await useFetch(url, {
      headers: { Authorization: `Bearer ${token.value}`}
    })
    return { data, error }
  }

  const getFincasById = async (id) => {
    const { data, error } = await useFetch(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token.value}`}
    })
    return { data, error }
  }

  const createFinca = async (fincaData) => {
    const { data, error } = await useFetch(baseUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}`},
      body: fincaData
    })
    return { data, error }
  }

  const updateFinca = async (id, fincaData) => {
    const { data, error } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}`},
      body: fincaData
    })
    return { data, error }
  }

  const deleteFinca = async (id) => {
    const { data, error } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}`}
    })
    return { data, error }
  }

  return { getAllFincas, getFincasById, createFinca, updateFinca, deleteFinca }
}