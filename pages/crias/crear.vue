<!-- pages/crias/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Nueva Cría</h2>
    
    <form @submit.prevent="handleCrearCria" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Animal (Cría) *</label>
          <select v-model.number="form.animal_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Selecciona el animal</option>
            <option v-for="animal in animales" :key="animal.id" :value="animal.id">
              {{ animal.identificador_unico }} - {{ animal.sexo }}
            </option>
          </select>
          <p v-if="loadingAnimales" class="text-xs text-blue-500 mt-1">Cargando animales...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento *</label>
          <input type="date" v-model="form.fecha_nacimiento" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Madre (Hembra) *</label>
          <select v-model.number="form.madre_id" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Selecciona la madre</option>
            <option v-for="hembra in hembras" :key="hembra.id" :value="hembra.id">
              {{ hembra.identificador_unico }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Padre (Macho) - Opcional</label>
          <select v-model.number="form.padre_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingAnimales">
            <option :value="null">Sin padre</option>
            <option v-for="macho in machos" :key="macho.id" :value="macho.id">
              {{ macho.identificador_unico }}
            </option>
          </select>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? 'Guardando...' : 'Registrar Cría' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
      ✅ {{ success }}
    </div>
    <div v-if="criaError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium">
      ❌ Error: {{ criaError }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'profile-layout' })

const { createCria } = useCria()
const { animales, getAnimalesOfFinca } = useAnimal()
const { getAllFincas } = useFinca()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  animal_id: null,
  madre_id: null,
  padre_id: null,
  fecha_nacimiento: null,
})

const loadingAnimales = ref(false)
const isSubmitting = ref(false)
const success = ref(null)
const criaError = ref(null)

const hembras = computed(() => animales.value.filter(a => a.sexo === 'hembra'))
const machos = computed(() => animales.value.filter(a => a.sexo === 'macho'))

const loadAnimales = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingAnimales.value = true
  const { data: fincasData } = await getAllFincas(userId, user.value.rol)
  
  if (fincasData.value && fincasData.value.length > 0) {
    await getAnimalesOfFinca(fincasData.value[0].id)
  }
  loadingAnimales.value = false
}

onMounted(loadAnimales)
watch(user, loadAnimales, { immediate: true })

const handleCrearCria = async () => {
  criaError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.animal_id) {
      throw new Error('Debes seleccionar el animal (cría).')
    }
    if (!form.value.madre_id) {
      throw new Error('Debes seleccionar la madre.')
    }
    if (!form.value.fecha_nacimiento) {
      throw new Error('Debes ingresar la fecha de nacimiento.')
    }

    const dataToSend = {
      animal_id: form.value.animal_id,
      madre_id: form.value.madre_id,
      fecha_nacimiento: form.value.fecha_nacimiento,
    }

    if (form.value.padre_id) {
      dataToSend.padre_id = form.value.padre_id
    }

    const nuevaCria = await createCria(dataToSend)
    if (nuevaCria) {
      success.value = 'Cría registrada exitosamente.'
      setTimeout(() => {
        router.push('/crias')
      }, 1500)
    } else {
      criaError.value = 'Error al registrar la cría.'
    }
  } catch (err) {
    console.error('Error con más detalles:', err)
    const errorMessage = err.message || err.data?.message || ''
    const isDuplicateError = errorMessage.toLowerCase().includes('duplicate') || 
                            errorMessage.toLowerCase().includes('duplicado') || 
                            err.statusCode === 409 || err.data?.statusCode === 409

    if (isDuplicateError) {
      criaError.value = 'Este animal ya está registrado como una cría.'
    } else if (err.data?.message) {
      criaError.value = err.data.message
    } else {
      criaError.value = errorMessage || 'Error al registrar la cría.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>