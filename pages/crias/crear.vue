<!-- pages/crias/crear.vue -->
<template>
  <div class="p-6 max-w-3xl mx-auto">
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
      <NuxtLink to="/crias"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors mb-3">
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        Volver al listado
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Registrar Nueva Cría</h1>
      <p class="text-sm text-gray-500 mt-1">Documenta el nacimiento de un nuevo ejemplar</p>
    </div>

    <form @submit.prevent="handleCrearCria" class="space-y-6">

      <!-- Sección: Identificación -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">🐮</div>
          <h2 class="font-semibold text-gray-800">Identificación de la Cría</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Animal (Cría) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Animal (Cría) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Icon name="heroicons:identification"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select v-model.number="form.animal_id" required
                :class="['w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2',
                  fieldErrors.animal_id ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']"
                @change="onAnimalChange" :disabled="loadingAnimales">
                <option :value="null">{{ loadingAnimales ? 'Cargando animales...' : 'Selecciona el animal (cría)' }}
                </option>
                <option v-for="animal in animales" :key="animal.id" :value="animal.id">
                  {{ animal.identificador_unico }} — {{ animal.sexo === 'macho' ? '♂ Macho' : '♀ Hembra' }} {{
                    animal.raza ? `| ${animal.raza}` : '' }}
                </option>
              </select>
            </div>
            <p v-if="fieldErrors.animal_id" class="mt-1 text-xs text-red-500 flex items-center gap-1">
              <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" /> {{ fieldErrors.animal_id }}
            </p>
            <p v-if="fechaAutocompletada" class="mt-1.5 text-xs text-blue-600 flex items-center gap-1">
              <Icon name="heroicons:information-circle" class="w-3.5 h-3.5" />
              Fecha de nacimiento cargada automáticamente desde el registro del animal.
            </p>
            <p v-else class="mt-1.5 text-xs text-gray-400">Selecciona el animal que fue registrado como resultado de
              este
              nacimiento.</p>
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Fecha de Nacimiento <span class="text-red-500">*</span>
            </label>
            <div class="relative max-w-xs">
              <Icon name="heroicons:calendar" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="date" v-model="form.fecha_nacimiento" required :max="today"
                :class="['w-full pl-9 pr-4 py-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2',
                  fieldErrors.fecha_nacimiento ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']"
                @change="clearFieldError('fecha_nacimiento')" />
            </div>
            <p v-if="fieldErrors.fecha_nacimiento" class="mt-1 text-xs text-red-500 flex items-center gap-1">
              <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" /> {{ fieldErrors.fecha_nacimiento }}
            </p>
            <p v-if="edadCria" class="mt-1.5 text-xs text-green-600 flex items-center gap-1">
              <Icon name="heroicons:clock" class="w-3.5 h-3.5" />
              Edad calculada: {{ edadCria }}
            </p>
          </div>
        </div>
      </div>

      <!-- Sección: Progenitores -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user-group" class="w-4 h-4 text-green-600" />
          </div>
          <h2 class="font-semibold text-gray-800">Progenitores</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Madre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Madre (Hembra) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <Icon name="heroicons:heart" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <select v-model.number="form.madre_id" required
                :class="['w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2',
                  fieldErrors.madre_id ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-green-400 focus:ring-green-100']"
                @change="clearFieldError('madre_id')" :disabled="loadingAnimales">
                <option :value="null">Selecciona la madre</option>
                <option v-for="hembra in hembras" :key="hembra.id" :value="hembra.id">
                  {{ hembra.identificador_unico }} {{ hembra.raza ? `— ${hembra.raza}` : '' }}
                </option>
              </select>
            </div>
            <p v-if="fieldErrors.madre_id" class="mt-1 text-xs text-red-500 flex items-center gap-1">
              <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" /> {{ fieldErrors.madre_id }}
            </p>
          </div>

          <!-- Padre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Padre (Macho) <span class="text-gray-400 text-xs">(Opcional)</span>
            </label>
            <div class="relative">
              <Icon name="heroicons:arrow-up-circle"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <select v-model.number="form.padre_id"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors"
                :disabled="loadingAnimales">
                <option :value="null">Sin padre registrado</option>
                <option v-for="macho in machos" :key="macho.id" :value="macho.id">
                  {{ macho.identificador_unico }} {{ macho.raza ? `— ${macho.raza}` : '' }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen previo al envío -->
      <div v-if="resumenVisible" class="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h3 class="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
          <Icon name="heroicons:clipboard-document-check" class="w-4 h-4" />
          Resumen del Registro
        </h3>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt class="text-gray-500">Cría</dt>
            <dd class="font-medium text-gray-800">{{animales.find(a => a.id === form.animal_id)?.identificador_unico ||
              '—'}}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Nacimiento</dt>
            <dd class="font-medium text-gray-800">{{ form.fecha_nacimiento ? new
              Date(form.fecha_nacimiento).toLocaleDateString('es-ES') : '—' }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Madre</dt>
            <dd class="font-medium text-gray-800">{{hembras.find(a => a.id === form.madre_id)?.identificador_unico ||
              '—'}}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Padre</dt>
            <dd class="font-medium text-gray-800">{{machos.find(a => a.id === form.padre_id)?.identificador_unico ||
              'Sin asignar'}}</dd>
          </div>
        </dl>
      </div>

      <!-- Botones -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button type="submit" :disabled="isSubmitting"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          <Icon v-else name="heroicons:check" class="w-5 h-5" />
          {{ isSubmitting ? 'Registrando...' : 'Registrar Cría' }}
        </button>
        <NuxtLink to="/crias"
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

const { createCria } = useCria()
const { animales, getAnimalesOfFinca } = useAnimal()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()

const today = new Date().toISOString().split('T')[0]

const form = ref({
  animal_id: null,
  madre_id: null,
  padre_id: null,
  fecha_nacimiento: null,
})

const fieldErrors = ref({})
const loadingAnimales = ref(false)
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))

