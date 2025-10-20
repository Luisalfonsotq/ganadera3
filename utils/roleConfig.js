// utils/roleConfig.js

// Configuración de navegación del sidebar por rol
export const roleSidebarConfig = {
  Administrador: [
    {
      name: 'Dashboard',
      icon: 'i-heroicons-home',
      path: '/dashboard',
      key: 'dashboard'
    },
    {
      name: 'Ganado',
      icon: 'i-heroicons-shield-check',
      path: '/ganado',
      key: 'cattle',
      subItems: [
        { name: 'Listado de Animales', path: '/animales', key: 'animal-list' },
        { name: 'Listado de Proveedores', path: '/proveedores', key: 'proveedores-list' },
        { name: 'Control Sanitario', path: '/ganado/sanitario', key: 'sanitary-control' },
        { name: 'Eventos', path: '/eventos-animal', key: 'events' },
        { name: 'Reproducción', path: '/reproducciones', key: 'reproduction' },
      ]
    },
    {
      name: 'Fincas',
      icon: 'i-heroicons-building-office',
      path: '/fincas',
      key: 'farms',
      subItems: [
        { name: 'Mis Fincas', path: '/fincas', key: 'my-farms' },
        { name: 'Gestionar Finca Actual', path: '/fincas/gestionar', key: 'manage-current-farm' },
        { name: 'Potreros', path: '/potreros', key: 'paddocks' },
      ]
    },
    {
      name: 'Usuarios',
      icon: 'i-heroicons-users',
      path: '/usuarios',
      key: 'users',
      subItems: [
        { name: 'Gestionar Usuarios', path: '/usuarios', key: 'manage-users' },
        { name: 'Roles y Permisos', path: '/usuarios/roles', key: 'roles-permissions' },
        { name: 'Asignar Tareas', path: '/usuarios/tareas', key: 'assign-tasks' },
      ]
    },
    {
      name: 'Reportes',
      icon: 'i-heroicons-chart-bar',
      path: '/reportes',
      key: 'reports',
      subItems: [
        { name: 'Rendimiento', path: '/reportes/rendimiento', key: 'performance-reports' },
        { name: 'Salud', path: '/reportes/salud', key: 'health-reports' },
        { name: 'Financieros', path: '/reportes/financieros', key: 'financial-reports' },
        { name: 'Inventario', path: '/reportes/inventario', key: 'inventory-reports' },
      ]
    },
    {
      name: 'Configuración',
      icon: 'i-heroicons-cog-6-tooth',
      path: '/configuracion',
      key: 'settings',
      subItems: [
        { name: 'Ajustes de la Aplicación', path: '/configuracion/app', key: 'app-settings' },
        { name: 'Configuración de Finca', path: '/configuracion/finca', key: 'farm-settings' },
        { name: 'Respaldos', path: '/configuracion/respaldos', key: 'backups' },
      ]
    },
    {
      name: 'Ayuda',
      icon: 'i-heroicons-question-mark-circle',
      path: '/ayuda',
      key: 'help',
      subItems: [
        { name: 'Guía de Usuario', path: '/ayuda/guia', key: 'user-guide' },
        { name: 'Preguntas Frecuentes', path: '/ayuda/faq', key: 'faq' },
        { name: 'Soporte Técnico', path: '/ayuda/soporte', key: 'technical-support' },
      ]
    },
  ],
  
  Veterinario: [
    {
      name: 'Dashboard',
      icon: 'i-heroicons-home',
      path: '/dashboard',
      key: 'dashboard'
    },
    {
      name: 'Control Sanitario',
      icon: 'i-heroicons-shield-check',
      path: '/sanitario',
      key: 'sanitary',
      subItems: [
        { name: 'Historial Médico', path: '/sanitario/historial', key: 'medical-history' },
        { name: 'Vacunaciones', path: '/sanitario/vacunas', key: 'vaccinations' },
        { name: 'Tratamientos', path: '/sanitario/tratamientos', key: 'treatments' },
        { name: 'Diagnósticos', path: '/sanitario/diagnosticos', key: 'diagnostics' },
      ]
    },
    {
      name: 'Eventos Médicos',
      icon: 'i-heroicons-calendar',
      path: '/eventos',
      key: 'medical-events',
      subItems: [
        { name: 'Programar Consultas', path: '/eventos/consultas', key: 'schedule-consultations' },
        { name: 'Chequeos Rutinarios', path: '/eventos/chequeos', key: 'routine-checkups' },
        { name: 'Emergencias', path: '/eventos/emergencias', key: 'emergencies' },
      ]
    },
    {
      name: 'Reportes Médicos',
      icon: 'i-heroicons-document-text',
      path: '/reportes-medicos',
      key: 'medical-reports',
      subItems: [
        { name: 'Estado de Salud', path: '/reportes-medicos/salud', key: 'health-status' },
        { name: 'Medicamentos', path: '/reportes-medicos/medicamentos', key: 'medications' },
        { name: 'Estadísticas', path: '/reportes-medicos/estadisticas', key: 'medical-statistics' },
      ]
    },
    {
      name: 'Ayuda',
      icon: 'i-heroicons-question-mark-circle',
      path: '/ayuda',
      key: 'help',
      subItems: [
        { name: 'Protocolos Médicos', path: '/ayuda/protocolos', key: 'medical-protocols' },
        { name: 'Guía Veterinaria', path: '/ayuda/guia-vet', key: 'vet-guide' },
      ]
    },
  ],
  
  Supervisor: [
    {
      name: 'Dashboard',
      icon: 'i-heroicons-home',
      path: '/dashboard',
      key: 'dashboard'
    },
    {
      name: 'Supervisión',
      icon: 'i-heroicons-eye',
      path: '/supervision',
      key: 'supervision',
      subItems: [
        { name: 'Actividades Diarias', path: '/supervision/actividades', key: 'daily-activities' },
        { name: 'Control de Tareas', path: '/supervision/tareas', key: 'task-control' },
        { name: 'Monitoreo de Personal', path: '/supervision/personal', key: 'staff-monitoring' },
      ]
    },
    {
      name: 'Alertas',
      icon: 'i-heroicons-bell',
      path: '/alertas',
      key: 'alerts',
      subItems: [
        { name: 'Alertas Activas', path: '/alertas/activas', key: 'active-alerts' },
        { name: 'Historial de Alertas', path: '/alertas/historial', key: 'alert-history' },
        { name: 'Configurar Alertas', path: '/alertas/configurar', key: 'configure-alerts' },
      ]
    },
    {
      name: 'Reportes',
      icon: 'i-heroicons-chart-bar',
      path: '/reportes',
      key: 'reports',
      subItems: [
        { name: 'Productividad', path: '/reportes/productividad', key: 'productivity-reports' },
        { name: 'Cumplimiento', path: '/reportes/cumplimiento', key: 'compliance-reports' },
      ]
    },
    {
      name: 'Ayuda',
      icon: 'i-heroicons-question-mark-circle',
      path: '/ayuda',
      key: 'help',
      subItems: [
        { name: 'Manual de Supervisión', path: '/ayuda/manual', key: 'supervision-manual' },
      ]
    },
  ],
  
  Colaborador: [
    {
      name: 'Dashboard',
      icon: 'i-heroicons-home',
      path: '/dashboard',
      key: 'dashboard'
    },
    {
      name: 'Mis Tareas',
      icon: 'i-heroicons-clipboard-document-check',
      path: '/tareas',
      key: 'my-tasks',
      subItems: [
        { name: 'Tareas Pendientes', path: '/tareas/pendientes', key: 'pending-tasks' },
        { name: 'Tareas Completadas', path: '/tareas/completadas', key: 'completed-tasks' },
        { name: 'Historial', path: '/tareas/historial', key: 'task-history' },
      ]
    },
    {
      name: 'Checklists',
      icon: 'i-heroicons-check-circle',
      path: '/checklists',
      key: 'checklists',
      subItems: [
        { name: 'Rutinas Diarias', path: '/checklists/diarias', key: 'daily-routines' },
        { name: 'Mantenimiento', path: '/checklists/mantenimiento', key: 'maintenance' },
      ]
    },
    {
      name: 'Reportar',
      icon: 'i-heroicons-exclamation-triangle',
      path: '/reportar',
      key: 'report',
      subItems: [
        { name: 'Incidencias', path: '/reportar/incidencias', key: 'report-incidents' },
        { name: 'Observaciones', path: '/reportar/observaciones', key: 'observations' },
      ]
    },
    {
      name: 'Ayuda',
      icon: 'i-heroicons-question-mark-circle',
      path: '/ayuda',
      key: 'help',
      subItems: [
        { name: 'Guía de Tareas', path: '/ayuda/tareas', key: 'task-guide' },
      ]
    },
  ],
};

