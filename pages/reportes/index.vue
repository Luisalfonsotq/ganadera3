<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- ── HEADER ──────────────────────────────────────────────────── -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <span class="p-2 bg-emerald-100 rounded-xl">
              <Icon name="i-heroicons-chart-bar" class="w-7 h-7 text-emerald-600" />
            </span>
            Reportes & Estadísticas
          </h1>
          <p class="text-slate-500 mt-2 text-base">Visualiza KPIs y tendencias de tu finca en tiempo real</p>
        </div>

        <!-- Selector de finca -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-semibold text-slate-600">Finca:</label>
          <div class="relative">
            <select
              id="selector-finca"
              v-model="selectedFincaId"
              @change="onFincaChange"
              class="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700
                     focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-sm appearance-none"
            >
              <option v-for="f in fincas" :key="f.id" :value="f.id">{{ f.nombre }}</option>
            </select>
            <Icon name="i-heroicons-chevron-down" class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <!-- Selector de periodo -->
          <div class="relative">
            <select
              id="selector-meses"
              v-model="selectedMeses"
              @change="onFincaChange"
              class="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700
                     focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-sm appearance-none"
            >
              <option :value="3">Últimos 3 meses</option>
              <option :value="6">Últimos 6 meses</option>
              <option :value="12">Últimos 12 meses</option>
            </select>
            <Icon name="i-heroicons-chevron-down" class="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- ── LOADING GLOBAL ──────────────────────────────────────────── -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
        <p class="text-slate-500 font-medium">Cargando estadísticas...</p>
      </div>

      <!-- ── ESTADO VACÍO (sin finca) ───────────────────────────────── -->
      <div v-else-if="!selectedFincaId" class="flex flex-col items-center py-24 gap-4 text-slate-400">
        <Icon name="i-heroicons-building-office" class="w-16 h-16" />
        <p class="font-medium text-lg">Selecciona una finca para ver sus estadísticas</p>
      </div>

      <!-- ── CONTENIDO ──────────────────────────────────────────────── -->
      <template v-else>

        <!-- ── TARJETAS KPI ─────────────────────────────────────────── -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="kpi in kpiCards"
            :key="kpi.label"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-2 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ kpi.label }}</span>
              <span :class="kpi.iconBg" class="p-2 rounded-xl">
                <Icon :name="kpi.icon" class="w-5 h-5" :class="kpi.iconColor" />
              </span>
            </div>
            <span class="text-3xl font-extrabold" :class="kpi.valueColor">{{ kpi.value }}</span>
            <span class="text-xs text-slate-400">{{ kpi.sub }}</span>
          </div>
        </div>

        <!-- ── FILA 1: Producción mensual + Jornada ────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Gráfico de línea: Producción mensual -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div class="flex items-center justify-between mb-1">
              <h2 class="text-base font-bold text-slate-800">Producción de Leche — Tendencia Mensual</h2>
              <span class="text-xs text-slate-400 font-medium">Litros / mes</span>
            </div>
            <p class="text-xs text-slate-400 mb-4">Litros producidos en los últimos {{ selectedMeses }} meses</p>
            <ClientOnly>
              <apexchart
                v-if="produccionMensualChart.series[0].data.length"
                type="area"
                height="260"
                :options="produccionMensualChart.options"
                :series="produccionMensualChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-chart-bar" class="w-10 h-10" />
                <span class="text-sm">Sin datos de producción</span>
              </div>
            </ClientOnly>
          </div>

          <!-- Gráfico dona: Producción por jornada -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Producción por Jornada</h2>
            <p class="text-xs text-slate-400 mb-4">Distribución mañana / tarde</p>
            <ClientOnly>
              <apexchart
                v-if="jornadaChart.series.length"
                type="donut"
                height="260"
                :options="jornadaChart.options"
                :series="jornadaChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-clock" class="w-10 h-10" />
                <span class="text-sm">Sin datos</span>
              </div>
            </ClientOnly>
          </div>
        </div>

        <!-- ── FILA 2: Top animales + Partos por mes ──────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Gráfico de barras: Top animales productores -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Top 10 Animales Productores</h2>
            <p class="text-xs text-slate-400 mb-4">Litros acumulados por animal</p>
            <ClientOnly>
              <apexchart
                v-if="topAnimalesChart.series[0].data.length"
                type="bar"
                height="280"
                :options="topAnimalesChart.options"
                :series="topAnimalesChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-user-group" class="w-10 h-10" />
                <span class="text-sm">Sin datos</span>
              </div>
            </ClientOnly>
          </div>

          <!-- Gráfico de barras: Partos por mes -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Partos por Mes</h2>
            <p class="text-xs text-slate-400 mb-4">Partos registrados y crías nacidas</p>
            <ClientOnly>
              <apexchart
                v-if="partosChart.series[0].data.length"
                type="bar"
                height="280"
                :options="partosChart.options"
                :series="partosChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-heart" class="w-10 h-10" />
                <span class="text-sm">Sin registros de partos</span>
              </div>
            </ClientOnly>
          </div>
        </div>

        <!-- ── FILA 3: Distribución animales ──────────────────────── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- Dona: Distribución por raza -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Hato por Raza</h2>
            <p class="text-xs text-slate-400 mb-4">Composición del inventario</p>
            <ClientOnly>
              <apexchart
                v-if="razaChart.series.length"
                type="pie"
                height="240"
                :options="razaChart.options"
                :series="razaChart.series"
              />
              <div v-else class="h-32 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-tag" class="w-8 h-8" />
                <span class="text-xs">Sin datos de raza</span>
              </div>
            </ClientOnly>
          </div>

          <!-- Barras horizontal: Distribución por etapa de vida -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Hato por Etapa de Vida</h2>
            <p class="text-xs text-slate-400 mb-4">Ternero, novillo, adulto…</p>
            <ClientOnly>
              <apexchart
                v-if="etapaChart.series[0].data.length"
                type="bar"
                height="240"
                :options="etapaChart.options"
                :series="etapaChart.series"
              />
              <div v-else class="h-32 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-sparkles" class="w-8 h-8" />
                <span class="text-xs">Sin datos</span>
              </div>
            </ClientOnly>
          </div>

          <!-- Dona: Estado de salud -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Estado de Salud</h2>
            <p class="text-xs text-slate-400 mb-4">Sanos, enfermos, en tratamiento</p>
            <ClientOnly>
              <apexchart
                v-if="saludChart.series.length"
                type="radialBar"
                height="240"
                :options="saludChart.options"
                :series="saludChart.series"
              />
              <div v-else class="h-32 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-shield-check" class="w-8 h-8" />
                <span class="text-xs">Sin datos</span>
              </div>
            </ClientOnly>
          </div>
        </div>

        <!-- ── FILA 4: Sanidad ─────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Barras: Controles sanitarios por tipo -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Controles Sanitarios por Tipo</h2>
            <p class="text-xs text-slate-400 mb-4">Vacunas, desparasitaciones, revisiones…</p>
            <ClientOnly>
              <apexchart
                v-if="sanidadTipoChart.series[0].data.length"
                type="bar"
                height="260"
                :options="sanidadTipoChart.options"
                :series="sanidadTipoChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-beaker" class="w-10 h-10" />
                <span class="text-sm">Sin registros sanitarios</span>
              </div>
            </ClientOnly>
          </div>

          <!-- Línea: Evolución mensual de controles sanitarios -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Evolución de Controles Sanitarios</h2>
            <p class="text-xs text-slate-400 mb-4">Número de controles por mes</p>
            <ClientOnly>
              <apexchart
                v-if="sanidadMesChart.series[0].data.length"
                type="line"
                height="260"
                :options="sanidadMesChart.options"
                :series="sanidadMesChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-arrow-trending-up" class="w-10 h-10" />
                <span class="text-sm">Sin registros</span>
              </div>
            </ClientOnly>
          </div>
        </div>

        <!-- ── FILA 5: Tipo de monta ──────────────────────────────── -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-base font-bold text-slate-800 mb-1">Reproducciones por Tipo de Monta</h2>
            <p class="text-xs text-slate-400 mb-4">Natural vs Inseminación Artificial</p>
            <ClientOnly>
              <apexchart
                v-if="tipoMontaChart.series.length"
                type="donut"
                height="260"
                :options="tipoMontaChart.options"
                :series="tipoMontaChart.series"
              />
              <div v-else class="h-48 flex items-center justify-center text-slate-300 flex-col gap-2">
                <Icon name="i-heroicons-heart" class="w-10 h-10" />
                <span class="text-sm">Sin registros</span>
              </div>
            </ClientOnly>
          </div>

          <!-- Tarjeta de preñeces activas -->
          <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-white gap-4">
            <Icon name="i-heroicons-heart" class="w-16 h-16 opacity-50" />
            <div class="text-center">
              <p class="text-emerald-100 text-sm font-semibold uppercase tracking-widest mb-2">Preñeces Activas</p>
              <p class="text-6xl font-black">{{ estadisticasReproduccion?.prenez_activa ?? '-' }}</p>
              <p class="text-emerald-200 text-sm mt-2">Hembras confirmadas en gestación</p>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFinca } from '~/composables/useFinca'