const edadCria = computed(() => {
  if (!form.value.fecha_nacimiento) return null
  const hoy = new Date()
  const nacimiento = new Date(form.value.fecha_nacimiento)
  const diffDias = Math.floor((hoy - nacimiento) / (1000 * 60 * 60 * 24))
  if (diffDias < 0) return null
  if (diffDias < 30) return `${diffDias} días`
  const meses = Math.floor(diffDias / 30)
  if (meses < 12) return `${meses} mes${meses !== 1 ? 'es' : ''}`
  const años = Math.floor(meses / 12)
  const mesesRest = meses % 12
  return mesesRest > 0 ? `${años}a ${mesesRest}m` : `${años} año${años !== 1 ? 's' : ''}`
})

const resumenVisible = computed(() => form.value.animal_id && form.value.madre_id && form.value.fecha_nacimiento)

const fechaAutocompletada = ref(false)

const onAnimalChange = () => {
  clearFieldError('animal_id')
  fechaAutocompletada.value = false
  const selected = animales.value.find(a => a.id === form.value.animal_id)
  if (selected?.fecha_nacimiento) {
    // Usar solo la parte de fecha (YYYY-MM-DD) para el input type="date"
    form.value.fecha_nacimiento = String(selected.fecha_nacimiento).substring(0, 10)
    fechaAutocompletada.value = true
  }
}

const clearFieldError = (field) => { delete fieldErrors.value[field] }

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  loadingAnimales.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  if (fincasData.value && fincasData.value.length > 0) {
    await getAnimalesOfFinca(fincasData.value[0].id)
  }
  loadingAnimales.value = false
}

onMounted(loadAnimales)
watch(user, loadAnimales, { immediate: true })

const handleCrearCria = async () => {
  fieldErrors.value = {}
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) {
      fieldErrors.value.animal_id = 'Debes seleccionar el animal (cría).'
    }
    if (!form.value.madre_id) {
      fieldErrors.value.madre_id = 'Debes seleccionar la madre.'
    }
    if (!form.value.fecha_nacimiento) {
      fieldErrors.value.fecha_nacimiento = 'Debes ingresar la fecha de nacimiento.'
    }
    if (Object.keys(fieldErrors.value).length > 0) {
      isSubmitting.value = false
      return
    }

    const dataToSend = {
      animal_id: form.value.animal_id,
      madre_id: form.value.madre_id,
      fecha_nacimiento: form.value.fecha_nacimiento,
    }
    if (form.value.padre_id) dataToSend.padre_id = form.value.padre_id

    const nuevaCria = await createCria(dataToSend)
    if (nuevaCria) {
      showToast('Cría registrada exitosamente.')
      setTimeout(() => router.push('/crias'), 1800)
    }
  } catch (err) {
    const errorMessage = err.message || err.data?.message || ''
    const isDuplicate = errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('duplicado') || err.statusCode === 409 || err.data?.statusCode === 409
    showToast(isDuplicate ? 'Este animal ya está registrado como una cría.' : (err.data?.message || errorMessage || 'Error al registrar la cría.'), 'error')
  } finally {
    isSubmitting.value = false
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