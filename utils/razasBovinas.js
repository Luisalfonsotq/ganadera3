// utils/razasBovinas.js

export const razasBovinas = [
  // Razas cebuínas (carne)
  { value: 'brahman', label: 'Brahman', tipo: 'carne' },
  { value: 'cebu', label: 'Cebú', tipo: 'carne' },
  { value: 'gyr', label: 'Gyr', tipo: 'carne' },
  { value: 'guzerat', label: 'Guzerá', tipo: 'carne' },
  { value: 'nelore', label: 'Nelore', tipo: 'carne' },
  { value: 'indubrasil', label: 'Indubrasil', tipo: 'carne' },
  
  // Razas europeas (carne)
  { value: 'angus', label: 'Angus', tipo: 'carne' },
  { value: 'hereford', label: 'Hereford', tipo: 'carne' },
  { value: 'charolais', label: 'Charolais', tipo: 'carne' },
  { value: 'limousin', label: 'Limousin', tipo: 'carne' },
  { value: 'simmental', label: 'Simmental', tipo: 'doble_proposito' },
  { value: 'brangus', label: 'Brangus', tipo: 'carne' },
  { value: 'braford', label: 'Braford', tipo: 'carne' },
  
  // Razas lecheras
  { value: 'holstein', label: 'Holstein', tipo: 'leche' },
  { value: 'jersey', label: 'Jersey', tipo: 'leche' },
  { value: 'pardo_suizo', label: 'Pardo Suizo', tipo: 'leche' },
  { value: 'ayrshire', label: 'Ayrshire', tipo: 'leche' },
  { value: 'guernsey', label: 'Guernsey', tipo: 'leche' },
  
  // Razas doble propósito
  { value: 'normando', label: 'Normando', tipo: 'doble_proposito' },
  { value: 'bon', label: 'BON (Blanco Orejinegro)', tipo: 'doble_proposito' },
  { value: 'lucerna', label: 'Lucerna', tipo: 'doble_proposito' },
  { value: 'hartون', label: 'Hartón del Valle', tipo: 'doble_proposito' },
  { value: 'romosinuano', label: 'Romosinuano', tipo: 'carne' },
  { value: 'sanmartinero', label: 'Sanmartinero', tipo: 'doble_proposito' },
  { value: 'costeño_con_cuernos', label: 'Costeño con Cuernos', tipo: 'doble_proposito' },
  { value: 'caqueteño', label: 'Caqueteño', tipo: 'doble_proposito' },
  { value: 'chino_santandereano', label: 'Chino Santandereano', tipo: 'doble_proposito' },
  
  // Razas criollas colombianas
  { value: 'casanareño', label: 'Casanareño', tipo: 'carne' },
  { value: 'criolla', label: 'Criolla Colombiana', tipo: 'doble_proposito' },
  
  // Opción para otra raza
  { value: 'otra', label: 'Otra raza (especificar)', tipo: 'otro' }
]

export const getTipoRaza = (razaValue) => {
  const raza = razasBovinas.find(r => r.value === razaValue)
  return raza?.tipo || 'desconocido'
}

export const getRazaLabel = (razaValue) => {
  const raza = razasBovinas.find(r => r.value === razaValue)
  return raza?.label || razaValue
}