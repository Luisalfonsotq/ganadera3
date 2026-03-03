// composables/useReportes.js
import { ref } from 'vue';

const BASE_URL = 'http://localhost:3001';

async function apiFetch(path) {
    const res = await fetch(`${BASE_URL}${path}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
}

async function apiFetchBlob(path) {
    const res = await fetch(`${BASE_URL}${path}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res;
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const useReportes = () => {
    const loading = ref(false);
    const error = ref(null);

    // ── RESUMEN ──────────────────────────────────────────────────────────────
    const resumen = ref(null);

    const getResumen = async (finca_id) => {
        loading.value = true;
        error.value = null;
        try {
            resumen.value = await apiFetch(`/reportes/finca/${finca_id}/resumen`);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    // ── PRODUCCIÓN DE LECHE ──────────────────────────────────────────────────
    const produccionMensual = ref([]);
    const topAnimales = ref([]);
    const produccionPorJornada = ref([]);

    const getProduccionMensual = async (finca_id, meses = 12) => {
        loading.value = true;
        error.value = null;
        try {
            produccionMensual.value = await apiFetch(
                `/reportes/finca/${finca_id}/produccion-leche/mensual?meses=${meses}`
            );
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const getTopAnimales = async (finca_id, top = 10) => {
        loading.value = true;
        error.value = null;
        try {
            topAnimales.value = await apiFetch(
                `/reportes/finca/${finca_id}/produccion-leche/top-animales?top=${top}`
            );
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const getProduccionPorJornada = async (finca_id) => {
        loading.value = true;
        error.value = null;
        try {
            produccionPorJornada.value = await apiFetch(
                `/reportes/finca/${finca_id}/produccion-leche/por-jornada`
            );
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    // ── REPRODUCCIÓN ─────────────────────────────────────────────────────────
    const estadisticasReproduccion = ref(null);

    const getEstadisticasReproduccion = async (finca_id, meses = 12) => {
        loading.value = true;
        error.value = null;
        try {
            estadisticasReproduccion.value = await apiFetch(
                `/reportes/finca/${finca_id}/reproduccion?meses=${meses}`
            );
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    // ── SANIDAD ───────────────────────────────────────────────────────────────
    const estadisticasSanidad = ref(null);

    const getEstadisticasSanidad = async (finca_id, meses = 12) => {
        loading.value = true;
        error.value = null;
        try {
            estadisticasSanidad.value = await apiFetch(
                `/reportes/finca/${finca_id}/sanidad?meses=${meses}`
            );
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    // ── ANIMALES DISTRIBUCIÓN ─────────────────────────────────────────────────
    const distribucionRaza = ref([]);
    const distribucionEtapa = ref([]);
    const distribucionSalud = ref([]);

    const getDistribucionAnimales = async (finca_id) => {
        loading.value = true;
        error.value = null;
        try {
            const [raza, etapa, salud] = await Promise.all([
                apiFetch(`/reportes/finca/${finca_id}/animales/distribucion-raza`),
                apiFetch(`/reportes/finca/${finca_id}/animales/distribucion-etapa-vida`),
                apiFetch(`/reportes/finca/${finca_id}/animales/distribucion-salud`),
            ]);
            distribucionRaza.value = raza;
            distribucionEtapa.value = etapa;
            distribucionSalud.value = salud;
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    // ── EXPORTACIÓN ─────────────────────────────────────────────────────
    const downloading = ref(false);
    const downloadError = ref(null);

    const downloadExcel = async (finca_id, meses = 12, fincaNombre = '') => {
        downloading.value = true;
        downloadError.value = null;
        try {
            const params = new URLSearchParams({ meses, nombre: fincaNombre }).toString();
            const res = await apiFetchBlob(`/reportes/finca/${finca_id}/exportar/excel?${params}`);
            const blob = await res.blob();
            triggerDownload(blob, `reporte-${fincaNombre || finca_id}-${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (e) {
            downloadError.value = e.message;
        } finally {
            downloading.value = false;
        }
    };

    const downloadPdf = async (finca_id, meses = 12, fincaNombre = '') => {
        downloading.value = true;
        downloadError.value = null;
        try {
            const params = new URLSearchParams({ meses, nombre: fincaNombre }).toString();
            const res = await apiFetchBlob(`/reportes/finca/${finca_id}/exportar/pdf?${params}`);
            const blob = await res.blob();
            triggerDownload(blob, `reporte-${fincaNombre || finca_id}-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (e) {
            downloadError.value = e.message;
        } finally {
            downloading.value = false;
        }
    };

    return {
        loading,
        error,
        // Resumen
        resumen,
        getResumen,
        // Producción Leche
        produccionMensual,
        topAnimales,
        produccionPorJornada,
        getProduccionMensual,
        getTopAnimales,
        getProduccionPorJornada,
        // Reproducción
        estadisticasReproduccion,
        getEstadisticasReproduccion,
        // Sanidad
        estadisticasSanidad,
        getEstadisticasSanidad,
        // Animales
        distribucionRaza,
        distribucionEtapa,
        distribucionSalud,
        getDistribucionAnimales,
        // Exportación
        downloading,
        downloadError,
        downloadExcel,
        downloadPdf,
    };
};
