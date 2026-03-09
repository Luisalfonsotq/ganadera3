<!-- pages/controles-sanitarios/crear.vue -->
<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="$router.back()"
        class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Registrar Control Sanitario</h1>
        <p class="text-sm text-gray-500">Selecciona el animal y el tipo de control a aplicar</p>
      </div>
    </div>

    <form @submit.prevent="handleCrear" class="space-y-6">

      <!-- PASO 1: Seleccionar Animal -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 class="font-semibold text-gray-800 flex items-center gap-2">
            <span
              class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Seleccionar Animal
          </h2>
        </div>
        <div class="p-6">
          <div v-if="loadingAnimales" class="flex items-center gap-3 py-4 text-gray-500">
            <div class="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm">Cargando animales disponibles...</span>
          </div>
          <div v-else-if="animales.length === 0" class="py-6 text-center">
            <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500 text-sm">No hay animales disponibles en tu finca</p>
          </div>

          <div v-else>
            <!-- Búsqueda de animal -->
            <div class="relative mb-4">
              <Icon name="heroicons:magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="busquedaAnimal" type="text" placeholder="Buscar animal por ID, raza..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
            </div>

            <!-- Lista de animales como cards seleccionables -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              <button v-for="animal in animalesFiltrados" :key="animal.id" type="button"
                @click="seleccionarAnimal(animal)" :class="[
                  'text-left p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md',
                  form.animal_id === animal.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                ]">
                <div class="flex items-center gap-2 mb-1">
                  <div :class="[
                    'w-8 h-8 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0',
                    animal.sexo === 'macho' ? 'bg-blue-500' : 'bg-pink-500'
                  ]">
                    {{ animal.identificador_unico?.charAt(0) || '?' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ animal.identificador_unico }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ animal.raza || 'Sin raza' }}</p>
                  </div>
                  <Icon v-if="form.animal_id === animal.id" name="heroicons:check-circle"
                    class="w-5 h-5 text-blue-500 ml-auto flex-shrink-0" />
                </div>
                <div class="flex gap-1.5 mt-1.5 flex-wrap">
                  <span class="text-xs px-1.5 py-0.5 rounded-full"
                    :class="animal.sexo === 'macho' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'">
                    {{ animal.sexo }}
                  </span>
                  <span v-if="animal.etapa_vida" class="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {{ formatEtapaVida(animal.etapa_vida) }}
                  </span>
                  <span class="text-xs px-1.5 py-0.5 rounded-full" :class="getEstadoSaludBadge(animal.estado_salud)">
                    {{ formatEstadoSalud(animal.estado_salud) }}
                  </span>
                </div>
                <p v-if="animal.nombre_finca" class="text-xs text-gray-400 mt-1 truncate">
                  Finca: {{ animal.nombre_finca }}
                </p>
              </button>
            </div>

            <!-- Animal seleccionado (resumen) -->
            <div v-if="animalSeleccionado"
              class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                :class="animalSeleccionado.sexo === 'macho' ? 'bg-blue-500' : 'bg-pink-500'">
                {{ animalSeleccionado.identificador_unico?.charAt(0) }}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-blue-900">{{ animalSeleccionado.identificador_unico }}</p>
                <p class="text-sm text-blue-600">{{ animalSeleccionado.raza || 'Sin raza' }} · {{
                  formatEtapaVida(animalSeleccionado.etapa_vida) || 'Sin etapa' }}</p>
              </div>
              <Icon name="heroicons:check-circle" class="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- PASO 2: Tipo de Control -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        :class="{ 'opacity-50 pointer-events-none': !form.animal_id }">
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 class="font-semibold text-gray-800 flex items-center gap-2">
            <span
              class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Tipo de Control Sanitario
          </h2>
        </div>
        <div class="p-6">
          <!-- Filtro por categoría -->
          <div class="flex gap-2 flex-wrap mb-4">
            <button v-for="cat in categoriasControl" :key="cat" type="button"
              @click="filtroCategoria = filtroCategoria === cat ? '' : cat" :class="[
                'text-xs px-3 py-1.5 rounded-full font-medium border transition',
                filtroCategoria === cat
                  ? [getCategoriaColor(cat).bg.replace('100', '500'), 'text-white border-transparent']
                  : ['bg-white text-gray-600 border-gray-200 hover:border-gray-300']
              ]">
              {{ cat }}
            </button>
          </div>

          <!-- Búsqueda de control -->
          <div class="relative mb-4">
            <Icon name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="busquedaControl" type="text" placeholder="Buscar tipo de control..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" />
          </div>

          <!-- Lista de controles -->
          <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
            <button v-for="control in controlesFiltrados" :key="control.id" type="button"
              @click="seleccionarControl(control)" :class="[
                'w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200',
                form.tipo_control_id === control.id
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 bg-white hover:shadow-sm'
              ]">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      :class="['text-xs font-medium px-2 py-0.5 rounded-full', getCategoriaColor(control.categoria).bg, getCategoriaColor(control.categoria).text]">
                      {{ control.categoria }}
                    </span>
                    <span v-if="control.requiere_medicamento"
                      class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      💊 Medicamento
                    </span>
                    <span v-if="control.aplica_a_sexo"
                      class="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
                      ♀/♂ Específico
                    </span>
                  </div>
                  <p class="font-semibold text-gray-800 mt-1.5 text-sm">{{ control.nombre }}</p>
                  <p v-if="control.descripcion" class="text-xs text-gray-500 mt-1 line-clamp-2">{{ control.descripcion
                  }}</p>
                  <p v-if="control.frecuencia_dias" class="text-xs text-green-600 font-medium mt-1">
                    <Icon name="heroicons:clock" class="w-3 h-3 inline" />
                    Frecuencia: cada {{ control.frecuencia_dias }} días
                  </p>
                </div>
                <Icon v-if="form.tipo_control_id === control.id" name="heroicons:check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              </div>
            </button>

            <div v-if="controlesFiltrados.length === 0" class="py-8 text-center text-gray-400">
              <Icon name="heroicons:face-frown" class="w-10 h-10 mx-auto mb-2" />
              <p class="text-sm">No hay controles que coincidan con tu búsqueda</p>
            </div>
          </div>

          <!-- Control seleccionado (resumen) -->
          <div v-if="controlSeleccionado" class="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div class="flex items-start gap-3">
              <div class="flex-1">
                <p class="font-semibold text-green-900">{{ controlSeleccionado.nombre }}</p>
                <p v-if="controlSeleccionado.notas" class="text-xs text-green-700 mt-1">
                  📌 {{ controlSeleccionado.notas }}
                </p>
              </div>
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <!-- PASO 3: Detalles del Control -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        :class="{ 'opacity-50 pointer-events-none': !form.tipo_control_id }">
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 class="font-semibold text-gray-800 flex items-center gap-2">
            <span
              class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Detalles del Control
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Fecha del Control *</label>
              <input type="date" v-model="form.fecha" required
                class="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent p-2.5 border text-sm">
            </div>

            <div v-if="controlSeleccionado?.requiere_medicamento">
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Medicamento *</label>
              <input type="text" v-model="form.medicamento" :required="controlSeleccionado?.requiere_medicamento"
                class="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent p-2.5 border text-sm"
                placeholder="Ej: Ivermectina 1%">
            </div>

            <div v-if="form.medicamento">
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Dosis</label>
              <input type="number" v-model.number="form.dosis" min="0" step="0.01"
                class="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent p-2.5 border text-sm"
                placeholder="Ej: 5">
            </div>

            <div v-if="form.medicamento">
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Vía de Aplicación</label>
              <select v-model="form.via_aplicacion"
                class="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent p-2.5 border text-sm bg-white">
                <option :value="null">Seleccionar vía</option>
                <option value="Oral">Oral</option>
                <option value="Intramuscular">Intramuscular (IM)</option>
                <option value="Intravenosa">Intravenosa (IV)</option>
                <option value="Subcutánea">Subcutánea (SC)</option>
                <option value="Tópica">Tópica (Pour-on / Baño)</option>
                <option value="Intramamaria">Intramamaria</option>
                <option value="Intradérmica">Intradérmica</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Costo (COP)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                <input type="number" v-model.number="form.costo" min="0" step="100"
                  class="w-full pl-7 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent p-2.5 border text-sm"
                  placeholder="0">
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones</label>
              <textarea v-model="form.observaciones" rows="3"
                class="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent p-2.5 border text-sm resize-none"
                placeholder="Notas adicionales, reacciones observadas, dosis específica..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen y botón de envío -->
      <div v-if="form.animal_id && form.nombre_control && form.fecha"
        class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h3 class="font-bold text-lg mb-3">Resumen del Control</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
          <div>
            <p class="text-green-200 text-xs">Animal</p>
            <p class="font-semibold">{{ animalSeleccionado?.identificador_unico }}</p>
          </div>
          <div>
            <p class="text-green-200 text-xs">Control</p>
            <p class="font-semibold">{{ controlSeleccionado?.nombre }}</p>
          </div>
          <div>
            <p class="text-green-200 text-xs">Fecha</p>
            <p class="font-semibold">{{ formatDate(form.fecha) }}</p>
          </div>
          <div v-if="form.medicamento">
            <p class="text-green-200 text-xs">Medicamento</p>
            <p class="font-semibold">{{ form.medicamento }}</p>
          </div>
          <div v-if="form.costo">
            <p class="text-green-200 text-xs">Costo</p>
            <p class="font-semibold">${{ form.costo?.toLocaleString('es-ES') }}</p>
          </div>
        </div>
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-white text-green-700 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <div v-if="isSubmitting"
            class="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <Icon v-else name="heroicons:check-circle" class="w-5 h-5" />
          {{ isSubmitting ? 'Guardando control...' : 'Registrar Control Sanitario' }}
        </button>
      </div>

      <!-- Mensaje de éxito o error -->
      <div v-if="success"
        class="p-4 bg-green-100 text-green-800 rounded-xl flex items-center gap-3 border border-green-200">
        <Icon name="heroicons:check-circle" class="w-6 h-6 flex-shrink-0" />
        <p class="font-medium">{{ success }}</p>
      </div>
      <div v-if="controlError"
        class="p-4 bg-red-100 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
        <Icon name="heroicons:exclamation-circle" class="w-6 h-6 flex-shrink-0" />
        <p class="font-medium">{{ controlError }}</p>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