import { useReportes } from '~/composables/useReportes'

definePageMeta({ layout: 'profile-layout' })

// ── Estado global ─────────────────────────────────────────────────────────
const { user } = useAuth()
const { getAllFincas } = useFinca()
const {
  loading,
  resumen, getResumen,
  produccionMensual, getProduccionMensual,
  topAnimales, getTopAnimales,
  produccionPorJornada, getProduccionPorJornada,
  estadisticasReproduccion, getEstadisticasReproduccion,
  estadisticasSanidad, getEstadisticasSanidad,
  distribucionRaza, distribucionEtapa, distribucionSalud, getDistribucionAnimales,
} = useReportes()

const fincas = ref([])
const selectedFincaId = ref(null)
const selectedMeses = ref(12)

// ── Paleta ────────────────────────────────────────────────────────────────
const COLORS = {
  emerald: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  multi: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'],
  chart: {
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  },
}

const baseOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'Inter, sans-serif', animations: { enabled: true, speed: 600 } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  tooltip: { theme: 'light' },
}

// ── KPI Cards ─────────────────────────────────────────────────────────────
const kpiCards = computed(() => {
  const r = resumen.value
  if (!r) return []
  return [
    {
      label: 'Total Animales', value: r.animales.total, sub: `${r.animales.machos} machos / ${r.animales.hembras} hembras`,
      icon: 'i-heroicons-squares-2x2', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', valueColor: 'text-slate-800',
    },
    {
      label: 'Litros este mes', value: `${r.produccion_leche.litros_mes_actual.toFixed(0)} L`, sub: 'Producción acumulada del mes',
      icon: 'i-heroicons-beaker', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', valueColor: 'text-sky-700',
    },
    {
      label: 'Partos este mes', value: r.reproduccion.partos_mes_actual, sub: `${r.reproduccion.proximos_partos_30_dias} en los próximos 30 días`,
      icon: 'i-heroicons-heart', iconBg: 'bg-pink-100', iconColor: 'text-pink-600', valueColor: 'text-pink-700',
    },
    {
      label: 'Alertas Sanitarias', value: r.animales.con_alerta_sanitaria, sub: `${r.animales.enfermos} enfermos, ${r.animales.en_tratamiento} en tratamiento`,
      icon: 'i-heroicons-exclamation-triangle', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-700',
    },
  ]
})

