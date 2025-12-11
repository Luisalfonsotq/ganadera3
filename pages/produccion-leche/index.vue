<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">Producción de Leche</h1>
          <p class="text-slate-500 mt-2 text-lg">Gestiona y monitorea la producción lechera de tu finca</p>
        </div>
        <NuxtLink 
          to="/produccion-leche/crear" 
          class="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Icon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
          Registrar Producción
        </NuxtLink>
      </div>

      <!-- Main Content Area -->
      <div class="space-y-6">
        
        <!-- Filters Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 class="text-base font-semibold text-slate-800 mb-4 flex items-center">
            <Icon name="i-heroicons-funnel" class="w-5 h-5 mr-2 text-emerald-500" />
            Filtros de Búsqueda
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Finca</label>
              <div class="relative">
                <select 
                  v-model="filters.finca_id" 
                  class="w-full pl-3 pr-10 py-2.5 bg-slate-50 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all text-sm font-medium text-slate-700 appearance-none"
                  @change="loadData"
                >
                  <option :value="null">Todas las fincas</option>
                  <option v-for="finca in fincas" :key="finca.id" :value="finca.id">
                    {{ finca.nombre }}
                  </option>
                </select>
                <Icon name="i-heroicons-chevron-down" class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Desde</label>
              <input 
                type="date" 
                v-model="filters.fecha_inicio"
                class="w-full px-3 py-2.5 bg-slate-50 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all text-sm font-medium text-slate-700"
                @change="loadData"
              >
            </div>
             <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hasta</label>
              <input 
                type="date" 
                v-model="filters.fecha_fin"
                class="w-full px-3 py-2.5 bg-slate-50 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all text-sm font-medium text-slate-700"
                @change="loadData"
              >
            </div>

            <!-- Total Summary Card embedded in filters for context -->
            <div class="md:col-span-1 bg-emerald-50 rounded-xl p-4 flex items-center justify-between border border-emerald-100">
               <div>
                 <span class="block text-xs font-bold text-emerald-600 uppercase">Total Litros</span>
                 <span class="text-xs text-emerald-500">En este periodo</span>
               </div>
               <span class="text-2xl font-bold text-emerald-700">{{ totalLitros }} L</span>
            </div>
          </div>
        </div>

        <!-- Table Loading State -->
        <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
            <p class="text-slate-500 font-medium">Cargando registros...</p>
        </div>

        <!-- Table Content -->
        <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th class="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Jornada</th>
                  <th class="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Animal</th>
                  <th class="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Cantidad (L)</th>
                   <th class="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Finca</th>
                  <th class="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="prod in producciones" 
                  :key="prod.id"
                  class="group hover:bg-slate-50/80 transition-colors duration-150"
                >
                  <td class="px-6 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">
                    <div class="flex items-center">
                       <div class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg mr-3">
                         <Icon name="i-heroicons-calendar" class="w-4 h-4" />
                       </div>
                       {{ formatDate(prod.fecha) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="prod.jornada === 'mañana' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'">
                      {{ prod.jornada || '-' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700 font-semibold whitespace-nowrap">{{ prod.animal?.identificador_unico || 'N/A' }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-emerald-700 text-right">{{ prod.cantidad }}</td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ prod.finca?.nombre }}</td>
                  <td class="px-6 py-4 text-center">
                    <button 
                      @click="deleteItem(prod.id)" 
                      class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
                      title="Eliminar registro"
                    >
                       <Icon name="i-heroicons-trash" class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="producciones.length === 0">
                  <td colspan="6" class="px-6 py-16 text-center">
                    <div class="flex flex-col items-center justify-center">
                       <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                         <Icon name="i-heroicons-beaker" class="w-8 h-8 text-slate-400" />
                       </div>
                       <h3 class="text-lg font-medium text-slate-800">No se encontraron registros</h3>
                       <p class="text-slate-500 mt-1">Intenta ajustar los filtros o registra una nueva producción.</p>
                       <button @click="resetFilters" class="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                         Limpiar filtros
                       </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useProduccionLeche } from '~/composables/useProduccionLeche'
import { useFinca } from '~/composables/useFinca'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'profile-layout'
})

const { producciones, getProducciones, deleteProduccion, loading } = useProduccionLeche()
const { getAllFincas } = useFinca()
const { user } = useAuth()

const fincas = ref([])
const filters = ref({
  finca_id: null,
  animal_id: null,
  fecha_inicio: '',
  fecha_fin: ''
})

const totalLitros = computed(() => {
  return producciones.value.reduce((sum, item) => sum + Number(item.cantidad), 0).toFixed(2)
})

const loadData = async () => {
    // Si no hay finca seleccionada, seleccionar la primera por defecto si existen
    if (!filters.value.finca_id && fincas.value.length > 0) {
        filters.value.finca_id = fincas.value[0].id
    }
    
    // Solo cargar si tenemos una finca seleccionada (aunque el backend permite null para admins, mejor filtrar por contexto)
    if (filters.value.finca_id) {
        await getProducciones(filters.value)
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const deleteItem = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
        await deleteProduccion(id)
    }
}

const resetFilters = () => {
    filters.value.fecha_inicio = '';
    filters.value.fecha_fin = '';
    loadData();
}

onMounted(async () => {
    if (user.value) {
        const { data } = await getAllFincas(user.value.id, user.value.rol)
        if (data.value) {
            fincas.value = data.value
            // Set default filter to first finca
            if (fincas.value.length > 0) {
              filters.value.finca_id = fincas.value[0].id
            }
            await loadData()
        }
    }
})

// Watch para recargar si el usuario llega tarde
watch(user, async (newUser) => {
    if (newUser && fincas.value.length === 0) {
         const { data } = await getAllFincas(newUser.id, newUser.rol)
         if (data.value) {
             fincas.value = data.value
             if (fincas.value.length > 0) {
                 filters.value.finca_id = fincas.value[0].id
                 await loadData()
             }
         }
    }
}, { immediate: true })

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
