<!-- pages/controles-sanitarios/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Editar Control Sanitario</h2>
    
    <div v-if="loading" class="text-center text-gray-500 py-8">Cargando información del control...</div>
    <div v-else-if="errorMsg" class="text-center text-red-500 py-8 bg-red-50 rounded-lg p-4">{{ errorMsg }}</div>
    
    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-4">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-blue-800">Editando Control Sanitario</p>
            <p class="text-sm text-blue-700">ID: <span class="font-bold">{{ form.id }}</span></p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal *</label>
          <select v-model.number="form.animal_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option v-for="animal in animales" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.raza || 'Sin raza' }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Control *</label>
          <select v-model.number="form.tipo_control_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingTipos">
            <option v-for="tipo in tiposControl" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Veterinario</label>
          <select v-model.number="form.veterinario_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingVeterinarios">
            <option :value="null">Sin veterinario asignado</option>
            <option v-for="vet in veterinarios" :key="vet.id" :value="vet.id">
              {{ vet.nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha *</label>
          <input type="date" v-model="form.fecha" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div v-if="requiereMedicamento">
          <label class="block text-sm font-medium text-gray-700">Medicamento *</label>
          <input type="text" v-model="form.medicamento" :required="requiereMedicamento"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Nombre del medicamento">
        </div>

        <div v-if="form.medicamento">
          <label class="block text-sm font-medium text-gray-700">Dosis</label>
          <input type="number" v-model.number="form.dosis" min="0" step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: 5">
        </div>

        <div v-if="form.medicamento">
          <label class="block text-sm font-medium text-gray-700">Vía de Aplicación</label>
          <select v-model="form.via_aplicacion"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option :value="null">Selecciona vía</option>
            <option value="Oral">Oral</option>
            <option value="Intramuscular">Intramuscular</option>
            <option value="Intravenosa">Intravenosa</option>
            <option value="Subcutánea">Subcutánea</option>
            <option value="Tópica">Tópica</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Costo</label>
          <input type="number" v-model.number="form.costo" min="0" step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: 50000">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea v-model="form.observaciones" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Notas adicionales sobre el control sanitario"></textarea>
        </div>
      </div>

      <div class="flex gap-2 pt-4">
        <button type="submit" :disabled="submitting"
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> 
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/controles-sanitarios" 
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

const { getControlById, updateControl } = useControlSanitario()
const { getAnimalesOfFinca } = useAnimal()
const { getAllTiposControlSanitario } = useTipoControlSanitario()
const { getVeterinarios } = useUsuario()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()

const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)
const updateSuccess = ref('')
const updateError = ref('')
const animales = ref([])
const tiposControl = ref([])
const veterinarios = ref([])
const loadingAnimales = ref(false)
const loadingTipos = ref(false)
const loadingVeterinarios = ref(false)

const requiereMedicamento = computed(() => {
  const tipoSeleccionado = tiposControl.value.find(t => t.id === form.value?.tipo_control_id)
  return tipoSeleccionado?.requiere_medicamento || false
})

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingAnimales.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  
  if (fincasData.value && fincasData.value.length > 0) {
    const { data: animalesData } = await getAnimalesOfFinca(fincasData.value[0].id)
    if (animalesData.value) {
      animales.value = animalesData.value
    }
  }
  loadingAnimales.value = false
}

const loadTiposControl = async () => {
  loadingTipos.value = true
  const { data } = await getAllTiposControlSanitario()
  if (data.value) {
    tiposControl.value = data.value
  }
  loadingTipos.value = false
}

const loadVeterinarios = async () => {
  loadingVeterinarios.value = true
  const { data } = await getVeterinarios()
  if (data.value) {
    veterinarios.value = data.value
  }
  loadingVeterinarios.value = false
}

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Veterinario') {
    alert('No autorizado para editar controles sanitarios')
    router.push('/controles-sanitarios')
    return
  }

  await loadAnimales()
  await loadTiposControl()
  await loadVeterinarios()

  const id = route.params.id
  const { data, error } = await getControlById(id)
  loading.value = false

  if (data.value) {
    form.value = {
      ...data.value,
      fecha: data.value.fecha ? data.value.fecha.split('T')[0] : null,
    }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar control: ' + error.value.message
  } else {
    errorMsg.value = 'Control sanitario no encontrado'
  }
})

const handleSubmit = async () => {
  updateSuccess.value = ''
  updateError.value = ''
  submitting.value = true

  try {
    const dataToUpdate = { ...form.value }

    const { data, error } = await updateControl(form.value.id, dataToUpdate)
    
    if (data) {
      updateSuccess.value = 'Control sanitario actualizado exitosamente'
      setTimeout(() => {
        router.push('/controles-sanitarios')
      }, 1500)
    } else {
      updateError.value = error?.message || 'Error desconocido al actualizar'
    }
  } catch (err) {
    updateError.value = err.message || 'Error al procesar la solicitud'
    console.error('Error al actualizar control:', err)
  } finally {
    submitting.value = false
  }
}
</script>