import { controlesSanitariosBase, getCategoriasControl, getCategoriaColor } from '~/utils/controlesSanitarios.js'

const { createControl } = useControlSanitario()
const { getAnimalesOfFinca } = useAnimal()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()
const route = useRoute()

// Form
const form = ref({
  animal_id: null,
  nombre_control: null,      // nombre directo del controlesSanitariosBase
  categoria_control: null,  // categoría del control
  fecha: new Date().toISOString().split('T')[0],
  medicamento: null,
  dosis: null,
  via_aplicacion: null,
  observaciones: null,
  costo: null,
})

// Id interno del control base (solo para UI, no se envía al backend)
const controlBaseId = ref(null)

const animales = ref([])
const loadingAnimales = ref(false)
const isSubmitting = ref(false)
const success = ref(null)
const controlError = ref(null)
const busquedaAnimal = ref('')
const busquedaControl = ref('')
const filtroCategoria = ref('')

// Categorías disponibles
const categoriasControl = computed(() => getCategoriasControl())

// Animal seleccionado
const animalSeleccionado = computed(() => animales.value.find(a => a.id === form.value.animal_id))

// Control base seleccionado (solo para UI)
const controlSeleccionado = computed(() =>
  controlesSanitariosBase.find(c => c.id === controlBaseId.value)
)

