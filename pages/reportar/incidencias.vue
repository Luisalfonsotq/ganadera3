<!-- pages/reportar/incidencias.vue -->
<template>
  <div class="max-w-xl mx-auto space-y-6">

    <!-- Header -->
    <div class="flex items-center space-x-4">
      <NuxtLink
        to="/mis-tareas"
        class="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
      >
        <Icon name="i-heroicons-arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Reportar Incidencia</h1>
        <p class="text-sm text-gray-500">Informa sobre un problema en la finca</p>
      </div>
    </div>

    <!-- Categorías rápidas -->
    <div>
      <p class="text-sm font-semibold text-gray-700 mb-3">¿Qué tipo de problema es?</p>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="cat in categorias"
          :key="cat.id"
          @click="seleccionarCategoria(cat)"
          :class="[
            'flex items-center space-x-3 p-4 rounded-xl border-2 text-left transition',
            categoriaSeleccionada === cat.id
              ? `${cat.bgActivo} ${cat.borderActivo} shadow-sm`
              : 'bg-white border-gray-200 hover:border-gray-300'
          ]"
        >
          <span class="text-2xl shrink-0">{{ cat.emoji }}</span>
          <div>
            <p :class="['text-sm font-semibold', categoriaSeleccionada === cat.id ? cat.textoActivo : 'text-gray-800']">
              {{ cat.label }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ cat.sub }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Formulario principal -->
    <form @submit.prevent="enviarIncidencia" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

      <!-- Tareas relacionadas (si hay) -->
      <div v-if="misTagsConTarea.length > 0">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ¿Está relacionado con alguna tarea?
        </label>
        <select
          v-model="form.tarea_id"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-400 focus:border-transparent"
        >
          <option :value="null">— No está relacionado con una tarea —</option>
          <option v-for="t in misTagsConTarea" :key="t.id" :value="t.id">
            {{ t.titulo }}
          </option>
        </select>
      </div>

      <!-- Descripción del problema -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Describe el problema <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.descripcion"
          rows="5"
          required
          :placeholder="placeholderDescripcion"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm resize-none transition"
          :class="{ 'border-red-400 ring-1 ring-red-400': errors.descripcion }"
        />
        <div class="flex justify-between items-center mt-1">
          <p v-if="errors.descripcion" class="text-xs text-red-600">{{ errors.descripcion }}</p>
          <p class="text-xs text-gray-400 ml-auto">{{ form.descripcion.length }}/500 caracteres</p>
        </div>
      </div>

      <!-- URL de foto -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Foto del problema <span class="text-gray-400 font-normal">(opcional pero recomendada)</span>
        </label>

        <div class="relative">
          <Icon name="i-heroicons-link" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="form.foto_url"
            type="url"
            placeholder="https://... (enlace a la foto)"
            class="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm transition"
          />
        </div>

        <!-- Preview -->
        <Transition name="fade">
          <div v-if="form.foto_url && fotoValida" class="mt-3 relative rounded-xl overflow-hidden border border-gray-200">
            <img
              :src="form.foto_url"
              alt="Vista previa del problema"
              class="w-full max-h-48 object-cover"
              @error="fotoValida = false"
              @load="fotoValida = true"
            />
            <div class="absolute top-2 right-2">
              <button
                type="button"
                @click="form.foto_url = ''"
                class="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
              >
                <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </Transition>

        <p class="text-xs text-gray-400 mt-1.5 flex items-start space-x-1">
          <Icon name="i-heroicons-light-bulb" class="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span>Sube la foto a Google Fotos, WhatsApp Web o Imgur y pega el enlace aquí.</span>
        </p>
      </div>

      <!-- Prioridad del reporte -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Urgencia</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="p in prioridades"
            :key="p.value"
            type="button"
            @click="form.prioridad = p.value"
            :class="[
              'py-2 px-3 rounded-xl border-2 text-xs font-semibold transition',
              form.prioridad === p.value ? p.activeCls : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            ]"
          >
            {{ p.emoji }} {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Botón enviar -->
      <button
        type="submit"
        :disabled="enviando || !form.descripcion.trim()"
        class="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm shadow-red-200 transition flex items-center justify-center space-x-2 active:scale-95"
      >
        <Icon v-if="enviando" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
        <Icon v-else name="i-heroicons-paper-airplane" class="w-5 h-5" />
        <span>{{ enviando ? 'Enviando reporte...' : 'Enviar Reporte' }}</span>
      </button>
    </form>

    <!-- Historial de reportes recientes -->
    <div v-if="reportesEnviados.length > 0">
      <h2 class="text-sm font-semibold text-gray-600 mb-3">Reportes recientes enviados</h2>
      <div class="space-y-2">
        <div
          v-for="r in reportesEnviados"
          :key="r.id"
          class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3"
        >
          <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ r.titulo }}</p>
            <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ r.reporte_descripcion }}</p>
            <p class="text-xs text-amber-600 mt-1 flex items-center">
              <Icon name="i-heroicons-clock" class="w-3 h-3 mr-1" />
              {{ formatRelativo(r.reporte_fecha) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast feedback -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        :class="`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${toast.bg} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 min-w-56`"
      >
        <Icon :name="toast.icon" class="w-5 h-5 shrink-0" />
        <span class="text-sm font-semibold">{{ toast.msg }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTarea } from '@/composables/useTarea'

definePageMeta({ layout: 'profile-layout' })

const router = useRouter()
const { user } = useAuth()
const { tareas, getMisTareas, reportarProblema } = useTarea()

// ─── Estado ───────────────────────────────────────────────────────────────────
const categoriaSeleccionada = ref('animal')
const enviando = ref(false)
const fotoValida = ref(false)
const errors = ref({})
const toast = ref({ show: false, msg: '', bg: 'bg-green-600', icon: 'i-heroicons-check-circle' })

const form = ref({
  descripcion: '',
  foto_url: '',
  prioridad: 'alta',
  tarea_id: null,
})

// ─── Categorías de incidencia ─────────────────────────────────────────────────
const categorias = [
  {
    id: 'animal', emoji: '🐄', label: 'Animal Enfermo', sub: 'Salud del ganado',
    bgActivo: 'bg-red-50', borderActivo: 'border-red-400', textoActivo: 'text-red-700',
    placeholder: 'Ej: La vaca #034 está cojera, no apoya la pata derecha. Está en el potrero 2.',
  },
  {
    id: 'agua', emoji: '💧', label: 'Agua / Bebederos', sub: 'Falta de agua',
    bgActivo: 'bg-blue-50', borderActivo: 'border-blue-400', textoActivo: 'text-blue-700',
    placeholder: 'Ej: El bebedero del potrero 3 está vacío y la manguera está rota.',
  },
  {
    id: 'alimento', emoji: '🌾', label: 'Falta Alimento', sub: 'Concentrado / Pasto',
    bgActivo: 'bg-green-50', borderActivo: 'border-green-400', textoActivo: 'text-green-700',
    placeholder: 'Ej: Se acabó el concentrado en la bodega. Quedan 2 sacos pero no son suficientes.',
  },
  {
    id: 'baja', emoji: '💀', label: 'Muerte / Baja', sub: 'Animal muerto',
    bgActivo: 'bg-gray-100', borderActivo: 'border-gray-500', textoActivo: 'text-gray-900',
    placeholder: 'Ej: Encontré muerta a la ternera del lote 1, número de arete 089. Está en el potrero 5.',
  },
  {
    id: 'infraestructura', emoji: '🔧', label: 'Infraestructura', sub: 'Cercas / Instalaciones',
    bgActivo: 'bg-orange-50', borderActivo: 'border-orange-400', textoActivo: 'text-orange-700',
    placeholder: 'Ej: La cerca del sector norte tiene 3 postes caídos. El ganado puede escapar.',
  },
  {
    id: 'otro', emoji: '⚠️', label: 'Otro Problema', sub: 'Algo más',
    bgActivo: 'bg-yellow-50', borderActivo: 'border-yellow-400', textoActivo: 'text-yellow-700',
    placeholder: 'Describe el problema con el mayor detalle posible: ¿qué?, ¿dónde?, ¿cuándo?',
  },
]

const prioridades = [
  { value: 'urgente', label: 'Urgente', emoji: '🔴', activeCls: 'bg-red-50 border-red-500 text-red-700' },
  { value: 'alta', label: 'Alta', emoji: '🟠', activeCls: 'bg-orange-50 border-orange-500 text-orange-700' },
  { value: 'media', label: 'Media', emoji: '🟡', activeCls: 'bg-yellow-50 border-yellow-500 text-yellow-700' },
]

// ─── Computed ─────────────────────────────────────────────────────────────────
const placeholderDescripcion = computed(() =>
  categorias.find(c => c.id === categoriaSeleccionada.value)?.placeholder || 'Describe el problema...'
)

const misTagsConTarea = computed(() =>
  tareas.value.filter(t => t.estado === 'pendiente' || t.estado === 'en_curso')
)

const reportesEnviados = computed(() =>
  tareas.value
    .filter(t => t.reporte_descripcion)
    .sort((a, b) => new Date(b.reporte_fecha) - new Date(a.reporte_fecha))
    .slice(0, 3)
)

// ─── Watch foto URL para preview ──────────────────────────────────────────────
watch(() => form.value.foto_url, (url) => {
  if (!url) { fotoValida.value = false }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
const seleccionarCategoria = (cat) => {
  categoriaSeleccionada.value = cat.id
  // Auto-llenar urgencia según categoría
  if (cat.id === 'baja' || cat.id === 'animal') form.value.prioridad = 'urgente'
  else if (cat.id === 'agua') form.value.prioridad = 'alta'
  else form.value.prioridad = 'media'
}

const showToast = (msg, ok = true) => {
  toast.value = {
    show: true, msg,
    bg: ok ? 'bg-green-600' : 'bg-red-600',
    icon: ok ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle',
  }
  setTimeout(() => { toast.value.show = false }, 3500)
}

const formatRelativo = (fecha) => {
  if (!fecha) return ''
  const diff = Date.now() - new Date(fecha).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Hace un momento'
  if (min < 60) return `Hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Hace ${h}h`
  return new Date(fecha).toLocaleDateString('es-CO')
}

// ─── Carga de datos ───────────────────────────────────────────────────────────
onMounted(async () => {
  if (user.value?.id) {
    await getMisTareas(user.value.id)
  }
})

// ─── Enviar incidencia ────────────────────────────────────────────────────────
const enviarIncidencia = async () => {
  errors.value = {}

  if (!form.value.descripcion.trim()) {
    errors.value.descripcion = 'La descripción del problema es obligatoria.'
    return
  }

  enviando.value = true

  try {
    // Si eligió una tarea específica, reportar como problema en esa tarea
    if (form.value.tarea_id) {
      await reportarProblema(
        form.value.tarea_id,
        form.value.foto_url || null,
        `[${categorias.find(c => c.id === categoriaSeleccionada.value)?.label}] ${form.value.descripcion.trim()}`,
      )
    } else {
      // Sin tarea: buscar si hay algún tarea general asignada (primera pendiente)
      const tareaGeneral = tareas.value.find(t => t.estado === 'pendiente' || t.estado === 'en_curso')
      if (tareaGeneral) {
        await reportarProblema(
          tareaGeneral.id,
          form.value.foto_url || null,
          `[${categorias.find(c => c.id === categoriaSeleccionada.value)?.label} | Reporte libre] ${form.value.descripcion.trim()}`,
        )
      }
    }

    // Limpiar form
    form.value.descripcion = ''
    form.value.foto_url = ''
    form.value.tarea_id = null

    showToast('Reporte enviado al supervisor ✅')

    // Redirigir después de 2s
    setTimeout(() => router.push('/mis-tareas'), 2000)

  } catch (e) {
    showToast(e.message || 'Error al enviar el reporte', false)
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
