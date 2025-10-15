<!-- pages/crias/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles de la Cría</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="cria" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ cria.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal (Cría)</label>
          <p class="mt-1 text-gray-900">
            {{ cria.cria_animal?.identificador_unico || 'N/A' }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Madre</label>
          <p class="mt-1 text-gray-900">
            {{ cria.madre?.identificador_unico || 'N/A' }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Padre</label>
          <p class="mt-1 text-gray-900">
            {{ cria.padre?.identificador_unico || 'Sin padre registrado' }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <p class="mt-1 text-gray-900">{{ formatDate(cria.fecha_nacimiento) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sexo de la Cría</label>
          <p class="mt-1 text-gray-900 capitalize">
            {{ cria.cria_animal?.sexo || 'N/A' }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Raza</label>
          <p class="mt-1 text-gray-900">
            {{ cria.cria_animal?.raza || 'N/A' }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado de Salud</label>
          <p class="mt-1 text-gray-900 capitalize">
            <span :class="getEstadoSaludClass(cria.cria_animal?.estado_salud)">
              {{ cria.cria_animal?.estado_salud || 'N/A' }}
            </span>
          </p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/crias/editar/${cria.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/crias" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Cría no encontrada.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getCriaById, deleteCria } = useCria()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const cria = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getCriaById(id)
  loading.value = false
  if (data.value) {
    cria.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar cría: ' + error.value.message
  } else {
    errorMsg.value = 'Cría no encontrada'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const getEstadoSaludClass = (estado) => {
  const classes = {
    'sano': 'px-2 py-1 rounded-full bg-green-100 text-green-800',
    'diagnosticado_enfermo': 'px-2 py-1 rounded-full bg-red-100 text-red-800',
    'en_tratamiento': 'px-2 py-1 rounded-full bg-yellow-100 text-yellow-800'
  }
  return classes[estado] || 'px-2 py-1 rounded-full bg-gray-100 text-gray-800'
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este registro de cría?')) {
    const { error } = await deleteCria(cria.value.id)
    if (!error.value) {
      router.push('/crias')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>