// Animales filtrados para la búsqueda
const animalesFiltrados = computed(() => {
  if (!busquedaAnimal.value) return animales.value
  const q = busquedaAnimal.value.toLowerCase()
  return animales.value.filter(a =>
    a.identificador_unico?.toLowerCase().includes(q) ||
    a.raza?.toLowerCase().includes(q)
  )
})

// Controles filtrados por búsqueda y categoría
const controlesFiltrados = computed(() => {
  let lista = controlesSanitariosBase

  // Filtrar por categoría
  if (filtroCategoria.value) {
    lista = lista.filter(c => c.categoria === filtroCategoria.value)
  }

  // Filtrar por sexo del animal seleccionado
  if (animalSeleccionado.value) {
    const sexo = animalSeleccionado.value.sexo
    lista = lista.filter(c => {
      if (!c.aplica_a_sexo) return true
      // Controles solo para machos
      if (c.subcategoria === 'Examen andrológico') return sexo === 'macho'
      // Controles solo para hembras
      if (['Protocolo reproductivo', 'Seguimiento postparto', 'Sanidad de ubre'].includes(c.subcategoria)) return sexo === 'hembra'
      // Brucelosis solo hembras
      if (c.nombre.includes('Brucelosis')) return sexo === 'hembra'
      return true
    })
  }

  // Búsqueda por texto
  if (busquedaControl.value) {
    const q = busquedaControl.value.toLowerCase()
    lista = lista.filter(c =>
      c.nombre?.toLowerCase().includes(q) ||
      c.categoria?.toLowerCase().includes(q) ||
      c.subcategoria?.toLowerCase().includes(q) ||
      c.descripcion?.toLowerCase().includes(q)
    )
  }

  return lista
})

