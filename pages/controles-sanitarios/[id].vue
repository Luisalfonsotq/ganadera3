<!-- pages/controles-sanitarios/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles del Control Sanitario</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="control" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ control.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal</label>
          <p class="mt-1 text-gray-900">{{ control.animal?.identificador_unico || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Control</label>
          <p class="mt-1 text-gray-900">{{ control.tipo_control?.nombre || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha</label>
          <p class="mt-1 text-gray-900">{{ formatDate(control.fecha) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Veterinario</label>
          <p class="mt-1 text-gray-900">{{ control.veterinario?.nombre || 'No asignado' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Medicamento</label>
          <p class="mt-1 text-gray-900">{{ control.medicamento || 'N/A' }}</p>
        </div>
        <div v-if="control.dosis">
          <label class="block text-sm font-medium text-gray-700">Dosis</label>
          <p class="mt-1 text-gray-900">{{ control.dosis }}</p>
        </div>
        <div v-if="control.via_aplicacion">
          <label class="block text-sm font-medium text-gray-700">Vía de Aplicación</label>
          <p class="mt-1 text-gray-900">{{ control.via_aplicacion }}</p>
        </div>
        <div v-if="control.costo">
          <label class="block text-sm font-medium text-gray-700">Costo</label>
          <p class="mt-1 text-gray-900">${{ control.costo }}</p>
        </div>
        <div class="md:col-span-2" v-if="control.observaciones">
          <label class="block text-sm font-medium text-gray-700">Observaciones</label>
          <p class="mt-1 text-gray-900">{{ control.observaciones }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user?.rol === 'Veterinario'" :to="`/controles-sanitarios/editar/${control.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user?.rol === 'Veterinario'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/controles-sanitarios" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Control sanitario no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getControlById, deleteControl } = useControlSanitario()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const control = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getControlById(id)
  loading.value = false
  if (data.value) {
    control.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar control: ' + error.value.message
  } else {
    errorMsg.value = 'Control sanitario no encontrado'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este control sanitario?')) {
    const { error } = await deleteControl(control.value.id)
    if (!error.value) {
      router.push('/controles-sanitarios')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>