// utils/controlesSanitarios.js
// Controles sanitarios base para ganado bovino en Colombia
// Incluye protocolos ajustados a normativas ICA, clima tropical y razas predominantes

export const controlesSanitariosBase = [

  // ══════════════════════════════════════════════════
  // VACUNACIÓN - Obligatorias por ley ICA Colombia
  // ══════════════════════════════════════════════════
  {
    id: 1,
    nombre: 'Vacunación Fiebre Aftosa (FMD)',
    categoria: 'Vacunación',
    subcategoria: 'Obligatoria ICA',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: 120,
    aplica_razas: 'todas',
    descripcion: 'Campaña obligatoria ICA cada 4 meses. Terneros desde los 2 meses.',
    notas: 'Obligatoria por ley. Notificable al ICA. Usar vacuna bivalente (tipos O y A).'
  },
  {
    id: 2,
    nombre: 'Vacunación Brucelosis (RB51 o B19)',
    categoria: 'Vacunación',
    subcategoria: 'Obligatoria ICA',
    aplica_a_sexo: true, // solo hembras
    requiere_medicamento: true,
    edad_minima_dias: 150,  // 5 meses
    edad_maxima_dias: 270,  // 9 meses - ventana ideal para novillas
    frecuencia_dias: null,  // una sola vez (vacuna de por vida)
    aplica_razas: 'todas',
    descripcion: 'Campaña obligatoria ICA para hembras entre 3-9 meses. Solo novillas.',
    notas: 'Solo hembras bovinas de 3 a 8 meses. Notificable. Veterinario autorizado ICA.'
  },
  {
    id: 3,
    nombre: 'Vacunación Carbón Bacteridiano (Ántrax)',
    categoria: 'Vacunación',
    subcategoria: 'Recomendada',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 150,
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'Anual. Especialmente en zonas endémicas del Magdalena Medio, Orinoquia y Caribe.',
    notas: 'Prioritaria en llanuras inundables. Aplicar antes de época de lluvias.'
  },
  {
    id: 4,
    nombre: 'Vacunación Carbón Sintomático (Clostridios)',
    categoria: 'Vacunación',
    subcategoria: 'Recomendada',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 90,
    edad_maxima_dias: null,
    frecuencia_dias: 180,
    aplica_razas: 'todas',
    descripcion: 'Semestral. Terneros y adultos. Vital en Llanos Orientales, Urabá, Córdoba.',
    notas: 'Usar vacuna polivalente clostridial. Refuerzo a los 30 días en primovacunación.'
  },
  {
    id: 5,
    nombre: 'Vacunación Rabia Bovina (Desmodus)',
    categoria: 'Vacunación',
    subcategoria: 'Recomendada zonas riesgo',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 90,
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'Anual. Obligatoria en zonas de murciélagos hematófagos (Desmodus rotundus).',
    notas: 'Prevalente en regiones cálidas húmedas. Aplicar en animales de zonas de riesgo.'
  },
  {
    id: 6,
    nombre: 'Vacunación IBR / DVB (Rinotraqueítis)',
    categoria: 'Vacunación',
    subcategoria: 'Recomendada',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 120,
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'IBR (Rinotraqueítis Infecciosa Bovina) y DVB (Diarrea Viral Bovina). Anual.',
    notas: 'Importante en hatos lecheros. Usar vacuna combinada. Pre-servicio en vacas.'
  },
  {
    id: 7,
    nombre: 'Vacunación Leptospirosis',
    categoria: 'Vacunación',
    subcategoria: 'Recomendada',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 90,
    edad_maxima_dias: null,
    frecuencia_dias: 180,
    aplica_razas: 'todas',
    descripcion: 'Semestral. Alta prevalencia en regiones con inundaciones. Afecta reproducción.',
    notas: 'Serovares prevalentes en Colombia: Hardjo, Pomona, Serjoe. Refuerzo cada 6 meses.'
  },
  {
    id: 8,
    nombre: 'Vacunación Edema Maligno / Enterotoxemia',
    categoria: 'Vacunación',
    subcategoria: 'Recomendada',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'Anual. Clostridium perfringens tipos C y D. Crítico en cambios de alimentación.',
    notas: 'Incluir en vacuna polivalente clostridial. Fundamental en bovinos de engorde.'
  },

  // ══════════════════════════════════════════════════
  // CONTROL DE PARÁSITOS
  // ══════════════════════════════════════════════════
  {
    id: 9,
    nombre: 'Desparasitación Interna (Terneros)',
    categoria: 'Control de parásitos',
    subcategoria: 'Helmintos',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: 365,
    frecuencia_dias: 90,
    aplica_razas: 'todas',
    descripcion: 'Cada 3 meses en terneros. Nematodos gastrointestinales: Haemonchus, Ostertagia.',
    notas: 'Alta carga parasitaria en clima cálido-húmedo. Rotar principio activo para evitar resistencia.'
  },
  {
    id: 10,
    nombre: 'Desparasitación Interna (Adultos)',
    categoria: 'Control de parásitos',
    subcategoria: 'Helmintos',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 365,
    edad_maxima_dias: null,
    frecuencia_dias: 120,
    aplica_razas: 'todas',
    descripcion: 'Cada 4 meses en adultos o según carga parasitaria. Usar FAMACHA en terneros.',
    notas: 'Ivermectina, albendazol, levamisol. Análisis coprológico recomendado antes de tratar.'
  },
  {
    id: 11,
    nombre: 'Control de Garrapatas (Rhipicephalus)',
    categoria: 'Control de parásitos',
    subcategoria: 'Ectoparásitos',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: 21,
    aplica_razas: 'todas',
    descripcion: 'Cada 21 días en zonas de alta presión. Rhipicephalus microplus es el principal vector.',
    notas: 'Rotar acaricidas cada 2-3 ciclos. Razas Brahman y criollas tienen mayor resistencia natural.'
  },
  {
    id: 12,
    nombre: 'Control Mosca del Cuerno (Haematobia)',
    categoria: 'Control de parásitos',
    subcategoria: 'Ectoparásitos',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: 30,
    aplica_razas: 'todas',
    descripcion: 'Mensual en épocas de alta presión. Haematobia irritans reduce producción de leche.',
    notas: 'Usar pour-on o aspersión. Umbral económico: más de 200 moscas/animal.'
  },
  {
    id: 13,
    nombre: 'Control de Nuches / Berne (Dermatobia)',
    categoria: 'Control de parásitos',
    subcategoria: 'Ectoparásitos',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: 30,
    aplica_razas: 'todas',
    descripcion: 'Dermatobia hominis. Control mensual en zonas endémicas (trópico húmedo).',
    notas: 'Ivermectina sistémica es efectiva. Causar daño en cuero y reducción de peso.'
  },
  {
    id: 14,
    nombre: 'Tratamiento con Ivermectina (Multiantiparasitario)',
    categoria: 'Control de parásitos',
    subcategoria: 'Sistémico',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 45,
    edad_maxima_dias: null,
    frecuencia_dias: 90,
    aplica_razas: 'todas',
    descripcion: 'Control combinado endo y ectoparásitos. Especialmente en destete y entrada/salida de potrero.',
    notas: 'Dosis: 1mL/50kg SC. No aplicar en vacas lecheras en producción (período de retiro).'
  },

  // ══════════════════════════════════════════════════
  // REPRODUCTIVO - Controles especiales por etapa
  // ══════════════════════════════════════════════════
  {
    id: 15,
    nombre: 'Raspado Prepucial (Campylobacter / Tricomoniasis)',
    categoria: 'Reproductivo',
    subcategoria: 'Examen andrológico',
    aplica_a_sexo: true, // solo machos
    requiere_medicamento: false,
    edad_minima_dias: 540, // 18 meses
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'Diagnóstico Campylobacter fetus y Tritrichomonas foetus. Anual en reproductores.',
    notas: 'Obligatorio antes de montas y en toros de renta. Incluir examen de capacidad reproductiva.'
  },
  {
    id: 16,
    nombre: 'Evaluación Capacidad Reproductiva Toro (ECR)',
    categoria: 'Reproductivo',
    subcategoria: 'Examen andrológico',
    aplica_a_sexo: true, // solo machos
    requiere_medicamento: false,
    edad_minima_dias: 450, // 15 meses
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'SCE, morfología espermática, libido y condición física. Anual antes de temporada de monta.',
    notas: 'Realizar 60 días antes de la época de monta. Score SC mínimo: 30cm en novillo Brahman.'
  },
  {
    id: 17,
    nombre: 'Diagnóstico de Gestación (Palpación/Ecografía)',
    categoria: 'Reproductivo',
    subcategoria: 'Diagnóstico',
    aplica_a_sexo: true, // solo hembras
    requiere_medicamento: false,
    edad_minima_dias: 540, // 18 meses
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Diagnóstico de preñez 30-45 días post-servicio. Ecografía transrectal o palpación.',
    notas: 'Las razas Bos indicus (Brahman, Cebú) tienden a ovular más temprano con buena condición corporal.'
  },
  {
    id: 18,
    nombre: 'Sincronización de Celo / IATF',
    categoria: 'Reproductivo',
    subcategoria: 'Protocolo reproductivo',
    aplica_a_sexo: true, // solo hembras
    requiere_medicamento: true,
    edad_minima_dias: 540,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Inseminación Artificial a Tiempo Fijo. Protocolos OvSynch, J-Synch, 72h.',
    notas: 'Considerar condición corporal ≥2.5 en Bos indicus. Razas cebuínas tienen mayor anestro postparto.'
  },
  {
    id: 19,
    nombre: 'Posparto y Revisión Puerperal',
    categoria: 'Reproductivo',
    subcategoria: 'Seguimiento postparto',
    aplica_a_sexo: true, // solo hembras
    requiere_medicamento: false,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Revisión 7-15 días posparto. Detectar retención placentaria, metritis, prolapso.',
    notas: 'Brahman/Cebú tienen menor incidencia de distocias. Razas europeas (Holstein) mayor riesgo.'
  },
  {
    id: 20,
    nombre: 'Descarte Reproductivo (Vacas Problema)',
    categoria: 'Reproductivo',
    subcategoria: 'Diagnóstico',
    aplica_a_sexo: true,
    requiere_medicamento: false,
    edad_minima_dias: 540,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Vacas con >3 servicios sin concepción. Evaluación para descarte o tratamiento.',
    notas: 'Incluir examen ginecológico, hormonal y ultrasonografía ovárica.'
  },

  // ══════════════════════════════════════════════════
  // NUTRICIÓN Y SUPLEMENTACIÓN
  // ══════════════════════════════════════════════════
  {
    id: 21,
    nombre: 'Suplementación Mineral (Sal Mineralizada)',
    categoria: 'Nutrición',
    subcategoria: 'Mineralización',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: 30,
    aplica_razas: 'todas',
    descripcion: 'Suministro mensual de sal mineralizada. 50-80g/animal/día en pastoreo.',
    notas: 'Suelos colombianos deficientes en fósforo, cobre, zinc y selenio. Formulas regionales.'
  },
  {
    id: 22,
    nombre: 'Aplicación de Vitamina ADE',
    categoria: 'Nutrición',
    subcategoria: 'Vitaminas',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: 90,
    aplica_razas: 'todas',
    descripcion: 'Trimestral. A, D y E para terneros y animales en épocas secas o estrés.',
    notas: 'Especialmente importante en zafra seca (verano). Vital para vacas preparto.'
  },
  {
    id: 23,
    nombre: 'Suplementación con Calcio-Fósforo (Preventivo Hipocalcemia)',
    categoria: 'Nutrición',
    subcategoria: 'Mineralización',
    aplica_a_sexo: true, // vacas en producción
    requiere_medicamento: true,
    edad_minima_dias: 730,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'leche',
    descripcion: 'Pre y posparto en vacas de leche. Previene fiebre de leche (hipocalcemia).',
    notas: 'Razas Holstein y Jersey más susceptibles. Administrar 24h antes del parto esperado.'
  },
  {
    id: 24,
    nombre: 'Evaluación Condición Corporal (BCS)',
    categoria: 'Nutrición',
    subcategoria: 'Seguimiento nutricional',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: 60,
    aplica_razas: 'todas',
    descripcion: 'Bimestral. Escala 1-5. Score ideal: 2.5-3.5 Bos indicus, 3-3.75 Bos taurus.',
    notas: 'Evaluar en vacas antes del parto (score 3.0-3.5) y postparto, en reproductores y ganado de ceba.'
  },
  {
    id: 25,
    nombre: 'Detoxificación Hepática (Complejo B + Hepatoprotectores)',
    categoria: 'Nutrición',
    subcategoria: 'Soporte metabólico',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Soporte hepático en animales con sobrecarga metabólica, parasitismo o enfermedad.',
    notas: 'Muy útil en destete y periodos de estrés. Complejo B mejora apetito y conversión.'
  },

  // ══════════════════════════════════════════════════
  // SEGUIMIENTO Y CONTROL PRODUCTIVO
  // ══════════════════════════════════════════════════
  {
    id: 26,
    nombre: 'Pesaje de Control (Terneros)',
    categoria: 'Seguimiento',
    subcategoria: 'Biometría',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 0,
    edad_maxima_dias: 365,
    frecuencia_dias: 30,
    aplica_razas: 'todas',
    descripcion: 'Mensual en terneros. GDP objetivo: 700-900g/día Brahman, 600-800g Holstein.',
    notas: 'Indicador clave de salud y nutrición. Usar bozal y balanza. Registrar en ficha.'
  },
  {
    id: 27,
    nombre: 'Pesaje de Control (Novillos y Adultos)',
    categoria: 'Seguimiento',
    subcategoria: 'Biometría',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 365,
    edad_maxima_dias: null,
    frecuencia_dias: 60,
    aplica_razas: 'todas',
    descripcion: 'Bimestral. GDP en ceba: mínimo 600g/día. Ajuste de pastoreo o suplementación.',
    notas: 'Razas doble propósito como Normando o Simmental tienen buena conversión alimenticia.'
  },
  {
    id: 28,
    nombre: 'Control de Producción de Leche (Lactometría)',
    categoria: 'Seguimiento',
    subcategoria: 'Producción',
    aplica_a_sexo: true, // hembras en lactación
    requiere_medicamento: false,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: 30,
    aplica_razas: 'leche',
    descripcion: 'Mensual. Medición individual de producción. Holstein: 20-30L/día, Jersey 12-18L.',
    notas: 'Incluir control de mastitis (CMT). Razas criollas como Lucerna y Hartón del Valle: 8-15L.'
  },
  {
    id: 29,
    nombre: 'Medición Alzada y Perímetro Torácico',
    categoria: 'Seguimiento',
    subcategoria: 'Biometría',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 60,
    edad_maxima_dias: 730,
    frecuencia_dias: 90,
    aplica_razas: 'todas',
    descripcion: 'Trimestral en jóvenes. Estima peso y ritmo de crecimiento. Cinta bovinométrica.',
    notas: 'Útil cuando no hay balanza disponible. Registrar para evaluación conformación racial.'
  },

  // ══════════════════════════════════════════════════
  // BIOSEGURIDAD Y PREVENCIÓN
  // ══════════════════════════════════════════════════
  {
    id: 30,
    nombre: 'Desinfección de Instalaciones (Bioseguridad)',
    categoria: 'Bioseguridad',
    subcategoria: 'Higiene',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: 15,
    aplica_razas: 'todas',
    descripcion: 'Quincenal en corrales, bañaderos y salas de ordeño. Hipoclorito o amonio cuaternario.',
    notas: 'Especialmente crítico en épocas de lluvia para prevenir miasis y enfermedades respiratorias.'
  },
  {
    id: 31,
    nombre: 'Prueba Tuberculina (Tuberculosis Bovina)',
    categoria: 'Bioseguridad',
    subcategoria: 'Diagnóstico enfermedades de control oficial',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 180,
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'Obligatoria en hatos de exportación y zonas certificadas. PPD bovina intradérmica.',
    notas: 'Notificable al ICA. Leer a las 72 horas. Veterinario oficial acreditado M. bovis.'
  },
  {
    id: 32,
    nombre: 'Prueba Rosa de Bengala (Brucela)',
    categoria: 'Bioseguridad',
    subcategoria: 'Diagnóstico enfermedades de control oficial',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 270,
    edad_maxima_dias: null,
    frecuencia_dias: 365,
    aplica_razas: 'todas',
    descripcion: 'Diagnóstico serológico de Brucelosis. Anual en hatos lecheros y certificados.',
    notas: 'ICA requiere resultados negativos para movilización. Muestras en laboratorio acreditado.'
  },
  {
    id: 33,
    nombre: 'Monitoreo Mastitis (CMT / Cultivo)',
    categoria: 'Bioseguridad',
    subcategoria: 'Sanidad de ubre',
    aplica_a_sexo: true, // hembras en lactación
    requiere_medicamento: false,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: 30,
    aplica_razas: 'leche',
    descripcion: 'CMT mensual. Conteo células somáticas. Meta: <200,000 cél/mL en tanque.',
    notas: 'Staphylococcus aureus es el principal agente en Colombia. Pre-ordeño: higiene estricta.'
  },
  {
    id: 34,
    nombre: 'Sellado de Pezones (Terapia de Vaca Seca)',
    categoria: 'Bioseguridad',
    subcategoria: 'Sanidad de ubre',
    aplica_a_sexo: true,
    requiere_medicamento: true,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'leche',
    descripcion: 'Al secar la vaca. Antibiótico intramamario de vaca seca + sellador externo.',
    notas: 'Reducción 50-70% de nuevas infecciones durante el período seco. Usar como rutina.'
  },

  // ══════════════════════════════════════════════════
  // PROCEDIMIENTOS QUIRÚRGICOS Y MANEJO
  // ══════════════════════════════════════════════════
  {
    id: 35,
    nombre: 'Descorne (Descornación)',
    categoria: 'Manejo Zootécnico',
    subcategoria: 'Procedimiento',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: 180,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Ideal antes de los 3 meses con pasta cáustica o hierro. Reduce lesiones en hato.',
    notas: 'Razas Brahman, Angus, Romosinuano son naturalmente astas. Hormonas sin cuernos.'
  },
  {
    id: 36,
    nombre: 'Castración (Machos no Reproductores)',
    categoria: 'Manejo Zootécnico',
    subcategoria: 'Procedimiento',
    aplica_a_sexo: true, // machos
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: 365,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Machos no seleccionados para reproducción. Ideal 3-6 meses. Burdizzo o escalpelo.',
    notas: 'Novillos castrados tienen mejor calidad de carne (marmoreo). Aplicar antibiótico post.'
  },
  {
    id: 37,
    nombre: 'Identificación / Marcación (Fierro, Caravanas)',
    categoria: 'Manejo Zootécnico',
    subcategoria: 'Trazabilidad',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 1,
    edad_maxima_dias: 90,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Caravanas auriculares, microchip, fierro o tatuaje. Sistema de trazabilidad ICA.',
    notas: 'Obligatorio para movilización. SINIGAN Colombia. Usar doble caravana (oficial + hato).'
  },
  {
    id: 38,
    nombre: 'Revisión y Arreglo de Pezuñas',
    categoria: 'Manejo Zootécnico',
    subcategoria: 'Podología',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 365,
    edad_maxima_dias: null,
    frecuencia_dias: 180,
    aplica_razas: 'todas',
    descripcion: 'Semestral o cuando requiera. Cojeras en Holstein hasta 30% del hato, Brahman <5%.',
    notas: 'Causa principal de descarte en hatos lecheros. Podódromo y cama de sulfato de cobre.'
  },
  {
    id: 39,
    nombre: 'Desinfección de Ombligo (Neonatos)',
    categoria: 'Manejo Zootécnico',
    subcategoria: 'Cuidado neonatal',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 0,
    edad_maxima_dias: 3,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Inmediato al nacimiento. Yodo al 7% o tintura de yodo. Previene onfalitis.',
    notas: 'Sumergir o pintar el ombligo 2-3 veces el primer día. Vital en terneros.'
  },
  {
    id: 40,
    nombre: 'Suministro Calostro (Terneros Neonatos)',
    categoria: 'Manejo Zootécnico',
    subcategoria: 'Cuidado neonatal',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 0,
    edad_maxima_dias: 1,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Primeras 6 horas. 2-4 litros. Inmunidad pasiva. Vital para supervivencia.',
    notas: 'Razas cebuínas: mayor facilidad de parto. Holstein: terneros más grandes, más riesgo.'
  },

  // ══════════════════════════════════════════════════
  // DIAGNÓSTICO Y TRATAMIENTOS CLÍNICOS
  // ══════════════════════════════════════════════════
  {
    id: 41,
    nombre: 'Tratamiento Neumonía / Enfermedades Respiratorias',
    categoria: 'Tratamiento',
    subcategoria: 'Enfermedades respiratorias',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 0,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'BRD (Bovine Respiratory Disease). Más frecuente en terneros y bovinos estresados.',
    notas: 'Pasteurella, Mannheimia, Mycoplasma. Antibióticos sistémicos. Vital diagnóstico temprano.'
  },
  {
    id: 42,
    nombre: 'Tratamiento Diarrea Neonatal (Colibacilosis)',
    categoria: 'Tratamiento',
    subcategoria: 'Enfermedades gastrointestinales',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 0,
    edad_maxima_dias: 30,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'E. coli, Salmonella, Coronavirus, Rotavirus. Rehidratación oral y antibioterapia.',
    notas: 'Principal causa de mortalidad en terneros. Colostro adecuado es la mejor prevención.'
  },
  {
    id: 43,
    nombre: 'Tratamiento Timpanismo (Meteorismo)',
    categoria: 'Tratamiento',
    subcategoria: 'Emergencias metabólicas',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 90,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Emergencia. Distensión ruminal. Pasturas de leguminosas, cambios bruscos de dieta.',
    notas: 'Simethicona, sonda ruminal, trocar. Evitar en leguminosas con rocío. Raza Holstein más susceptible.'
  },
  {
    id: 44,
    nombre: 'Tratamiento Mastitis (Clínica / Subclínica)',
    categoria: 'Tratamiento',
    subcategoria: 'Enfermedades de ubre',
    aplica_a_sexo: true, // hembras
    requiere_medicamento: true,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'leche',
    descripcion: 'Intramamaria + sistémica según gravedad. Cultivo antes de tratar si posible.',
    notas: 'Período de retiro en leche. Staphylococcus contagioso: segregar. Streptococcus: tratable.'
  },
  {
    id: 45,
    nombre: 'Tratamiento Queratoconjuntivitis (Mal de Ojo)',
    categoria: 'Tratamiento',
    subcategoria: 'Enfermedades oculares',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Moraxella bovis. Alta prevalencia en verano, polvo y moscas. Conjuntivitis infecciosa.',
    notas: 'Oxitetraciclina subconjuntival. Aislar animales afectados. Mayor incidencia Holstein.'
  },
  {
    id: 46,
    nombre: 'Tratamiento Anaplasmosis / Babesiosis (Tristeza Bovina)',
    categoria: 'Tratamiento',
    subcategoria: 'Hemoparásitos',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Transmitida por garrapatas. Tristeza bovina. Dipropionato de imidocarb, tetraciclinas.',
    notas: 'Alta prevalencia en regiones tropicales. Razas cebuínas: premunición natural. Razas europeas: mayor riesgo.'
  },
  {
    id: 47,
    nombre: 'Tratamiento Fiebre de Leche (Hipocalcemia)',
    categoria: 'Tratamiento',
    subcategoria: 'Enfermedades metabólicas',
    aplica_a_sexo: true, // hembras
    requiere_medicamento: true,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'leche',
    descripcion: 'Gluconato de calcio IV. Vacas recién paridas de alta producción. Emergencia.',
    notas: 'Común en Holstein y Jersey de alta producción. Síntomas: parálisis, frío, postración.'
  },
  {
    id: 48,
    nombre: 'Tratamiento Botulismo',
    categoria: 'Tratamiento',
    subcategoria: 'Intoxicaciones',
    aplica_a_sexo: false,
    requiere_medicamento: true,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: null,
    aplica_razas: 'todas',
    descripcion: 'Clostridium botulinum. Parálisis flácida por consumo de materia orgánica en descomposición.',
    notas: 'Alta mortalidad. Suero antibotulínico si disponible. Vacunación preventiva en zonas endémicas.'
  },

  // ══════════════════════════════════════════════════
  // INSPECCIÓN Y AUDITORÍA DE SALUD
  // ══════════════════════════════════════════════════
  {
    id: 49,
    nombre: 'Revisión General de Salud (Check-Up)',
    categoria: 'Inspección',
    subcategoria: 'Control periódico',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 0,
    edad_maxima_dias: null,
    frecuencia_dias: 90,
    aplica_razas: 'todas',
    descripcion: 'Examen clínico trimestral. Temperatura, FC, FR, mucosas, estado general.',
    notas: 'T° normal: 38-39.5°C. FC: 60-80/min. FR: 12-36/min. Registrar cualquier anomalía.'
  },
  {
    id: 50,
    nombre: 'Toma de Muestras de Sangre (Hemograma / Serología)',
    categoria: 'Inspección',
    subcategoria: 'Diagnóstico laboratorial',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 60,
    edad_maxima_dias: null,
    frecuencia_dias: 180,
    aplica_razas: 'todas',
    descripcion: 'Hemograma, bioquímica, serología brucelosis, IBR, DVB. Semestral o por indicación.',
    notas: 'Extraer de yugular. 5-10mL con y sin anticoagulante. Remitir en cadena de frío.'
  },
  {
    id: 51,
    nombre: 'Análisis Coprológico (Parásitos)',
    categoria: 'Inspección',
    subcategoria: 'Diagnóstico laboratorial',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: 30,
    edad_maxima_dias: null,
    frecuencia_dias: 90,
    aplica_razas: 'todas',
    descripcion: 'Conteo huevos por gramo (HPG). FAMACHA según anemia. Plan estratégico antiparasitario.',
    notas: 'Determinar carga parasitaria real. Evitar desparasitaciones innecesarias. Resistencia a antihelmínticos.'
  },
  {
    id: 52,
    nombre: 'Inspección Potreros y Bioseguridad',
    categoria: 'Bioseguridad',
    subcategoria: 'Control ambiental',
    aplica_a_sexo: false,
    requiere_medicamento: false,
    edad_minima_dias: null,
    edad_maxima_dias: null,
    frecuencia_dias: 30,
    aplica_razas: 'todas',
    descripcion: 'Revisión pasturas, agua, presencia de plantas tóxicas, cercas, comederos y bebederos.',
    notas: 'Plantas tóxicas en Colombia: Crotalaria, Solanum, Senecio. Agua limpia reduce carga de Leptospira.'
  }
]

