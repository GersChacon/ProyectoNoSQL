const API_BASE = 'http://localhost:5000/api';

const API = {
  usuariosActivos: `${API_BASE}/usuarios/activos`,
  rolesActivos: `${API_BASE}/roles/activos`,
  fincasActivas: `${API_BASE}/fincas/activas`,
  recolectoresActivos: `${API_BASE}/recolectores/activos`,
  asignacionesActivas: `${API_BASE}/asignaciones/activas`,
  cortesActivos: `${API_BASE}/cortes/activos`,
  recoleccionesNoPagadas: `${API_BASE}/recolecciones/no-pagadas`,
  precioVigente: `${API_BASE}/precios/vigente`,
  pagosPendientes: `${API_BASE}/pagos/pendientes`,
  resumenNotificaciones: `${API_BASE}/notificaciones/resumen-tipo`,
  auditoriaReciente: `${API_BASE}/auditoria/reciente/20`,
  resumenProduccion: `${API_BASE}/reportes/resumen-produccion`,

  usuarios: `${API_BASE}/usuarios`,
  roles: `${API_BASE}/roles`,
  fincas: `${API_BASE}/fincas`,
  recolectores: `${API_BASE}/recolectores`,
  asignaciones: `${API_BASE}/asignaciones`,
  cortes: `${API_BASE}/cortes`,
  recolecciones: `${API_BASE}/recolecciones`,
  precios: `${API_BASE}/precios`,
  pagos: `${API_BASE}/pagos`,
  notificaciones: `${API_BASE}/notificaciones`,
  auditoria: `${API_BASE}/auditoria`,
  reportes: `${API_BASE}/reportes`
};