<!-- pages/tipos-control-sanitario/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Editar Tipo de Control Sanitario</h2>
    
    <div v-if="loading" class="text-center text-gray-500 py-8">Cargando información del tipo de control sanitario...</div>
    <div v-else-if="errorMsg" class="text-center text-red-500 py-8 bg-red-50 rounded-lg p-4">{{ errorMsg }}</div>
    
    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-4">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-blue-800">Editando Tipo de Control Sanitario</p>
            <p class="text-sm text-blue-700">ID: <span class="font-bold">{{ form.id }}</span></p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre *</label>
          <input type="text" v-model="form.nombre" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: Vacunación, Desparasitación">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="form.descripcion" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Descripción del tipo de control sanitario"></textarea>
        </div>

        <div class="flex items-center">
          <input type="checkbox" v-model="form.aplica_a_sexo" id="aplica_a_sexo"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
          <label for="aplica_a_sexo" class="ml-2 block text-sm text-gray-700">
            Aplica a sexo específico
          </label>
        </div>

        <div class="flex items-center">
          <input type="checkbox" v-model="form.requiere_medicamento" id="requiere_medicamento"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
          <label for="requiere_medicamento" class="ml-2 block text-sm text-gray-700">
            Requiere medicamento
          </label>
        </div>
      </div>

      <div class="flex gap-2 pt-4">
        <button type="submit" :disabled="submitting"
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> 
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/tipos-control-sanitario" 
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> 
          Cancelar
        </NuxtLink>
      </div>

      <div v-if="updateSuccess" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
        ✅ {{ updateSuccess }}
      </div>
      <div v-if="updateError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
        ❌ Error: {{ updateError }}
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getTipoControlSanitarioById, updateTipoControlSanitario } = useTipoControlSanitario()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()

const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)
const updateSuccess = ref('')
const updateError = ref('')

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar tipos de control sanitario')
    router.push('/tipos-control-sanitario')
    return
  }

  const id = route.params.id
  const { data, error } = await getTipoControlSanitarioById(id)
  loading.value = false

  if (data.value) {
    form.value = { ...data.value }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar tipo de control sanitario: ' + error.value.message
  } else {
    errorMsg.value = 'Tipo de control sanitario no encontrado'
  }
})

const handleSubmit = async () => {
  updateSuccess.value = ''
  updateError.value = ''
  submitting.value = true

  try {
    if (!form.value.nombre || !form.value.nombre.trim()) {
      throw new Error('Debes ingresar el nombre del tipo de control sanitario.')
    }

    const dataToUpdate = {
      nombre: form.value.nombre.trim(),
      aplica_a_sexo: form.value.aplica_a_sexo,
      requiere_medicamento: form.value.requiere_medicamento,
    }

    if (form.value.descripcion && form.value.descripcion.trim()) {
      dataToUpdate.descripcion = form.value.descripcion.trim()
    }

    const { data, error } = await updateTipoControlSanitario(form.value.id, dataToUpdate)
    
    if (data) {
      updateSuccess.value = 'Tipo de control sanitario actualizado exitosamente'
      setTimeout(() => {
        router.push('/tipos-control-sanitario')
      }, 1500)
    } else {
      updateError.value = error?.message || 'Error desconocido al actualizar'
    }
  } catch (err) {
    updateError.value = err.message || 'Error al procesar la solicitud'
    console.error('Error al actualizar tipo de control sanitario:', err)
  } finally {
    submitting.value = false
  }
}
</script>