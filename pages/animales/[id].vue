<!-- pages/animales/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles del Animal</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="animal" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ animal.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Arete Único</label>
          <p class="mt-1 text-gray-900">{{ animal.arete_unico }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Raza</label>
          <p class="mt-1 text-gray-900">{{ animal.raza || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sexo</label>
          <p class="mt-1 text-gray-900 capitalize">{{ animal.sexo }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <p class="mt-1 text-gray-900">{{ formatDate(animal.fecha_nacimiento) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado Reproductivo</label>
          <p class="mt-1 text-gray-900 capitalize">{{ animal.estado_reproductivo || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado de Salud</label>
          <p class="mt-1 text-gray-900 capitalize">
            <span :class="getEstadoSaludClass(animal.estado_salud)">
              {{ animal.estado_salud }}
            </span>
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Origen</label>
          <p class="mt-1 text-gray-900 capitalize">{{ animal.origen || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <p class="mt-1 text-gray-900">{{ formatDate(animal.fecha_adquisicion) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Finca</label>
          <p class="mt-1 text-gray-900">{{ animal.finca?.nombre || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Potrero</label>
          <p class="mt-1 text-gray-900">{{ animal.potrero?.nombre || 'Sin asignar' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Proveedor</label>
          <p class="mt-1 text-gray-900">{{ animal.proveedor?.nombre || 'N/A' }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/animales/editar/${animal.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/animales" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Animal no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getAnimalById, deleteAnimal } = useAnimal()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const animal = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getAnimalById(id)
  loading.value = false
  if (data.value) {
    animal.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar animal: ' + error.value.message
  } else {
    errorMsg.value = 'Animal no encontrado'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES')
}

const getEstadoSaludClass = (estado) => {
  const classes = {
    'sano': 'px-2 py-1 rounded-full bg-green-100 text-green-800',
    'enfermo': 'px-2 py-1 rounded-full bg-red-100 text-red-800',
    'en_tratamiento': 'px-2 py-1 rounded-full bg-yellow-100 text-yellow-800'
  }
  return classes[estado] || 'px-2 py-1 rounded-full bg-gray-100 text-gray-800'
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este animal?')) {
    const { error } = await deleteAnimal(animal.value.id)
    if (!error.value) {
      router.push('/animales')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>