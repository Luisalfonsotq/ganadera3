<!-- pages/crias/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Editar Cría</h2>
    
    <div v-if="loading" class="text-center text-gray-500 py-8">Cargando información de la cría...</div>
    <div v-else-if="errorMsg" class="text-center text-red-500 py-8 bg-red-50 rounded-lg p-4">{{ errorMsg }}</div>
    
    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Banner informativo con ID -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-blue-800">Editando Cría</p>
            <p class="text-sm text-blue-700">ID: <span class="font-bold">{{ form.id }}</span></p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal (Cría) *</label>
          <input v-model="animalNombre" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed p-2 border" />
          <p class="text-xs text-gray-500 mt-1">El animal no puede ser modificado</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento *</label>
          <input type="date" v-model="form.fecha_nacimiento" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Madre (Hembra) *</label>
          <select v-model.number="form.madre_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option v-for="hembra in hembras" :key="hembra.id" :value="hembra.id">
              {{ hembra.identificador_unico }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Padre (Macho) - Opcional</label>
          <select v-model.number="form.padre_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Sin padre</option>
            <option v-for="macho in machos" :key="macho.id" :value="macho.id">
              {{ macho.identificador_unico }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex gap-2 pt-4">
        <button type="submit" :disabled="submitting"
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> 
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/crias" 
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

const { getCriaById, updateCria } = useCria()
const { animales, getAnimalesOfFinca } = useAnimal()
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
const loadingAnimales = ref(false)
const animalNombre = ref('')

const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingAnimales.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  
  if (fincasData.value && fincasData.value.length > 0) {
    await getAnimalesOfFinca(fincasData.value[0].id)
  }
  loadingAnimales.value = false
}

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar crías')
    router.push('/crias')
    return
  }

  await loadAnimales()

  const id = route.params.id
  const { data, error } = await getCriaById(id)
  loading.value = false

  if (data.value) {
    form.value = {
      id: data.value.id,
      animal_id: data.value.animal_id,
      madre_id: data.value.madre_id,
      padre_id: data.value.padre_id,
      fecha_nacimiento: data.value.fecha_nacimiento ? data.value.fecha_nacimiento.split('T')[0] : null,
    }
    animalNombre.value = data.value.cria_animal?.identificador_unico || 'N/A'
  } else if (error.value) {
    errorMsg.value = 'Error al cargar cría: ' + error.value.message
  } else {
    errorMsg.value = 'Cría no encontrada'
  }
})

const handleSubmit = async () => {
  updateSuccess.value = ''
  updateError.value = ''
  submitting.value = true

  try {
    const dataToUpdate = {
      madre_id: form.value.madre_id,
      padre_id: form.value.padre_id,
      fecha_nacimiento: form.value.fecha_nacimiento,
    }

    const { data, error } = await updateCria(form.value.id, dataToUpdate)
    
    if (data) {
      updateSuccess.value = 'Cría actualizada exitosamente'
      setTimeout(() => {
        router.push('/crias')
      }, 1500)
    } else {
      updateError.value = error?.message || 'Error desconocido al actualizar'
    }
  } catch (err) {
    updateError.value = err.message || 'Error al procesar la solicitud'
    console.error('Error al actualizar cría:', err)
  } finally {
    submitting.value = false
  }
}
</script>