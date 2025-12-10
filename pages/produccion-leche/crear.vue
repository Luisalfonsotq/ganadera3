<template>
  <div class="p-6 bg-slate-50 min-h-screen flex justify-center">
    <div class="w-full max-w-2xl">
      
      <!-- Back Link -->
      <NuxtLink to="/produccion-leche" class="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
        <span class="mr-2">←</span> Volver a la lista
      </NuxtLink>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-6">Registrar Producción de Leche</h1>

        <form @submit.prevent="submitForm" class="space-y-6">
          
          <!-- Finca Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Finca</label>
            <select 
              v-model="form.finca_id" 
              required
              class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all p-2.5"
              @change="onFincaChange"
            >
              <option :value="null" disabled>Selecciona una finca</option>
              <option v-for="finca in fincas" :key="finca.id" :value="finca.id">
                {{ finca.nombre }}
              </option>
            </select>
          </div>

          <!-- Animal Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Animal (Vaca)</label>
            <select 
              v-model="form.animal_id" 
              required
              :disabled="!form.finca_id || loadingAnimales"
              class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all p-2.5 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option :value="null" disabled>Selecciona un animal</option>
              <option v-for="animal in animalesFiltrados" :key="animal.id" :value="animal.id">
                {{ animal.identificador_unico }} {{ animal.nombre ? `(${animal.nombre})` : '' }}
              </option>
            </select>
            <p v-if="loadingAnimales" class="text-xs text-emerald-600 mt-1">Cargando animales...</p>
            <p v-if="!loadingAnimales && form.finca_id && animalesFiltrados.length === 0" class="text-xs text-amber-600 mt-1">
              No hay animales hembra registrados en esta finca.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Fecha -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
              <input 
                type="date" 
                v-model="form.fecha" 
                required
                class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all p-2.5"
              >
            </div>

            <!-- Jornada -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Jornada</label>
              <select 
                v-model="form.jornada" 
                class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all p-2.5"
              >
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
          </div>

          <!-- Cantidad -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Cantidad (Litros)</label>
            <div class="relative">
              <input 
                type="number" 
                step="0.01"
                min="0"
                v-model="form.cantidad" 
                required
                class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all p-2.5 pl-4"
                placeholder="0.00"
              >
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">L</span>
            </div>
          </div>

           <!-- Observaciones -->
           <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Observaciones</label>
            <textarea 
              v-model="form.observaciones"
              rows="3"
              class="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all p-2.5"
              placeholder="Comentarios adicionales..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end pt-4">
            <button 
              type="submit" 
              :disabled="loading"
              class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              Guardar Registro
            </button>
          </div>
          
           <div v-if="error" class="p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
            {{ error }}
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProduccionLeche } from '~/composables/useProduccionLeche'
import { useFinca } from '~/composables/useFinca'
import { useAnimal } from '~/composables/useAnimal'
import { useUsuario } from '~/composables/useUsuario'

definePageMeta({
  layout: 'profile-layout'
})

const router = useRouter()
const { createProduccion, loading, error } = useProduccionLeche()
const { getFincasByUsuario } = useFinca()
const { getAnimalesOfFinca } = useAnimal()
const { user } = useUsuario()

const fincas = ref([])
const animales = ref([])
const loadingAnimales = ref(false)

const form = ref({
  fecha: new Date().toISOString().split('T')[0],
  cantidad: null,
  jornada: 'manana',
  observaciones: '',
  animal_id: null,
  finca_id: null
})

// Filtrar solo hembras para producción de leche
const animalesFiltrados = computed(() => {
    return animales.value.filter(a => a.sexo === 'hembra')
})

const onFincaChange = async () => {
    form.value.animal_id = null
    if (form.value.finca_id) {
        loadingAnimales.value = true
        const { data } = await getAnimalesOfFinca(form.value.finca_id)
        if (data.value) {
            animales.value = data.value
        } else {
            animales.value = []
        }
        loadingAnimales.value = false
    }
}

const submitForm = async () => {
    if (!form.value.finca_id || !form.value.animal_id || !form.value.cantidad) {
        return
    }

    const payload = {
        ...form.value,
        cantidad: Number(form.value.cantidad)
    }

    const { error: reqError } = await createProduccion(payload)
    
    if (!reqError.value) {
        router.push('/produccion-leche')
    }
}

onMounted(async () => {
    if (user.value) {
        const { data } = await getFincasByUsuario(user.value.id)
        if (data.value) {
            fincas.value = data.value
            // Select first finca by default if available
            if (fincas.value.length === 1) {
                form.value.finca_id = fincas.value[0].id
                await onFincaChange()
            }
        }
    }
})
</script>
