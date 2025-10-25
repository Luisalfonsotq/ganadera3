<!-- pages/animales/[id].vue -->
<template>
  <div class="container mx-auto p-4 max-w-6xl">
    <div v-if="loading" class="text-center py-12">
      <Icon name="heroicons:arrow-path" class="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
      <p class="text-gray-500">Cargando información del animal...</p>
    </div>
    
    <div v-else-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ errorMsg }}</p>
    </div>
    
    <div v-else-if="animal" class="space-y-6">
      <!-- Header con título y botones -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ animal.identificador_unico }}</h1>
          <p class="text-gray-600">{{ animal.raza || 'Sin raza especificada' }}</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink v-if="user.value?.rol === 'Administrador'" :to="`/animales/editar/${animal.id}`" 
            class="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition">
            <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" /> Editar
          </NuxtLink>
          <button v-if="user.value?.rol === 'Administrador'" @click="handleDelete" 
            class="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition">
            <Icon name="heroicons:trash" class="w-5 h-5 mr-2" /> Eliminar
          </button>
          <NuxtLink to="/animales" class="inline-flex items-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition">
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" /> Volver
          </NuxtLink>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="animal.requiere_atencion_sanitaria || animal.fecha_probable_parto" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="animal.requiere_atencion_sanitaria" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div class="flex items-center gap-3">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
            <div>
              <p class="font-semibold text-red-900">¡Atención Sanitaria Requerida!</p>
              <p class="text-sm text-red-700">
                Último control: {{ animal.ultima_fecha_control_sanitario ? formatDate(animal.ultima_fecha_control_sanitario) : 'Nunca' }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="animal.fecha_probable_parto && isProximoParto(animal.fecha_probable_parto)" 
          class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
          <div class="flex items-center gap-3">
            <Icon name="heroicons:heart" class="w-8 h-8 text-purple-600" />
            <div>
              <p class="font-semibold text-purple-900">Próximo Parto</p>
              <p class="text-sm text-purple-700">
                Fecha probable: {{ formatDate(animal.fecha_probable_parto) }}
              </p>
              <p class="text-xs text-purple-600 font-medium">
                {{ getDiasRestantes(animal.fecha_probable_parto) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas de información rápida -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p class="text-gray-500 text-sm font-medium">Sexo</p>
          <p class="text-2xl font-bold text-gray-800 capitalize">{{ animal.sexo }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p class="text-gray-500 text-sm font-medium">Etapa de Vida</p>
          <p class="text-2xl font-bold text-gray-800">{{ formatEtapaVida(animal.etapa_vida) }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <p class="text-gray-500 text-sm font-medium">Estado de Salud</p>
          <p class="text-lg font-bold" :class="getEstadoSaludColor(animal.estado_salud)">
            {{ formatEstadoSalud(animal.estado_salud) }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <p class="text-gray-500 text-sm font-medium">Edad</p>
          <p class="text-2xl font-bold text-gray-800">{{ calcularEdad(animal.fecha_nacimiento) }}</p>
        </div>
      </div>

      <!-- Información detallada -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-green-600 text-white p-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:information-circle" class="w-6 h-6" />
            Información General
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">ID del Sistema</label>
              <p class="text-gray-900 font-semibold">{{ animal.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Identificador Único</label>
              <p class="text-gray-900 font-semibold">{{ animal.identificador_unico }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Raza</label>
              <p class="text-gray-900">{{ animal.raza || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Peso</label>
              <p class="text-gray-900">{{ animal.peso_kg ? `${animal.peso_kg} kg` : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Fecha de Nacimiento</label>
              <p class="text-gray-900">{{ formatDate(animal.fecha_nacimiento) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Estado Reproductivo</label>
              <p class="text-gray-900 capitalize">{{ formatEstadoReproductivo(animal.estado_reproductivo) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Origen</label>
              <p class="text-gray-900 capitalize">{{ formatOrigen(animal.origen) }}</p>
            </div>
            <div v-if="animal.fecha_adquisicion">
              <label class="block text-sm font-medium text-gray-500 mb-1">Fecha de Adquisición</label>
              <p class="text-gray-900">{{ formatDate(animal.fecha_adquisicion) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ubicación -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-600 text-white p-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:map-pin" class="w-6 h-6" />
            Ubicación
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Finca</label>
              <p class="text-gray-900 font-semibold">{{ animal.finca?.nombre || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Potrero</label>
              <p class="text-gray-900 font-semibold">{{ animal.potrero?.nombre || 'Sin asignar' }}</p>
            </div>
            <div v-if="animal.proveedor">
              <label class="block text-sm font-medium text-gray-500 mb-1">Proveedor</label>
              <p class="text-gray-900 font-semibold">{{ animal.proveedor?.nombre || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Sanitario -->
      <div v-if="animal.ultima_fecha_control_sanitario || animal.requiere_atencion_sanitaria" 
        class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-red-600 text-white p-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:beaker" class="w-6 h-6" />
            Control Sanitario
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Último Control</label>
              <p class="text-gray-900 font-semibold">
                {{ animal.ultima_fecha_control_sanitario ? formatDate(animal.ultima_fecha_control_sanitario) : 'Nunca realizado' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Estado de Atención</label>
              <span v-if="animal.requiere_atencion_sanitaria" 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mr-1" />
                Requiere Atención
              </span>
              <span v-else 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Icon name="heroicons:check-circle" class="w-4 h-4 mr-1" />
                Al Día
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de Reproducción (solo para hembras) -->
      <div v-if="animal.sexo === 'hembra' && animal.fecha_probable_parto" 
        class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-purple-600 text-white p-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon name="heroicons:heart" class="w-6 h-6" />
            Información de Reproducción
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Fecha Probable de Parto</label>
              <p class="text-gray-900 font-semibold text-lg">{{ formatDate(animal.fecha_probable_parto) }}</p>
              <p class="text-sm text-purple-600 font-medium mt-1">{{ getDiasRestantes(animal.fecha_probable_parto) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Preñada
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p class="text-xs text-gray-500">
          Creado: {{ formatDateTime(animal.creado_en) }} | 
          Actualizado: {{ formatDateTime(animal.actualizado_en) }}
        </p>
      </div>
    </div>
    
    <div v-else class="text-center py-12 text-gray-500">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p>Animal no encontrado.</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { getAnimalById, deleteAnimal } = useAnimal()
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const animal = ref(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = route.params.id
  const { data, error } = await getAnimalById(id)
  loading.value = false
  if (data.value) {
    animal.value = data.value
  } else if (error.value) {
    errorMsg.value = 'Error al cargar animal: ' + error.value.message
  } else {
    errorMsg.value = 'Animal no encontrado'
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatEtapaVida = (etapa) => {
  const nombres = {
    'ternero': 'Ternero',
    'ternera': 'Ternera',
    'novillo': 'Novillo',
    'novilla': 'Novilla',
    'adulto': 'Adulto',
    'adulta': 'Adulta',
    'adulto_mayor': 'Adulto Mayor'
  }
  return nombres[etapa] || 'Sin definir'
}

const formatEstadoSalud = (estado) => {
  const nombres = {
    'sano': 'Sano',
    'diagnosticado_enfermo': 'Enfermo',
    'en_tratamiento': 'En Tratamiento'
  }
  return nombres[estado] || estado
}

const formatEstadoReproductivo = (estado) => {
  if (!estado) return 'N/A'
  const nombres = {
    'vacia': 'Vacía',
    'prenada': 'Preñada',
    'lactando': 'Lactando',
    'en_engorde': 'En Engorde',
    'en_produccion_lechera': 'En Producción Lechera',
    'listo_para_venta_o_sacrificio': 'Listo para Venta/Sacrificio'
  }
  return nombres[estado] || estado
}

const formatOrigen = (origen) => {
  if (!origen) return 'N/A'
  const nombres = {
    'nacido_en_finca': 'Nacido en Finca',
    'comprado': 'Comprado'
  }
  return nombres[origen] || origen
}

const getEstadoSaludColor = (estado) => {
  const colors = {
    'sano': 'text-green-600',
    'diagnosticado_enfermo': 'text-red-600',
    'en_tratamiento': 'text-yellow-600'
  }
  return colors[estado] || 'text-gray-600'
}

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 'N/A'
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12
  meses += hoy.getMonth() - nacimiento.getMonth()
  if (hoy.getDate() < nacimiento.getDate()) meses--
  
  const años = Math.floor(meses / 12)
  const mesesRestantes = meses % 12
  
  if (años > 0) {
    return `${años} año${años > 1 ? 's' : ''} ${mesesRestantes > 0 ? `y ${mesesRestantes} mes${mesesRestantes > 1 ? 'es' : ''}` : ''}`
  }
  return `${meses} mes${meses !== 1 ? 'es' : ''}`
}

const isProximoParto = (fechaParto) => {
  if (!fechaParto) return false
  const fecha = new Date(fechaParto)
  const hoy = new Date()
  const diasDiferencia = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24))
  return diasDiferencia >= 0 && diasDiferencia <= 30
}

const getDiasRestantes = (fechaParto) => {
  if (!fechaParto) return ''
  const fecha = new Date(fechaParto)
  const hoy = new Date()
  const diasDiferencia = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24))
  
  if (diasDiferencia < 0) return 'Fecha pasada'
  if (diasDiferencia === 0) return '¡Hoy!'
  if (diasDiferencia === 1) return 'Mañana'
  return `Faltan ${diasDiferencia} días`
}

const handleDelete = async () => {
  if (confirm('¿Estás seguro de eliminar este animal? Esta acción no se puede deshacer.')) {
    const { error } = await deleteAnimal(animal.value.id)
    if (!error.value) {
      router.push('/animales')
    } else {
      alert('Error al eliminar: ' + error.value.message)
    }
  }
}
</script>