// ── Gráficos ──────────────────────────────────────────────────────────────

// 1. Producción mensual (área)
const produccionMensualChart = computed(() => {
  const data = produccionMensual.value || []
  return {
    options: {
      ...baseOptions,
      colors: ['#10b981'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0 } },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: data.map(d => d.mes),
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
        axisBorder: { show: false }, axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: v => `${v.toFixed(0)} L` } },
      markers: { size: 4, colors: ['#10b981'], strokeColors: '#fff', strokeWidth: 2 },
      dataLabels: { enabled: false },
    },
    series: [{ name: 'Litros', data: data.map(d => parseFloat(d.total_litros.toFixed(2))) }],
  }
})

// 2. Jornada (dona)
const jornadaChart = computed(() => {
  const data = produccionPorJornada.value || []
  return {
    options: {
      ...baseOptions,
      colors: ['#f59e0b', '#6366f1'],
      labels: data.map(d => d.jornada === 'manana' ? 'Mañana' : (d.jornada === 'tarde' ? 'Tarde' : d.jornada || 'Sin jornada')),
      legend: { position: 'bottom', fontSize: '12px' },
      dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
      plotOptions: { pie: { donut: { size: '65%' } } },
    },
    series: data.map(d => parseFloat(d.total_litros.toFixed(2))),
  }
})

// 3. Top animales (barras)
const topAnimalesChart = computed(() => {
  const data = topAnimales.value || []
  return {
    options: {
      ...baseOptions,
      colors: ['#10b981'],
      plotOptions: { bar: { borderRadius: 6, horizontal: true } },
      dataLabels: { enabled: true, style: { fontSize: '11px' }, formatter: v => `${v.toFixed(0)} L` },
      xaxis: {
        categories: data.map(d => d.identificador),
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
      },
      yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } } },
    },
    series: [{ name: 'Litros totales', data: data.map(d => parseFloat(d.total_litros.toFixed(2))) }],
  }
})

// 4. Partos por mes (barras agrupadas)
const partosChart = computed(() => {
  const data = (estadisticasReproduccion.value?.partos_por_mes) || []
  return {
    options: {
      ...baseOptions,
      colors: ['#ec4899', '#f9a8d4'],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: data.map(d => d.mes),
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
        axisBorder: { show: false }, axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
      legend: { position: 'bottom' },
    },
    series: [
      { name: 'Partos', data: data.map(d => d.total_partos) },
      { name: 'Crías', data: data.map(d => d.total_crias) },
    ],
  }
})

// 5. Distribución por raza (pie)
const razaChart = computed(() => {
  const data = distribucionRaza.value || []
  return {
    options: {
      ...baseOptions,
      colors: COLORS.multi,
      labels: data.map(d => d.raza),
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: true, formatter: (val, opts) => opts.w.globals.seriesNames[opts.seriesIndex] },
    },
    series: data.map(d => d.total),
  }
})

