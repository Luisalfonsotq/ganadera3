<!-- pages/animales/editar/[id].vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Editar Animal</h1>
    <div v-if="loading" class="text-gray-500">Cargando...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="form" class="bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Arete Único *</label>
            <input v-model="form.arete_unico" required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Raza</label>
            <input v-model="form.raza"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Sexo *</label>
            <select v-model="form.sexo" required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white">
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input v-model="form.fecha_nacimiento" type="date"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Estado Reproductivo</label>
            <select v-model="form.estado_reproductivo"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white">
              <option :value="null">Sin especificar</option>
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
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white">
              <option value="sano">Sano</option>
              <option value="enfermo">Enfermo</option>
              <option value="en_tratamiento">En Tratamiento</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Origen</label>
            <select v-model="form.origen"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white">
              <option :value="null">Sin especificar</option>
              <option value="nativo">Nativo</option>
              <option value="foraneo">Foráneo</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
            <input v-model="form.fecha_adquisicion" type="date"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Finca *</label>
            <select v-model.number="form.finca_id" @change="onFincaChange" required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white"
              :disabled="loadingFincas">
              <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Potrero</label>
            <select v-model.number="form.potrero_id"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white"
              :disabled="!form.finca_id || loadingPotreros">
              <option :value="null">Sin asignar</option>
              <option v-for="potrero in potreros" :key="potrero.id" :value="potrero.id">{{ potrero.nombre }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Proveedor</label>
            <select v-model.number="form.proveedor_id"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-white">
              <option :value="null">Sin proveedor</option>
              <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2">
          <button type="submit" :disabled="submitting"
            class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
            <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> {{ submitting ? 'Guardando...' : 'Guardar' }}
          </button>
          <NuxtLink to="/animales" class="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Cancelar
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getAnimalById, updateAnimal } = useAnimal()
const { getAllFincas } = useFinca()
const { getPotrerosOfFinca } = usePotrero()
const { getAllProveedores } = useProveedor()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)
const fincas = ref([])
const potreros = ref([])
const proveedores = ref([])
const loadingFincas = ref(false)
const loadingPotreros = ref(false)

const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return

  loadingFincas.value = true
  const { data } = await getAllFincas(userId, user.value.rol)
  loadingFincas.value = false
  if (data.value) {
    fincas.value = data.value
  }
}

const loadPotreros = async (fincaId) => {
  if (!fincaId) return
  loadingPotreros.value = true
  const { data } = await getPotrerosOfFinca(fincaId)
  loadingPotreros.value = false
  if (data.value) {
    potreros.value = data.value
  }
}

const loadProveedores = async () => {
  const { data } = await getAllProveedores()
  if (data.value) {
    proveedores.value = data.value
  }
}

const onFincaChange = async () => {
  if (form.value.finca_id) {
    form.value.potrero_id = null
    await loadPotreros(form.value.finca_id)
  }
}

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    alert('No autorizado para editar animales')
    router.push('/animales')
    return
  }

  await loadFincas()
  await loadProveedores()

  const id = route.params.id
  const { data, error } = await getAnimalById(id)
  loading.value = false

  if (data.value) {
    form.value = {
      ...data.value,
      fecha_nacimiento: data.value.fecha_nacimiento ? data.value.fecha_nacimiento.split('T')[0] : null,
      fecha_adquisicion: data.value.fecha_adquisicion ? data.value.fecha_adquisicion.split('T')[0] : null,
    }
    if (form.value.finca_id) {
      await loadPotreros(form.value.finca_id)
    }
  } else if (error.value) {
    errorMsg.value = 'Error al cargar animal: ' + error.value.message
  } else {
    errorMsg.value = 'Animal no encontrado'
  }
})

const handleSubmit = async () => {
  submitting.value = true
  const { data, error } = await updateAnimal(form.value.id, form.value)
  submitting.value = false
  if (data) {
    router.push('/animales')
  } else {
    alert('Error al actualizar animal: ' + error.message)
  }
}
</script>