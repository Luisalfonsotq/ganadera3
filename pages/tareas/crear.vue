<!-- pages/tareas/crear.vue -->
<template>
  <div class="max-w-3xl mx-auto space-y-6">

    <!-- Header -->
    <div class="flex items-center space-x-4">
      <NuxtLink
        to="/supervision/tareas"
        class="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Icon name="i-heroicons-arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Nueva Tarea</h1>
        <p class="text-sm text-gray-500 mt-0.5">Asigna una tarea a un colaborador de la finca</p>
      </div>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información básica -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 class="text-base font-semibold text-gray-800 flex items-center">
          <Icon name="i-heroicons-clipboard-document-list" class="w-5 h-5 mr-2 text-blue-600" />
          Información de la Tarea
        </h2>

        <!-- Título -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Título <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.titulo"
            type="text"
            required
            maxlength="255"
            placeholder="Ej: Alimentar ganado en Potrero 3"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            :class="{ 'border-red-400 ring-1 ring-red-400': errors.titulo }"
          />
          <p v-if="errors.titulo" class="mt-1 text-xs text-red-600">{{ errors.titulo }}</p>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            placeholder="Detalles adicionales sobre la tarea..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm resize-none"
          />
        </div>

        <!-- Categoría y Prioridad -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.categoria"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white"
            >
              <option value="alimentacion">🍼 Alimentación</option>
              <option value="limpieza">🧹 Limpieza</option>
              <option value="movimiento_ganado">🐄 Movimiento de Ganado</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="sanidad">🏥 Sanidad</option>
              <option value="revision">👁️ Revisión</option>
              <option value="otro">📋 Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prioridad <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.prioridad"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white"
            >
              <option value="baja">🟢 Baja</option>
              <option value="media">🔵 Media</option>
              <option value="alta">🟠 Alta</option>
              <option value="urgente">🔴 Urgente</option>
            </select>
          </div>
        </div>

        <!-- Fecha límite -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
          <input
            v-model="form.fecha_limite"
            type="date"
            :min="hoy"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
          />
        </div>
      </div>

      <!-- Asignación -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 class="text-base font-semibold text-gray-800 flex items-center">
          <Icon name="i-heroicons-user-group" class="w-5 h-5 mr-2 text-blue-600" />
          Asignación
        </h2>

        <!-- Finca -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Finca <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.finca_id"
            required
            @change="onFincaChange"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white"
            :class="{ 'border-red-400': errors.finca_id }"
          >
            <option value="" disabled>-- Selecciona una finca --</option>
            <option
              v-for="finca in fincasDisponibles"
              :key="finca.id"
              :value="finca.id"
            >
              {{ finca.nombre }}
            </option>
          </select>
          <p v-if="errors.finca_id" class="mt-1 text-xs text-red-600">{{ errors.finca_id }}</p>
        </div>

        <!-- Potrero (opcional) -->
        <div v-if="potrerosDisponibles.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Potrero <span class="text-gray-400">(opcional)</span>
          </label>
          <select
            v-model="form.potrero_id"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white"
          >
            <option :value="null">-- Sin potrero específico --</option>
            <option
              v-for="potrero in potrerosDisponibles"
              :key="potrero.id"
              :value="potrero.id"
            >
              {{ potrero.nombre }}
            </option>
          </select>
        </div>

        <!-- Colaborador asignado -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Asignar a <span class="text-gray-400">(opcional)</span>
          </label>
          <select
            v-model="form.asignado_a_id"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white"
          >
            <option :value="null">-- Sin asignar (tarea libre) --</option>
            <option
              v-for="colaborador in colaboradoresDisponibles"
              :key="colaborador.id"
              :value="colaborador.id"
            >
              {{ colaborador.nombre }} — {{ colaborador.email }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            Si no asignas a nadie, el supervisor podrá asignarla luego.
          </p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center justify-end space-x-3 pb-6">
        <NuxtLink
          to="/supervision/tareas"
          class="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
        >
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center space-x-2 shadow-sm"
        >
          <Icon v-if="loading" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          <Icon v-else name="i-heroicons-plus-circle" class="w-4 h-4" />
          <span>{{ loading ? 'Creando...' : 'Crear Tarea' }}</span>
        </button>
      </div>
    </form>

    <!-- Toast de éxito -->
    <Transition name="slide-up">
      <div
        v-if="successMsg"
        class="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2"
      >
        <Icon name="i-heroicons-check-circle" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ successMsg }}</span>
      </div>
    </Transition>

    <!-- Toast de error -->
    <Transition name="slide-up">
      <div
        v-if="errorMsg"
        class="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2"
      >
        <Icon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ errorMsg }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTarea } from '@/composables/useTarea'

