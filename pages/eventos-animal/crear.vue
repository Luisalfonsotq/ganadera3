<!-- pages/eventos-animal/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Evento de Animal</h2>
    
    <form @submit.prevent="handleCrear" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal *</label>
          <select v-model.number="form.animal_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Selecciona el animal</option>
            <option v-for="animal in animales" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.raza || 'Sin raza' }}
            </option>
          </select>
          <p v-if="loadingAnimales" class="text-xs text-blue-500 mt-1">Cargando animales...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Evento *</label>
          <select v-model.number="form.tipo_evento_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingTipos">
            <option :value="null">Selecciona el tipo</option>
            <option v-for="tipo in tiposEvento" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
          <p v-if="loadingTipos" class="text-xs text-blue-500 mt-1">Cargando tipos...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha *</label>
          <input type="date" v-model="form.fecha" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Valor Medida</label>
          <input type="number" v-model.number="form.valor_medida" min="0" step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: peso, temperatura">
        </div>

        <div v-if="esCambioPotrero">
          <label class="block text-sm font-medium text-gray-700">Potrero Anterior *</label>
          <select v-model.number="form.potrero_anterior_id" :required="esCambioPotrero"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingPotreros">
            <option :value="null">Selecciona potrero anterior</option>
            <option v-for="potrero in potreros" :key="potrero.id" :value="potrero.id">
              {{ potrero.nombre }}
            </option>
          </select>
        </div>

        <div v-if="esCambioPotrero">
          <label class="block text-sm font-medium text-gray-700">Potrero Actual *</label>
          <select v-model.number="form.potrero_actual_id" :required="esCambioPotrero"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingPotreros">
            <option :value="null">Selecciona potrero actual</option>
            <option v-for="potrero in potreros" :key="potrero.id" :value="potrero.id">
              {{ potrero.nombre }}
            </option>
          </select>
        </div>

        <div :class="esCambioPotrero ? 'md:col-span-2' : 'md:col-span-2'">
          <label class="block text-sm font-medium text-gray-700">Detalle</label>
          <textarea v-model="form.detalle" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Notas adicionales sobre el evento"></textarea>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || animales.length === 0"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : animales.length === 0 ? 'No hay animales disponibles' : 'Crear Evento' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="eventoError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ eventoError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createEvento } = useEventoAnimal()
const { getAnimalesOfFinca } = useAnimal()
const { getAllTiposEvento } = useTipoEventoAnimal()
const { getPotrerosOfFinca } = usePotrero()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  animal_id: null,
  tipo_evento_id: null,
  fecha: null,
  detalle: null,
  valor_medida: null,
  potrero_anterior_id: null,
  potrero_actual_id: null,
})

const animales = ref([])
const tiposEvento = ref([])
const potreros = ref([])
const loadingAnimales = ref(false)
const loadingTipos = ref(false)
const loadingPotreros = ref(false)
const isSubmitting = ref(false)
const success = ref(null)
const eventoError = ref(null)

const esCambioPotrero = computed(() => {
  const tipoSeleccionado = tiposEvento.value.find(t => t.id === form.value.tipo_evento_id)
  return tipoSeleccionado?.nombre === 'Cambio de Potrero'
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

const loadTiposEvento = async () => {
  loadingTipos.value = true
  const { data } = await getAllTiposEvento()
  if (data.value) {
    tiposEvento.value = data.value
  }
  loadingTipos.value = false
}

const loadPotreros = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingPotreros.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  
  if (fincasData.value && fincasData.value.length > 0) {
    const { data: potrerosData } = await getPotrerosOfFinca(fincasData.value[0].id)
    if (potrerosData.value) {
      potreros.value = potrerosData.value
    }
  }
  loadingPotreros.value = false
}

watch(user, () => {
  loadAnimales()
  loadPotreros()
}, { immediate: true })

onMounted(() => {
  loadAnimales()
  loadTiposEvento()
  loadPotreros()
})

const handleCrear = async () => {
  eventoError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) {
      throw new Error('Debes seleccionar el animal.')
    }
    if (!form.value.tipo_evento_id) {
      throw new Error('Debes seleccionar el tipo de evento.')
    }
    if (!form.value.fecha) {
      throw new Error('Debes ingresar la fecha del evento.')
    }

    const dataToSend = {
      animal_id: form.value.animal_id,
      tipo_evento_id: form.value.tipo_evento_id,
      fecha: form.value.fecha,
    }

    if (form.value.detalle && form.value.detalle.trim()) {
      dataToSend.detalle = form.value.detalle.trim()
    }
    if (form.value.valor_medida) {
      dataToSend.valor_medida = form.value.valor_medida
    }
    if (form.value.potrero_anterior_id) {
      dataToSend.potrero_anterior_id = form.value.potrero_anterior_id
    }
    if (form.value.potrero_actual_id) {
      dataToSend.potrero_actual_id = form.value.potrero_actual_id
    }

    const nuevoEvento = await createEvento(dataToSend)
    if (nuevoEvento) {
      success.value = 'Evento creado exitosamente.'
      setTimeout(() => {
        router.push('/eventos-animal')
      }, 1500)
    } else {
      eventoError.value = 'Error al crear el evento.'
    }
  } catch (err) {
    console.error('Error con más detalles:', err)
    if (err.data?.message) {
      eventoError.value = err.data.message
    } else {
      eventoError.value = err.message || 'Error al crear el evento.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>