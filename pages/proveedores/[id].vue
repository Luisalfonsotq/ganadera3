<!-- pages/proveedores/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles del Proveedor</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="proveedor" class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID</label>
          <p class="mt-1 text-gray-900">{{ proveedor.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <p class="mt-1 text-gray-900">{{ proveedor.nombre }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contacto</label>
          <p class="mt-1 text-gray-900">{{ proveedor.contacto || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <p class="mt-1 text-gray-900">{{ proveedor.telefono || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Dirección</label>
          <p class="mt-1 text-gray-900">{{ proveedor.direccion || 'N/A' }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Observaciones</label>
          <p class="mt-1 text-gray-900">{{ proveedor.observaciones || 'N/A' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
          <p class="mt-1 text-gray-900">{{ formatDate(proveedor.created_at) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Última Actualización</label>
          <p class="mt-1 text-gray-900">{{ formatDate(proveedor.updated_at) }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/proveedores/editar/${proveedor.id}`" 
          class="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
        </NuxtLink>
        <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" 
          class="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
        </button>
        <NuxtLink to="/proveedores" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-gray-500">Proveedor no encontrado.</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getProveedorById, deleteProveedor } = useProveedor()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const proveedor = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getProveedorById(id)
  loading.value = false
  if (data.value) {
    proveedor.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar proveedor: ' + error.value.message
  } else {
    errorMsg.value = 'Proveedor no encontrado'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este proveedor?')) {
    const { error } = await deleteProveedor(proveedor.value.id)
    if (!error.value) {
      router.push('/proveedores')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>