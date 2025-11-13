<!-- pages/animales/crear.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Animal</h2>
    
    <!-- Info sobre etapa de vida -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div class="flex items-center">
        <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mr-3" />
        <div>
          <p class="text-sm font-medium text-blue-800">Etapa de Vida Automática</p>
          <p class="text-xs text-blue-700 mt-1">La etapa de vida se calculará automáticamente según la fecha de nacimiento y sexo del animal</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleCrearAnimal" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Identificador Único *</label>
          <input type="text" v-model="form.identificador_unico" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
            required
            placeholder="Ej: A001, Vaca-123">
          <p class="text-xs text-gray-500 mt-1">Este identificador debe ser único en todo el sistema</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Raza</label>
          <select v-model="form.raza" @change="onRazaChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona una raza</option>
            <optgroup label="Razas Cebuínas (Carne)">
              <option value="brahman">Brahman</option>
              <option value="cebu">Cebú</option>
              <option value="gyr">Gyr</option>
              <option value="guzerat">Guzerá</option>
              <option value="nelore">Nelore</option>
              <option value="indubrasil">Indubrasil</option>
            </optgroup>
            <optgroup label="Razas Europeas (Carne)">
              <option value="angus">Angus</option>
              <option value="hereford">Hereford</option>
              <option value="charolais">Charolais</option>
              <option value="limousin">Limousin</option>
              <option value="brangus">Brangus</option>
              <option value="braford">Braford</option>
            </optgroup>
            <optgroup label="Razas Lecheras">
              <option value="holstein">Holstein</option>
              <option value="jersey">Jersey</option>
              <option value="pardo_suizo">Pardo Suizo</option>
              <option value="ayrshire">Ayrshire</option>
              <option value="guernsey">Guernsey</option>
            </optgroup>
            <optgroup label="Razas Doble Propósito">
              <option value="normando">Normando</option>
              <option value="simmental">Simmental</option>
              <option value="bon">BON (Blanco Orejinegro)</option>
              <option value="lucerna">Lucerna</option>
              <option value="harton">Hartón del Valle</option>
              <option value="sanmartinero">Sanmartinero</option>
              <option value="costeño_con_cuernos">Costeño con Cuernos</option>
              <option value="caqueteño">Caqueteño</option>
              <option value="chino_santandereano">Chino Santandereano</option>
            </optgroup>
            <optgroup label="Razas Criollas Colombianas">
              <option value="romosinuano">Romosinuano</option>
              <option value="casanareño">Casanareño</option>
              <option value="criolla">Criolla Colombiana</option>
            </optgroup>
            <option value="otra">Otra raza (especificar)</option>
          </select>
          <p v-if="form.raza" class="text-xs text-gray-500 mt-1">
            Tipo: <span class="font-semibold">{{ getTipoRazaLabel() }}</span>
          </p>
        </div>

        <!-- Input manual para "otra raza" -->
        <div v-if="form.raza === 'otra'" class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Especifica la raza *</label>
          <input type="text" v-model="form.raza_manual" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
            required
            placeholder="Escribe el nombre de la raza">
          <p class="text-xs text-gray-500 mt-1">Ingresa el nombre completo de la raza</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Sexo *</label>
          <select v-model="form.sexo" @change="onSexoChange" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona el sexo</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">Necesario para calcular la etapa de vida</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Peso (kg)</label>
          <input type="number" v-model.number="form.peso_kg" step="0.01" min="0" @input="calcularEstadoPeso"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            placeholder="Ej: 450.50">
          <p v-if="estadoPeso.estado !== 'sin_datos' && estadoPeso.estado !== 'sin_referencia'" 
            class="text-xs mt-1 font-semibold"
            :class="{
              'text-green-600': estadoPeso.color === 'green',
              'text-orange-600': estadoPeso.color === 'orange',
              'text-red-600': estadoPeso.color === 'red'
            }">
            {{ estadoPeso.mensaje }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input type="date" v-model="form.fecha_nacimiento" @change="calcularEstadoPeso"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="form.fecha_nacimiento && form.sexo">
              Etapa estimada: <span class="font-semibold text-green-600">{{ calcularEtapaEstimada() }}</span>
            </span>
            <span v-else>Ingresa fecha y sexo para ver la etapa estimada</span>
          </p>
        </div>

        <!-- Indicador de estado de peso detallado -->
        <div v-if="estadoPeso.estado !== 'sin_datos' && estadoPeso.estado !== 'sin_referencia' && form.peso_kg" 
          class="md:col-span-2 p-4 rounded-lg border-2"
          :class="{
            'bg-green-50 border-green-300': estadoPeso.color === 'green',
            'bg-orange-50 border-orange-300': estadoPeso.color === 'orange',
            'bg-red-50 border-red-300': estadoPeso.color === 'red'
          }">
          <div class="flex items-start">
            <Icon name="heroicons:scale" class="w-6 h-6 mr-3 mt-1"
              :class="{
                'text-green-600': estadoPeso.color === 'green',
                'text-orange-600': estadoPeso.color === 'orange',
                'text-red-600': estadoPeso.color === 'red'
              }" />
            <div class="flex-1">
              <p class="text-sm font-semibold mb-1"
                :class="{
                  'text-green-800': estadoPeso.color === 'green',
                  'text-orange-800': estadoPeso.color === 'orange',
                  'text-red-800': estadoPeso.color === 'red'
                }">
                Estado del Peso: {{ estadoPeso.mensaje }}
              </p>
              <div class="text-xs space-y-1"
                :class="{
                  'text-green-700': estadoPeso.color === 'green',
                  'text-orange-700': estadoPeso.color === 'orange',
                  'text-red-700': estadoPeso.color === 'red'
                }">
                <p>• Peso actual: <span class="font-semibold">{{ form.peso_kg }} kg</span></p>
                <p>• Peso ideal: <span class="font-semibold">{{ estadoPeso.pesoIdeal }}</span></p>
                <p>• Rango recomendado: <span class="font-semibold">{{ estadoPeso.rangoReferencia }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado Reproductivo o Productivo</label>
          <select v-model="form.estado_reproductivo"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona un estado</option>
            <option value="vacia" :disabled="form.sexo === 'macho'">Vacía</option>
            <option value="prenada" :disabled="form.sexo === 'macho'">Preñada</option>
            <option value="lactando" :disabled="form.sexo === 'macho'">Lactando</option>
            <option value="en_engorde">En Engorde</option>
            <option value="en_produccion_lechera" :disabled="form.sexo === 'macho'">En Producción Lechera</option>
            <option value="listo_para_venta_o_sacrificio">Listo para Venta o Sacrificio</option>
          </select>
          <p v-if="form.sexo === 'macho'" class="text-xs text-gray-500 mt-1">
            Algunas opciones están deshabilitadas para machos
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado de Salud</label>
          <select v-model="form.estado_salud"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="sano">Sano</option>
            <option value="diagnosticado_enfermo">Diagnosticado Enfermo</option>
            <option value="en_tratamiento">En Tratamiento</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Origen</label>
          <select v-model="form.origen" @change="onOrigenChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white">
            <option value="">Selecciona el origen</option>
            <option value="nacido_en_finca">Nacido en Finca</option>
            <option value="comprado">Comprado</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <input type="date" v-model="form.fecha_adquisicion" 
            :disabled="form.origen !== 'comprado'"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border disabled:bg-gray-100 disabled:cursor-not-allowed">
          <p v-if="form.origen !== 'comprado'" class="text-xs text-gray-500 mt-1">
            Solo disponible para animales comprados
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Finca *</label>
          <select v-model.number="form.finca_id" @change="onFincaChange" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingFincas || fincas.length === 0">
            <option :value="null">Selecciona una finca</option>
            <option v-for="finca in fincas" :key="finca.id" :value="finca.id">{{ finca.nombre }}</option>
          </select>
          <p v-if="loadingFincas" class="text-xs text-blue-500 mt-1">Cargando fincas...</p>
          <p v-else-if="errorFincas" class="text-xs text-red-500 mt-1">{{ errorFincas }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Potrero</label>
          <select v-model.number="form.potrero_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="!form.finca_id || loadingPotreros">
            <option :value="null">Sin asignar</option>
            <option v-for="potrero in potreros" :key="potrero.id" :value="potrero.id">{{ potrero.nombre }}</option>
          </select>
          <p v-if="loadingPotreros" class="text-xs text-blue-500 mt-1">Cargando potreros...</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Proveedor</label>
          <select v-model.number="form.proveedor_id"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
            :disabled="loadingProveedores || form.origen !== 'comprado'">
            <option :value="null">Sin proveedor</option>
            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
          </select>
          <p v-if="loadingProveedores" class="text-xs text-blue-500 mt-1">Cargando proveedores...</p>
          <p v-else-if="form.origen !== 'comprado'" class="text-xs text-gray-500 mt-1">
            Solo disponible para animales comprados
          </p>
        </div>
      </div>

      <!-- Resumen de información antes de crear -->
      <div v-if="form.identificador_unico && form.sexo && form.finca_id" 
        class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div class="flex items-start">
          <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-500 mr-3 mt-1" />
          <div>
            <p class="text-sm font-medium text-green-800">Listo para crear</p>
            <ul class="text-xs text-green-700 mt-2 space-y-1">
              <li>✓ Identificador: <span class="font-semibold">{{ form.identificador_unico }}</span></li>
              <li>✓ Sexo: <span class="font-semibold capitalize">{{ form.sexo }}</span></li>
              <li v-if="form.fecha_nacimiento">✓ Etapa estimada: <span class="font-semibold">{{ calcularEtapaEstimada() }}</span></li>
              <li>✓ Finca seleccionada</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="isSubmitting || fincas.length === 0"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          <Icon v-else name="heroicons:plus-circle" class="w-5 h-5" />
          {{ isSubmitting ? 'Guardando...' : fincas.length === 0 ? 'No hay fincas disponibles' : 'Crear Animal' }}
        </button>
      </div>
    </form>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium flex items-center gap-2">
      <Icon name="heroicons:check-circle" class="w-5 h-5" />
      {{ success }}
    </div>
    <div v-if="animalError" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-medium flex items-center gap-2">
      <Icon name="heroicons:exclamation-circle" class="w-5 h-5" />
      Error: {{ animalError }}
    </div>
  </div>
</template>

<script setup>
import { razasBovinas, getTipoRaza, getRazaLabel } from '~/utils/razasBovinas'
import { calcularEstadoPeso as calcularEstadoPesoUtil } from '~/utils/pesosBovinos'

definePageMeta({ layout: 'profile-layout' })

const { createAnimal } = useAnimal()
const { getAllFincas } = useFinca()
const { getPotrerosOfFinca } = usePotrero()
const { getAllProveedores } = useProveedor()
const { user } = useAuth()
const router = useRouter()

const form = ref({
  identificador_unico: '',
  raza: '',
  raza_manual: '',
  sexo: '',
  peso_kg: null,
  fecha_nacimiento: null,
  estado_reproductivo: null,
  estado_salud: 'sano',
  origen: null,
  fecha_adquisicion: null,
  finca_id: null,
  potrero_id: null,
  proveedor_id: null,
})

const fincas = ref([])
const potreros = ref([])
const proveedores = ref([])
const loadingFincas = ref(false)
const loadingPotreros = ref(false)
const loadingProveedores = ref(false)
const errorFincas = ref('')
const isSubmitting = ref(false)
const success = ref(null)
const animalError = ref(null)
const estadoPeso = ref({ estado: 'sin_datos', porcentaje: 0, mensaje: '' })

const loadFincas = async () => {
  const userId = user.value?.id || user.value?.userId
  if (!userId) return
  
  loadingFincas.value = true
  errorFincas.value = ''
  const { data, error } = await getAllFincas(userId, user.value.rol)
  loadingFincas.value = false
  
  if (data.value) {
    fincas.value = data.value
  } else if (error.value) {
    errorFincas.value = 'Error al cargar fincas: ' + error.value.message
  }
}

const loadProveedores = async () => {
  loadingProveedores.value = true
  const { data } = await getAllProveedores()
  loadingProveedores.value = false
  if (data.value) {
    proveedores.value = data.value
  }
}

const onRazaChange = () => {
  if (form.value.raza !== 'otra') {
    form.value.raza_manual = ''
  }
  calcularEstadoPeso()
}

const onSexoChange = () => {
  const estadosRestringidos = ['lactando', 'prenada', 'vacia', 'en_produccion_lechera']
  if (form.value.sexo === 'macho' && estadosRestringidos.includes(form.value.estado_reproductivo)) {
    form.value.estado_reproductivo = null
  }
  calcularEstadoPeso()
}

const onOrigenChange = () => {
  if (form.value.origen !== 'comprado') {
    form.value.fecha_adquisicion = null
    form.value.proveedor_id = null
  }
}

const onFincaChange = async () => {
  if (form.value.finca_id) {
    form.value.potrero_id = null
    loadingPotreros.value = true
    const { data } = await getPotrerosOfFinca(form.value.finca_id)
    loadingPotreros.value = false
    if (data.value) {
      potreros.value = data.value
    }
  }
}

const getTipoRazaLabel = () => {
  if (!form.value.raza) return ''
  const tipo = getTipoRaza(form.value.raza)
  const labels = {
    'carne': 'Carne',
    'leche': 'Leche',
    'doble_proposito': 'Doble Propósito',
    'otro': 'Otro'
  }
  return labels[tipo] || tipo
}

const calcularEtapaEstimada = () => {
  if (!form.value.fecha_nacimiento || !form.value.sexo) return 'N/A'
  
  const hoy = new Date()
  const nacimiento = new Date(form.value.fecha_nacimiento)
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12
  meses += hoy.getMonth() - nacimiento.getMonth()
  if (hoy.getDate() < nacimiento.getDate()) meses--
  
  const esMacho = form.value.sexo === 'macho'
  
  if (meses < 0) return 'Fecha futura'
  if (meses < 8) return esMacho ? 'Ternero (0-8 meses)' : 'Ternera (0-8 meses)'
  if (esMacho && meses >= 8 && meses < 24) return 'Novillo (8-24 meses)'
  if (!esMacho && meses >= 8 && meses < 30) return 'Novilla (8-30 meses)'
  if (meses >= 96) return 'Adulto Mayor (8+ años)'
  return esMacho ? 'Adulto (24+ meses)' : 'Adulta (30+ meses o con parto)'
}

const getEtapaVidaNormalizada = () => {
  if (!form.value.fecha_nacimiento || !form.value.sexo) return null
  
  const hoy = new Date()
  const nacimiento = new Date(form.value.fecha_nacimiento)
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12
  meses += hoy.getMonth() - nacimiento.getMonth()
  if (hoy.getDate() < nacimiento.getDate()) meses--
  
  const esMacho = form.value.sexo === 'macho'
  
  if (meses < 0) return null
  if (meses < 8) return esMacho ? 'ternero' : 'ternera'
  if (esMacho && meses >= 8 && meses < 24) return 'novillo'
  if (!esMacho && meses >= 8 && meses < 30) return 'novilla'
  if (meses >= 96) return 'adulto_mayor'
  return esMacho ? 'adulto' : 'adulta'
}

const calcularEstadoPeso = () => {
  if (!form.value.peso_kg || !form.value.raza || !form.value.sexo || !form.value.fecha_nacimiento) {
    estadoPeso.value = { estado: 'sin_datos', porcentaje: 0, mensaje: '' }
    return
  }

  const etapaVida = getEtapaVidaNormalizada()
  if (!etapaVida) {
    estadoPeso.value = { estado: 'sin_datos', porcentaje: 0, mensaje: '' }
    return
  }

  const razaParaCalculo = form.value.raza === 'otra' ? null : form.value.raza
  const tipoRaza = razaParaCalculo ? getTipoRaza(razaParaCalculo) : 'doble_proposito'

  estadoPeso.value = calcularEstadoPesoUtil(
    form.value.peso_kg,
    razaParaCalculo,
    form.value.sexo,
    etapaVida,
    tipoRaza
  )
}

watch(user, loadFincas, { immediate: true })
onMounted(() => {
  loadFincas()
  loadProveedores()
})

const handleCrearAnimal = async () => {
  animalError.value = null
  success.value = null
  isSubmitting.value = true

  try {
    if (!form.value.finca_id) {
      throw new Error('Debes seleccionar una finca.')
    }
    if (!form.value.identificador_unico.trim()) {
      throw new Error('Debes ingresar el identificador único.')
    }
    if (!form.value.sexo) {
      throw new Error('Debes seleccionar el sexo del animal.')
    }
    if (form.value.raza === 'otra' && !form.value.raza_manual.trim()) {
      throw new Error('Debes especificar el nombre de la raza.')
    }

    const dataToSend = {
      identificador_unico: form.value.identificador_unico,
      sexo: form.value.sexo,
      finca_id: form.value.finca_id,
      estado_salud: form.value.estado_salud || 'sano',
    }

    // Guardar la raza correctamente
    if (form.value.raza === 'otra') {
      dataToSend.raza = form.value.raza_manual.trim()
    } else if (form.value.raza && form.value.raza.trim()) {
      dataToSend.raza = getRazaLabel(form.value.raza)
    }

    if (form.value.peso_kg) {
      dataToSend.peso_kg = form.value.peso_kg
    }
    if (form.value.fecha_nacimiento) {
      dataToSend.fecha_nacimiento = form.value.fecha_nacimiento
    }
    if (form.value.estado_reproductivo) {
      dataToSend.estado_reproductivo = form.value.estado_reproductivo
    }
    if (form.value.origen) {
      dataToSend.origen = form.value.origen
    }
    if (form.value.fecha_adquisicion && form.value.origen === 'comprado') {
      dataToSend.fecha_adquisicion = form.value.fecha_adquisicion
    }
    if (form.value.potrero_id) {
      dataToSend.potrero_id = form.value.potrero_id
    }
    if (form.value.proveedor_id && form.value.origen === 'comprado') {
      dataToSend.proveedor_id = form.value.proveedor_id
    }

    const nuevoAnimal = await createAnimal(dataToSend)
    if (nuevoAnimal) {
      success.value = `Animal "${nuevoAnimal.identificador_unico}" creado exitosamente. ${nuevoAnimal.etapa_vida ? 'Etapa de vida: ' + formatEtapaVida(nuevoAnimal.etapa_vida) : ''}`
      setTimeout(() => {
        router.push('/animales')
      }, 2000)
    } else {
      animalError.value = 'Error al crear el animal.'
    }
  } catch (err) {
    console.error('Error con más detalles:', err)
    const errorMessage = err.message || err.data?.message || ''
    const isDuplicateError = errorMessage.toLowerCase().includes('duplicate') || 
                            errorMessage.toLowerCase().includes('duplicado') || 
                            err.statusCode === 409 || 
                            err.data?.statusCode === 409

    if (isDuplicateError) {
      animalError.value = `El identificador único "${form.value.identificador_unico}" ya está en uso. Por favor, usa otro identificador.`
    } else if (err.data?.message) {
      animalError.value = err.data.message
    } else {
      animalError.value = errorMessage || 'Error al crear el animal.'
    }
    console.error('Error en la creación del animal:', err)
  } finally {
    isSubmitting.value = false
  }
}

const formatEtapaVida = (etapa) => {
  const nombres = {
    'ternero': 'Ternero',
    'ternera': 'Ternera',
    'novillo': 'Novillo',
    'novilla': 'Novilla',
    'adulto': 'Adulto',
    'adulta': 'Adulta',
    'adulto_mayor': 'Adulto Mayor'
  }
  return nombres[etapa] || etapa
}
</script>