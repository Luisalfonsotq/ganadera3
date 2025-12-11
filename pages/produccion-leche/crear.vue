<template>
  <div class="p-6 bg-slate-50 min-h-screen flex justify-center items-start pt-10 animate-fade-in">
    <div class="w-full max-w-3xl space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
         <NuxtLink to="/produccion-leche" class="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors group">
          <div class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-emerald-500 shadow-sm">
            <Icon name="i-heroicons-arrow-left" class="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
          </div>
          <span class="font-medium">Volver a producción</span>
        </NuxtLink>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
        <!-- Top Decoration -->
        <div class="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 w-full absolute top-0 left-0"></div>

        <div class="p-8">
          <div class="flex items-center mb-8">
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl mr-4">
              <Icon name="i-heroicons-beaker" class="w-8 h-8" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">Registrar Producción</h1>
              <p class="text-slate-500 text-sm">Ingresa los datos de la producción lechera diaria.</p>
            </div>
          </div>

          <form @submit.prevent="submitForm" class="space-y-8">
            
            <!-- Section: Ubicación y Animal -->
            <div class="space-y-6">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                 <span class="bg-slate-100 px-2 py-1 rounded mr-2">1</span> Identificación
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Finca Selection -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Finca</label>
                  <div class="relative">
                    <select 
                      v-model="form.finca_id" 
                      required
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all appearance-none outline-none"
                      @change="onFincaChange"
                    >
                      <option :value="null" disabled>Selecciona una finca</option>
                      <option v-for="finca in fincas" :key="finca.id" :value="finca.id">
                        {{ finca.nombre }}
                      </option>
                    </select>
                    <Icon name="i-heroicons-building-storefront" class="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <Icon name="i-heroicons-chevron-down" class="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <!-- Animal Selection -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Animal (Vaca)</label>
                  <div class="relative">
                    <select 
                      v-model="form.animal_id" 
                      required
                      :disabled="!form.finca_id || loadingAnimales"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all appearance-none outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option :value="null" disabled>Selecciona un animal</option>
                      <option v-for="animal in animalesFiltrados" :key="animal.id" :value="animal.id">
                        {{ animal.identificador_unico }} {{ animal.nombre ? `(${animal.nombre})` : '' }}
                      </option>
                    </select>
                    <Icon name="i-heroicons-identification" class="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <Icon name="i-heroicons-chevron-down" class="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    
                    <div v-if="loadingAnimales" class="absolute right-10 top-3.5">
                      <div class="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                    </div>
                  </div>
                   <p v-if="!loadingAnimales && form.finca_id && animalesFiltrados.length === 0" class="text-xs text-amber-600 mt-2 flex items-center">
                    <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4 mr-1" />
                    No hay animales hembra registrados en esta finca.
                  </p>
                </div>
              </div>
            </div>

            <hr class="border-slate-100" />

            <!-- Section: Detalles de Producción -->
            <div class="space-y-6">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                 <span class="bg-slate-100 px-2 py-1 rounded mr-2">2</span> Detalles
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Fecha -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
                   <div class="relative">
                    <input 
                      type="date" 
                      v-model="form.fecha" 
                      required
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all outline-none"
                    >
                    <Icon name="i-heroicons-calendar" class="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <!-- Jornada -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Jornada</label>
                  <div class="relative">
                    <select 
                      v-model="form.jornada" 
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all appearance-none outline-none"
                    >
                      <option value="manana">Mañana</option>
                      <option value="tarde">Tarde</option>
                    </select>
                    <Icon name="i-heroicons-sun" class="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <Icon name="i-heroicons-chevron-down" class="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

               <!-- Cantidad -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Cantidad Producida</label>
                <div class="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    v-model="form.cantidad" 
                    required
                    class="w-full pl-10 pr-12 py-3 bg-slate-50 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all outline-none font-bold text-lg text-slate-700 placeholder-slate-400"
                    placeholder="0.00"
                  >
                  <Icon name="i-heroicons-scale" class="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold bg-slate-200 px-2 py-1 rounded text-xs tracking-wider">LITROS</span>
                </div>
              </div>

               <!-- Observaciones -->
               <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Observaciones (Opcional)</label>
                <textarea 
                  v-model="form.observaciones"
                  rows="3"
                  class="w-full p-4 bg-slate-50 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all outline-none resize-none"
                  placeholder="Escribe comentarios adicionales aquí..."
                ></textarea>
              </div>
            </div>

            <!-- Global Error -->
            <div v-if="error" class="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 flex items-start">
               <Icon name="i-heroicons-x-circle" class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
               {{ error }}
            </div>

            <!-- Actions -->
            <div class="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="button" 
                @click="router.push('/produccion-leche')"
                class="px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 mr-3 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="loading"
                class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                {{ loading ? 'Guardando...' : 'Guardar Registro' }}
              </button>
            </div>

          </form>
        </div>
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
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'profile-layout'
})

const router = useRouter()
const { createProduccion, loading, error } = useProduccionLeche()
const { getAllFincas } = useFinca()
const { getAnimalesOfFinca } = useAnimal()
const { user } = useAuth()

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
        try {
           const { data } = await getAnimalesOfFinca(form.value.finca_id)
           if (data.value) {
               animales.value = data.value
           } else {
               animales.value = []
           }
        } catch(e) {
           console.error("Error cargando animales", e)
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

const cargarFincas = async () => {
    if (user.value) {
        const { data } = await getAllFincas(user.value.id, user.value.rol)
        if (data.value) {
            fincas.value = data.value
            // Select first finca by default if available and not selected
            if (fincas.value.length === 1 && !form.value.finca_id) {
                form.value.finca_id = fincas.value[0].id
                await onFincaChange()
            }
        }
    }
}

onMounted(async () => {
    await cargarFincas()
})

watch(user, async (newUser) => {
    if(newUser) {
        await cargarFincas()
    }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
