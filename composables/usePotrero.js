// composables/usePotrero.js
import { useFetch, useCookie } from '#app'
import { ref } from 'vue'

export const usePotrero = () => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()
  const baseUrl = `${apiBaseUrl}/potreros`
  // const token = useCookie('access_token')
  const potreros = ref([])
  const potrero = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Get: obtener los potreros
  const getPotrerosOfFinca = async (fincaId) => {
    let url = fincaId ? `${baseUrl}/by-finca/${fincaId}` : baseUrl;
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await useFetch(url, {
      credentials: 'include'
    });
    if (fetchError.value) {
      error.value = 'No se pudo obtener la lista de potreros.';
      console.error('Error fetching potreros:', fetchError.value);
    } else {
      potreros.value = Array.isArray(data.value) ? data.value : [];
      console.log('Fetched potreros:', potreros.value)
    }
    loading.value = false;
    return { data, error: fetchError };
  };

  // GetById: obtener potreros por id
  const getPotreroById = async (id) => {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      credentials: 'include'
    });
    if (fetchError.value) {
      error.value = 'No se pudo obtener el potrero.';
      console.error('Error fetching potrero:', fetchError.value);
    } else {
      potrero.value = data.value;
    }
    loading.value = false;
    return { data, error: fetchError };
  };

  // POST: Crear un nuevo potrero
  const createPotrero = async (potreroData) => {
    loading.value = true;
    error.value = null;
    const { data: newPotrero, error: fetchError } = await useFetch(baseUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(potreroData),
    });

    if (fetchError.value) {
      error.value = 'Error al crear el potrero.';
      console.error('Error creating potrero:', fetchError.value);
      loading.value = false;
      return null;
    } else {
      if (newPotrero.value) {
        potreros.value.push(newPotrero.value);
      }
      loading.value = false;
      return newPotrero.value;
    }
  };

  // PATCH: Actualiza potrero
  const updatePotrero = async (id, data) => {
    loading.value = true;
    error.value = null;
    const { data: updated, error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (fetchError.value) {
      error.value = 'Error al actualizar el potrero.';
      console.error('Error updating potrero:', fetchError.value);
    } else {
      // Actualizar el ref si es el mismo id
      if (potrero.value && potrero.value.id === id && updated.value) {
        potrero.value = updated.value;
      }

      // Actualizar en la lista si existe
      const index = potreros.value.findIndex(p => p.id === id);
      if (index !== -1 && updated.value) {
        potreros.value[index] = updated.value;
      }
    }
    loading.value = false;
    return { data: updated.value, error: fetchError.value };
  };

  // DELETE: Eliminar potrero
  const deletePotrero = async (id) => {
    loading.value = true;
    error.value = null;
    const { error: fetchError } = await useFetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (fetchError.value) {
      error.value = 'Error al eliminar el potrero.';
      console.error('Error deleting potrero:', fetchError.value);
    } else {
      // Remover de la lista
      potreros.value = potreros.value.filter(p => p.id !== id);
      // Limpiar el ref si es el mismo
      if (potrero.value && potrero.value.id === id) {
        potrero.value = null;
      }
    }
    loading.value = false;
    return { error: fetchError };
  };

  return {
    potreros,
    potrero,
    loading,
    error,
    getPotrerosOfFinca,
    getPotreroById,
    createPotrero,
    updatePotrero,
    deletePotrero,
  };
};