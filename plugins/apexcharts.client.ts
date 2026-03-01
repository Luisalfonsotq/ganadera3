// plugins/apexcharts.client.ts
// Este plugin se carga únicamente en el cliente (SSR-safe)
import VueApexCharts from 'vue3-apexcharts';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueApexCharts);
});
