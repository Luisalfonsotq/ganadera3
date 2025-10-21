<!-- pages/controles-sanitarios/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Controles Sanitarios</h1>
      <NuxtLink v-if="user?.rol === 'Veterinario'" to="/controles-sanitarios/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Control Sanitario
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando controles sanitarios...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="controles.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay controles sanitarios creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Animal</th>
            <th class="py-2 px-4 text-left">Tipo Control</th>
            <th class="py-2 px-4 text-left">Fecha</th>
            <th class="py-2 px-4 text-left">Veterinario</th>
            <th class="py-2 px-4 text-left">Medicamento</th>
            <th class="py-2 px-4 text-left">Costo</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="control in controles" :key="control.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ control.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ control.animal?.identificador_unico || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ control.tipo_control?.nombre || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(control.fecha) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ control.veterinario?.nombre || 'N/A' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">
              {{ control.medicamento || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ control.costo ? `$${control.costo}` : 'N/A' }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/controles-sanitarios/${control.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink v-if="user?.rol === 'Veterinario'" :to="`/controles-sanitarios/editar/${control.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button v-if="user?.rol === 'Veterinario'" @click="handleDelete(control.id)" class="text-red-500 hover:text-red-700">
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

const { controles, loading, error, getAllControles, deleteControl } = useControlSanitario()
const { user } = useAuth()

onMounted(async () => {
  await getAllControles()
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este control sanitario?')) {
    const { error } = await deleteControl(id)
    if (!error.value) {
      controles.value = controles.value.filter(c => c.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>