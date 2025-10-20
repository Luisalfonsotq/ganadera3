<!-- pages/reproducciones/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles de la Reproducción</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="reproduccion" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ reproduccion.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Madre</label>
          <p class="mt-1 text-gray-900">{{ reproduccion.madre?.identificador_unico || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Padre</label>
          <p class="mt-1 text-gray-900">{{ reproduccion.padre?.identificador_unico || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Celo</label>
          <p class="mt-1 text-gray-900">{{ formatDate(reproduccion.fecha_celo) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Monta</label>
          <p class="mt-1 text-gray-900">{{ formatDate(reproduccion.fecha_monta) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Monta</label>
          <p class="mt-1 text-gray-900 capitalize">{{ reproduccion.tipo_monta || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha Confirmación Preñez</label>
          <p class="mt-1 text-gray-900">{{ formatDate(reproduccion.fecha_confirmacion_prenez) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Parto</label>
          <p class="mt-1 text-gray-900">{{ formatDate(reproduccion.fecha_parto) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Crías Nacidas</label>
          <p class="mt-1 text-gray-900">{{ reproduccion.crias_nacidas || 'N/A' }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Observaciones</label>
          <p class="mt-1 text-gray-900">{{ reproduccion.observaciones || 'Sin observaciones' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/reproducciones/editar/${reproduccion.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/reproducciones" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Registro no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getReproduccionById, deleteReproduccion } = useReproduccion()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const reproduccion = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getReproduccionById(id)
  loading.value = false
  if (data.value) {
    reproduccion.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar registro: ' + error.value.message
  } else {
    errorMsg.value = 'Registro no encontrado'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este registro de reproducción?')) {
    const { error } = await deleteReproduccion(reproduccion.value.id)
    if (!error.value) {
      router.push('/reproducciones')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>