// Configuración del botón crear por rol
export const btnCrear = {
  Administrador: [
    { name: 'Crear Nueva Finca', icon: 'i-heroicons-building-office', path: '/fincas/crear' },
    { name: 'Registrar Nuevo Animal', icon: 'i-heroicons-plus-circle', path: '/animales/crear' },
    { name: 'Crear Usuario', icon: 'i-heroicons-user-plus', path: '/usuarios/crear' },
    { name: 'Crear Potrero', icon: 'i-heroicons-map', path: '/potreros/crear' },
    { name: 'Asignar Tarea', icon: 'i-heroicons-clipboard-document', path: '/tareas/crear' },
    { name: 'Programar Evento', icon: 'i-heroicons-calendar-days', path: '/eventos/crear' },
  ],
  
  Veterinario: [
    { name: 'Registrar Consulta', icon: 'i-heroicons-clipboard-document-list', path: '/consultas/crear' },
    { name: 'Programar Vacunación', icon: 'i-heroicons-beaker', path: '/vacunas/programar' },
    { name: 'Crear Tratamiento', icon: 'i-heroicons-heart', path: '/tratamientos/crear' },
    { name: 'Registrar Diagnóstico', icon: 'i-heroicons-document-text', path: '/diagnosticos/crear' },
    { name: 'Programar Chequeo', icon: 'i-heroicons-calendar', path: '/chequeos/programar' },
  ],
  
  Supervisor: [
    { name: 'Crear Alerta', icon: 'i-heroicons-bell', path: '/alertas/crear' },
    { name: 'Asignar Actividad', icon: 'i-heroicons-list-bullet', path: '/actividades/crear' },
    { name: 'Generar Reporte', icon: 'i-heroicons-document-chart-bar', path: '/reportes/generar' },
    { name: 'Programar Supervisión', icon: 'i-heroicons-eye', path: '/supervision/programar' },
  ],
  
  Colaborador: [
    { name: 'Reportar Incidencia', icon: 'i-heroicons-exclamation-triangle', path: '/incidencias/crear' },
    { name: 'Registrar Observación', icon: 'i-heroicons-chat-bubble-left-right', path: '/observaciones/crear' },
    { name: 'Solicitar Ayuda', icon: 'i-heroicons-hand-raised', path: '/ayuda/solicitar' },
  ],
};