// ══════════════════════════════════════════════════
// FUNCIONES DE UTILIDAD
// ══════════════════════════════════════════════════

export const getCategoriasControl = () => {
  return [...new Set(controlesSanitariosBase.map(c => c.categoria))]
}

export const getSubcategoriasControl = () => {
  return [...new Set(controlesSanitariosBase.map(c => c.subcategoria).filter(Boolean))]
}

export const getControlesPorCategoria = (categoria) => {
  return controlesSanitariosBase.filter(c => c.categoria === categoria)
}

// Filtra controles según el sexo del animal
export const getControlesParaAnimal = (animal) => {
  return controlesSanitariosBase.filter(control => {
    // Si aplica_a_sexo es true, verificar sexo
    if (control.aplica_a_sexo) {
      // Controles reproductivos para machos
      if (control.subcategoria === 'Examen andrológico' && animal.sexo !== 'macho') return false
      // Controles reproductivos para hembras
      if (['Protocolo reproductivo', 'Seguimiento postparto', 'Sanidad de ubre'].includes(control.subcategoria) && animal.sexo !== 'hembra') return false
      // Brucelosis solo para hembras jóvenes
      if (control.nombre.includes('Brucelosis') && animal.sexo !== 'hembra') return false
    }
    // Verificar edad si aplica
    if (control.edad_minima_dias !== null && animal.edad_dias < control.edad_minima_dias) return false
    if (control.edad_maxima_dias !== null && animal.edad_dias > control.edad_maxima_dias) return false
    return true
  })
}

