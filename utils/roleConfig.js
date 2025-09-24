// utils/roleConfig.js
export const roleSidebarConfig = {
  Administrador: [
    { name: 'Dashboard', icon: 'heroicons-home', path: '/dashboard' },
    { name: 'Gestionar Usuarios', icon: 'heroicons-users', path: '/usuarios' },
    { name: 'Potreros Virtuales', icon: 'heroicons-map', path: '/potreros' },
    { name: 'Asignar Tareas', icon: 'heroicons-clipboard-document-check', path: '/tareas' },
  ],
  Veterinario: [
    { name: 'Dashboard', icon: 'heroicons-home', path: '/dashboard' },
    { name: 'Controles Sanitarios', icon: 'heroicons-shield-check', path: '/controles-sanitarios' },
    { name: 'Programar Eventos', icon: 'heroicons-calendar', path: '/eventos' },
  ],
  Supervisor: [
    { name: 'Dashboard', icon: 'heroicons-home', path: '/dashboard' },
    { name: 'Seguimiento Alertas', icon: 'heroicons-bell', path: '/alertas' },
    { name: 'Actividades', icon: 'heroicons-list-bullet', path: '/actividades' },
  ],
  Colaborador: [
    { name: 'Dashboard', icon: 'heroicons-home', path: '/dashboard' },
    { name: 'Tareas Asignadas', icon: 'heroicons-clipboard-document-check', path: '/tareas-asignadas' },
    { name: 'Checklists', icon: 'heroicons-check-circle', path: '/checklists' },
  ],
};


export const btnCrear = {
  Administrador: [
    { name: 'Gestionar Finca', icon: 'i-heroicons-home', path: 'fincas' },
    { name: 'Gestionar Usuarios', icon: 'i-heroicons-user-group', path: '/usuarios' },
    { name: 'Gestionar Potreros', icon: 'i-heroicons-map', path: '/potreros' },
    { name: 'Asignar Tareas', icon: 'i-heroicons-clipboard-document', path: '/tareas' },
  ],
  Veterinario: [
    { name: 'Dashboard', icon: 'i-heroicons-home', path: '/dashboard' },
    { name: 'Controles Sanitarios', icon: 'i-heroicons-shield-check', path: '/controles-sanitarios' },
    { name: 'Programar Eventos', icon: 'i-heroicons-calendar', path: '/eventos' },
  ],
  Supervisor: [
    { name: 'Dashboard', icon: 'i-heroicons-home', path: '/dashboard' },
    { name: 'Seguimiento Alertas', icon: 'i-heroicons-bell', path: '/alertas' },
    { name: 'Gestionar Actividades', icon: 'i-heroicons-list-bullet', path: '/actividades' },
  ],
  Colaborador: [
    { name: 'Dashboard', icon: 'i-heroicons-home', path: '/dashboard' },
    { name: 'Tareas Asignadas', icon: 'i-heroicons-clipboard-document-check', path: '/tareas-asignadas' },
    { name: 'Checklists', icon: 'i-heroicons-check-circle', path: '/checklists' },
  ],
};
