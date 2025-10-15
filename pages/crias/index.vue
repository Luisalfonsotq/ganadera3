<!-- pages/crias/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Crías</h1>
      <NuxtLink to="/crias/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Registrar Cría
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando crías...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="crias.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay crías registradas.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Cría (Identificador)</th>
            <th class="py-2 px-4 text-left">Madre</th>
            <th class="py-2 px-4 text-left">Padre</th>
            <th class="py-2 px-4 text-left">Fecha Nacimiento</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cria in crias" :key="cria.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ cria.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cria.cria_animal?.identificador_unico || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ cria.madre?.identificador_unico || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ cria.padre?.identificador_unico || 'Sin padre' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(cria.fecha_nacimiento) }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/crias/${cria.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink :to="`/crias/editar/${cria.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button @click="handleDelete(cria.id)" class="text-red-500 hover:text-red-700">
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

const { crias, loading, error, getAllCrias, deleteCria } = useCria()

onMounted(async () => {
  await getAllCrias()
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este registro de cría?')) {
    const { error } = await deleteCria(id)
    if (!error.value) {
      crias.value = crias.value.filter(c => c.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>