// Configuración de notificaciones por rol
export const roleNotifications = {
  Administrador: [
    {
      title: 'Usuarios pendientes de aprobación',
      message: '3 solicitudes de registro esperan aprobación.',
      type: 'warning',
      time: '2 min'
    },
    {
      title: 'Reporte mensual disponible',
      message: 'El reporte de productividad de julio está listo.',
      type: 'info',
      time: '1 hora'
    },
    {
      title: 'Mantenimiento programado',
      message: 'Actualización del sistema programada para mañana.',
      type: 'info',
      time: '3 horas'
    },
  ],
  
  Veterinario: [
    {
      title: 'Vacunación pendiente',
      message: 'Animales #123, #124, #125 necesitan vacuna contra la fiebre aftosa.',
      type: 'urgent',
      time: '30 min'
    },
    {
      title: 'Chequeo veterinario programado',
      message: 'Revisión programada para mañana a las 9:00 AM.',
      type: 'info',
      time: '2 horas'
    },
    {
      title: 'Resultado de laboratorio',
      message: 'Análisis de sangre del animal #089 disponible.',
      type: 'info',
      time: '4 horas'
    },
  ],
  
  Supervisor: [
    {
      title: 'Tarea vencida',
      message: 'La tarea de limpieza del potrero 3 está vencida.',
      type: 'urgent',
      time: '15 min'
    },
    {
      title: 'Personal ausente',
      message: 'Juan Pérez no ha marcado entrada hoy.',
      type: 'warning',
      time: '1 hora'
    },
    {
      title: 'Reporte de actividades',
      message: 'Resumen diario de actividades disponible.',
      type: 'info',
      time: '2 horas'
    },
  ],
  
  Colaborador: [
    {
      title: 'Nueva tarea asignada',
      message: 'Se te ha asignado la limpieza del potrero 5.',
      type: 'info',
      time: '10 min'
    },
    {
      title: 'Recordatorio de checklist',
      message: 'No olvides completar el checklist matutino.',
      type: 'warning',
      time: '30 min'
    },
    {
      title: 'Capacitación programada',
      message: 'Sesión de capacitación mañana a las 2:00 PM.',
      type: 'info',
      time: '1 día'
    },
  ],
};

