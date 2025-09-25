// composables/useFinca.js
import { useFetch, useCookie} from '#app'

export const useFinca = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/fincas`
  const token = useCookie('access_token')

  // Para traer las fincas del usuario
  const getMyFincas = async (userId) => {
    const { data, error } = await useFetch(`${baseUrl}?propietario_id=${userId}`, {
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

  return { getMyFincas, getFincasById, createFinca, updateFinca, deleteFinca }
}