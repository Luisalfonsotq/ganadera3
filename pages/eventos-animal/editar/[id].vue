<!-- pages/eventos-animal/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Editar Evento de Animal</h2>

    <div v-if="loading" class="text-center text-gray-500 py-8">Cargando información del evento...</div>
    <div v-else-if="errorMsg" class="text-center text-red-500 py-8 bg-red-50 rounded-lg p-4">{{ errorMsg }}</div>

    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-4">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-blue-800">Editando Evento</p>
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
          <label class="block text-sm font-medium text-gray-700">Tipo de Evento *</label>
          <select v-model.number="form.tipo_evento_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingTipos">
            <option v-for="tipo in tiposEvento" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
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
            <option :value="null">Sin potrero anterior</option>
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
            <option :value="null">Sin potrero actual</option>
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

      <div class="flex gap-2 pt-4">
        <button type="submit" :disabled="submitting"
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" />
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/eventos-animal"
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

const { getEventoById, updateEvento } = useEventoAnimal()
const { getAnimalesOfFinca } = useAnimal()
const { getAllTiposEvento } = useTipoEventoAnimal()
const { getPotrerosOfFinca } = usePotrero()
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
const tiposEvento = ref([])
const potreros = ref([])
const loadingAnimales = ref(false)
const loadingTipos = ref(false)
const loadingPotreros = ref(false)

const esCambioPotrero = computed(() => {
  const tipoSeleccionado = tiposEvento.value.find(t => t.id === form.value?.tipo_evento_id)
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

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar eventos')
    router.push('/eventos-animal')
    return
  }

  await loadAnimales()
  await loadTiposEvento()
  await loadPotreros()

  const id = route.params.id
  const { data, error } = await getEventoById(id)
  loading.value = false

  if (data.value) {
    if (data.value.animal) {
      const animalExiste = animales.value.find(a => a.id === data.value.animal.id)
      if (!animalExiste) {
        animales.value.push({
          ...data.value.animal,
          identificador_unico: `${data.value.animal.identificador_unico} (Dado de baja)`
        })
      }
    }

    form.value = {
      ...data.value,
      fecha: data.value.fecha ? data.value.fecha.split('T')[0] : null,
    }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar evento: ' + error.value.message
  } else {
    errorMsg.value = 'Evento no encontrado'
  }
})

const handleSubmit = async () => {
  updateSuccess.value = ''
  updateError.value = ''
  submitting.value = true

  try {
    const dataToUpdate = { ...form.value }

    const { data, error } = await updateEvento(form.value.id, dataToUpdate)

    if (data) {
      updateSuccess.value = 'Evento actualizado exitosamente'
      setTimeout(() => {
        router.push('/eventos-animal')
      }, 1500)
    } else {
      updateError.value = error?.message || 'Error desconocido al actualizar'
    }
  } catch (err) {
    updateError.value = err.message || 'Error al procesar la solicitud'
    console.error('Error al actualizar evento:', err)
  } finally {
    submitting.value = false
  }
}
</script>