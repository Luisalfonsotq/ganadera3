import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useControlSanitario } from './useControlSanitario'
import { useAnimal } from './useAnimal'
import { useFinca } from './useFinca'

export const useNotifications = () => {
  const { user } = useAuth()
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const { getProximasVacunaciones } = useControlSanitario()
  const { getAlertasSanitarias, getProximosPartos } = useAnimal()
  const { getAllFincas } = useFinca()

  const fetchNotifications = async () => {
    if (!user.value) return

    loading.value = true
    error.value = null
    notifications.value = []

    try {
      if (user.value.rol === 'Veterinario') {
        // Veterinario: Próximas vacunaciones
        const { data } = await getProximasVacunaciones(7) // Próximos 7 días
        if (data.value && Array.isArray(data.value)) {
           notifications.value = data.value.map(v => ({
             title: 'Vacunación Próxima',
             message: `Vacuna ${v.nombre_vacuna} para ${v.animal_nombre} (ID: ${v.animal_identificador})`,
             type: 'warning',
             time: new Date(v.fecha_programada).toLocaleDateString()
           }))
        }
      } else if (user.value.rol === 'Colaborador') {
         // Colaborador: Alertas sanitarias (animales enfermos)
         // Primero obtenemos las fincas del colaborador
         const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol)
         if (fincasData.value && Array.isArray(fincasData.value)) {
            for (const finca of fincasData.value) {
               const { data: alertas } = await getAlertasSanitarias(finca.id)
               if (alertas.value && Array.isArray(alertas.value)) {
                  alertas.value.forEach(a => {
                    notifications.value.push({
                      title: 'Alerta Sanitaria',
                      message: `Animal ${a.nombre} (${a.identificador}) en ${finca.nombre}: ${a.estado_salud}`,
                      type: 'urgent',
                      time: 'Ahora'
                    })
                  })
               }
            }
         }
      } else if (user.value.rol === 'Supervisor') {
        // Supervisor: Alertas sanitarias y Próximos partos
        const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol)
        if (fincasData.value && Array.isArray(fincasData.value)) {
           for (const finca of fincasData.value) {
              // Alertas Sanitarias
              const { data: alertas } = await getAlertasSanitarias(finca.id)
              if (alertas.value && Array.isArray(alertas.value)) {
                 alertas.value.forEach(a => {
                   notifications.value.push({
                     title: 'Alerta Sanitaria',
                     message: `Animal ${a.nombre} (${a.identificador}) en ${finca.nombre}: ${a.estado_salud}`,
                     type: 'urgent',
                     time: 'Ahora'
                   })
                 })
              }
              // Próximos Partos
              const { data: partos } = await getProximosPartos(15, finca.id) // Próximos 15 días
              if (partos.value && Array.isArray(partos.value)) {
                partos.value.forEach(p => {
                  notifications.value.push({
                    title: 'Próximo Parto',
                    message: `Animal ${p.nombre} (${p.identificador}) en ${finca.nombre} espera cría pronto.`,
                    type: 'info',
                    time: new Date(p.fecha_estimada_parto).toLocaleDateString()
                  })
                })
              }
           }
        }
      } else if (user.value.rol === 'Administrador') {
        // Administrador: Ver todo (por ahora similar a Supervisor pero global si es posible, o iterando fincas)
        // Asumimos que admin puede ver todas las fincas o tiene un endpoint global
        // Por simplicidad, usaremos getAlertasSanitarias sin fincaId si el backend lo soporta, o iteramos fincas del admin
        const { data: fincasData } = await getAllFincas(user.value.id, user.value.rol)
        if (fincasData.value && Array.isArray(fincasData.value)) {
           for (const finca of fincasData.value) {
              const { data: alertas } = await getAlertasSanitarias(finca.id)
              if (alertas.value && Array.isArray(alertas.value)) {
                 alertas.value.forEach(a => {
                   notifications.value.push({
                     title: 'Alerta Sanitaria',
                     message: `Animal ${a.nombre} (${a.identificador}) en ${finca.nombre}: ${a.estado_salud}`,
                     type: 'urgent',
                     time: 'Ahora'
                   })
                 })
              }
           }
        }
      }
      
      // Si no hay notificaciones, agregar una por defecto o dejar vacío
      if (notifications.value.length === 0) {
        // notifications.value.push({
        //   title: 'Sin novedades',
        //   message: 'No tienes notificaciones pendientes.',
        //   type: 'info',
        //   time: 'Ahora'
        // })
      }

    } catch (e) {
      console.error('Error fetching notifications:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    loading,
    error,
    fetchNotifications
  }
}