// Configuración de cards del dashboard por rol
export const roleDashboardCards = {
  Administrador: [
    {
      title: 'Resumen de Ganado',
      icon: 'i-heroicons-shield-check',
      iconColor: 'text-green-700',
      bgColor: 'bg-green-100',
      metrics: [
        { label: 'Total Animales', value: '150' },
        { label: 'Pendientes de Vacunar', value: '10', class: 'text-red-500 font-bold' },
        { label: 'Nacimientos Recientes', value: '3 (último mes)' },
      ],
      buttonText: 'Ver Ganado',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      path: '/ganado'
    },
    {
      title: 'Gestión de Usuarios',
      icon: 'i-heroicons-users',
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      metrics: [
        { label: 'Usuarios Activos', value: '12' },
        { label: 'Pendientes Aprobación', value: '3', class: 'text-orange-500 font-bold' },
        { label: 'Roles Configurados', value: '4' },
      ],
      buttonText: 'Gestionar Usuarios',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      path: '/usuarios'
    },
    {
      title: 'Estado de Fincas',
      icon: 'i-heroicons-building-office',
      iconColor: 'text-purple-700',
      bgColor: 'bg-purple-100',
      metrics: [
        { label: 'Fincas Registradas', value: '3' },
        { label: 'Potreros Activos', value: '15' },
        { label: 'Hectáreas Totales', value: '250 ha' },
      ],
      buttonText: 'Ver Fincas',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      path: '/fincas'
    },
    {
      title: 'Reportes del Sistema',
      icon: 'i-heroicons-chart-bar',
      iconColor: 'text-indigo-700',
      bgColor: 'bg-indigo-100',
      metrics: [
        { label: 'Reportes Generados', value: '25 (este mes)' },
        { label: 'Productividad', value: '+15%', class: 'text-green-500 font-bold' },
        { label: 'Eficiencia', value: '92%' },
      ],
      buttonText: 'Ver Reportes',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      path: '/reportes'
    },
  ],
  
  Veterinario: [
    {
      title: 'Control Sanitario',
      icon: 'i-heroicons-shield-check',
      iconColor: 'text-green-700',
      bgColor: 'bg-green-100',
      metrics: [
        { label: 'Animales Bajo Tratamiento', value: '5' },
        { label: 'Vacunaciones Pendientes', value: '12', class: 'text-red-500 font-bold' },
        { label: 'Chequeos Programados', value: '8' },
      ],
      buttonText: 'Ver Control Sanitario',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      path: '/sanitario'
    },
    {
      title: 'Próximos Eventos',
      icon: 'i-heroicons-calendar',
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      metrics: [
        { label: 'Consultas Hoy', value: '3' },
        { label: 'Vacunaciones Mañana', value: '15' },
        { label: 'Emergencias Activas', value: '1', class: 'text-red-500 font-bold' },
      ],
      buttonText: 'Ver Calendario',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      path: '/eventos'
    },
  ],
  
  Supervisor: [
    {
      title: 'Supervisión Diaria',
      icon: 'i-heroicons-eye',
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      metrics: [
        { label: 'Tareas Completadas', value: '18/25' },
        { label: 'Personal Activo', value: '8/10' },
        { label: 'Alertas Pendientes', value: '3', class: 'text-orange-500 font-bold' },
      ],
      buttonText: 'Ver Supervisión',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      path: '/supervision'
    },
    {
      title: 'Alertas del Sistema',
      icon: 'i-heroicons-bell',
      iconColor: 'text-red-700',
      bgColor: 'bg-red-100',
      metrics: [
        { label: 'Alertas Críticas', value: '2', class: 'text-red-500 font-bold' },
        { label: 'Alertas Menores', value: '5' },
        { label: 'Resueltas Hoy', value: '12' },
      ],
      buttonText: 'Gestionar Alertas',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      path: '/alertas'
    },
  ],
  
  Colaborador: [
    {
      title: 'Mis Tareas',
      icon: 'i-heroicons-clipboard-document-check',
      iconColor: 'text-green-700',
      bgColor: 'bg-green-100',
      metrics: [
        { label: 'Tareas Pendientes', value: '5' },
        { label: 'Completadas Hoy', value: '3' },
        { label: 'Vencidas', value: '1', class: 'text-red-500 font-bold' },
      ],
      buttonText: 'Ver Mis Tareas',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      path: '/tareas'
    },
    {
      title: 'Checklists',
      icon: 'i-heroicons-check-circle',
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      metrics: [
        { label: 'Rutinas Completadas', value: '2/3' },
        { label: 'Pendientes', value: '1' },
        { label: 'Próxima Rutina', value: 'En 2 horas' },
      ],
      buttonText: 'Ver Checklists',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      path: '/checklists'
    },
  ],
};
