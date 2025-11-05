<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white">
    <!-- Hero Section con Hero Image Responsivo -->
    <div class="bg-public1 relative w-full min-h-[400px] md:min-h-[500px] bg-cover bg-center overflow-hidden" >
      
      <!-- Logo y Hero Content - Totalmente Responsivo -->
      <div class="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div class="flex flex-col items-center justify-center md:items-center max-w-2xl mx-auto md:mx-0 md:ml-8 lg:ml-20">
          <!-- Logo Responsivo -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6 w-full max-w-sm transform hover:scale-105 transition-all duration-300">
            <img class="w-full h-auto" src="../assets/img/HERDIX.svg" alt="HERDIX Logo">
          </div>
          
          <!-- Hero Text con gradiente verde -->
          <div class="bg-gradient-to-br from-green-700 via-green-600 to-green-800 rounded-3xl rounded-tl-[20%] rounded-br-[20%] p-6 md:p-8 lg:p-10 shadow-2xl transform hover:shadow-green-500/50 transition-all duration-300 w-full max-w-sm md:max-w-md">
            <p class="text-center md:text-left text-xl md:text-2xl lg:text-3xl text-white font-bold leading-relaxed">
              ¡Transforma tu finca con tecnología inteligente y lleva tu ganadería al siguiente nivel!
            </p>
            <div class="mt-6 flex justify-center md:justify-start">
              <button class="bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Comenzar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Elementos decorativos animados -->
      <div class="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>

    <!-- Banner de Beneficios -->
    <section class="py-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-green-500">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
          <div class="transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl font-bold mb-2">+50%</div>
            <div class="text-lg">Eficiencia Operativa</div>
          </div>
          <div class="transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl font-bold mb-2">100%</div>
            <div class="text-lg">Control en Tiempo Real</div>
          </div>
          <div class="transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl font-bold mb-2">24/7</div>
            <div class="text-lg">Monitoreo Continuo</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Roles Rediseñada -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Un Sistema Diseñado para Cada Rol
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Optimiza tu operación ganadera con herramientas especializadas para cada miembro de tu equipo
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Administrador -->
          <div class="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-blue-200">
            <div class="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl">👔</span>
            </div>
            <h3 class="font-bold text-2xl mb-3 text-blue-900">Administrador</h3>
            <p class="text-gray-700 mb-4">
              Toma decisiones estratégicas con datos en tiempo real. Visualiza reportes completos, controla costos y escala tu negocio sin perder el control.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ Dashboard completo</li>
              <li>✓ Reportes financieros</li>
              <li>✓ Gestión de usuarios</li>
            </ul>
          </div>

          <!-- Veterinario -->
          <div class="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-green-200">
            <div class="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl">🧑‍⚕️</span>
            </div>
            <h3 class="font-bold text-2xl mb-3 text-green-900">Veterinario</h3>
            <p class="text-gray-700 mb-4">
              Mantén la salud del ganado bajo control. Accede al historial médico completo, programa vacunaciones y reduce pérdidas por enfermedades.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ Historial médico digital</li>
              <li>✓ Alertas de vacunación</li>
              <li>✓ Control sanitario</li>
            </ul>
          </div>

          <!-- Supervisor -->
          <div class="group bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-amber-200">
            <div class="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl">👷</span>
            </div>
            <h3 class="font-bold text-2xl mb-3 text-amber-900">Supervisor</h3>
            <p class="text-gray-700 mb-4">
              Coordina las operaciones diarias con eficiencia. Asigna tareas, supervisa el equipo y asegura que todo funcione como debe ser.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ Asignación de tareas</li>
              <li>✓ Seguimiento en tiempo real</li>
              <li>✓ Coordinación de equipo</li>
            </ul>
          </div>

          <!-- Colaborador -->
          <div class="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-200">
            <div class="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl">🧑‍🌾</span>
            </div>
            <h3 class="font-bold text-2xl mb-3 text-purple-900">Colaborador</h3>
            <p class="text-gray-700 mb-4">
              Simplifica el trabajo en campo. Recibe tareas claras, reporta novedades fácilmente y contribuye al éxito de la operación.
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ Tareas claras</li>
              <li>✓ Reporte de novedades</li>
              <li>✓ Interfaz simple</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Funcionalidades con Imágenes -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Herramientas Poderosas para Tu Finca
          </h2>
          <p class="text-xl text-gray-600">Todo lo que necesitas en un solo lugar</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Gestión de Fincas -->
          <div class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="h-48 bg-cover bg-center transform group-hover:scale-105 transition-all duration-500" 
                 style="background-image: url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2074');">
            </div>
            <div class="p-6">
              <h3 class="font-bold text-2xl mb-3 text-green-800">Gestión de Fincas y Potreros</h3>
              <p class="text-gray-700">
                Organiza tus terrenos de forma inteligente. Controla el uso de pastos, rotación de potreros y maximiza la productividad de cada hectárea.
              </p>
            </div>
          </div>

          <!-- Control Sanitario -->
          <div class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="h-48 bg-cover bg-center transform group-hover:scale-105 transition-all duration-500" 
                 style="background-image: url('https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?q=80&w=2070');">
            </div>
            <div class="p-6">
              <h3 class="font-bold text-2xl mb-3 text-green-800">Control Sanitario Completo</h3>
              <p class="text-gray-700">
                Nunca más olvides una vacuna o tratamiento. Programa recordatorios, mantén historiales médicos y protege la salud de tu ganado.
              </p>
            </div>
          </div>

          <!-- Registro de Eventos -->
          <div class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="h-48 bg-cover bg-center transform group-hover:scale-105 transition-all duration-500" 
                 style="background-image: url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2070');">
            </div>
            <div class="p-6">
              <h3 class="font-bold text-2xl mb-3 text-green-800">Trazabilidad Total</h3>
              <p class="text-gray-700">
                Registra nacimientos, ventas, movimientos y cualquier evento importante. Mantén un historial completo de cada animal desde su nacimiento.
              </p>
            </div>
          </div>

          <!-- Reportes -->
          <div class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="h-48 bg-cover bg-center transform group-hover:scale-105 transition-all duration-500" 
                 style="background-image: url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070');">
            </div>
            <div class="p-6">
              <h3 class="font-bold text-2xl mb-3 text-green-800">Reportes Inteligentes</h3>
              <p class="text-gray-700">
                Toma decisiones basadas en datos reales. Analiza costos, producción y rentabilidad con reportes automáticos y visualizaciones claras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-16 relative overflow-hidden">
      <!-- Elementos decorativos -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div class="max-w-4xl mx-auto text-center px-4 relative z-10">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 animate-pulse">
          ¡Empieza a Modernizar Tu Finca Hoy!
        </h2>
        <p class="text-xl md:text-2xl mb-8 text-green-100">
          Únete a cientos de ganaderos que ya están optimizando su producción con HERDIX
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-xl">
            Crear Cuenta Gratis
          </button>
          <button class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-700 transform hover:scale-105 transition-all duration-300">
            Ver Demo
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>