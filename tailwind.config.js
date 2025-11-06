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
        'computer': "url('/assets/img/computer.jfif')",
        'paisaje': "url('/assets/img/paisaje.jfif')",
        'interaccion': "url('/assets/img/interaccion.jpg')",
        'fondoNosotros': "url('/assets/img/fondo_prueba.jpg')",
        'public1': "url('/assets/img/cow-boy.jpg')",
        'vaccine': "url('/assets/img/vaccine.jpg')",
        'brahman1': "url('/assets/img/brahman1.jpg')",
        'brahman2': "url('/assets/img/brahman2.jpg')",
        'traceability': "url('/assets/img/traceability.jpg')",
        'equipo': "url('/assets/img/equipo.jfif')",
      }
    }
  },
  plugins: []
}