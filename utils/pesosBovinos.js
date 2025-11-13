// utils/pesosBovinos.js

// Pesos promedio en kg por raza, sexo y etapa de vida
// Basado en estándares ganaderos de Colombia

export const pesosPorRaza = {
  // Razas cebuínas - Carne
  brahman: {
    macho: {
      ternero: { min: 80, ideal: 120, max: 160 },
      novillo: { min: 250, ideal: 350, max: 450 },
      adulto: { min: 600, ideal: 800, max: 1000 },
      adulto_mayor: { min: 550, ideal: 750, max: 950 }
    },
    hembra: {
      ternera: { min: 70, ideal: 110, max: 150 },
      novilla: { min: 220, ideal: 320, max: 420 },
      adulta: { min: 450, ideal: 600, max: 750 },
      adulto_mayor: { min: 400, ideal: 550, max: 700 }
    }
  },
  
  cebu: {
    macho: {
      ternero: { min: 75, ideal: 115, max: 155 },
      novillo: { min: 240, ideal: 340, max: 440 },
      adulto: { min: 580, ideal: 780, max: 980 },
      adulto_mayor: { min: 530, ideal: 730, max: 930 }
    },
    hembra: {
      ternera: { min: 65, ideal: 105, max: 145 },
      novilla: { min: 210, ideal: 310, max: 410 },
      adulta: { min: 430, ideal: 580, max: 730 },
      adulto_mayor: { min: 380, ideal: 530, max: 680 }
    }
  },

  // Razas europeas - Carne
  angus: {
    macho: {
      ternero: { min: 90, ideal: 130, max: 170 },
      novillo: { min: 280, ideal: 380, max: 480 },
      adulto: { min: 700, ideal: 900, max: 1100 },
      adulto_mayor: { min: 650, ideal: 850, max: 1050 }
    },
    hembra: {
      ternera: { min: 80, ideal: 120, max: 160 },
      novilla: { min: 250, ideal: 350, max: 450 },
      adulta: { min: 500, ideal: 650, max: 800 },
      adulto_mayor: { min: 450, ideal: 600, max: 750 }
    }
  },

  // Razas lecheras
  holstein: {
    macho: {
      ternero: { min: 85, ideal: 125, max: 165 },
      novillo: { min: 270, ideal: 370, max: 470 },
      adulto: { min: 800, ideal: 1000, max: 1200 },
      adulto_mayor: { min: 750, ideal: 950, max: 1150 }
    },
    hembra: {
      ternera: { min: 75, ideal: 115, max: 155 },
      novilla: { min: 240, ideal: 340, max: 440 },
      adulta: { min: 550, ideal: 700, max: 850 },
      adulto_mayor: { min: 500, ideal: 650, max: 800 }
    }
  },

  jersey: {
    macho: {
      ternero: { min: 60, ideal: 90, max: 120 },
      novillo: { min: 180, ideal: 250, max: 320 },
      adulto: { min: 500, ideal: 650, max: 800 },
      adulto_mayor: { min: 450, ideal: 600, max: 750 }
    },
    hembra: {
      ternera: { min: 50, ideal: 80, max: 110 },
      novilla: { min: 160, ideal: 220, max: 280 },
      adulta: { min: 350, ideal: 450, max: 550 },
      adulto_mayor: { min: 320, ideal: 420, max: 520 }
    }
  },

  normando: {
    macho: {
      ternero: { min: 85, ideal: 125, max: 165 },
      novillo: { min: 270, ideal: 370, max: 470 },
      adulto: { min: 750, ideal: 950, max: 1150 },
      adulto_mayor: { min: 700, ideal: 900, max: 1100 }
    },
    hembra: {
      ternera: { min: 75, ideal: 115, max: 155 },
      novilla: { min: 240, ideal: 340, max: 440 },
      adulta: { min: 550, ideal: 700, max: 850 },
      adulto_mayor: { min: 500, ideal: 650, max: 800 }
    }
  },

  // Razas criollas colombianas
  bon: {
    macho: {
      ternero: { min: 70, ideal: 100, max: 130 },
      novillo: { min: 220, ideal: 300, max: 380 },
      adulto: { min: 500, ideal: 650, max: 800 },
      adulto_mayor: { min: 450, ideal: 600, max: 750 }
    },
    hembra: {
      ternera: { min: 60, ideal: 90, max: 120 },
      novilla: { min: 190, ideal: 270, max: 350 },
      adulta: { min: 380, ideal: 500, max: 620 },
      adulto_mayor: { min: 350, ideal: 470, max: 590 }
    }
  },

  romosinuano: {
    macho: {
      ternero: { min: 75, ideal: 110, max: 145 },
      novillo: { min: 230, ideal: 320, max: 410 },
      adulto: { min: 550, ideal: 700, max: 850 },
      adulto_mayor: { min: 500, ideal: 650, max: 800 }
    },
    hembra: {
      ternera: { min: 65, ideal: 100, max: 135 },
      novilla: { min: 200, ideal: 290, max: 380 },
      adulta: { min: 400, ideal: 530, max: 660 },
      adulto_mayor: { min: 370, ideal: 500, max: 630 }
    }
  }
}

