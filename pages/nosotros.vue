<!-- pages/nosotros.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
    <!-- Hero Section -->
    <div class="relative w-full min-h-[400px] md:min-h-[500px] bg-cover bg-center flex items-center justify-center" 
         style="background-image: linear-gradient(rgba(22, 101, 52, 0.85), rgba(21, 128, 61, 0.85)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232');">
      
      <div class="text-center px-4 z-10">
        <!-- Logo con animación -->
        <div class="inline-block bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6 transform hover:scale-105 transition-all duration-300">
          <img src="../assets/img/HERDIX.svg" alt="HERDIX Logo" class="w-48 md:w-64 lg:w-80 h-auto mx-auto">
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Tecnología al Servicio del Campo
        </h1>
        <p class="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
          Desarrollado por ganaderos que entienden tus necesidades
        </p>
      </div>
    </div>

    <!-- Nuestra Historia -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Nuestra Historia</h2>
          <div class="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <div class="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
              <h3 class="text-3xl font-bold mb-4">¿Quiénes Somos?</h3>
              <p class="text-lg leading-relaxed mb-4">
                Somos un equipo de desarrolladores del SENA apasionados por transformar la gestión ganadera en Colombia. 
              </p>
              <p class="text-lg leading-relaxed mb-4">
                Nacimos de la necesidad de ayudar a los ganaderos a modernizar sus operaciones, reducir pérdidas y aumentar la rentabilidad de sus fincas.
              </p>
              <p class="text-lg leading-relaxed">
                Combinamos tecnología de punta con un profundo entendimiento de las necesidades del campo colombiano.
              </p>
            </div>
          </div>

          <div class="order-1 md:order-2">
            <div class="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" 
                   alt="Equipo de desarrollo" 
                   class="w-full h-auto">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="py-16 bg-white px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Nuestros Valores</h2>
          <div class="w-24 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Innovación -->
          <div class="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-blue-200">
            <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💡</div>
            <h3 class="text-2xl font-bold mb-3 text-blue-900">Innovación</h3>
            <p class="text-gray-700 leading-relaxed">
              Desarrollamos soluciones tecnológicas de vanguardia adaptadas a las necesidades del campo colombiano.
            </p>
          </div>

          <!-- Compromiso -->
          <div class="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-green-200">
            <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🤝</div>
            <h3 class="text-2xl font-bold mb-3 text-green-900">Compromiso</h3>
            <p class="text-gray-700 leading-relaxed">
              Estamos dedicados al éxito de cada ganadero que confía en HERDIX para gestionar su finca.
            </p>
          </div>

          <!-- Simplicidad -->
          <div class="group bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-amber-200">
            <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
            <h3 class="text-2xl font-bold mb-3 text-amber-900">Simplicidad</h3>
            <p class="text-gray-700 leading-relaxed">
              Hacemos la tecnología accesible y fácil de usar, incluso para quienes no son expertos digitales.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Por Qué HERDIX -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-3xl shadow-2xl overflow-hidden">
          <div class="grid md:grid-cols-2 gap-0">
            <div class="p-8 md:p-12 text-white">
              <h2 class="text-4xl font-bold mb-6">¿Por Qué Elegir HERDIX?</h2>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <span class="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-xl mb-2">Diseñado para Ganaderos</h4>
                    <p class="text-green-100">Entendemos el campo porque hemos trabajado de cerca con ganaderos reales.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <span class="text-2xl">📱</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-xl mb-2">Fácil de Usar</h4>
                    <p class="text-green-100">Interfaz intuitiva que cualquier persona puede dominar en minutos.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <span class="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-xl mb-2">Resultados Comprobados</h4>
                    <p class="text-green-100">Nuestros usuarios reportan aumentos de hasta 50% en eficiencia operativa.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="bg-white/20 rounded-full p-3 flex-shrink-0">
                    <span class="text-2xl">💪</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-xl mb-2">Soporte Continuo</h4>
                    <p class="text-green-100">Estamos contigo en cada paso, desde la configuración hasta el crecimiento.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-64 md:h-auto bg-cover bg-center" 
                 style="background-image: url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073');">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tecnología -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Tecnología de Vanguardia</h2>
          <div class="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="bg-white rounded-3xl p-8 shadow-xl">
            <h3 class="text-2xl font-bold mb-6 text-gray-800">Plataforma Completa</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="bg-green-100 rounded-full p-2 mt-1">
                  <span class="text-green-600">✓</span>
                </div>
                <div>
                  <div class="font-bold text-gray-800">Acceso Multiplataforma</div>
                  <div class="text-gray-600 text-sm">Web, móvil y tablet - trabaja desde cualquier lugar</div>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="bg-green-100 rounded-full p-2 mt-1">
                  <span class="text-green-600">✓</span>
                </div>
                <div>
                  <div class="font-bold text-gray-800">Sincronización en Tiempo Real</div>
                  <div class="text-gray-600 text-sm">Todos los cambios se actualizan instantáneamente</div>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="bg-green-100 rounded-full p-2 mt-1">
                  <span class="text-green-600">✓</span>
                </div>
                <div>
                  <div class="font-bold text-gray-800">Seguridad Avanzada</div>
                  <div class="text-gray-600 text-sm">Tus datos protegidos con encriptación de nivel bancario</div>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="bg-green-100 rounded-full p-2 mt-1">
                  <span class="text-green-600">✓</span>
                </div>
                <div>
                  <div class="font-bold text-gray-800">Respaldos Automáticos</div>
                  <div class="text-gray-600 text-sm">Nunca pierdas información importante</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015" 
                 alt="Tecnología" 
                 class="w-full h-auto transform hover:scale-105 transition-all duration-500">
          </div>
        </div>
      </div>
    </section>

    <!-- Impacto -->
    <section class="py-16 bg-gradient-to-b from-white to-green-50 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Nuestro Impacto</h2>
          <div class="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p class="text-xl text-gray-600">Transformando la ganadería colombiana, un ganadero a la vez</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl md:text-5xl font-bold text-green-600 mb-2">500+</div>
            <div class="text-gray-600">Ganaderos Activos</div>
          </div>
          
          <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl md:text-5xl font-bold text-green-600 mb-2">50K+</div>
            <div class="text-gray-600">Animales Gestionados</div>
          </div>
          
          <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl md:text-5xl font-bold text-green-600 mb-2">98%</div>
            <div class="text-gray-600">Satisfacción</div>
          </div>
          
          <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-4xl md:text-5xl font-bold text-green-600 mb-2">24/7</div>
            <div class="text-gray-600">Soporte Disponible</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Lo Que Dicen Nuestros Usuarios</h2>
          <div class="w-24 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg border-2 border-green-100 transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                JM
              </div>
              <div>
                <div class="font-bold text-lg">Juan Martínez</div>
                <div class="text-gray-600 text-sm">Ganadero - Córdoba</div>
              </div>
            </div>
            <div class="text-yellow-500 text-2xl mb-3">★★★★★</div>
            <p class="text-gray-700 italic">
              "HERDIX transformó mi finca. Ahora tengo control total de cada animal y he reducido costos en un 30%."
            </p>
          </div>

          <div class="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg border-2 border-blue-100 transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                LG
              </div>
              <div>
                <div class="font-bold text-lg">Laura González</div>
                <div class="text-gray-600 text-sm">Administradora - Meta</div>
              </div>
            </div>
            <div class="text-yellow-500 text-2xl mb-3">★★★★★</div>
            <p class="text-gray-700 italic">
              "La mejor inversión que hice para mi negocio. Ahora gestiono 3 fincas desde mi celular sin problemas."
            </p>
          </div>

          <div class="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border-2 border-amber-100 transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                CR
              </div>
              <div>
                <div class="font-bold text-lg">Carlos Rodríguez</div>
                <div class="text-gray-600 text-sm">Veterinario - Cesar</div>
              </div>
            </div>
            <div class="text-yellow-500 text-2xl mb-3">★★★★★</div>
            <p class="text-gray-700 italic">
              "Como veterinario, HERDIX me facilita el seguimiento de todos mis pacientes. ¡Excelente herramienta!"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA de Registro -->
    <section class="py-16 px-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 transform hover:scale-110 transition-all duration-300">
          <span class="text-4xl">🎉</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          ¡Únete a la Revolución Ganadera!
        </h2>
        <p class="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
          Moderniza tu finca, aumenta tu rentabilidad y lleva tu negocio ganadero al siguiente nivel con HERDIX
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button class="bg-white text-green-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2">
            <span>Registrarse Gratis</span>
            <span class="text-2xl">→</span>
          </button>
          <button class="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-700 transform hover:scale-105 transition-all duration-300">
            Contactar Soporte
          </button>
        </div>

        <div class="flex flex-wrap justify-center gap-6 text-green-100 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-xl">✓</span>
            <span>Sin tarjeta de crédito</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xl">✓</span>
            <span>Configuración en 5 minutos</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xl">✓</span>
            <span>Soporte incluido</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Info -->
    <section class="py-12 bg-gray-900 text-white px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 class="font-bold text-xl mb-4 text-green-400">Contacto</h3>
            <p class="text-gray-300 mb-2">📧 soporte@herdix.com</p>
            <p class="text-gray-300 mb-2">📱 +57 300 123 4567</p>
            <p class="text-gray-300">📍 Bogotá, Colombia</p>
          </div>
          
          <div>
            <h3 class="font-bold text-xl mb-4 text-green-400">Horarios</h3>
            <p class="text-gray-300 mb-2">Lunes a Viernes</p>
            <p class="text-gray-300 mb-2">8:00 AM - 6:00 PM</p>
            <p class="text-gray-300">Soporte 24/7 disponible</p>
          </div>
          
          <div>
            <h3 class="font-bold text-xl mb-4 text-green-400">Síguenos</h3>
            <div class="flex gap-4 justify-center md:justify-start">
              <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 cursor-pointer transform hover:scale-110 transition-all duration-300">
                <span>f</span>
              </div>
              <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 cursor-pointer transform hover:scale-110 transition-all duration-300">
                <span>📷</span>
              </div>
              <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 cursor-pointer transform hover:scale-110 transition-all duration-300">
                <span>in</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 HERDIX - Desarrollado por equipo SENA. Todos los derechos reservados.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
definePageMeta({
  layout: 'public'
})
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.6s ease-out;
}
</style>