// composables/useFinca.js
export const useFinca = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/fincas`

  const getAllFincas = async (userId, rol) => {
    let url = baseUrl
    if (rol === 'Administrador') {
      url = `${baseUrl}?propietario_id=${userId}`
    } else {
      // Para otros roles, obtener fincas asignadas
      url = `${baseUrl}/by-user/${userId}`
    }

    const { data, error } = await useFetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return { data, error }
  }

  const getFincasById = async (id) => {
    const { data, error } = await useFetch(`${baseUrl}/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return { data, error }
  }

  const createFinca = async (fincaData) => {
    const { data, error } = await useFetch(baseUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: fincaData
    })
    return { data, error }
  }

  const updateFinca = async (id, fincaData) => {
    const { data, error } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: fincaData
    })
    return { data, error }
  }

  const deleteFinca = async (id) => {
    const { data, error } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return { data, error }
  }

  return { getAllFincas, getFincasById, createFinca, updateFinca, deleteFinca }
}