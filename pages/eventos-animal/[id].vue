<!-- pages/eventos-animal/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles del Evento</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="evento" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ evento.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal</label>
          <p class="mt-1 text-gray-900">{{ evento.animal?.identificador_unico || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Evento</label>
          <p class="mt-1 text-gray-900">{{ evento.tipo_evento?.nombre || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha</label>
          <p class="mt-1 text-gray-900">{{ formatDate(evento.fecha) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Valor Medida</label>
          <p class="mt-1 text-gray-900">{{ evento.valor_medida || 'N/A' }}</p>
        </div>
        <div v-if="evento.potrero_anterior">
          <label class="block text-sm font-medium text-gray-700">Potrero Anterior</label>
          <p class="mt-1 text-gray-900">{{ evento.potrero_anterior?.nombre || 'N/A' }}</p>
        </div>
        <div v-if="evento.potrero_actual">
          <label class="block text-sm font-medium text-gray-700">Potrero Actual</label>
          <p class="mt-1 text-gray-900">{{ evento.potrero_actual?.nombre || 'N/A' }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Detalle</label>
          <p class="mt-1 text-gray-900">{{ evento.detalle || 'Sin detalle' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/eventos-animal/editar/${evento.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/eventos-animal" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Evento no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getEventoById, deleteEvento } = useEventoAnimal()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const evento = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getEventoById(id)
  loading.value = false
  if (data.value) {
    evento.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar evento: ' + error.value.message
  } else {
    errorMsg.value = 'Evento no encontrado'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este evento?')) {
    const { error } = await deleteEvento(evento.value.id)
    if (!error.value) {
      router.push('/eventos-animal')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>