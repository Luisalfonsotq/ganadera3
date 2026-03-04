<!-- pages/mis-tareas/index.vue -->
<template>
  <div class="max-w-2xl mx-auto space-y-5">

    <!-- Header saludo -->
    <div class="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-indigo-200 text-sm font-medium">Buen día,</p>
          <h1 class="text-2xl font-bold mt-0.5">{{ user?.nombre?.split(' ')[0] || 'Colaborador' }} 👋</h1>
          <p class="text-indigo-100 text-sm mt-1">{{ fechaHoy }}</p>
        </div>
        <div class="text-right">
          <div class="text-4xl font-black">{{ pendientesCount }}</div>
          <p class="text-indigo-200 text-xs mt-0.5">
            {{ pendientesCount === 1 ? 'tarea pendiente' : 'tareas pendientes' }}
          </p>
        </div>
      </div>

      <!-- Barra de progreso del día -->
      <div class="mt-5">
        <div class="flex justify-between text-xs text-indigo-200 mb-1.5">
          <span>Progreso de hoy</span>
          <span>{{ completadasCount }}/{{ totalCount }} completadas</span>
        </div>
        <div class="w-full bg-indigo-400/40 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full bg-white transition-all duration-700"
            :style="{ width: totalCount > 0 ? `${Math.round((completadasCount / totalCount) * 100)}%` : '0%' }"
          />
        </div>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="grid grid-cols-2 gap-3">
      <NuxtLink
        to="/reportar/incidencias"
        class="flex items-center space-x-3 p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition group"
      >
        <div class="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition">
          <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p class="text-sm font-semibold text-red-700">Reportar</p>
          <p class="text-xs text-red-500">Incidencia</p>
        </div>
      </NuxtLink>

      <button
        @click="recargar"
        class="flex items-center space-x-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition group"
      >
        <div class="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition">
          <Icon name="i-heroicons-arrow-path" :class="['w-5 h-5 text-indigo-600', loading ? 'animate-spin' : '']" />
        </div>
        <div class="text-left">
          <p class="text-sm font-semibold text-indigo-700">Actualizar</p>
          <p class="text-xs text-indigo-500">Lista</p>
        </div>
      </button>
    </div>

    <!-- Tabs de filtro -->
    <div class="flex bg-gray-100 rounded-xl p-1 gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="tabActivo = tab.value"
        :class="[
          'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition',
          tabActivo === tab.value
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.label }}
        <span
          v-if="contarPorTab(tab.value) > 0"
          :class="[
            'ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold',
            tab.value === 'vencidas' ? 'bg-red-100 text-red-700' :
            tab.value === 'pendientes' ? 'bg-amber-100 text-amber-700' :
            'bg-green-100 text-green-700'
          ]"
        >
          {{ contarPorTab(tab.value) }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 space-y-3">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
      <p class="text-gray-500 text-sm">Cargando tus tareas...</p>
    </div>

    <!-- Estado vacío general -->
    <div
      v-else-if="tareasFiltradas.length === 0 && tabActivo === 'pendientes'"
      class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <div class="text-6xl mb-4">🎉</div>
      <p class="text-xl font-bold text-gray-800">¡Al día!</p>
      <p class="text-gray-500 text-sm mt-2">No tienes tareas pendientes por ahora.</p>
      <p class="text-gray-400 text-xs mt-1">Bien hecho 👏</p>
    </div>

    <div
      v-else-if="tareasFiltradas.length === 0"
      class="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <Icon name="i-heroicons-inbox" class="w-10 h-10 text-gray-300 mx-auto mb-2" />
      <p class="text-gray-500 text-sm">No hay tareas en esta sección</p>
    </div>

    <!-- Lista de tareas -->
    <div v-else class="space-y-3">
      <TransitionGroup name="list">
        <div
          v-for="tarea in tareasFiltradas"
          :key="tarea.id"
          :class="[
            'bg-white rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md',
            tarea.estado === 'vencida' ? 'border-red-200' :
            tarea.estado === 'completada' ? 'border-green-200 opacity-80' :
            tarea.estado === 'en_curso' ? 'border-blue-200' :
            'border-gray-200'
          ]"
        >
          <!-- Franja lateral de prioridad -->
          <div :class="['border-l-4 p-5', getBorderClass(tarea.estado)]">

            <!-- Badges superiores -->
            <div class="flex items-center flex-wrap gap-2 mb-3">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold border', getEstadoClass(tarea.estado)]">
                {{ estadoEmoji(tarea.estado) }} {{ getEstadoLabel(tarea.estado) }}
              </span>
              <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getPrioridadClass(tarea.prioridad)]">
                {{ prioridadLabel(tarea.prioridad) }}
              </span>
              <span class="flex items-center text-xs text-gray-400">
                <Icon :name="getCategoriaIcon(tarea.categoria)" class="w-3.5 h-3.5 mr-1" />
                {{ categoriaLabel(tarea.categoria) }}
              </span>
            </div>

            <!-- Título -->
            <h2 :class="['text-base font-bold mb-1', tarea.estado === 'completada' ? 'line-through text-gray-400' : 'text-gray-900']">
              {{ tarea.titulo }}
            </h2>

            <!-- Descripción -->
            <p v-if="tarea.descripcion" class="text-sm text-gray-500 mb-3 leading-relaxed">
              {{ tarea.descripcion }}
            </p>

            <!-- Meta info -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
              <span v-if="tarea.finca" class="flex items-center">
                <Icon name="i-heroicons-building-office" class="w-3.5 h-3.5 mr-1" />
                {{ tarea.finca.nombre }}
              </span>
              <span v-if="tarea.potrero" class="flex items-center">
                <Icon name="i-heroicons-map-pin" class="w-3.5 h-3.5 mr-1" />
                {{ tarea.potrero.nombre }}
              </span>
              <span
                v-if="tarea.fecha_limite"
                :class="['flex items-center', esVencida(tarea) ? 'text-red-500 font-semibold' : '']"
              >
                <Icon name="i-heroicons-calendar" class="w-3.5 h-3.5 mr-1" />
                {{ esVencida(tarea) ? '⚠️ ' : '' }}Límite: {{ formatDate(tarea.fecha_limite) }}
              </span>
              <span v-if="tarea.fecha_completada" class="flex items-center text-green-600">
                <Icon name="i-heroicons-check" class="w-3.5 h-3.5 mr-1" />
                Completada: {{ formatDateTime(tarea.fecha_completada) }}
              </span>
            </div>

            <!-- Reporte enviado (si existe) -->
            <div v-if="tarea.reporte_descripcion" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
              <p class="font-semibold text-amber-700 mb-1 flex items-center">
                <Icon name="i-heroicons-chat-bubble-left-ellipsis" class="w-3.5 h-3.5 mr-1" />
                Reporte enviado
              </p>
              <p class="text-amber-800">{{ tarea.reporte_descripcion }}</p>
            </div>

            <!-- Botones de acción -->
            <div v-if="tarea.estado !== 'completada' && tarea.estado !== 'cancelada'" class="flex flex-wrap gap-2">

              <!-- Iniciar (si está pendiente) -->
              <button
                v-if="tarea.estado === 'pendiente'"
                @click="handleIniciar(tarea.id)"
                :disabled="accionLoading === tarea.id"
                class="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60 active:scale-95"
              >
                <Icon v-if="accionLoading === tarea.id" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <Icon v-else name="i-heroicons-play" class="w-4 h-4" />
                <span>Iniciar</span>
              </button>

              <!-- Completar (si está en curso o pendiente) -->
              <button
                @click="handleCompletar(tarea.id)"
                :disabled="accionLoading === tarea.id"
                class="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60 active:scale-95 shadow-sm shadow-green-200"
              >
                <Icon v-if="accionLoading === tarea.id" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <Icon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                <span>Completar</span>
              </button>

              <!-- Reportar problema -->
              <button
                @click="abrirReporte(tarea)"
                class="flex items-center space-x-1.5 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-sm font-medium rounded-xl transition active:scale-95"
              >
                <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                <span>{{ tarea.reporte_descripcion ? 'Actualizar reporte' : 'Reportar problema' }}</span>
              </button>
            </div>

            <!-- Tarea completada — mensaje de éxito -->
            <div v-else-if="tarea.estado === 'completada'" class="flex items-center space-x-2 text-green-600">
              <Icon name="i-heroicons-check-badge" class="w-5 h-5" />
              <span class="text-sm font-medium">¡Tarea completada! 🎉</span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- ─── MODAL DE REPORTE DE PROBLEMA ─────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="modalReporte.open"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        @click.self="cerrarModal"
      >
        <div class="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg p-6 space-y-5">
          <!-- Header del modal -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-amber-100 rounded-xl">
                <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">Reportar Problema</h3>
                <p class="text-xs text-gray-500 truncate max-w-56">{{ modalReporte.tarea?.titulo }}</p>
              </div>
            </div>
            <button @click="cerrarModal" class="p-2 hover:bg-gray-100 rounded-lg transition">
              <Icon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Formulario de reporte -->
          <div class="space-y-4">
            <!-- Descripción del problema -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                ¿Qué problema encontraste? <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="modalReporte.descripcion"
                rows="4"
                placeholder="Describe el problema con detalle: ¿qué pasó? ¿dónde? ¿qué animal o recurso está afectado?"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm resize-none transition"
                :class="{ 'border-red-400 ring-1 ring-red-400': modalReporte.errorDesc }"
              />
              <p v-if="modalReporte.errorDesc" class="text-xs text-red-600 mt-1">{{ modalReporte.errorDesc }}</p>
            </div>

            <!-- URL de foto -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                Foto del problema <span class="text-gray-400">(URL opcional)</span>
              </label>
              <div class="relative">
                <Icon name="i-heroicons-photo" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="modalReporte.foto_url"
                  type="url"
                  placeholder="https://... (pega un enlace a la foto)"
                  class="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">
                💡 Toma la foto con tu celular, súbela a Google Fotos o WhatsApp y pega el enlace aquí.
              </p>

              <!-- Preview de imagen si hay URL -->
              <div v-if="modalReporte.foto_url" class="mt-2">
                <img
                  :src="modalReporte.foto_url"
                  alt="Preview"
                  class="w-full max-h-40 object-cover rounded-xl border border-gray-200"
                  @error="e => e.target.style.display = 'none'"
                />
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-3">
            <button
              @click="cerrarModal"
              class="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              @click="enviarReporte"
              :disabled="modalReporte.loading"
              class="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition disabled:opacity-60 flex items-center justify-center space-x-2"
            >
              <Icon v-if="modalReporte.loading" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
              <Icon v-else name="i-heroicons-paper-airplane" class="w-4 h-4" />
              <span>{{ modalReporte.loading ? 'Enviando...' : 'Enviar Reporte' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast de feedback -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        :class="`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${toast.bg} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 min-w-64`"
      >
        <Icon :name="toast.icon" class="w-5 h-5 shrink-0" />
        <span class="text-sm font-semibold">{{ toast.msg }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useTarea } from '@/composables/useTarea'

definePageMeta({ layout: 'profile-layout' })

const { user } = useAuth()
const {
  tareas, loading,
  getMisTareas,
  iniciarTarea, completarTarea, reportarProblema,
  getEstadoClass, getEstadoBorderClass, getPrioridadClass, getCategoriaIcon, getEstadoLabel,
} = useTarea()

// ─── Estado ───────────────────────────────────────────────────────────────────
const tabActivo = ref('pendientes')
const accionLoading = ref(null)
const toast = ref({ show: false, msg: '', bg: 'bg-green-600', icon: 'i-heroicons-check-circle' })

const modalReporte = ref({
  open: false,
  tarea: null,
  descripcion: '',
  foto_url: '',
  loading: false,
  errorDesc: '',
})

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabs = [
  { value: 'pendientes', label: 'Pendientes' },
  { value: 'en_curso', label: 'En Curso' },
  { value: 'completadas', label: 'Hechas' },
  { value: 'vencidas', label: 'Vencidas' },
]

// ─── Computed ─────────────────────────────────────────────────────────────────
const pendientesCount = computed(() =>
  tareas.value.filter(t => t.estado === 'pendiente' || t.estado === 'en_curso' || t.estado === 'vencida').length
)
const completadasCount = computed(() =>
  tareas.value.filter(t => t.estado === 'completada').length
)
const totalCount = computed(() => tareas.value.length)

const tareasFiltradas = computed(() => {
  if (tabActivo.value === 'pendientes') {
    return tareas.value.filter(t => t.estado === 'pendiente')
      .sort((a, b) => {
        const pOrd = { urgente: 0, alta: 1, media: 2, baja: 3 }
        return (pOrd[a.prioridad] ?? 4) - (pOrd[b.prioridad] ?? 4)
      })
  }
  if (tabActivo.value === 'en_curso') return tareas.value.filter(t => t.estado === 'en_curso')
  if (tabActivo.value === 'completadas') return tareas.value.filter(t => t.estado === 'completada')
    .sort((a, b) => new Date(b.fecha_completada) - new Date(a.fecha_completada))
  if (tabActivo.value === 'vencidas') return tareas.value.filter(t => t.estado === 'vencida')
  return tareas.value
})

const contarPorTab = (tab) => {
  if (tab === 'pendientes') return tareas.value.filter(t => t.estado === 'pendiente').length
  if (tab === 'en_curso') return tareas.value.filter(t => t.estado === 'en_curso').length
  if (tab === 'completadas') return tareas.value.filter(t => t.estado === 'completada').length
  if (tab === 'vencidas') return tareas.value.filter(t => t.estado === 'vencida').length
  return 0
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getBorderClass = (estado) => getEstadoBorderClass(estado)
const fechaHoy = computed(() => new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }))
const esVencida = (t) => t.estado === 'vencida' || (t.fecha_limite && new Date(t.fecha_limite) < new Date() && t.estado !== 'completada')
const formatDate = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : ''
const formatDateTime = (d) => d ? new Date(d).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''
const estadoEmoji = (e) => ({ pendiente: '⏳', en_curso: '🔄', completada: '✅', vencida: '🚨', cancelada: '❌' })[e] || ''
const prioridadLabel = (p) => ({ baja: '🟢 Baja', media: '🔵 Media', alta: '🟠 Alta', urgente: '🔴 Urgente' })[p] || p
const categoriaLabel = (c) => ({
  alimentacion: 'Alimentación', limpieza: 'Limpieza', movimiento_ganado: 'Movimiento',
  mantenimiento: 'Mantenimiento', sanidad: 'Sanidad', revision: 'Revisión', otro: 'Otro'
})[c] || c

const showToast = (msg, ok = true) => {
  toast.value = {
    show: true, msg,
    bg: ok ? 'bg-green-600' : 'bg-red-600',
    icon: ok ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle',
  }
  setTimeout(() => { toast.value.show = false }, 3500)
}

// ─── Carga inicial ────────────────────────────────────────────────────────────
const recargar = async () => {
  if (user.value?.id) {
    await getMisTareas(user.value.id)
  }
}

onMounted(recargar)

// ─── Acciones de tarea ────────────────────────────────────────────────────────
const handleIniciar = async (id) => {
  accionLoading.value = id
  try {
    await iniciarTarea(id)
    showToast('¡Tarea iniciada! Puedes completarla cuando termines.')
    tabActivo.value = 'en_curso'
  } catch (e) {
    showToast(e.message || 'Error al iniciar la tarea', false)
  } finally {
    accionLoading.value = null
  }
}

const handleCompletar = async (id) => {
  accionLoading.value = id
  try {
    await completarTarea(id)
    showToast('¡Excelente! Tarea completada 🎉')
    if (contarPorTab(tabActivo.value) === 0) tabActivo.value = 'completadas'
  } catch (e) {
    showToast(e.message || 'Error al completar la tarea', false)
  } finally {
    accionLoading.value = null
  }
}

// ─── Reporte de problema ──────────────────────────────────────────────────────
const abrirReporte = (tarea) => {
  modalReporte.value = {
    open: true,
    tarea,
    descripcion: tarea.reporte_descripcion || '',
    foto_url: tarea.reporte_foto_url || '',
    loading: false,
    errorDesc: '',
  }
}

const cerrarModal = () => {
  if (!modalReporte.value.loading) {
    modalReporte.value.open = false
  }
}

const enviarReporte = async () => {
  if (!modalReporte.value.descripcion.trim()) {
    modalReporte.value.errorDesc = 'Describe el problema antes de enviar.'
    return
  }
  modalReporte.value.errorDesc = ''
  modalReporte.value.loading = true

  try {
    await reportarProblema(
      modalReporte.value.tarea.id,
      modalReporte.value.foto_url || null,
      modalReporte.value.descripcion.trim(),
    )
    cerrarModal()
    showToast('Reporte enviado al supervisor ✅')
  } catch (e) {
    showToast(e.message || 'Error al enviar el reporte', false)
  } finally {
    modalReporte.value.loading = false
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-8px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
