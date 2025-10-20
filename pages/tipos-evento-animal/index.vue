<!-- pages/tipos-evento-animal/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Tipos de Evento de Animales</h1>
      <NuxtLink v-if="user?.rol === 'Administrador'" to="/tipos-evento-animal/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Tipo de Evento
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando tipos de evento...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="tiposEvento.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay tipos de evento creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-left">Descripción</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tipo in tiposEvento" :key="tipo.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tipo.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tipo.nombre }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ tipo.descripcion || 'N/A' }}</td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/tipos-evento-animal/${tipo.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink v-if="user?.rol === 'Administrador'" :to="`/tipos-evento-animal/editar/${tipo.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button v-if="user?.rol === 'Administrador'" @click="handleDelete(tipo.id)" class="text-red-500 hover:text-red-700">
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

const { tiposEvento, loading, error, getAllTiposEvento, deleteTipoEvento } = useTipoEventoAnimal()
const { user } = useAuth()

onMounted(async () => {
  await getAllTiposEvento()
})

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este tipo de evento?')) {
    const { error } = await deleteTipoEvento(id)
    if (!error.value) {
      tiposEvento.value = tiposEvento.value.filter(t => t.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>