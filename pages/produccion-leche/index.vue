<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Producción de Leche</h1>
          <p class="text-slate-500 mt-1">Gestiona y monitorea la producción lechera de tu finca</p>
        </div>
        <NuxtLink 
          to="/produccion-leche/crear" 
          class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
        >
          <span class="mr-2 text-xl">+</span>
          Registrar Producción
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Finca</label>
          <select 
            v-model="filters.finca_id" 
            class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all font-sans"
            @change="loadData"
          >
            <option :value="null">Todas las fincas</option>
            <option v-for="finca in fincas" :key="finca.id" :value="finca.id">
              {{ finca.nombre }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio</label>
          <input 
            type="date" 
            v-model="filters.fecha_inicio"
            class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            @change="loadData"
          >
        </div>
         <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Fin</label>
          <input 
            type="date" 
            v-model="filters.fecha_fin"
            class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            @change="loadData"
          >
        </div>
      </div>

      <!-- Stats Cards (Optional) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
           <h3 class="text-sm font-medium text-slate-500">Total Litros (Periodo)</h3>
           <p class="text-3xl font-bold text-emerald-600 mt-2">{{ totalLitros }} L</p>
        </div>
        <!-- Add more stats as needed -->
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">Fecha</th>
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">Jornada</th>
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">Animal</th>
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">Cantidad (L)</th>
                 <th class="px-6 py-4 text-sm font-semibold text-slate-600">Finca</th>
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="prod in producciones" 
                :key="prod.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 text-slate-700">{{ formatDate(prod.fecha) }}</td>
                <td class="px-6 py-4 text-slate-700 capitalize">{{ prod.jornada || '-' }}</td>
                <td class="px-6 py-4 text-slate-700 font-medium">{{ prod.animal?.identificador_unico || 'N/A' }}</td>
                <td class="px-6 py-4 text-slate-800 font-bold">{{ prod.cantidad }}</td>
                <td class="px-6 py-4 text-slate-600">{{ prod.finca?.nombre }}</td>
                <td class="px-6 py-4 text-slate-500">
                  <button @click="deleteItem(prod.id)" class="text-rose-500 hover:text-rose-700 font-medium text-sm">Eliminar</button>
                </td>
              </tr>
              <tr v-if="producciones.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-slate-400">
                  No hay registros de producción que coincidan con los filtros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useProduccionLeche } from '~/composables/useProduccionLeche'
import { useFinca } from '~/composables/useFinca'
import { useUsuario } from '~/composables/useUsuario'

definePageMeta({
  layout: 'profile-layout'
})

const { producciones, getProducciones, deleteProduccion } = useProduccionLeche()
const { getFincasByUsuario } = useFinca()
const { user } = useUsuario()

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

onMounted(async () => {
    if (user.value) {
        const { data } = await getFincasByUsuario(user.value.id)
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
</script>
