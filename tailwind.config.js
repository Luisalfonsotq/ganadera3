export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'brahman1': "url('/assets/img/brahman1.jpg')",
        'brahman2': "url('/assets/img/brahman2.jpg')",
        'computer': "url('/assets/img/computer.jfif')",
        'equipo': "url('/assets/img/equipo.jfif')",
        'fondoNosotros': "url('/assets/img/fondo_prueba.jpg')",
        'interaccion': "url('/assets/img/interaccion.jpg')",
        'index1': "url('/assets/img/index1.jfif')",
        'paisaje': "url('/assets/img/paisaje.jfif')",
        'public1': "url('/assets/img/cow-boy.jpg')",
        'traceability': "url('/assets/img/traceability.jpg')",
        'vaccine': "url('/assets/img/vaccine.jpg')",
      }
    }
  },
  plugins: []
}