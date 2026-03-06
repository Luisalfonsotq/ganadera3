<!-- pages/potreros/rotacion.vue -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">

    <!-- ── Header ── -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-2.5 shadow-lg">
              <Icon name="i-heroicons-arrow-path-rounded-square" class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-gray-800">Rotación de Potreros</h1>
          </div>
          <p class="text-gray-500 ml-[52px]">Mueve el ganado a potreros con mejores pastos de forma rápida y segura.</p>
        </div>
        <NuxtLink
          to="/potreros"
          class="inline-flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
        >
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Volver a Potreros
        </NuxtLink>
      </div>
    </div>

    <!-- ── Loading inicial ── -->
    <div v-if="loading && potreros.length === 0" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
      <p class="text-gray-500 font-medium">Cargando potreros…</p>
    </div>

    <!-- ── Error al cargar ── -->
    <div v-else-if="error && potreros.length === 0" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <Icon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p class="text-red-700 font-semibold">{{ error }}</p>
      <button @click="cargarPotreros" class="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
        Reintentar
      </button>
    </div>

    <template v-else>

      <!-- ── Banner estado del pasto agotado ── -->
      <div v-if="potrerosAgotados.length" class="mb-6 bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
        <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-amber-800 font-semibold text-sm">
            {{ potrerosAgotados.length }} potrero{{ potrerosAgotados.length > 1 ? 's' : '' }} con pasto agotado:
            <span class="font-normal">{{ potrerosAgotados.map(p => p.nombre).join(', ') }}</span>
          </p>
          <p class="text-amber-600 text-xs mt-0.5">Considera hacer una rotación para que el pasto se recupere.</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           PANEL PRINCIPAL: grid de potreros izq + formulario der
      ══════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <!-- ── Listado de potreros (2/3 del ancho) ── -->
        <div class="xl:col-span-2 space-y-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-bold text-gray-700">Potreros de la finca</h2>
            <button
              @click="cargarPotreros"
              :disabled="loading"
              class="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
            >
              <Icon name="i-heroicons-arrow-path" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
              Actualizar
            </button>
          </div>

          <!-- Mensaje sin potreros -->
          <div v-if="!potreros.length" class="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <Icon name="i-heroicons-square-3-stack-3d" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No hay potreros registrados en esta finca.</p>
          </div>

          <!-- Tarjetas de potreros -->
          <div
            v-for="p in potreros"
            :key="p.id"
            class="bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            :class="getPotreroCardClass(p)"
            @click="seleccionarPotrero(p)"
          >
            <div class="p-5">
              <div class="flex items-start justify-between gap-4">
                <!-- Info principal -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 class="font-bold text-gray-800 text-base truncate">{{ p.nombre }}</h3>
                    <!-- Badge seleccionado como origen -->
                    <span v-if="form.potrero_origen_id === p.id"
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      <Icon name="i-heroicons-arrow-up-right" class="w-3 h-3" /> Origen
                    </span>
                    <!-- Badge seleccionado como destino -->
                    <span v-if="form.potrero_destino_id === p.id"
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      <Icon name="i-heroicons-arrow-down-left" class="w-3 h-3" /> Destino
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <Icon name="i-heroicons-chart-bar" class="w-4 h-4 text-blue-400" />
                      {{ p.tamano_ha }} ha
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon name="i-heroicons-sparkles" class="w-4 h-4 text-purple-400" />
                      {{ p.tipo_pasto || 'Sin especificar' }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon name="i-heroicons-user-group" class="w-4 h-4 text-gray-400" />
                      {{ p.total_animales }} animal{{ p.total_animales !== 1 ? 'es' : '' }}
                      <template v-if="p.capacidad_animales">
                        <span class="text-gray-300">/</span>
                        <span class="font-medium" :class="p.total_animales >= p.capacidad_animales ? 'text-red-500' : 'text-gray-500'">
                          máx {{ p.capacidad_animales }}
                        </span>
                      </template>
                    </span>
                  </div>
                </div>

                <!-- Badge estado pasto + acciones rápidas -->
                <div class="flex flex-col items-end gap-2 flex-shrink-0">
                  <!-- Estado del pasto -->
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    :class="estadoPastoBadge(p.estado_pasto)">
                    <span class="w-1.5 h-1.5 rounded-full" :class="estadoPastoDot(p.estado_pasto)"></span>
                    {{ labelEstadoPasto(p.estado_pasto) }}
                  </span>

                  <!-- Botones de selección -->
                  <div class="flex gap-1.5">
                    <button
                      @click.stop="seleccionarComoOrigen(p)"
                      class="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                      :class="form.potrero_origen_id === p.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
                      title="Seleccionar como origen"
                    >
                      Origen
                    </button>
                    <button
                      @click.stop="seleccionarComoDestino(p)"
                      :disabled="!p.disponible"
                      class="px-2 py-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      :class="form.potrero_destino_id === p.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'"
                      title="Seleccionar como destino"
                    >
                      Destino
                    </button>
                  </div>
                </div>
              </div>

              <!-- Barra de animales -->
              <div v-if="p.capacidad_animales" class="mt-3">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Ocupación</span>
                  <span>{{ Math.round((p.total_animales / p.capacidad_animales) * 100) }}%</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: Math.min((p.total_animales / p.capacidad_animales) * 100, 100) + '%' }"
                    :class="p.total_animales >= p.capacidad_animales ? 'bg-red-400' : 'bg-emerald-400'"
                  ></div>
                </div>
              </div>

              <!-- Actualizar estado del pasto inline -->
              <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                <span class="text-xs text-gray-400 flex-shrink-0">Cambiar estado del pasto:</span>
                <div class="flex gap-1.5 flex-wrap">
                  <button
                    v-for="estado in estadosPasto"
                    :key="estado.value"
                    @click.stop="cambiarEstadoPasto(p, estado.value)"
                    :disabled="p.estado_pasto === estado.value || loadingEstado[p.id]"
                    class="px-2 py-0.5 rounded-md text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="p.estado_pasto === estado.value ? estado.activeClass : estado.inactiveClass"
                  >
                    <span v-if="loadingEstado[p.id] === estado.value" class="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1"></span>
                    {{ estado.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Panel de formulario de rotación (1/3 del ancho) ── -->
        <div class="xl:col-span-1">
          <div class="sticky top-6">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <!-- Header panel -->
              <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-path-rounded-square" class="w-5 h-5" />
                  Panel de Rotación
                </h2>
                <p class="text-emerald-100 text-xs mt-1">Selecciona origen y destino en el listado</p>
              </div>

              <div class="p-6 space-y-5">

                <!-- Potrero Origen -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Potrero Origen (con ganado)
                  </label>
                  <div
                    class="rounded-xl border-2 p-4 min-h-[72px] flex items-center transition-colors"
                    :class="origenSeleccionado ? 'border-blue-300 bg-blue-50' : 'border-dashed border-gray-200 bg-gray-50'"
                  >
                    <template v-if="origenSeleccionado">
                      <div class="flex-1">
                        <p class="font-bold text-gray-800">{{ origenSeleccionado.nombre }}</p>
                        <p class="text-sm text-gray-500 mt-0.5">
                          {{ origenSeleccionado.total_animales }} animal{{ origenSeleccionado.total_animales !== 1 ? 'es' : '' }} a mover
                          · <span :class="estadoTexto(origenSeleccionado.estado_pasto)">{{ labelEstadoPasto(origenSeleccionado.estado_pasto) }}</span>
                        </p>
                      </div>
                      <button @click="form.potrero_origen_id = null" class="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                      </button>
                    </template>
                    <p v-else class="text-gray-400 text-sm">Haz clic en "Origen" de algún potrero</p>
                  </div>
                </div>

                <!-- Flecha -->
                <div class="flex justify-center">
                  <div class="flex flex-col items-center gap-1">
                    <div class="w-px h-4 bg-gray-200"></div>
                    <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                      :class="form.potrero_origen_id && form.potrero_destino_id ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-300'"
                    >
                      <Icon name="i-heroicons-arrow-down" class="w-4 h-4" />
                    </div>
                    <div class="w-px h-4 bg-gray-200"></div>
                  </div>
                </div>

                <!-- Potrero Destino -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Potrero Destino (con buen pasto)
                  </label>
                  <div
                    class="rounded-xl border-2 p-4 min-h-[72px] flex items-center transition-colors"
                    :class="destinoSeleccionado ? 'border-emerald-300 bg-emerald-50' : 'border-dashed border-gray-200 bg-gray-50'"
                  >
                    <template v-if="destinoSeleccionado">
                      <div class="flex-1">
                        <p class="font-bold text-gray-800">{{ destinoSeleccionado.nombre }}</p>
                        <p class="text-sm text-gray-500 mt-0.5">
                          {{ destinoSeleccionado.total_animales }} animal{{ destinoSeleccionado.total_animales !== 1 ? 'es' : '' }} actuales
                          · <span :class="estadoTexto(destinoSeleccionado.estado_pasto)">{{ labelEstadoPasto(destinoSeleccionado.estado_pasto) }}</span>
                        </p>
                      </div>
                      <button @click="form.potrero_destino_id = null" class="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                      </button>
                    </template>
                    <p v-else class="text-gray-400 text-sm">Haz clic en "Destino" de algún potrero</p>
                  </div>
                </div>

                <!-- Motivo -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Motivo de la rotación
                  </label>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <button
                      v-for="m in motivosSugeridos"
                      :key="m"
                      @click="form.motivo = m"
                      class="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                      :class="form.motivo === m ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    >
                      {{ m }}
                    </button>
                  </div>
                  <textarea
                    v-model="form.motivo"
                    rows="2"
                    placeholder="Escribe el motivo…"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  ></textarea>
                </div>

                <!-- Resumen de la rotación -->
                <div v-if="origenSeleccionado && destinoSeleccionado"
                  class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Resumen</p>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex justify-between">
                      <span>Animales a mover:</span>
                      <span class="font-bold text-gray-800">{{ origenSeleccionado.total_animales }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Destino tras rotación:</span>
                      <span class="font-bold" :class="capacidadSuperada ? 'text-red-600' : 'text-gray-800'">
                        {{ (destinoSeleccionado.total_animales + origenSeleccionado.total_animales) }} animales
                        <span v-if="destinoSeleccionado.capacidad_animales">
                          / {{ destinoSeleccionado.capacidad_animales }} máx
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- Advertencia capacidad superada -->
                  <div v-if="capacidadSuperada" class="mt-3 flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p class="text-xs text-red-600">Supera la capacidad máxima del potrero destino.</p>
                  </div>
                  <!-- Advertencia destino agotado -->
                  <div v-if="destinoSeleccionado.estado_pasto === 'agotado'" class="mt-3 flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <p class="text-xs text-amber-600">El potrero destino tiene el pasto agotado. El backend rechazará la rotación.</p>
                  </div>
                </div>

                <!-- Botón ejecutar -->
                <button
                  @click="confirmarRotacion"
                  :disabled="!puedeRotar || loadingRotacion"
                  class="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="puedeRotar ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:shadow-xl' : 'bg-gray-200 text-gray-400'"
                >
                  <span v-if="loadingRotacion" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <Icon v-else name="i-heroicons-arrow-path-rounded-square" class="w-5 h-5" />
                  {{ loadingRotacion ? 'Ejecutando…' : 'Ejecutar Rotación' }}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- ══ Modal de confirmación ══ -->
    <Transition name="fade">
      <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <Icon name="i-heroicons-arrow-path-rounded-square" class="w-5 h-5" />
              Confirmar Rotación
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-gray-600 text-sm">Estás a punto de mover <strong class="text-gray-800">{{ origenSeleccionado?.total_animales }} animales</strong> de:</p>
            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="i-heroicons-arrow-up-right" class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-400">ORIGEN</p>
                  <p class="font-bold text-gray-800">{{ origenSeleccionado?.nombre }}</p>
                </div>
              </div>
              <div class="border-t border-dashed border-gray-200 pt-3 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="i-heroicons-arrow-down-left" class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-400">DESTINO</p>
                  <p class="font-bold text-gray-800">{{ destinoSeleccionado?.nombre }}</p>
                </div>
              </div>
            </div>
            <p v-if="form.motivo" class="text-sm text-gray-500">
              <span class="font-medium text-gray-700">Motivo:</span> {{ form.motivo }}
            </p>
            <p class="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-lg p-3">
              ⚠️ Esta acción moverá todos los animales del potrero origen al destino. El sistema actualizará el estado del pasto automáticamente.
            </p>
            <div class="flex gap-3 pt-2">
              <button @click="showConfirm = false" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                Cancelar
              </button>
              <button @click="ejecutarRotacion" :disabled="loadingRotacion"
                class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <span v-if="loadingRotacion" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ Toast de resultado ══ -->
    <Transition name="slide-up">
      <div v-if="toast.visible" class="fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm"
        :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
        <Icon :name="toast.type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <p class="font-bold text-sm">{{ toast.title }}</p>
          <p class="text-xs opacity-90 mt-0.5">{{ toast.message }}</p>
        </div>
        <button @click="toast.visible = false" class="ml-2 opacity-70 hover:opacity-100 flex-shrink-0">
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { user } = useAuth()
const { getAllFincas } = useFinca()
const { potreros, loading, error, getPotrerosConDetalle, actualizarEstadoPasto, ejecutarRotacion: rotarGanado } = usePotrero()

// ── Estado ─────────────────────────────────────────────
const fincaId = ref(null)
const loadingRotacion = ref(false)
const showConfirm = ref(false)
const loadingEstado = ref({}) // { [potreroId]: 'bueno'|'regular'|'agotado' | null }

const form = reactive({
  potrero_origen_id: null,
  potrero_destino_id: null,
  motivo: '',
})

const toast = reactive({
  visible: false,
  type: 'success',
  title: '',
  message: '',
})

// ── Opciones estáticas ──────────────────────────────────
const estadosPasto = [
  {
    value: 'bueno',
    label: 'Bueno',
    activeClass: 'bg-emerald-500 text-white',
    inactiveClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  },
  {
    value: 'regular',
    label: 'Regular',
    activeClass: 'bg-amber-500 text-white',
    inactiveClass: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
  },
  {
    value: 'agotado',
    label: 'Agotado',
    activeClass: 'bg-red-500 text-white',
    inactiveClass: 'bg-red-50 text-red-700 hover:bg-red-100',
  },
]

const motivosSugeridos = [
  'Pasto agotado',
  'Descanso programado',
  'Exceso de animales',
  'Recuperación del pasto',
]

// ── Computadas ─────────────────────────────────────────
const potrerosAgotados = computed(() =>
  potreros.value.filter((p) => p.estado_pasto === 'agotado'),
)

const origenSeleccionado = computed(() =>
  potreros.value.find((p) => p.id === form.potrero_origen_id) ?? null,
)

const destinoSeleccionado = computed(() =>
  potreros.value.find((p) => p.id === form.potrero_destino_id) ?? null,
)

const capacidadSuperada = computed(() => {
  if (!origenSeleccionado.value || !destinoSeleccionado.value) return false
  if (!destinoSeleccionado.value.capacidad_animales) return false
  return (
    destinoSeleccionado.value.total_animales + origenSeleccionado.value.total_animales >
    destinoSeleccionado.value.capacidad_animales
  )
})

const puedeRotar = computed(() => {
  if (!form.potrero_origen_id || !form.potrero_destino_id) return false
  if (form.potrero_origen_id === form.potrero_destino_id) return false
  if (!origenSeleccionado.value || origenSeleccionado.value.total_animales === 0) return false
  if (destinoSeleccionado.value?.estado_pasto === 'agotado') return false
  return true
})

// ── Helpers visuales ────────────────────────────────────
const getPotreroCardClass = (p) => {
  if (p.id === form.potrero_origen_id) return 'border-blue-400 bg-blue-50/30'
  if (p.id === form.potrero_destino_id) return 'border-emerald-400 bg-emerald-50/30'
  if (p.estado_pasto === 'agotado') return 'border-red-200 opacity-75'
  return 'border-gray-200'
}

const estadoPastoBadge = (estado) => ({
  bueno: 'bg-emerald-100 text-emerald-700',
  regular: 'bg-amber-100 text-amber-700',
  agotado: 'bg-red-100 text-red-700',
}[estado] ?? 'bg-gray-100 text-gray-600')

const estadoPastoDot = (estado) => ({
  bueno: 'bg-emerald-500',
  regular: 'bg-amber-500',
  agotado: 'bg-red-500',
}[estado] ?? 'bg-gray-400')

const labelEstadoPasto = (estado) => ({
  bueno: 'Pasto Bueno',
  regular: 'Pasto Regular',
  agotado: 'Pasto Agotado',
}[estado] ?? 'Desconocido')

const estadoTexto = (estado) => ({
  bueno: 'text-emerald-600 font-semibold',
  regular: 'text-amber-600 font-semibold',
  agotado: 'text-red-600 font-semibold',
}[estado] ?? 'text-gray-600')

// ── Acciones ────────────────────────────────────────────
const seleccionarPotrero = (p) => {
  // Si no hay origen seleccionado, elegirlo como origen
  if (!form.potrero_origen_id) {
    seleccionarComoOrigen(p)
  } else if (!form.potrero_destino_id && p.id !== form.potrero_origen_id) {
    seleccionarComoDestino(p)
  }
}

const seleccionarComoOrigen = (p) => {
  // Evitar que sea igual al destino
  if (form.potrero_destino_id === p.id) form.potrero_destino_id = null
  form.potrero_origen_id = p.id
}

const seleccionarComoDestino = (p) => {
  if (!p.disponible) return
  // Evitar que sea igual al origen
  if (form.potrero_origen_id === p.id) form.potrero_origen_id = null
  form.potrero_destino_id = p.id
}

const cambiarEstadoPasto = async (potrero, nuevoEstado) => {
  loadingEstado.value[potrero.id] = nuevoEstado
  const { data, error: err } = await actualizarEstadoPasto(potrero.id, nuevoEstado)
  loadingEstado.value[potrero.id] = null

  if (err) {
    mostrarToast('error', 'Error', err?.message || 'No se pudo actualizar el estado.')
    return
  }
  // Actualizar localmente el potrero en la lista
  const idx = potreros.value.findIndex((p) => p.id === potrero.id)
  if (idx !== -1) {
    potreros.value[idx].estado_pasto = nuevoEstado
    potreros.value[idx].disponible = nuevoEstado !== 'agotado'
  }
  mostrarToast('success', 'Estado actualizado', `"${potrero.nombre}" → ${labelEstadoPasto(nuevoEstado)}`)
}

const confirmarRotacion = () => {
  if (!puedeRotar.value) return
  showConfirm.value = true
}

const ejecutarRotacion = async () => {
  loadingRotacion.value = true
  const { data, error: err } = await rotarGanado({
    potrero_origen_id: form.potrero_origen_id,
    potrero_destino_id: form.potrero_destino_id,
    motivo: form.motivo,
  })
  loadingRotacion.value = false
  showConfirm.value = false

  if (err) {
    mostrarToast('error', 'Error en la rotación', typeof err === 'string' ? err : 'Ocurrió un error inesperado.')
    return
  }

  mostrarToast(
    'success',
    '¡Rotación exitosa!',
    `${data.animales_movidos} animal${data.animales_movidos !== 1 ? 'es movidos' : ' movido'} de "${origenSeleccionado.value?.nombre}" a "${destinoSeleccionado.value?.nombre}".`,
  )

  // Limpiar selección y recargar
  form.potrero_origen_id = null
  form.potrero_destino_id = null
  form.motivo = ''
  await cargarPotreros()
}

const mostrarToast = (type, title, message) => {
  toast.type = type
  toast.title = title
  toast.message = message
  toast.visible = true
  setTimeout(() => (toast.visible = false), 5000)
}

// ── Carga de datos ──────────────────────────────────────
const cargarPotreros = async () => {
  if (!fincaId.value) return
  await getPotrerosConDetalle(fincaId.value)
}

const cargarFinca = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  const { data } = await getAllFincas(userId, user.value.rol)
  if (data.value?.length) {
    fincaId.value = data.value[0].id
    await cargarPotreros()
  }
}

watch(user, cargarFinca, { immediate: true })
onMounted(cargarFinca)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
