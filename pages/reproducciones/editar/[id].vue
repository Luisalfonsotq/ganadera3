<!-- pages/reproducciones/editar/[id].vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" :class="[
        'fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm',
        toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]">
        <Icon :name="toast.type === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'"
          class="w-6 h-6 shrink-0" />
        <p class="text-sm font-medium">{{ toast.message }}</p>
      </div>
    </Transition>

    <!-- Page Header -->
    <div class="mb-8">
      <NuxtLink to="/reproducciones"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors mb-3">
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        Volver al listado
      </NuxtLink>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <Icon name="heroicons:pencil" class="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Editar Reproducción</h1>
          <p v-if="form" class="text-sm text-gray-500 mt-0.5">ID del Registro: <span
              class="font-semibold text-gray-700">#{{ form.id }}</span></p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="h-5 bg-gray-200 rounded animate-pulse w-36 mb-4"></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          <div class="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-red-50 rounded-2xl p-10 text-center border border-red-100">
      <Icon name="heroicons:exclamation-circle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p class="text-red-600 font-medium">{{ errorMsg }}</p>
      <NuxtLink to="/reproducciones" class="mt-4 inline-block text-sm text-green-600 hover:underline">Volver al listado
      </NuxtLink>
    </div>

    <!-- Form -->
    <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Badge de Estado Actual -->
      <div :class="['flex items-center gap-3 px-5 py-3.5 rounded-2xl border', estadoBadge.bg]">
        <Icon :name="estadoBadge.icon" :class="['w-5 h-5', estadoBadge.iconColor]" />
        <div>
          <p class="text-sm font-semibold" :class="estadoBadge.textColor">Estado actual del ciclo: {{ estadoBadge.label
            }}</p>
          <p class="text-xs mt-0.5" :class="estadoBadge.subTextColor">{{ estadoBadge.description }}</p>
        </div>
      </div>

      <!-- Sección 1: Progenitores -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user-group" class="w-4 h-4 text-green-600" />
          </div>
          <h2 class="font-semibold text-gray-800">Progenitores</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Madre (Hembra) <span
                class="text-red-500">*</span></label>
            <div class="relative">
              <Icon name="heroicons:heart" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <select v-model.number="form.animal_id" required :disabled="loadingAnimales"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors">
                <option v-for="animal in hembras" :key="animal.id" :value="animal.id">
                  {{ animal.identificador_unico }} — {{ animal.raza || 'Sin raza' }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Padre / Toro <span
                class="text-gray-400 text-xs">(Opcional)</span></label>
            <div class="relative">
              <Icon name="heroicons:arrow-up-circle"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <select v-model.number="form.toro_id" :disabled="loadingAnimales"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors">
                <option :value="null">Sin padre asignado</option>
                <option v-for="animal in machos" :key="animal.id" :value="animal.id">
                  {{ animal.identificador_unico }} — {{ animal.raza || 'Sin raza' }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 2: Celo y Monta -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:calendar-days" class="w-4 h-4 text-orange-500" />
          </div>
          <h2 class="font-semibold text-gray-800">Celo y Monta</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Celo</label>
            <input type="date" v-model="form.fecha_celo" :max="today"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Monta</label>
            <input type="date" v-model="form.fecha_monta" :max="today" :min="form.fecha_celo || undefined"
              :class="['w-full px-3 py-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2',
                fieldErrors.fecha_monta ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']" @change="validateFechaMonta" />
            <p v-if="fieldErrors.fecha_monta" class="mt-1 text-xs text-red-500 flex items-center gap-1">
              <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" /> {{ fieldErrors.fecha_monta }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Monta</label>
            <div class="flex gap-3 mt-1">
              <label
                :class="['flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer transition-all',
                  form.tipo_monta === 'natural' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300']">
                <input type="radio" v-model="form.tipo_monta" value="natural" class="sr-only" />
                <span class="text-base">🐄</span>
                <span class="text-sm font-medium">Natural</span>
              </label>
              <label
                :class="['flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer transition-all',
                  form.tipo_monta === 'inseminacion' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300']">
                <input type="radio" v-model="form.tipo_monta" value="inseminacion" class="sr-only" />
                <span class="text-base">💉</span>
                <span class="text-sm font-medium">Inseminación</span>
              </label>
            </div>
            <button v-if="form.tipo_monta" type="button" @click="form.tipo_monta = null"
              class="mt-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
              × Limpiar selección
            </button>
          </div>
        </div>
      </div>

      <!-- Sección 3: Preñez y Parto -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:sparkles" class="w-4 h-4 text-yellow-600" />
          </div>
          <h2 class="font-semibold text-gray-800">Preñez y Parto</h2>
        </div>
        <div class="p-6 space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha Confirmación Preñez</label>
              <input type="date" v-model="form.fecha_confirmacion_prenez" :max="today"
                :min="form.fecha_monta || undefined"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Parto</label>
              <input type="date" v-model="form.fecha_parto" :max="today"
                :min="form.fecha_confirmacion_prenez || form.fecha_monta || undefined"
                :class="['w-full px-3 py-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2',
                  showGestacionWarning ? 'border-orange-400 bg-orange-50 focus:ring-orange-200 focus:border-orange-400' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']" />
              <p v-if="showGestacionWarning" class="mt-1.5 text-xs text-orange-600 flex items-center gap-1 font-medium">
                <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 shrink-0" />
                Gestación fuera del rango normal (260–300 días). Verifica las fechas.
              </p>
              <p v-else-if="diasGestacion" class="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                <Icon name="heroicons:check-circle" class="w-4 h-4" />
                Gestación: {{ diasGestacion }} días ✓
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Crías Nacidas</label>
            <div class="flex items-center gap-3">
              <div class="relative max-w-xs">
                <Icon name="heroicons:hashtag" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="number" v-model.number="form.crias_nacidas" min="0" step="1" placeholder="Ej: 1"
                  :disabled="!form.fecha_parto"
                  :class="['w-full pl-9 pr-4 py-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-green-100',
                    !form.fecha_parto ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' : 'border-gray-200 focus:border-green-400']" />
              </div>
              <p v-if="!form.fecha_parto" class="text-xs text-gray-400 flex items-center gap-1">
                <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5" />
                Requiere fecha de parto
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Observaciones -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:document-text" class="w-4 h-4 text-purple-500" />
          </div>
          <h2 class="font-semibold text-gray-800">Notas Adicionales</h2>
        </div>
        <div class="p-6">
          <textarea v-model="form.observaciones" rows="3"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors resize-none text-sm"
            placeholder="Observaciones sobre el estado reproductivo del animal"></textarea>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button type="submit" :disabled="submitting"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <Icon v-if="submitting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          <Icon v-else name="heroicons:check" class="w-5 h-5" />
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <NuxtLink to="/reproducciones"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          Cancelar
        </NuxtLink>
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

const today = new Date().toISOString().split('T')[0]

const form = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const submitting = ref(false)
const fieldErrors = ref({})
const animales = ref([])
const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))
const loadingAnimales = ref(false)

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

