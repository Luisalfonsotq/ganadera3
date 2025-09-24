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
        'interaccion': "url('/assets/img/interaccion.jpg')",
        'fondoNosotros': "url('/assets/img/fondo_prueba.jpg')"
      }
    }
  },
  plugins: []
}