<!-- pages/fincas/index.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Lista de Fincas</h1>
    <p v-if="user.value">Rol: {{ user.value.rol }}</p>
    <NuxtLink v-if="user.value?.rol === 'Administrador'" to="/fincas/crear" class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" /> Crear Finca
    </NuxtLink>
    <div v-if="loading" class="mt-4 text-gray-500">Cargando fincas...</div>
    <div v-else-if="errorMsg" class="mt-4 text-red-500">{{ errorMsg }}</div>
    <table v-else-if="fincas.length" class="min-w-full mt-4 bg-white shadow rounded-lg">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 text-left">ID</th>
          <th class="py-2 px-4 text-left">Nombre</th>
          <th class="py-2 px-4 text-left">Ubicación</th>
          <th class="py-2 px-4 text-left">Tamaño (ha)</th>
          <th class="py-2 px-4 text-left">Propietario</th>
          <th class="py-2 px-4 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="finca in fincas" :key="finca.id" class="border-t">
          <td class="py-2 px-4">{{ finca.id }}</td>
          <td class="py-2 px-4">{{ finca.nombre }}</td>
          <td class="py-2 px-4">{{ finca.ubicacion || 'N/A' }}</td>
          <td class="py-2 px-4">{{ finca.tamano_ha || 'N/A' }}</td>
          <td class="py-2 px-4">{{ finca.propietario?.nombre || 'N/A' }}</td>
          <td class="py-2 px-4 flex gap-2">
            <NuxtLink :to="`/fincas/${finca.id}`" class="text-blue-500 hover:underline">
              <Icon name="heroicons:eye" class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/fincas/editar/${finca.id}`" class="text-yellow-500 hover:underline">
              <Icon name="heroicons:pencil" class="w-5 h-5" />
            </NuxtLink>
            <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete(finca.id)" class="text-red-500 hover:text-red-700">
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="mt-4 text-gray-500">No hay fincas disponibles.</p>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
const { getMyFincas, deleteFinca } = useFinca()
const { user } = useAuth()
const fincas = ref([])
const loading = ref(false)
const errorMsg = ref('')

const loadFincas = async () => {
  console.log('loadFincas called, user:', user.value)
  const userId = user.value?.id || user.value?.userId
  if (!userId) {
    console.log('No user id or userId, skipping load')
    return
  }
  loading.value = true
  errorMsg.value = ''
  console.log('Loading fincas for user id:', userId)
  const { data, error } = await getMyFincas(userId)
  loading.value = false
  console.log('data:', data, 'error:', error)
  console.log('Fincas loaded:', data.value, 'error:', error.value)
  if (data.value) {
    fincas.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar fincas: ' + error.value.message
  }
}

watch(user, loadFincas, { immediate: true })

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta finca?')) {
    const { error } = await deleteFinca(id)
    if (!error.value) {
      fincas.value = fincas.value.filter(f => f.id !== id)
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>