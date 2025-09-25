<!-- pages/fincas/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles de Finca</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="finca" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ finca.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <p class="mt-1 text-gray-900">{{ finca.nombre }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ubicación</label>
          <p class="mt-1 text-gray-900">{{ finca.ubicacion || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <p class="mt-1 text-gray-900">{{ finca.tamano_ha || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Propietario</label>
          <p class="mt-1 text-gray-900">{{ finca.propietario?.nombre || 'N/A' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/fincas/editar/${finca.id}`" class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/fincas" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Finca no encontrada.</div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
const { getFincasById, deleteFinca } = useFinca()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const finca = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getFincasById(id)
  loading.value = false
  if (data.value) {
    finca.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar finca: ' + error.value.message
  } else {
    errorMsg.value = 'Finca no encontrada'
  }
})

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar esta finca?')) {
    const { error } = await deleteFinca(finca.value.id)
    if (!error.value) {
      router.push('/fincas')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>