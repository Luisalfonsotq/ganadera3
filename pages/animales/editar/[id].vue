<!-- pages/animales/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Editar Animal</h2>
    
    <div v-if="loading" class="text-center text-gray-500 py-8">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
      Cargando información del animal...
    </div>
    <div v-else-if="errorMsg" class="text-center text-red-500 py-8 bg-red-50 rounded-lg p-4">{{ errorMsg }}</div>
    
    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Banner informativo con ID -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-blue-800">Editando Animal</p>
            <p class="text-sm text-blue-700">ID: <span class="font-bold">{{ form.id }}</span> | Identificador: <span class="font-bold">{{ form.identificador_unico }}</span></p>
          </div>
        </div>
      </div>

      <!-- Mostrar etapa de vida actual si existe -->
      <div v-if="form.etapa_vida" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:user-circle" class="w-6 h-6 text-green-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-green-800">Etapa de Vida Actual</p>
            <p class="text-sm text-green-700">{{ formatEtapaVida(form.etapa_vida) }}</p>
            <p class="text-xs text-green-600 mt-1">Este campo se calcula automáticamente según la fecha de nacimiento</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Identificador Único *</label>
          <input v-model="form.identificador_unico" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Raza</label>
          <input v-model="form.raza"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Sexo *</label>
          <select v-model="form.sexo" @change="onSexoChange" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Peso (kg)</label>
          <input type="number" v-model.number="form.peso_kg" step="0.01" min="0"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: 450.50">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input v-model="form.fecha_nacimiento" type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
          <p class="text-xs text-gray-500 mt-1">La etapa de vida se actualizará automáticamente</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado Reproductivo o Productivo</label>
          <select v-model="form.estado_reproductivo"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option :value="null">Sin especificar</option>
            <option value="vacia" :disabled="form.sexo === 'macho'">Vacía</option>
            <option value="prenada" :disabled="form.sexo === 'macho'">Preñada</option>
            <option value="lactando" :disabled="form.sexo === 'macho'">Lactando</option>
            <option value="en_engorde">En Engorde</option>
            <option value="en_produccion_lechera" :disabled="form.sexo === 'macho'">En Producción Lechera</option>
            <option value="listo_para_venta_o_sacrificio">Listo para Venta o Sacrificio</option>
          </select>
          <p v-if="form.sexo === 'macho'" class="text-xs text-gray-500 mt-1">
            Algunas opciones están deshabilitadas para machos
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado de Salud</label>
          <select v-model="form.estado_salud"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="sano">Sano</option>
            <option value="diagnosticado_enfermo">Diagnosticado Enfermo</option>
            <option value="en_tratamiento">En Tratamiento</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Origen</label>
          <select v-model="form.origen" @change="onOrigenChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option :value="null">Sin especificar</option>
            <option value="nacido_en_finca">Nacido en Finca</option>
            <option value="comprado">Comprado</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <input v-model="form.fecha_adquisicion" type="date"
            :disabled="form.origen !== 'comprado'"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border disabled:bg-gray-100 disabled:cursor-not-allowed" />
          <p v-if="form.origen !== 'comprado'" class="text-xs text-gray-500 mt-1">
            Solo disponible para animales comprados
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Finca *</label>
          <select v-model.number="form.finca_id" @change="onFincaChange" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingFincas">
            <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
          </select>
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
            :disabled="form.origen !== 'comprado'">
            <option :value="null">Sin proveedor</option>
            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
          </select>
          <p v-if="form.origen !== 'comprado'" class="text-xs text-gray-500 mt-1">
            Solo disponible para animales comprados
          </p>
        </div>
      </div>

      <div class="flex gap-2 pt-4">
        <button type="submit" :disabled="submitting"
          class="flex-1 md:flex-none inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-5 h-5 mr-2" /> 
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/animales" 
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
const updateSuccess = ref('')
const updateError = ref('')
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

const onSexoChange = () => {
  const estadosRestringidos = ['lactando', 'prenada', 'vacia', 'en_produccion_lechera']
  if (form.value.sexo === 'macho' && estadosRestringidos.includes(form.value.estado_reproductivo)) {
    form.value.estado_reproductivo = null
  }
}

const onOrigenChange = () => {
  if (form.value.origen !== 'comprado') {
    form.value.fecha_adquisicion = null
    form.value.proveedor_id = null
  }
}

const onFincaChange = async () => {
  if (form.value.finca_id) {
    form.value.potrero_id = null
    await loadPotreros(form.value.finca_id)
  }
}

const formatEtapaVida = (etapa) => {
  const nombres = {
    'ternero': 'Ternero (0-8 meses)',
    'ternera': 'Ternera (0-8 meses)',
    'novillo': 'Novillo (8-24 meses)',
    'novilla': 'Novilla (8-30 meses)',
    'adulto': 'Adulto (24+ meses)',
    'adulta': 'Adulta (después del primer parto)',
    'adulto_mayor': 'Adulto Mayor (8+ años)'
  }
  return nombres[etapa] || 'Sin definir'
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
      peso_kg: data.value.peso_kg || null,
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
  updateSuccess.value = ''
  updateError.value = ''
  submitting.value = true

  try {
    const dataToUpdate = { ...form.value }
    
    // Limpiar campos según las reglas de negocio
    if (dataToUpdate.origen !== 'comprado') {
      dataToUpdate.fecha_adquisicion = null
      dataToUpdate.proveedor_id = null
    }

    const { data, error } = await updateAnimal(form.value.id, dataToUpdate)
    
    if (data) {
      updateSuccess.value = 'Animal actualizado exitosamente. La etapa de vida se actualizará automáticamente.'
      setTimeout(() => {
        router.push('/animales')
      }, 1500)
    } else {
      updateError.value = error?.message || 'Error desconocido al actualizar'
    }
  } catch (err) {
    updateError.value = err.message || 'Error al procesar la solicitud'
    console.error('Error al actualizar animal:', err)
  } finally {
    submitting.value = false
  }
}
</script>