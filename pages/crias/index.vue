<!-- pages/crias/index.vue -->
<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Crías</h1>
        <p class="text-sm text-gray-500 mt-1">Registro de nacimientos y línea genética del ganado</p>
      </div>
      <NuxtLink to="/crias/crear"
        class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <Icon name="heroicons:plus-circle" class="w-5 h-5" />
        Registrar Cría
      </NuxtLink>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <div class="h-5 bg-gray-200 rounded-md animate-pulse w-36"></div>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="i in 4" :key="i" class="flex items-center gap-4 px-6 py-4">
          <div class="w-9 h-9 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
            <div class="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div class="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
      <Icon name="heroicons:exclamation-circle" class="w-10 h-10 text-red-400 mx-auto mb-2" />
      <p class="text-red-600 font-medium">{{ error }}</p>
    </div>

    <!-- Estado Vacío -->
    <div v-else-if="crias.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">
      <div class="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-4xl">🐮</span>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-1">Sin crías registradas</h3>
      <p class="text-sm text-gray-500 mb-5">Registra el primer nacimiento de tu ganado.</p>
      <NuxtLink to="/crias/crear"
        class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-xl transition-all">
        <Icon name="heroicons:plus" class="w-4 h-4" />
        Registrar primera cría
      </NuxtLink>
    </div>

    <!-- Tabla de Datos -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          <span class="font-bold text-gray-800">{{ crias.length }}</span> crías registradas
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cría</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Madre</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre</th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nacimiento
              </th>
              <th class="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Edad</th>
              <th class="py-3 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="cria in crias" :key="cria.id" class="hover:bg-green-50/40 transition-colors duration-150 group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-yellow-50 rounded-full flex items-center justify-center shrink-0 text-lg">🐮
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ cria.cria_animal?.identificador_unico || 'N/A' }}
                    </p>
                    <p class="text-xs text-gray-400">#{{ cria.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5">
                  <Icon name="heroicons:heart" class="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span class="text-sm text-gray-700">{{ cria.madre?.identificador_unico || 'N/A' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="cria.padre" class="flex items-center gap-1.5 text-sm text-gray-700">
                  <Icon name="heroicons:arrow-up-circle" class="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {{ cria.padre.identificador_unico }}
                </span>
                <span v-else class="text-xs text-gray-400 italic">Sin padre</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(cria.fecha_nacimiento) }}</td>
              <td class="px-6 py-4">
                <span v-if="cria.fecha_nacimiento"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  {{ calcularEdad(cria.fecha_nacimiento) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <NuxtLink :to="`/crias/${cria.id}`"
                    class="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors" title="Ver detalle">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                  </NuxtLink>
                  <NuxtLink :to="`/crias/editar/${cria.id}`"
                    class="p-1.5 rounded-lg hover:bg-yellow-100 text-yellow-600 transition-colors" title="Editar">
                    <Icon name="heroicons:pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button @click="handleDelete(cria.id)"
                    class="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Eliminar">
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:trash" class="w-7 h-7 text-red-500" />
        </div>
        <h3 class="text-lg font-bold text-gray-800 text-center mb-2">¿Eliminar registro de cría?</h3>
        <p class="text-sm text-gray-500 text-center mb-6">Esta acción no se puede deshacer.</p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false"
            class="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button @click="confirmDelete"
            class="flex-1 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { crias, loading, error, getAllCrias, deleteCria } = useCria()

const showDeleteModal = ref(false)
const idToDelete = ref(null)

onMounted(async () => {
  await getAllCrias()
})

const formatDate = (date) => {
  if (!date) return '—'
  // Parsear como fecha local (sin zona horaria) para evitar desfases de +/-1 día
  const localDate = new Date(String(date).substring(0, 10) + 'T00:00:00')
  return localDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date()
  const nacimiento = new Date(String(fechaNacimiento).substring(0, 10) + 'T00:00:00')
  const diffMs = hoy - nacimiento
  if (diffMs < 0) return '—'
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDias < 30) return `${diffDias}d`
  const meses = Math.floor(diffDias / 30)
  if (meses < 12) return `${meses} mes${meses !== 1 ? 'es' : ''}`
  const años = Math.floor(meses / 12)
  const mesesRest = meses % 12
  return mesesRest > 0 ? `${años}a ${mesesRest}m` : `${años} año${años !== 1 ? 's' : ''}`
}

const handleDelete = (id) => {
  idToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  showDeleteModal.value = false
  const { error: delError } = await deleteCria(idToDelete.value)
  if (delError?.value) {
    alert('Error al eliminar: ' + delError.value.message)
  }
  idToDelete.value = null
}
</script>