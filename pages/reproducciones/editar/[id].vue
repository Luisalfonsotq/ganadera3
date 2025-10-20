<!-- pages/reproducciones/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Editar Registro de Reproducción</h2>
    
    <div v-if="loading" class="text-center text-gray-500 py-8">Cargando información del registro...</div>
    <div v-else-if="errorMsg" class="text-center text-red-500 py-8 bg-red-50 rounded-lg p-4">{{ errorMsg }}</div>
    
    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-4">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-blue-800">Editando Registro de Reproducción</p>
            <p class="text-sm text-blue-700">ID: <span class="font-bold">{{ form.id }}</span></p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Madre (Hembra) *</label>
          <select v-model.number="form.animal_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option v-for="animal in hembras" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.raza || 'Sin raza' }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Padre (Macho)</label>
          <select v-model.number="form.toro_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Sin padre asignado</option>
            <option v-for="animal in machos" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.raza || 'Sin raza' }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Celo</label>
          <input type="date" v-model="form.fecha_celo"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Monta</label>
          <input type="date" v-model="form.fecha_monta"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Monta</label>
          <select v-model="form.tipo_monta"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option :value="null">Selecciona el tipo</option>
            <option value="natural">Natural</option>
            <option value="inseminacion">Inseminación</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha Confirmación Preñez</label>
          <input type="date" v-model="form.fecha_confirmacion_prenez"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Parto</label>
          <input type="date" v-model="form.fecha_parto"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Crías Nacidas</label>
          <input type="number" v-model.number="form.crias_nacidas" min="0" step="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: 1">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea v-model="form.observaciones" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Notas adicionales sobre la reproducción"></textarea>
        </div>
      </div>

      <div class="flex gap-2 pt-4">
        <button type="submit" :disabled="submitting"
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> 
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/reproducciones" 
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

const { getReproduccionById, updateReproduccion } = useReproduccion()
const { getAnimalesOfFinca } = useAnimal()
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
const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))
const loadingAnimales = ref(false)

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

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar registros de reproducción')
    router.push('/reproducciones')
    return
  }

  await loadAnimales()

  const id = route.params.id
  const { data, error } = await getReproduccionById(id)
  loading.value = false

  if (data.value) {
    form.value = {
      ...data.value,
      fecha_celo: data.value.fecha_celo ? data.value.fecha_celo.split('T')[0] : null,
      fecha_monta: data.value.fecha_monta ? data.value.fecha_monta.split('T')[0] : null,
      fecha_confirmacion_prenez: data.value.fecha_confirmacion_prenez ? data.value.fecha_confirmacion_prenez.split('T')[0] : null,
      fecha_parto: data.value.fecha_parto ? data.value.fecha_parto.split('T')[0] : null,
    }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar registro: ' + error.value.message
  } else {
    errorMsg.value = 'Registro no encontrado'
  }
})

const handleSubmit = async () => {
  updateSuccess.value = ''
  updateError.value = ''
  submitting.value = true

  try {
    const dataToUpdate = { ...form.value }

    const { data, error } = await updateReproduccion(form.value.id, dataToUpdate)
    
    if (data) {
      updateSuccess.value = 'Registro actualizado exitosamente'
      setTimeout(() => {
        router.push('/reproducciones')
      }, 1500)
    } else {
      updateError.value = error?.message || 'Error desconocido al actualizar'
    }
  } catch (err) {
    updateError.value = err.message || 'Error al procesar la solicitud'
    console.error('Error al actualizar reproducción:', err)
  } finally {
    submitting.value = false
  }
}
</script>