const seleccionarAnimal = (animal) => {
  form.value.animal_id = animal.id
  // Resetear control si cambia el animal
  controlBaseId.value = null
  form.value.nombre_control = null
  form.value.categoria_control = null
}

const seleccionarControl = (control) => {
  controlBaseId.value = control.id          // solo usado en UI
  form.value.nombre_control = control.nombre
  form.value.categoria_control = control.categoria ?? null
  // Limpiar medicamento si el nuevo control no lo requiere
  if (!control.requiere_medicamento) {
    form.value.medicamento = null
    form.value.dosis = null
    form.value.via_aplicacion = null
  }
}

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
        allAnimales.push(...animalesData.value.map(a => ({ ...a, nombre_finca: finca.nombre })))
      }
    }
    animales.value = allAnimales

    // Pre-seleccionar animal si viene por query param
    const animalIdParam = route.query.animal_id
    if (animalIdParam) {
      const animalEncontrado = allAnimales.find(a => a.id === parseInt(animalIdParam))
      if (animalEncontrado) seleccionarAnimal(animalEncontrado)
    }
  }
  loadingAnimales.value = false
}

watch(user, loadAnimales, { immediate: true })

onMounted(() => {
  if (user.value?.rol !== 'Veterinario') {
    alert('No autorizado. Solo veterinarios pueden crear controles sanitarios.')
    router.push('/controles-sanitarios')
  }
})

const handleCrear = async () => {
  controlError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) throw new Error('Debes seleccionar el animal.')
    if (!form.value.nombre_control) throw new Error('Debes seleccionar el tipo de control.')
    if (!form.value.fecha) throw new Error('Debes ingresar la fecha del control.')

    // Validar medicamento si el control base lo requiere
    const controlBase = controlesSanitariosBase.find(c => c.id === controlBaseId.value)
    if (controlBase?.requiere_medicamento && !form.value.medicamento?.trim()) {
      throw new Error('Este tipo de control requiere especificar el medicamento.')
    }

    // Payload limpio para el backend (sin tipo_control_id)
    const dataToSend = {
      animal_id: form.value.animal_id,
      nombre_control: form.value.nombre_control.trim(),
      categoria_control: form.value.categoria_control ?? undefined,
      fecha: form.value.fecha,
      veterinario_id: user.value.id || user.value.userId,
      ...(form.value.medicamento?.trim() && { medicamento: form.value.medicamento.trim() }),
      ...(form.value.dosis && { dosis: form.value.dosis }),
      ...(form.value.via_aplicacion && { via_aplicacion: form.value.via_aplicacion }),
      ...(form.value.observaciones?.trim() && { observaciones: form.value.observaciones.trim() }),
      ...(form.value.costo && { costo: form.value.costo }),
    }

    const nuevoControl = await createControl(dataToSend)
    if (nuevoControl) {
      success.value = '✅ Control sanitario registrado exitosamente.'
      setTimeout(() => router.push('/controles-sanitarios'), 1500)
    }
  } catch (err) {
    console.error('Error al crear control:', err)
    controlError.value = err.data?.message || err.message || 'Error al crear el control sanitario.'
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date + 'T12:00:00').toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const formatEtapaVida = (etapa) => {
  const nombres = {
    'ternero': 'Ternero', 'ternera': 'Ternera', 'novillo': 'Novillo',
    'novilla': 'Novilla', 'adulto': 'Adulto', 'adulta': 'Adulta', 'adulto_mayor': 'Adulto Mayor'
  }
  return nombres[etapa] || etapa
}

const formatEstadoSalud = (estado) => {
  const nombres = { sano: 'Sano', diagnosticado_enfermo: 'Enfermo', en_tratamiento: 'En Tratamiento' }
  return nombres[estado] || 'N/A'
}

const getEstadoSaludBadge = (estado) => {
  const clases = {
    'sano': 'bg-green-100 text-green-700',
    'diagnosticado_enfermo': 'bg-red-100 text-red-700',
    'en_tratamiento': 'bg-yellow-100 text-yellow-700'
  }
  return clases[estado] || 'bg-gray-100 text-gray-700'
}
</script>