// 6. Etapa de vida (barras horizontal)
const etapaChart = computed(() => {
  const data = distribucionEtapa.value || []
  const labels = { ternero: 'Ternero', ternera: 'Ternera', novillo: 'Novillo', novilla: 'Novilla', adulto: 'Adulto', adulta: 'Adulta', adulto_mayor: 'Adulto Mayor' }
  return {
    options: {
      ...baseOptions,
      colors: ['#8b5cf6'],
      plotOptions: { bar: { borderRadius: 5, horizontal: true } },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      xaxis: {
        categories: data.map(d => labels[d.etapa] || d.etapa),
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
      },
      yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } } },
    },
    series: [{ name: 'Animales', data: data.map(d => d.total) }],
  }
})

// 7. Estado de salud (radialBar)
const saludChart = computed(() => {
  const data = distribucionSalud.value || []
  const total = data.reduce((a,b) => a + b.total, 0) || 1
  const labels = { sano: 'Sanos', diagnosticado_enfermo: 'Enfermos', en_tratamiento: 'En Tratamiento' }
  const colors = { sano: '#10b981', diagnosticado_enfermo: '#ef4444', en_tratamiento: '#f59e0b' }
  return {
    options: {
      ...baseOptions,
      colors: data.map(d => colors[d.estado] || '#94a3b8'),
      plotOptions: { radialBar: { hollow: { size: '30%' }, dataLabels: { name: { fontSize: '11px' }, value: { fontSize: '14px', fontWeight: 700, formatter: v => `${v}%` } } } },
      labels: data.map(d => labels[d.estado] || d.estado),
      legend: { show: true, position: 'bottom', fontSize: '11px' },
    },
    series: data.map(d => parseFloat(((d.total / total) * 100).toFixed(1))),
  }
})

// 8. Controles sanitarios por tipo
const sanidadTipoChart = computed(() => {
  const data = (estadisticasSanidad.value?.por_tipo_control) || []
  return {
    options: {
      ...baseOptions,
      colors: ['#06b6d4'],
      plotOptions: { bar: { borderRadius: 6, horizontal: true } },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      xaxis: {
        categories: data.map(d => d.tipo),
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
      },
      yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } } },
    },
    series: [{ name: 'Controles', data: data.map(d => d.total) }],
  }
})

// 9. Evolución mensual de controles (línea)
const sanidadMesChart = computed(() => {
  const data = (estadisticasSanidad.value?.por_mes) || []
  return {
    options: {
      ...baseOptions,
      colors: ['#06b6d4'],
      stroke: { curve: 'smooth', width: 3 },
      markers: { size: 4, colors: ['#06b6d4'], strokeColors: '#fff', strokeWidth: 2 },
      dataLabels: { enabled: false },
      xaxis: {
        categories: data.map(d => d.mes),
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
        axisBorder: { show: false }, axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
    },
    series: [{ name: 'Controles', data: data.map(d => d.total) }],
  }
})

// 10. Tipo de monta (dona)
const tipoMontaChart = computed(() => {
  const data = (estadisticasReproduccion.value?.por_tipo_monta) || []
  const labels = { natural: 'Monta Natural', inseminacion: 'Inseminación Artificial' }
  return {
    options: {
      ...baseOptions,
      colors: ['#f59e0b', '#8b5cf6'],
      labels: data.map(d => labels[d.tipo_monta] || d.tipo_monta),
      legend: { position: 'bottom', fontSize: '12px' },
      dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
      plotOptions: { pie: { donut: { size: '65%' } } },
    },
    series: data.map(d => d.total),
  }
})

// ── Carga de datos ────────────────────────────────────────────────────────
const onFincaChange = async () => {
  if (!selectedFincaId.value) return
  const id = selectedFincaId.value
  const meses = selectedMeses.value

  await Promise.all([
    getResumen(id),
    getProduccionMensual(id, meses),
    getTopAnimales(id),
    getProduccionPorJornada(id),
    getEstadisticasReproduccion(id, meses),
    getEstadisticasSanidad(id, meses),
    getDistribucionAnimales(id),
  ])
}

onMounted(async () => {
  if (user.value) {
    const { data } = await getAllFincas(user.value.id, user.value.rol)
    if (data.value && data.value.length > 0) {
      fincas.value = data.value
      selectedFincaId.value = fincas.value[0].id
      await onFincaChange()
    }
  }
})

watch(user, async (newUser) => {
  if (newUser && fincas.value.length === 0) {
    const { data } = await getAllFincas(newUser.id, newUser.rol)
    if (data.value && data.value.length > 0) {
      fincas.value = data.value
      selectedFincaId.value = fincas.value[0].id
      await onFincaChange()
    }
  }
}, { immediate: true })
</script>

<style scoped>
.animate-spin {
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