const diasGestacion = computed(() => {
  if (form.value?.fecha_monta && form.value?.fecha_parto) {
    return Math.ceil(Math.abs(new Date(form.value.fecha_parto) - new Date(form.value.fecha_monta)) / (1000 * 60 * 60 * 24))
  }
  return null
})
const showGestacionWarning = computed(() => diasGestacion.value !== null && (diasGestacion.value < 260 || diasGestacion.value > 300))

const estadoBadge = computed(() => {
  if (!form.value) return {}
  if (form.value.fecha_parto) return { label: 'Parida', description: 'Se ha registrado fecha de parto.', bg: 'bg-purple-50 border-purple-200', icon: 'heroicons:star', iconColor: 'text-purple-500', textColor: 'text-purple-800', subTextColor: 'text-purple-600' }
  if (form.value.fecha_confirmacion_prenez) return { label: 'Preñada', description: 'Preñez confirmada. Pendiente fecha de parto.', bg: 'bg-yellow-50 border-yellow-200', icon: 'heroicons:sparkles', iconColor: 'text-yellow-500', textColor: 'text-yellow-800', subTextColor: 'text-yellow-600' }
  if (form.value.fecha_monta) return { label: 'Montada', description: 'Fecha de monta registrada. Pendiente confirmación de preñez.', bg: 'bg-blue-50 border-blue-200', icon: 'heroicons:calendar-days', iconColor: 'text-blue-500', textColor: 'text-blue-800', subTextColor: 'text-blue-600' }
  if (form.value.fecha_celo) return { label: 'En Celo', description: 'Celo detectado. Pendiente registro de monta.', bg: 'bg-orange-50 border-orange-200', icon: 'heroicons:fire', iconColor: 'text-orange-500', textColor: 'text-orange-800', subTextColor: 'text-orange-600' }
  return { label: 'Registrada', description: 'Solo datos de progenitores registrados.', bg: 'bg-gray-50 border-gray-200', icon: 'heroicons:document', iconColor: 'text-gray-400', textColor: 'text-gray-700', subTextColor: 'text-gray-500' }
})

const validateFechaMonta = () => {
  if (form.value.fecha_celo && form.value.fecha_monta) {
    if (new Date(form.value.fecha_monta) < new Date(form.value.fecha_celo)) {
      fieldErrors.value.fecha_monta = 'La fecha de monta no puede ser anterior a la fecha de celo.'
    } else {
      delete fieldErrors.value.fecha_monta
    }
  }
}

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  loadingAnimales.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  if (fincasData.value && fincasData.value.length > 0) {
    const { data: animalesData } = await getAnimalesOfFinca(fincasData.value[0].id)
    if (animalesData.value) animales.value = animalesData.value
  }
  loadingAnimales.value = false
}

onMounted(async () => {
  if (!user.value || user.value.rol !== 'Administrador') {
    showToast('No estás autorizado para editar este registro.', 'error')
    setTimeout(() => router.push('/reproducciones'), 1500)
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
  fieldErrors.value = {}
  submitting.value = true
  try {
    const dataToUpdate = { ...form.value }
    const { data, error } = await updateReproduccion(form.value.id, dataToUpdate)
    if (data) {
      showToast('Registro actualizado exitosamente.')
      setTimeout(() => router.push('/reproducciones'), 1800)
    } else {
      showToast(error?.message || 'Error desconocido al actualizar', 'error')
    }
  } catch (err) {
    showToast(err.message || 'Error al procesar la solicitud', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}
</style>