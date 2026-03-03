<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- ── HEADER ────────────────────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <span class="p-2 bg-amber-100 rounded-xl">
              <Icon name="i-heroicons-bell" class="w-7 h-7 text-amber-600" />
            </span>
            Centro de Notificaciones
          </h1>
          <p class="text-slate-500 mt-2 text-sm">
            Alertas y avisos del sistema en tiempo real para tu finca
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Badge total -->
          <span
            v-if="notifications.length > 0"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700"
          >
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {{ unreadCount }} sin leer
          </span>

          <!-- Botón recargar -->
          <button
            id="btn-reload-notifications"
            @click="recargar"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-400
                   hover:bg-emerald-50 text-slate-700 text-sm font-semibold rounded-xl shadow-sm
                   transition-all duration-200 disabled:opacity-50"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></span>
            <Icon v-else name="i-heroicons-arrow-path" class="w-4 h-4" />
            Actualizar
          </button>

          <!-- Marcar todas como leídas -->
          <button
            v-if="unreadCount > 0"
            id="btn-mark-all-read"
            @click="markAllRead"
            class="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700
                   text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
          >
            <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
            Marcar todas
          </button>
        </div>
      </div>

      <!-- ── FILTROS ─────────────────────────────────────────────────── -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          @click="activeFilter = tab.key"
          :id="`filter-tab-${tab.key}`"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
          :class="activeFilter === tab.key
            ? `${tab.activeBg} ${tab.activeText} ${tab.activeBorder}`
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
            :class="activeFilter === tab.key ? 'bg-white/30' : 'bg-slate-100 text-slate-600'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- ── LOADING ─────────────────────────────────────────────────── -->
      <div v-if="loading && notifications.length === 0" class="flex flex-col items-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p class="text-slate-500 font-medium">Cargando notificaciones...</p>
      </div>

      <!-- ── VACÍO ───────────────────────────────────────────────────── -->
      <div
        v-else-if="filteredNotifications.length === 0"
        class="flex flex-col items-center py-20 gap-4 text-slate-400"
      >
        <div class="p-6 bg-slate-100 rounded-full">
          <Icon name="i-heroicons-bell-slash" class="w-12 h-12" />
        </div>
        <div class="text-center">
          <p class="font-semibold text-lg text-slate-600">Sin notificaciones</p>
          <p class="text-sm mt-1">No hay alertas pendientes en este momento</p>
        </div>
      </div>

      <!-- ── LISTADO ─────────────────────────────────────────────────── -->
      <div v-else class="space-y-3">
        <TransitionGroup name="notif-list">
          <div
            v-for="(notif, index) in filteredNotifications"
            :key="notif.id"
            class="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
                   transition-all duration-200 hover:shadow-md"
            :class="{ 'opacity-60': notif.read }"
          >
            <div class="flex items-start gap-4 p-5">

              <!-- Ícono / tipo -->
              <div
                class="flex-shrink-0 p-2.5 rounded-xl"
                :class="typeConfig[notif.type]?.iconBg"
              >
                <Icon
                  :name="typeConfig[notif.type]?.icon"
                  class="w-5 h-5"
                  :class="typeConfig[notif.type]?.iconColor"
                />
              </div>

              <!-- Contenido -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    :class="typeConfig[notif.type]?.badgeBg + ' ' + typeConfig[notif.type]?.badgeText"
                  >
                    {{ typeConfig[notif.type]?.label }}
                  </span>
                  <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <p class="font-semibold text-slate-800 text-sm leading-snug">{{ notif.title }}</p>
                <p class="text-slate-500 text-xs mt-1 leading-relaxed">{{ notif.message }}</p>
                <p class="text-slate-400 text-xs mt-2 flex items-center gap-1">
                  <Icon name="i-heroicons-clock" class="w-3.5 h-3.5" />
                  {{ notif.time }}
                </p>
              </div>

              <!-- Acciones -->
              <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  v-if="!notif.read"
                  @click="markRead(index)"
                  class="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1 bg-slate-100
                         hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs text-slate-500
                         transition-all duration-200"
                  :title="`Marcar ${notif.title} como leída`"
                >
                  <Icon name="i-heroicons-check" class="w-3 h-3" />
                  Leída
                </button>
                <button
                  @click="dismiss(index)"
                  class="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-300 hover:text-red-400
                         hover:bg-red-50 transition-all duration-200"
                  title="Descartar"
                >
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Barra de acento inferior -->
            <div
              class="h-0.5"
              :class="typeConfig[notif.type]?.accent"
            ></div>
          </div>
        </TransitionGroup>
      </div>

      <!-- ── STATS RESUMEN ───────────────────────────────────────────── -->
      <div v-if="notifications.length > 0" class="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
        <div
          v-for="stat in statsSummary"
          :key="stat.label"
          class="bg-white rounded-2xl border border-slate-100 p-4 text-center"
        >
          <div class="text-2xl font-black" :class="stat.color">{{ stat.value }}</div>
          <div class="text-xs text-slate-500 mt-1 font-medium">{{ stat.label }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({ layout: 'profile-layout' })

// ── Composable ───────────────────────────────────────────────────────────
const { notifications, loading, fetchNotifications } = useNotifications()

// ── Estado local ──────────────────────────────────────────────────────────
const activeFilter = ref('all')

// Añadimos id y read a cada notificación para gestión local
const localNotifications = ref([])

onMounted(async () => {
  await fetchNotifications()
  localNotifications.value = (notifications.value || []).map((n, i) => ({
    ...n,
    id: i,
    read: false,
  }))
})

// Sincronizar cuando cambia la fuente (recargar)
const recargar = async () => {
  await fetchNotifications()
  localNotifications.value = (notifications.value || []).map((n, i) => ({
    ...n,
    id: Date.now() + i,
    read: false,
  }))
}

// ── Tipo de notificación ──────────────────────────────────────────────────
const typeConfig = {
  urgent: {
    icon: 'i-heroicons-exclamation-triangle',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    label: 'Urgente',
    accent: 'bg-red-500',
  },
  warning: {
    icon: 'i-heroicons-bell-alert',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    label: 'Advertencia',
    accent: 'bg-amber-400',
  },
  info: {
    icon: 'i-heroicons-information-circle',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    label: 'Información',
    accent: 'bg-blue-400',
  },
}

// ── Filtros ───────────────────────────────────────────────────────────────
const filterTabs = computed(() => [
  {
    key: 'all',
    label: 'Todas',
    icon: 'i-heroicons-squares-2x2',
    count: localNotifications.value.filter(n => !n.read).length,
    activeBg: 'bg-slate-800',
    activeText: 'text-white',
    activeBorder: 'border-slate-800',
  },
  {
    key: 'urgent',
    label: 'Urgentes',
    icon: 'i-heroicons-exclamation-triangle',
    count: localNotifications.value.filter(n => n.type === 'urgent' && !n.read).length,
    activeBg: 'bg-red-600',
    activeText: 'text-white',
    activeBorder: 'border-red-600',
  },
  {
    key: 'warning',
    label: 'Advertencias',
    icon: 'i-heroicons-bell-alert',
    count: localNotifications.value.filter(n => n.type === 'warning' && !n.read).length,
    activeBg: 'bg-amber-500',
    activeText: 'text-white',
    activeBorder: 'border-amber-500',
  },
  {
    key: 'info',
    label: 'Información',
    icon: 'i-heroicons-information-circle',
    count: localNotifications.value.filter(n => n.type === 'info' && !n.read).length,
    activeBg: 'bg-blue-600',
    activeText: 'text-white',
    activeBorder: 'border-blue-600',
  },
])

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return localNotifications.value
  return localNotifications.value.filter(n => n.type === activeFilter.value)
})