definePageMeta({ layout: 'profile-layout' })

const router = useRouter()
const { user } = useAuth()
const { createTarea, loading } = useTarea()

const { public: { apiBaseUrl } } = useRuntimeConfig()
const token = useCookie('access_token')

// ─── Estado ───────────────────────────────────────────────────────────────────
const fincasDisponibles = ref([])
const potrerosDisponibles = ref([])
const colaboradoresDisponibles = ref([])
const successMsg = ref('')
const errorMsg = ref('')
const errors = ref({})

const hoy = computed(() => new Date().toISOString().split('T')[0])

const form = ref({
  titulo: '',
  descripcion: '',
  categoria: 'otro',
  prioridad: 'media',
  fecha_limite: '',
  finca_id: '',
  potrero_id: null,
  asignado_a_id: null,
  creado_por_id: null,
})

// ─── Carga de datos ───────────────────────────────────────────────────────────
const authFetch = (url) =>
  $fetch(url, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${token.value}` },
  })

onMounted(async () => {
  if (user.value) {
    form.value.creado_por_id = user.value.id

    // Cargar fincas según el rol
    try {
      if (user.value.rol === 'Administrador') {
        fincasDisponibles.value = await authFetch(`${apiBaseUrl}/fincas?propietario_id=${user.value.id}`)
      } else {
        // Supervisor: fincas donde está asignado
        fincasDisponibles.value = await authFetch(`${apiBaseUrl}/fincas/by-user/${user.value.id}`)
      }
    } catch (e) {
      console.error('Error cargando fincas:', e)
    }

    // Cargar colaboradores disponibles
    try {
      const todos = await authFetch(`${apiBaseUrl}/usuarios`)
      colaboradoresDisponibles.value = todos.filter(u => u.rol === 'Colaborador')
    } catch (e) {
      console.error('Error cargando colaboradores:', e)
    }
  }
})

// ─── Al cambiar finca, cargamos sus potreros ──────────────────────────────────
const onFincaChange = async () => {
  form.value.potrero_id = null
  potrerosDisponibles.value = []
  if (!form.value.finca_id) return

  try {
    const data = await authFetch(`${apiBaseUrl}/potreros?finca_id=${form.value.finca_id}`)
    potrerosDisponibles.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error cargando potreros:', e)
  }
}

// ─── Validación ───────────────────────────────────────────────────────────────
const validate = () => {
  errors.value = {}
  if (!form.value.titulo.trim()) errors.value.titulo = 'El título es requerido'
  if (!form.value.finca_id) errors.value.finca_id = 'Selecciona una finca'
  return Object.keys(errors.value).length === 0
}

// ─── Submit ───────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  if (!validate()) return

  const payload = {
    titulo: form.value.titulo.trim(),
    descripcion: form.value.descripcion || null,
    categoria: form.value.categoria,
    prioridad: form.value.prioridad,
    fecha_limite: form.value.fecha_limite || null,
    finca_id: +form.value.finca_id,
    potrero_id: form.value.potrero_id || null,
    asignado_a_id: form.value.asignado_a_id || null,
    creado_por_id: user.value.id,
  }

  try {
    await createTarea(payload)
    successMsg.value = '¡Tarea creada exitosamente!'
    setTimeout(() => {
      successMsg.value = ''
      router.push('/supervision/tareas')
    }, 1800)
  } catch (e) {
    errorMsg.value = e.message || 'Error al crear la tarea'
    setTimeout(() => { errorMsg.value = '' }, 4000)
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