// Pesos genéricos para razas no especificadas
export const pesosGenericos = {
  carne: {
    macho: {
      ternero: { min: 80, ideal: 120, max: 160 },
      novillo: { min: 250, ideal: 350, max: 450 },
      adulto: { min: 650, ideal: 850, max: 1050 },
      adulto_mayor: { min: 600, ideal: 800, max: 1000 }
    },
    hembra: {
      ternera: { min: 70, ideal: 110, max: 150 },
      novilla: { min: 220, ideal: 320, max: 420 },
      adulta: { min: 450, ideal: 600, max: 750 },
      adulto_mayor: { min: 400, ideal: 550, max: 700 }
    }
  },
  leche: {
    macho: {
      ternero: { min: 80, ideal: 120, max: 160 },
      novillo: { min: 260, ideal: 360, max: 460 },
      adulto: { min: 750, ideal: 950, max: 1150 },
      adulto_mayor: { min: 700, ideal: 900, max: 1100 }
    },
    hembra: {
      ternera: { min: 70, ideal: 110, max: 150 },
      novilla: { min: 230, ideal: 330, max: 430 },
      adulta: { min: 500, ideal: 650, max: 800 },
      adulto_mayor: { min: 450, ideal: 600, max: 750 }
    }
  },
  doble_proposito: {
    macho: {
      ternero: { min: 80, ideal: 120, max: 160 },
      novillo: { min: 250, ideal: 350, max: 450 },
      adulto: { min: 700, ideal: 900, max: 1100 },
      adulto_mayor: { min: 650, ideal: 850, max: 1050 }
    },
    hembra: {
      ternera: { min: 70, ideal: 110, max: 150 },
      novilla: { min: 220, ideal: 320, max: 420 },
      adulta: { min: 475, ideal: 625, max: 775 },
      adulto_mayor: { min: 425, ideal: 575, max: 725 }
    }
  }
}

/**
 * Calcula el estado del peso de un animal
 * @param {number} pesoActual - Peso actual del animal en kg
 * @param {string} raza - Raza del animal
 * @param {string} sexo - Sexo del animal (macho/hembra)
 * @param {string} etapaVida - Etapa de vida del animal
 * @param {string} tipoRaza - Tipo de raza (carne/leche/doble_proposito)
 * @returns {Object} Estado del peso con categoría y porcentaje
 */
export const calcularEstadoPeso = (pesoActual, raza, sexo, etapaVida, tipoRaza) => {
  if (!pesoActual || !sexo || !etapaVida) {
    return { estado: 'sin_datos', porcentaje: 0, mensaje: 'Datos insuficientes para calcular' }
  }

  // Normalizar etapa de vida
  let etapaNormalizada = etapaVida
  if (etapaVida === 'ternero' || etapaVida === 'ternera') {
    etapaNormalizada = sexo === 'macho' ? 'ternero' : 'ternera'
  } else if (etapaVida === 'novillo' || etapaVida === 'novilla') {
    etapaNormalizada = sexo === 'macho' ? 'novillo' : 'novilla'
  } else if (etapaVida === 'adulto' || etapaVida === 'adulta') {
    etapaNormalizada = sexo === 'macho' ? 'adulto' : 'adulta'
  }

  // Buscar pesos de referencia
  let rangoPeso
  if (pesosPorRaza[raza] && pesosPorRaza[raza][sexo] && pesosPorRaza[raza][sexo][etapaNormalizada]) {
    rangoPeso = pesosPorRaza[raza][sexo][etapaNormalizada]
  } else if (tipoRaza && pesosGenericos[tipoRaza] && pesosGenericos[tipoRaza][sexo]) {
    rangoPeso = pesosGenericos[tipoRaza][sexo][etapaNormalizada]
  } else {
    return { estado: 'sin_referencia', porcentaje: 0, mensaje: 'No hay referencia de peso para esta combinación' }
  }

  const { min, ideal, max } = rangoPeso
  const porcentajeIdeal = ((pesoActual / ideal) * 100).toFixed(1)

  let estado, mensaje, color

  if (pesoActual < min) {
    estado = 'bajo_peso'
    mensaje = `Bajo peso (${porcentajeIdeal}% del ideal)`
    color = 'red'
  } else if (pesoActual >= min && pesoActual < ideal * 0.9) {
    estado = 'peso_moderado_bajo'
    mensaje = `Peso moderadamente bajo (${porcentajeIdeal}% del ideal)`
    color = 'orange'
  } else if (pesoActual >= ideal * 0.9 && pesoActual <= ideal * 1.1) {
    estado = 'peso_ideal'
    mensaje = `Peso ideal (${porcentajeIdeal}% del ideal)`
    color = 'green'
  } else if (pesoActual > ideal * 1.1 && pesoActual <= max) {
    estado = 'peso_moderado_alto'
    mensaje = `Peso moderadamente alto (${porcentajeIdeal}% del ideal)`
    color = 'orange'
  } else {
    estado = 'sobrepeso'
    mensaje = `Sobrepeso (${porcentajeIdeal}% del ideal)`
    color = 'red'
  }

  return {
    estado,
    porcentaje: parseFloat(porcentajeIdeal),
    mensaje,
    color,
    rangoReferencia: `${min}-${max} kg`,
    pesoIdeal: `${ideal} kg`
  }
}