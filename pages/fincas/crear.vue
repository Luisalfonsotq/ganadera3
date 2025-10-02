<!-- pages/fincas/crear.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Crear Finca</h1>
    <div class="bg-white p-6 rounded-lg shadow">
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
          <Icon name="heroicons:plus-circle" class="w-5 h-5 mr-2" /> {{ submitting ? 'Creando...' : 'Crear' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'profile-layout'})
const { createFinca } = useFinca()
const { user } = useAuth()
const router = useRouter()
const form = ref({
  nombre: '',
  ubicacion: '',
  tamano_ha: null
})
const submitting = ref(false)

onMounted(() => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para crear fincas')
    router.push('/fincas')
  }
})

const handleSubmit = async () => {
  if (!user.value) return
  submitting.value = true
  const userId = user.value.id || user.value.userId
  const fincaData = { ...form.value, propietario_id: userId }
  const { data, error } = await createFinca(fincaData)
  submitting.value = false
  if (data.value) {
    router.push('/fincas')
  } else {
    alert('Error al crear finca: ' + error.value.message)
  }
}
</script>