// Calcula próximos controles según historial del animal
export const getProximosControles = (animal, historialControles = []) => {
  const controlesFiltrados = getControlesParaAnimal(animal)
  const hoy = new Date()

  return controlesFiltrados
    .filter(control => control.frecuencia_dias !== null)
    .map(control => {
      const ultimoControl = historialControles
        .filter(h => h.tipo_control?.nombre === control.nombre)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]

      let proxFecha = null
      let diasPendiente = null
      let urgente = false

      if (ultimoControl) {
        const ultimaFecha = new Date(ultimoControl.fecha)
        proxFecha = new Date(ultimaFecha)
        proxFecha.setDate(proxFecha.getDate() + control.frecuencia_dias)
        diasPendiente = Math.ceil((proxFecha - hoy) / (1000 * 60 * 60 * 24))
        urgente = diasPendiente <= 7
      } else {
        proxFecha = hoy
        diasPendiente = 0
        urgente = true // Nunca se ha aplicado
      }

      return {
        ...control,
        ultimoControl: ultimoControl ? new Date(ultimoControl.fecha) : null,
        proxFecha,
        diasPendiente,
        urgente,
        pendiente: diasPendiente <= 0
      }
    })
    .sort((a, b) => a.diasPendiente - b.diasPendiente)
}

// Colores por categoría para UI
export const getCategoriaColor = (categoria) => {
  const colores = {
    'Vacunación': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', hex: '#3B82F6' },
    'Control de parásitos': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', hex: '#F97316' },
    'Reproductivo': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', hex: '#EC4899' },
    'Nutrición': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', hex: '#22C55E' },
    'Seguimiento': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', hex: '#A855F7' },
    'Bioseguridad': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', hex: '#EF4444' },
    'Manejo Zootécnico': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', hex: '#EAB308' },
    'Tratamiento': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', hex: '#6366F1' },
    'Inspección': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', hex: '#14B8A6' },
  }
  return colores[categoria] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', hex: '#6B7280' }
}