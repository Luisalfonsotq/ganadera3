<!-- pages/reproducciones/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Reproducciones</h1>
      <NuxtLink to="/reproducciones/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Reproducción
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando reproducciones...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="reproducciones.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay registros de reproducción creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Madre</th>
            <th class="py-2 px-4 text-left">Padre</th>
            <th class="py-2 px-4 text-left">Fecha Monta</th>
            <th class="py-2 px-4 text-left">Tipo Monta</th>
            <th class="py-2 px-4 text-left">Fecha Parto</th>
            <th class="py-2 px-4 text-left">Crías</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repro in reproducciones" :key="repro.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ repro.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ repro.madre?.identificador_unico || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ repro.padre?.identificador_unico || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(repro.fecha_monta) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
              {{ repro.tipo_monta || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(repro.fecha_parto) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ repro.crias_nacidas || 'N/A' }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/reproducciones/${repro.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink :to="`/reproducciones/editar/${repro.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button @click="handleDelete(repro.id)" class="text-red-500 hover:text-red-700">
                <Icon name="i-heroicons-trash" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { reproducciones, loading, error, getAllReproducciones, deleteReproduccion } = useReproduccion()

onMounted(async () => {
  await getAllReproducciones()
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este registro de reproducción?')) {
    const { error } = await deleteReproduccion(id)
    if (!error.value) {
      reproducciones.value = reproducciones.value.filter(r => r.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>