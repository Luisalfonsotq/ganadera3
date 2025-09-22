// utils/roleConfig.js
export const roleSidebarConfig = {
  Administrador: [
    { name: 'Dashboard', icon: 'i-tabler-home', path: '/dashboard' },
    { name: 'Gestionar Usuarios', icon: 'i-tabler-users', path: '/usuarios' },
    { name: 'Potreros Virtuales', icon: 'i-tabler-map', path: '/potreros' },
    { name: 'Asignar Tareas', icon: 'i-tabler-clipboard', path: '/tareas' },
  ],
  Veterinario: [
    { name: 'Dashboard', icon: 'i-tabler-home', path: '/dashboard' },
    { name: 'Controles Sanitarios', icon: 'i-tabler-shield-check', path: '/controles-sanitarios' },
    { name: 'Programar Eventos', icon: 'i-tabler-calendar', path: '/eventos' },
  ],
  Supervisor: [
    { name: 'Dashboard', icon: 'i-tabler-home', path: '/dashboard' },
    { name: 'Seguimiento Alertas', icon: 'i-tabler-bell', path: '/alertas' },
    { name: 'Actividades', icon: 'i-tabler-list', path: '/actividades' },
  ],
  Colaborador: [
    { name: 'Dashboard', icon: 'i-tabler-home', path: '/dashboard' },
    { name: 'Tareas Asignadas', icon: 'i-tabler-clipboard-check', path: '/tareas-asignadas' },
    { name: 'Checklists', icon: 'i-tabler-checklist', path: '/checklists' },
  ],
};