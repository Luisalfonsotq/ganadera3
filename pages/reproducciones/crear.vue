<!-- pages/reproducciones/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Registro de Reproducción</h2>
    
    <form @submit.prevent="handleCrear" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Madre (Hembra) *</label>
          <select v-model.number="form.animal_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Selecciona la madre</option>
            <option v-for="animal in hembras" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.raza || 'Sin raza' }}
            </option>
          </select>
          <p v-if="loadingAnimales" class="text-xs text-blue-500 mt-1">Cargando animales...</p>
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

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || hembras.length === 0"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : hembras.length === 0 ? 'No hay hembras disponibles' : 'Crear Registro' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="reproduccionError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ reproduccionError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createReproduccion } = useReproduccion()
const { getAnimalesOfFinca } = useAnimal()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  animal_id: null,
  toro_id: null,
  fecha_celo: null,
  fecha_monta: null,
  tipo_monta: null,
  fecha_confirmacion_prenez: null,
  fecha_parto: null,
  crias_nacidas: null,
  observaciones: null,
})

const animales = ref([])
const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))
const loadingAnimales = ref(false)
const isSubmitting = ref(false)
const success = ref(null)
const reproduccionError = ref(null)

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

watch(user, loadAnimales, { immediate: true })
onMounted(loadAnimales)

const handleCrear = async () => {
  reproduccionError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) {
      throw new Error('Debes seleccionar la madre.')
    }

    const dataToSend = {
      animal_id: form.value.animal_id,
    }

    if (form.value.toro_id) {
      dataToSend.toro_id = form.value.toro_id
    }
    if (form.value.fecha_celo) {
      dataToSend.fecha_celo = form.value.fecha_celo
    }
    if (form.value.fecha_monta) {
      dataToSend.fecha_monta = form.value.fecha_monta
    }
    if (form.value.tipo_monta) {
      dataToSend.tipo_monta = form.value.tipo_monta
    }
    if (form.value.fecha_confirmacion_prenez) {
      dataToSend.fecha_confirmacion_prenez = form.value.fecha_confirmacion_prenez
    }
    if (form.value.fecha_parto) {
      dataToSend.fecha_parto = form.value.fecha_parto
    }
    if (form.value.crias_nacidas) {
      dataToSend.crias_nacidas = form.value.crias_nacidas
    }
    if (form.value.observaciones && form.value.observaciones.trim()) {
      dataToSend.observaciones = form.value.observaciones.trim()
    }

    const nuevaReproduccion = await createReproduccion(dataToSend)
    if (nuevaReproduccion) {
      success.value = 'Registro de reproducción creado exitosamente.'
      setTimeout(() => {
        router.push('/reproducciones')
      }, 1500)
    } else {
      reproduccionError.value = 'Error al crear el registro.'
    }
  } catch (err) {
    console.error('Error con más detalles:', err)
    if (err.data?.message) {
      reproduccionError.value = err.data.message
    } else {
      reproduccionError.value = err.message || 'Error al crear el registro.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>