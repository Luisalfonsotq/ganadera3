<!-- pages/fincas/editar/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Editar Finca</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="form" class="bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="form.nombre" required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ubicación</label>
          <input v-model="form.ubicacion"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamaño (ha)</label>
          <input v-model.number="form.tamano_ha" type="number" step="0.01"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
        </div>
        <button type="submit" :disabled="submitting"
          class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> {{ submitting ? 'Guardando...' : 'Guardar' }}
        </button>
        <NuxtLink to="/fincas" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Cancelar
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
const { getFincasById, updateFinca } = useFinca()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar fincas')
    router.push('/fincas')
    return
  }
  const id = route.params.id
  const { data, error } = await getFincasById(id)
  loading.value = false
  if (data.value) {
    form.value = { ...data.value }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar finca: ' + error.value.message
  } else {
    errorMsg.value = 'Finca no encontrada'
  }
})

const handleSubmit = async () => {
  submitting.value = true
  const { data, error } = await updateFinca(form.value.id, form.value)
  submitting.value = false
  if (data.value) {
    router.push('/fincas')
  } else {
    alert('Error al actualizar finca: ' + error.value.message)
  }
}
</script>