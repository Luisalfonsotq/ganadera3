<!-- pages/eventos-animal/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Eventos de Animales</h1>
      <NuxtLink to="/eventos-animal/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Evento
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando eventos...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="eventos.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay eventos de animales creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Animal</th>
            <th class="py-2 px-4 text-left">Tipo Evento</th>
            <th class="py-2 px-4 text-left">Fecha</th>
            <th class="py-2 px-4 text-left">Detalle</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evento in eventos" :key="evento.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ evento.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ evento.animal?.identificador_unico || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ evento.tipo_evento?.nombre || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(evento.fecha) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">
              {{ evento.detalle || 'N/A' }}
            </td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/eventos-animal/${evento.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink :to="`/eventos-animal/editar/${evento.id}`" class="text-yellow-500 hover:underline">
                <Icon name="i-heroicons-pencil" class="w-5 h-5" />
              </NuxtLink>
              <button @click="handleDelete(evento.id)" class="text-red-500 hover:text-red-700">
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

const { eventos, loading, error, getAllEventos, deleteEvento } = useEventoAnimal()

onMounted(async () => {
  await getAllEventos()
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este evento?')) {
    const { error } = await deleteEvento(id)
    if (!error.value) {
      eventos.value = eventos.value.filter(e => e.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>