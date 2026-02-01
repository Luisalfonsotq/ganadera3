// utils/controlesSanitarios.js

export const controlesSanitariosBase = [
  { id: 1, nombre: 'Vacunación Aftosa', categoria: 'Vacunación', aplica_a_sexo: false, requiere_medicamento: true },
  { id: 2, nombre: 'Vacunación Brucelosis', categoria: 'Vacunación', aplica_a_sexo: true, requiere_medicamento: true },
  { id: 3, nombre: 'Desparasitación Interna', categoria: 'Control de parásitos', aplica_a_sexo: false, requiere_medicamento: true },
  { id: 4, nombre: 'Control de Garrapatas', categoria: 'Control de parásitos', aplica_a_sexo: false, requiere_medicamento: true },
  { id: 5, nombre: 'Raspado Prepucial', categoria: 'Reproductivo', aplica_a_sexo: true, requiere_medicamento: false },
  { id: 6, nombre: 'Suplementación Mineral', categoria: 'Nutrición', aplica_a_sexo: false, requiere_medicamento: true },
  { id: 7, nombre: 'Pesaje de Control', categoria: 'Seguimiento', aplica_a_sexo: false, requiere_medicamento: false },
  { id: 8, nombre: 'Desinfección de Instalaciones', categoria: 'Bioseguridad', aplica_a_sexo: false, requiere_medicamento: true }
]

export const getCategoriasControl = () => {
  return [...new Set(controlesSanitariosBase.map(c => c.categoria))]
}