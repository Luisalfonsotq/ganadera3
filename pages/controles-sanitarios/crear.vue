<!-- pages/controles-sanitarios/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Control Sanitario</h2>
    
    <form @submit.prevent="handleCrear" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal *</label>
          <select v-model.number="form.animal_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Selecciona el animal</option>
            <option v-for="animal in animales" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.raza || 'Sin raza' }} ({{ animal.nombre_finca }})
            </option>
          </select>
          <p v-if="loadingAnimales" class="text-xs text-blue-500 mt-1">Cargando animales...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Control *</label>
          <select v-model.number="form.tipo_control_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingTipos">
            <option :value="null">Selecciona el tipo</option>
            <option v-for="tipo in tiposControl" :key="tipo.id" :value="tipo.id">
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

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || animales.length === 0"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : animales.length === 0 ? 'No hay animales disponibles' : 'Crear Control Sanitario' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="controlError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ controlError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createControl } = useControlSanitario()
const { getAnimalesOfFinca } = useAnimal()
const { getAllTiposControlSanitario } = useTipoControlSanitario()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  animal_id: null,
  tipo_control_id: null,
  veterinario_id: null,
  fecha: null,
  medicamento: null,
  dosis: null,
  via_aplicacion: null,
  observaciones: null,
  costo: null,
})

const animales = ref([])
const tiposControl = ref([])
const loadingAnimales = ref(false)
const loadingTipos = ref(false)
const isSubmitting = ref(false)
const success = ref(null)
const controlError = ref(null)

const requiereMedicamento = computed(() => {
  const tipoSeleccionado = tiposControl.value.find(t => t.id === form.value.tipo_control_id)
  return tipoSeleccionado?.requiere_medicamento || false
})

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingAnimales.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  
  if (fincasData.value && fincasData.value.length > 0) {
    const allAnimales = []
    for (const finca of fincasData.value) {
      const { data: animalesData } = await getAnimalesOfFinca(finca.id)
      if (animalesData.value) {
        const animalsWithFinca = animalesData.value.map(a => ({
          ...a,
          nombre_finca: finca.nombre
        }))
        allAnimales.push(...animalsWithFinca)
      }
    }
    animales.value = allAnimales
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

watch(user, () => {
  loadAnimales()
}, { immediate: true })

onMounted(() => {
  if (user.value?.rol !== 'Veterinario') {
    alert('No autorizado para crear controles sanitarios')
    router.push('/controles-sanitarios')
    return
  }
  
  loadAnimales()
  loadTiposControl()
})

const handleCrear = async () => {
  controlError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) {
      throw new Error('Debes seleccionar el animal.')
    }
    if (!form.value.tipo_control_id) {
      throw new Error('Debes seleccionar el tipo de control.')
    }
    if (!form.value.fecha) {
      throw new Error('Debes ingresar la fecha del control.')
    }

    const dataToSend = {
      animal_id: form.value.animal_id,
      tipo_control_id: form.value.tipo_control_id,
      fecha: form.value.fecha,
      veterinario_id: user.value.id // Asignar automáticamente el veterinario actual
    }

    if (form.value.medicamento && form.value.medicamento.trim()) {
      dataToSend.medicamento = form.value.medicamento.trim()
    }
    if (form.value.dosis) {
      dataToSend.dosis = form.value.dosis
    }
    if (form.value.via_aplicacion) {
      dataToSend.via_aplicacion = form.value.via_aplicacion
    }
    if (form.value.observaciones && form.value.observaciones.trim()) {
      dataToSend.observaciones = form.value.observaciones.trim()
    }
    if (form.value.costo) {
      dataToSend.costo = form.value.costo
    }

    const nuevoControl = await createControl(dataToSend)
    if (nuevoControl) {
      success.value = 'Control sanitario creado exitosamente.'
      setTimeout(() => {
        router.push('/controles-sanitarios')
      }, 1500)
    } else {
      controlError.value = 'Error al crear el control sanitario.'
    }
  } catch (err) {
    console.error('Error con más detalles:', err)
    if (err.data?.message) {
      controlError.value = err.data.message
    } else {
      controlError.value = err.message || 'Error al crear el control sanitario.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>