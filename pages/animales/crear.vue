<!-- pages/animales/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Animal</h2>
    
    <form @submit.prevent="handleCrearAnimal" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Arete Único *</label>
          <input type="text" v-model="form.arete_unico" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
            required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Raza</label>
          <input type="text" v-model="form.raza" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Sexo *</label>
          <select v-model="form.sexo" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona el sexo</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input type="date" v-model="form.fecha_nacimiento" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado Reproductivo</label>
          <select v-model="form.estado_reproductivo"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona un estado</option>
            <option value="lactancia">Lactancia</option>
            <option value="prenada">Preñada</option>
            <option value="vacia">Vacía</option>
            <option value="en_produccion">En Producción</option>
            <option value="engorde">Engorde</option>
            <option value="cebo">Cebo</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado de Salud</label>
          <select v-model="form.estado_salud"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="sano">Sano</option>
            <option value="enfermo">Enfermo</option>
            <option value="en_tratamiento">En Tratamiento</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Origen</label>
          <select v-model="form.origen"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona el origen</option>
            <option value="nativo">Nativo</option>
            <option value="foraneo">Foráneo</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <input type="date" v-model="form.fecha_adquisicion" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Finca *</label>
          <select v-model.number="form.finca_id" @change="onFincaChange" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingFincas || fincas.length === 0">
            <option :value="null">Selecciona una finca</option>
            <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
          </select>
          <p v-if="loadingFincas" class="text-xs text-blue-500 mt-1">Cargando fincas...</p>
          <p v-else-if="errorFincas" class="text-xs text-red-500 mt-1">{{ errorFincas }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Potrero</label>
          <select v-model.number="form.potrero_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="!form.finca_id || loadingPotreros">
            <option :value="null">Sin asignar</option>
            <option v-for="potrero in potreros" :key="potrero.id" :value="potrero.id">{{ potrero.nombre }}</option>
          </select>
          <p v-if="loadingPotreros" class="text-xs text-blue-500 mt-1">Cargando potreros...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Proveedor</label>
          <select v-model.number="form.proveedor_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingProveedores">
            <option :value="null">Sin proveedor</option>
            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
          </select>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || fincas.length === 0"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : fincas.length === 0 ? 'No hay fincas disponibles' : 'Crear Animal' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="animalError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ animalError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createAnimal } = useAnimal()
const { getAllFincas } = useFinca()
const { getPotrerosOfFinca } = usePotrero()
const { getAllProveedores } = useProveedor()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  arete_unico: '',
  raza: '',
  sexo: '',
  fecha_nacimiento: null,
  estado_reproductivo: null,
  estado_salud: 'sano',
  origen: null,
  fecha_adquisicion: null,
  finca_id: null,
  potrero_id: null,
  proveedor_id: null,
})

const fincas = ref([])
const potreros = ref([])
const proveedores = ref([])
const loadingFincas = ref(false)
const loadingPotreros = ref(false)
const loadingProveedores = ref(false)
const errorFincas = ref('')
const isSubmitting = ref(false)
const success = ref(null)
const animalError = ref(null)

const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingFincas.value = true
  errorFincas.value = ''
  const { data, error } = await getAllFincas(userId, user.value.rol)
  loadingFincas.value = false
  
  if (data.value) {
    fincas.value = data.value
  } else if (error.value) {
    errorFincas.value = 'Error al cargar fincas: ' + error.value.message
  }
}

const onFincaChange = async () => {
  if (form.value.finca_id) {
    form.value.potrero_id = null
    loadingPotreros.value = true
    const { data } = await getPotrerosOfFinca(form.value.finca_id)
    loadingPotreros.value = false
    if (data.value) {
      potreros.value = data.value
    }
  }
}

watch(user, loadFincas, { immediate: true })
onMounted(loadFincas)

const handleCrearAnimal = async () => {
  animalError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.finca_id) {
      throw new Error('Debes seleccionar una finca.')
    }
    if (!form.value.arete_unico.trim()) {
      throw new Error('Debes ingresar el arete único.')
    }
    if (!form.value.sexo) {
      throw new Error('Debes seleccionar el sexo del animal.')
    }

    const dataToSend = {
      arete_unico: form.value.arete_unico,
      sexo: form.value.sexo,
      finca_id: form.value.finca_id,
      estado_salud: form.value.estado_salud || 'sano',
    }

    if (form.value.raza && form.value.raza.trim()) {
      dataToSend.raza = form.value.raza.trim()
    }
    if (form.value.fecha_nacimiento) {
      dataToSend.fecha_nacimiento = form.value.fecha_nacimiento
    }
    if (form.value.estado_reproductivo) {
      dataToSend.estado_reproductivo = form.value.estado_reproductivo
    }
    if (form.value.origen) {
      dataToSend.origen = form.value.origen
    }
    if (form.value.fecha_adquisicion) {
      dataToSend.fecha_adquisicion = form.value.fecha_adquisicion
    }
    if (form.value.potrero_id) {
      dataToSend.potrero_id = form.value.potrero_id
    }
    if (form.value.proveedor_id) {
      dataToSend.proveedor_id = form.value.proveedor_id
    }

    const nuevoAnimal = await createAnimal(dataToSend)
    if (nuevoAnimal) {
      success.value = `Animal "${nuevoAnimal.arete_unico}" creado exitosamente.`
      router.push('/animales')
    } else {
      animalError.value = 'Error al crear el animal.'
    }
  } catch (err) {
    animalError.value = err.message
    console.error('Error en la creación del animal:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>