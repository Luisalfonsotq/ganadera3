<!-- pages/reproducciones/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" :class="[
        'fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm',
        toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]">
        <Icon :name="toast.type === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'" class="w-6 h-6 shrink-0" />
        <p class="text-sm font-medium">{{ toast.message }}</p>
      </div>
    </Transition>

    <!-- Page Header -->
    <div class="mb-8">
      <NuxtLink to="/reproducciones" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors mb-3">
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        Volver al listado
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Nuevo Registro de Reproducción</h1>
      <p class="text-sm text-gray-500 mt-1">Documenta el ciclo reproductivo paso a paso</p>
    </div>

    <!-- Stepper Visual de Etapas -->
    <div class="mb-8">
      <div class="flex items-center justify-between relative">
        <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div class="h-full bg-green-500 transition-all duration-500" :style="{ width: stepperWidth }"></div>
        </div>
        <div v-for="(step, i) in pasos" :key="i" class="relative z-10 flex flex-col items-center gap-1.5">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
            getStepClass(i)
          ]">
            <Icon v-if="isStepCompleted(i)" name="heroicons:check" class="w-4 h-4" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-xs font-medium" :class="currentStep >= i ? 'text-green-700' : 'text-gray-400'">{{ step.label }}</span>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleCrear" class="space-y-6">
      <!-- Sección 1: Progenitores -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user-group" class="w-4 h-4 text-green-600" />
          </div>
          <h2 class="font-semibold text-gray-800">Progenitores</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Madre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Madre (Hembra) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Icon name="heroicons:heart" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                <select v-model.number="form.animal_id" required
                  :class="['w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2', 
                    fieldErrors.animal_id ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']"
                  @change="clearFieldError('animal_id')"
                  :disabled="loadingAnimales">
                  <option :value="null">{{ loadingAnimales ? 'Cargando...' : 'Selecciona la madre' }}</option>
                  <option v-for="animal in hembras" :key="animal.id" :value="animal.id">
                    {{ animal.identificador_unico }} — {{ animal.raza || 'Sin raza' }}
                  </option>
                </select>
              </div>
              <p v-if="fieldErrors.animal_id" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" /> {{ fieldErrors.animal_id }}
              </p>
              <p v-if="hembras.length === 0 && !loadingAnimales" class="mt-1 text-xs text-orange-500">
                ⚠ No hay hembras disponibles en tu finca
              </p>
            </div>

            <!-- Padre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Padre / Toro <span class="text-gray-400 text-xs">(Opcional)</span></label>
              <div class="relative">
                <Icon name="heroicons:arrow-up-circle" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <select v-model.number="form.toro_id"
                  class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors"
                  :disabled="loadingAnimales">
                  <option :value="null">Sin padre asignado</option>
                  <option v-for="animal in machos" :key="animal.id" :value="animal.id">
                    {{ animal.identificador_unico }} — {{ animal.raza || 'Sin raza' }}
                  </option>
                </select>
              </div>
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
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Celo</label>
              <input type="date" v-model="form.fecha_celo"
                :max="today"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Monta</label>
              <input type="date" v-model="form.fecha_monta"
                :max="today"
                :min="form.fecha_celo || undefined"
                :class="['w-full px-3 py-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2',
                  fieldErrors.fecha_monta ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']"
                @change="validateFechaMonta" />
              <p v-if="fieldErrors.fecha_monta" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" /> {{ fieldErrors.fecha_monta }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Monta</label>
              <div class="flex gap-3 mt-1">
                <label :class="['flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer transition-all',
                  form.tipo_monta === 'natural' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300']">
                  <input type="radio" v-model="form.tipo_monta" value="natural" class="sr-only" />
                  <span class="text-base">🐄</span>
                  <span class="text-sm font-medium">Natural</span>
                </label>
                <label :class="['flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer transition-all',
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
      </div>

      <!-- Sección 3: Preñez y Parto -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:sparkles" class="w-4 h-4 text-yellow-600" />
          </div>
          <h2 class="font-semibold text-gray-800">Preñez y Parto</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha Confirmación Preñez</label>
              <input type="date" v-model="form.fecha_confirmacion_prenez"
                :max="today"
                :min="form.fecha_monta || undefined"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Parto</label>
              <input type="date" v-model="form.fecha_parto"
                :max="today"
                :min="form.fecha_confirmacion_prenez || form.fecha_monta || undefined"
                :class="['w-full px-3 py-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2',
                  showGestacionWarning ? 'border-orange-400 bg-orange-50 focus:ring-orange-200 focus:border-orange-400' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']" />
              <p v-if="showGestacionWarning" class="mt-1.5 text-xs text-orange-600 flex items-center gap-1 font-medium">
                <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 shrink-0" />
                Gestación fuera del rango normal para bovinos (260–300 días). Por favor revisa las fechas.
              </p>
              <p v-else-if="diasGestacion" class="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                <Icon name="heroicons:check-circle" class="w-4 h-4" />
                Gestación: {{ diasGestacion }} días (dentro del rango normal)
              </p>
            </div>
          </div>

          <!-- Crías nacidas -->
          <div class="pt-2">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Crías Nacidas</label>
            <div class="flex items-center gap-3">
              <div class="relative flex-1 max-w-xs">
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

      <!-- Sección 4: Observaciones -->
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
            placeholder="Observaciones sobre el estado reproductivo del animal, condiciones del parto, etc."></textarea>
          <p class="text-xs text-gray-400 mt-1 text-right">{{ (form.observaciones || '').length }} caracteres</p>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button type="submit"
          :disabled="isSubmitting || hembras.length === 0"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none">
          <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          <Icon v-else name="heroicons:check" class="w-5 h-5" />
          {{ isSubmitting ? 'Guardando...' : 'Crear Registro' }}
        </button>
        <NuxtLink to="/reproducciones"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors">
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
          Cancelar
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createReproduccion } = useReproduccion()
const { getAnimalesOfFinca } = useAnimal()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()