const unreadCount = computed(() => localNotifications.value.filter(n => !n.read).length)

// ── Estadísticas ──────────────────────────────────────────────────────────
const statsSummary = computed(() => [
  {
    label: 'Urgentes',
    value: localNotifications.value.filter(n => n.type === 'urgent').length,
    color: 'text-red-600',
  },
  {
    label: 'Advertencias',
    value: localNotifications.value.filter(n => n.type === 'warning').length,
    color: 'text-amber-600',
  },
  {
    label: 'Informativas',
    value: localNotifications.value.filter(n => n.type === 'info').length,
    color: 'text-blue-600',
  },
])

// ── Acciones ──────────────────────────────────────────────────────────────
const markRead = (visibleIndex) => {
  const notif = filteredNotifications.value[visibleIndex]
  if (notif) {
    const idx = localNotifications.value.findIndex(n => n.id === notif.id)
    if (idx !== -1) localNotifications.value[idx].read = true
  }
}

const markAllRead = () => {
  localNotifications.value = localNotifications.value.map(n => ({ ...n, read: true }))
}

const dismiss = (visibleIndex) => {
  const notif = filteredNotifications.value[visibleIndex]
  if (notif) {
    localNotifications.value = localNotifications.value.filter(n => n.id !== notif.id)
  }
}
</script>

<style scoped>
/* Animaciones TransitionGroup */
.notif-list-move,
.notif-list-enter-active,
.notif-list-leave-active {
  transition: all 0.3s ease;
}
.notif-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.notif-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.notif-list-leave-active {
  position: absolute;
  width: 100%;
}

.animate-spin {
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
