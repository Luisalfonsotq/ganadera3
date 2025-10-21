<!-- pages/tipos-control-sanitario/index.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Listado de Tipos de Control Sanitario</h1>
      <NuxtLink v-if="user?.rol === 'Administrador'" to="/tipos-control-sanitario/crear"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
        + Crear Tipo de Control Sanitario
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-gray-500">Cargando tipos de control sanitario...</div>
    <div v-else-if="error" class="mt-4 text-red-500">{{ error }}</div>
    <div v-else-if="tiposControlSanitario.length === 0" class="text-center py-8 text-gray-600 border rounded-lg p-6">
      Aún no hay tipos de control sanitario creados.
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-green-100">
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Nombre</th>
            <th class="py-2 px-4 text-left">Descripción</th>
            <th class="py-2 px-4 text-left">Aplica a Sexo</th>
            <th class="py-2 px-4 text-left">Requiere Medicamento</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tipo in tiposControlSanitario" :key="tipo.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tipo.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tipo.nombre }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ tipo.descripcion || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ tipo.aplica_a_sexo ? 'Sí' : 'No' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ tipo.requiere_medicamento ? 'Sí' : 'No' }}</td>
            <td class="py-2 px-4 flex gap-2">
              <NuxtLink :to="`/tipos-control-sanitario/${tipo.id}`" class="text-blue-500 hover:underline">
                <Icon name="i-heroicons-eye" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink v-if="user?.rol === 'Administrador'" :to="`/tipos-control-sanitario/editar/${tipo.id}`" class="text-yellow-500 hover:underline">
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

const { tiposControlSanitario, loading, error, getAllTiposControlSanitario, deleteTipoControlSanitario } = useTipoControlSanitario()
const { user } = useAuth()

onMounted(async () => {
  await getAllTiposControlSanitario()
})

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar este tipo de control sanitario?')) {
    const { error } = await deleteTipoControlSanitario(id)
    if (!error.value) {
      tiposControlSanitario.value = tiposControlSanitario.value.filter(t => t.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>