const today = new Date().toISOString().split('T')[0]

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

const fieldErrors = ref({})
const animales = ref([])
const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))
const loadingAnimales = ref(false)
const isSubmitting = ref(false)

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

// Indicador del Stepper
const pasos = [
  { label: 'Progenitores' },
  { label: 'Celo' },
  { label: 'Monta' },
  { label: 'Preñez / Parto' },
]
const currentStep = computed(() => {
  if (form.value.fecha_parto || form.value.fecha_confirmacion_prenez) return 3
  if (form.value.fecha_monta) return 2
  if (form.value.fecha_celo) return 1
  if (form.value.animal_id) return 0
  return -1
})
const stepperWidth = computed(() => {
  const pct = ((currentStep.value + 1) / pasos.length) * 100
  return `${Math.max(0, pct)}%`
})
const isStepCompleted = (i) => i <= currentStep.value
const getStepClass = (i) => {
  if (i < currentStep.value) return 'bg-green-500 text-white'
  if (i === currentStep.value) return 'bg-green-500 text-white ring-4 ring-green-200'
  return 'bg-white border-2 border-gray-300 text-gray-400'
}

// Cálculo de gestación
const diasGestacion = computed(() => {
  if (form.value.fecha_monta && form.value.fecha_parto) {
    const monta = new Date(form.value.fecha_monta)
    const parto = new Date(form.value.fecha_parto)
    const diff = Math.ceil(Math.abs(parto - monta) / (1000 * 60 * 60 * 24))
    return diff
  }
  return null
})
const showGestacionWarning = computed(() => {
  return diasGestacion.value !== null && (diasGestacion.value < 260 || diasGestacion.value > 300)
})

const clearFieldError = (field) => {
  delete fieldErrors.value[field]
}

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

watch(user, loadAnimales, { immediate: true })
onMounted(loadAnimales)

const handleCrear = async () => {
  fieldErrors.value = {}
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) {
      fieldErrors.value.animal_id = 'Debes seleccionar la madre.'
      isSubmitting.value = false
      return
    }

    const dataToSend = { animal_id: form.value.animal_id }
    if (form.value.toro_id) dataToSend.toro_id = form.value.toro_id
    if (form.value.fecha_celo) dataToSend.fecha_celo = form.value.fecha_celo
    if (form.value.fecha_monta) dataToSend.fecha_monta = form.value.fecha_monta
    if (form.value.tipo_monta) dataToSend.tipo_monta = form.value.tipo_monta
    if (form.value.fecha_confirmacion_prenez) dataToSend.fecha_confirmacion_prenez = form.value.fecha_confirmacion_prenez
    if (form.value.fecha_parto) dataToSend.fecha_parto = form.value.fecha_parto
    if (form.value.crias_nacidas) dataToSend.crias_nacidas = form.value.crias_nacidas
    if (form.value.observaciones?.trim()) dataToSend.observaciones = form.value.observaciones.trim()

    const nueva = await createReproduccion(dataToSend)
    if (nueva) {
      showToast('Registro de reproducción creado exitosamente.')
      setTimeout(() => router.push('/reproducciones'), 1800)
    }
  } catch (err) {
    const msg = err.data?.message || err.message || 'Error al crear el registro.'
    showToast(msg, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}
</style>