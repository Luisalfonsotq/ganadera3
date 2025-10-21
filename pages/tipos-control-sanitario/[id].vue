<!-- pages/tipos-control-sanitario/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles del Tipo de Control Sanitario</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="tipoControlSanitario" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ tipoControlSanitario.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <p class="mt-1 text-gray-900">{{ tipoControlSanitario.nombre }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <p class="mt-1 text-gray-900">{{ tipoControlSanitario.descripcion || 'Sin descripción' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Aplica a Sexo</label>
          <p class="mt-1 text-gray-900">{{ tipoControlSanitario.aplica_a_sexo ? 'Sí' : 'No' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Requiere Medicamento</label>
          <p class="mt-1 text-gray-900">{{ tipoControlSanitario.requiere_medicamento ? 'Sí' : 'No' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user?.rol === 'Administrador'" :to="`/tipos-control-sanitario/editar/${tipoControlSanitario.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user?.rol === 'Administrador'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/tipos-control-sanitario" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Tipo de control sanitario no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getTipoControlSanitarioById, deleteTipoControlSanitario } = useTipoControlSanitario()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const tipoControlSanitario = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getTipoControlSanitarioById(id)
  loading.value = false
  if (data.value) {
    tipoControlSanitario.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar tipo de control sanitario: ' + error.value.message
  } else {
    errorMsg.value = 'Tipo de control sanitario no encontrado'
  }
})

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este tipo de control sanitario?')) {
    const { error } = await deleteTipoControlSanitario(tipoControlSanitario.value.id)
    if (!error.value) {
      router.push('/tipos-control-sanitario')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>