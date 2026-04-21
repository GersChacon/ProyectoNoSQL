$(document).ready(function () {
  $('.menu-link').on('click', function (e) {
    e.preventDefault();
    $('.menu-link').removeClass('active');
    $(this).addClass('active');
    loadModule($(this).data('module'));
  });

  loadModule('dashboard');
});

function showAlert(message, type = 'success') {
  $('#alerts').html(`
    <div class="alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString('es-CR');
}

function renderTable(columns, rows) {
  return `
    <div class="table-responsive table-wrap">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            ${columns.map(c => `<th>${c}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.join('') : `<tr><td colspan="${columns.length}"><div class="empty-state">No hay datos disponibles.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderModuleShell(title, subtitle, innerHtml) {
  $('#content').html(`
    <div class="module-card">
      <div class="mb-4">
        <h3 class="section-title mb-1">${title}</h3>
        <p class="section-subtitle mb-0">${subtitle}</p>
      </div>
      ${innerHtml}
    </div>
  `);
}

function loadModule(module) {
  switch (module) {
    case 'dashboard': renderDashboard(); break;
    case 'usuarios': renderUsuarios(); break;
    case 'roles': renderRoles(); break;
    case 'fincas': renderFincas(); break;
    case 'recolectores': renderRecolectores(); break;
    case 'asignaciones': renderAsignaciones(); break;
    case 'cortes': renderCortes(); break;
    case 'recolecciones': renderRecolecciones(); break;
    case 'precios': renderPrecios(); break;
    case 'pagos': renderPagos(); break;
    case 'notificaciones': renderNotificaciones(); break;
    case 'auditoria': renderAuditoria(); break;
    case 'reportes': renderReportes(); break;
    default:
      $('#content').html('<div class="surface">Módulo no encontrado.</div>');
  }
}

function renderDashboard() {
  $('#content').html(`
    <div class="row g-4 mb-4">
      <div class="col-md-3"><div class="stat-card"><div class="stat-title">Usuarios activos</div><div class="stat-value" id="dashUsuarios">0</div></div></div>
      <div class="col-md-3"><div class="stat-card"><div class="stat-title">Fincas activas</div><div class="stat-value" id="dashFincas">0</div></div></div>
      <div class="col-md-3"><div class="stat-card"><div class="stat-title">Recolectores activos</div><div class="stat-value" id="dashRecolectores">0</div></div></div>
      <div class="col-md-3"><div class="stat-card"><div class="stat-title">Pagos pendientes</div><div class="stat-value" id="dashPagos">0</div></div></div>
    </div>

    <div class="surface mb-4">
      <h3 class="section-title">Resumen general</h3>
      <p class="section-subtitle">Vista rápida del estado del sistema cafetalero.</p>
    </div>

    <div class="surface">
      <h5 class="mb-3">Producción</h5>
      <div id="dashboardProduccion">Cargando...</div>
    </div>
  `);

  $.get(API.usuariosActivos).done(data => $('#dashUsuarios').text(Array.isArray(data) ? data.length : 0)).fail(() => $('#dashUsuarios').text('0'));
  $.get(API.fincasActivas).done(data => $('#dashFincas').text(Array.isArray(data) ? data.length : 0)).fail(() => $('#dashFincas').text('0'));
  $.get(API.recolectoresActivos).done(data => $('#dashRecolectores').text(Array.isArray(data) ? data.length : 0)).fail(() => $('#dashRecolectores').text('0'));
  $.get(API.pagosPendientes).done(data => $('#dashPagos').text(Array.isArray(data) ? data.length : 0)).fail(() => $('#dashPagos').text('0'));

  $.get(API.resumenProduccion)
    .done(data => {
      $('#dashboardProduccion').html(`<pre class="report-box mb-0">${JSON.stringify(data, null, 2)}</pre>`);
    })
    .fail(() => {
      $('#dashboardProduccion').html('<div class="text-danger">No se pudo cargar el resumen.</div>');
    });
}

function renderUsuarios() {
  renderModuleShell('Usuarios activos', 'Muestra lo que sí existe en tu API.', '<div id="usuariosBox">Cargando...</div>');

  $.get(API.usuariosActivos)
    .done(data => {
      const rows = (data || []).map(u => `
        <tr>
          <td>${u.nombre || ''}</td>
          <td>${u.correo || ''}</td>
          <td>${u.rol_id || ''}</td>
          <td>${u.activo ? 'Sí' : 'No'}</td>
          <td>${formatDate(u.ultimo_acceso)}</td>
        </tr>
      `);
      $('#usuariosBox').html(renderTable(
        ['Nombre', 'Correo', 'Rol ID', 'Activo', 'Último acceso'],
        rows
      ));
    })
    .fail(() => $('#usuariosBox').html('<div class="text-danger">No se pudieron cargar los usuarios.</div>'));
}

function renderRoles() {
  renderModuleShell('Roles activos', 'Consulta de roles activos.', '<div id="rolesBox">Cargando...</div>');

  $.get(API.rolesActivos)
    .done(data => {
      const rows = (data || []).map(r => `
        <tr>
          <td>${r.nombre || ''}</td>
          <td>${r.descripcion || ''}</td>
          <td>${Array.isArray(r.permisos) ? r.permisos.join(', ') : ''}</td>
          <td>${r.activo ? 'Sí' : 'No'}</td>
        </tr>
      `);
      $('#rolesBox').html(renderTable(
        ['Nombre', 'Descripción', 'Permisos', 'Activo'],
        rows
      ));
    })
    .fail(() => $('#rolesBox').html('<div class="text-danger">No se pudieron cargar los roles.</div>'));
}

function renderFincas() {
  renderModuleShell('Fincas activas', 'Consulta de fincas activas.', '<div id="fincasBox">Cargando...</div>');

  $.get(API.fincasActivas)
    .done(data => {
      const rows = (data || []).map(f => `
        <tr>
          <td>${f.nombre || ''}</td>
          <td>${f.ubicacion?.provincia || ''}</td>
          <td>${f.ubicacion?.canton || ''}</td>
          <td>${f.tamano_hectareas ?? ''}</td>
          <td>${f.activa ? 'Sí' : 'No'}</td>
        </tr>
      `);
      $('#fincasBox').html(renderTable(
        ['Nombre', 'Provincia', 'Cantón', 'Hectáreas', 'Activa'],
        rows
      ));
    })
    .fail(() => $('#fincasBox').html('<div class="text-danger">No se pudieron cargar las fincas.</div>'));
}

function renderRecolectores() {
  renderModuleShell('Recolectores activos', 'Consulta de recolectores activos.', '<div id="recolectoresBox">Cargando...</div>');

  $.get(API.recolectoresActivos)
    .done(data => {
      const rows = (data || []).map(r => `
        <tr>
          <td>${r.identificacion || ''}</td>
          <td>${r.nombre || ''}</td>
          <td>${r.telefono || ''}</td>
          <td>${r.correo || ''}</td>
          <td>${r.activo ? 'Sí' : 'No'}</td>
        </tr>
      `);
      $('#recolectoresBox').html(renderTable(
        ['Identificación', 'Nombre', 'Teléfono', 'Correo', 'Activo'],
        rows
      ));
    })
    .fail(() => $('#recolectoresBox').html('<div class="text-danger">No se pudieron cargar los recolectores.</div>'));
}

function renderAsignaciones() {
  renderModuleShell('Asignaciones activas', 'Consulta de asignaciones activas.', '<div id="asignacionesBox">Cargando...</div>');

  $.get(API.asignacionesActivas)
    .done(data => {
      const rows = (data || []).map(a => `
        <tr>
          <td>${a.recolector_id || ''}</td>
          <td>${a.finca_id || ''}</td>
          <td>${a.corte_id || ''}</td>
          <td>${formatDate(a.fecha_inicio)}</td>
          <td>${a.activa ? 'Sí' : 'No'}</td>
        </tr>
      `);
      $('#asignacionesBox').html(renderTable(
        ['Recolector ID', 'Finca ID', 'Corte ID', 'Fecha inicio', 'Activa'],
        rows
      ));
    })
    .fail(() => $('#asignacionesBox').html('<div class="text-danger">No se pudieron cargar las asignaciones.</div>'));
}

function renderCortes() {
  renderModuleShell('Cortes activos', 'Consulta de cortes activos.', '<div id="cortesBox">Cargando...</div>');

  $.get(API.cortesActivos)
    .done(data => {
      const rows = (data || []).map(c => `
        <tr>
          <td>${c.nombre || ''}</td>
          <td>${c.finca_id || ''}</td>
          <td>${formatDate(c.fecha_inicio)}</td>
          <td>${formatDate(c.fecha_fin)}</td>
          <td>${c.estado || ''}</td>
        </tr>
      `);
      $('#cortesBox').html(renderTable(
        ['Nombre', 'Finca ID', 'Inicio', 'Fin', 'Estado'],
        rows
      ));
    })
    .fail(() => $('#cortesBox').html('<div class="text-danger">No se pudieron cargar los cortes.</div>'));
}

function renderRecolecciones() {
  renderModuleShell('Recolecciones no pagadas', 'Consulta de recolecciones pendientes.', '<div id="recoleccionesBox">Cargando...</div>');

  $.get(API.recoleccionesNoPagadas)
    .done(data => {
      const rows = (data || []).map(r => `
        <tr>
          <td>${formatDate(r.fecha)}</td>
          <td>${r.recolector?.nombre || ''}</td>
          <td>${r.finca?.nombre || ''}</td>
          <td>${r.cantidad_cajuelas ?? 0}</td>
          <td>${r.pago_total ?? 0}</td>
        </tr>
      `);
      $('#recoleccionesBox').html(renderTable(
        ['Fecha', 'Recolector', 'Finca', 'Cajuelas', 'Pago total'],
        rows
      ));
    })
    .fail(() => $('#recoleccionesBox').html('<div class="text-danger">No se pudieron cargar las recolecciones.</div>'));
}

function renderPrecios() {
  renderModuleShell('Precio vigente', 'Consulta del precio activo.', '<div id="preciosBox">Cargando...</div>');

  $.get(API.precioVigente)
    .done(data => {
      const one = Array.isArray(data) ? data[0] : data;
      if (!one) {
        $('#preciosBox').html('<div class="empty-state">No hay precio vigente.</div>');
        return;
      }

      $('#preciosBox').html(renderTable(
        ['Valor cajuela', 'Valor cuartillo', 'Moneda', 'Vigente desde', 'Activo'],
        [`
          <tr>
            <td>${one.valor_cajuela ?? ''}</td>
            <td>${one.valor_cuartillo ?? ''}</td>
            <td>${one.moneda || ''}</td>
            <td>${formatDate(one.vigente_desde)}</td>
            <td>${one.activo ? 'Sí' : 'No'}</td>
          </tr>
        `]
      ));
    })
    .fail(() => $('#preciosBox').html('<div class="text-danger">No se pudo cargar el precio vigente.</div>'));
}

function renderPagos() {
  renderModuleShell('Pagos pendientes', 'Consulta de pagos en estado pendiente.', '<div id="pagosBox">Cargando...</div>');

  $.get(API.pagosPendientes)
    .done(data => {
      const rows = (data || []).map(p => `
        <tr>
          <td>${p.recolector_id || ''}</td>
          <td>${p.finca_id || ''}</td>
          <td>${p.corte_id || ''}</td>
          <td>${p.monto_total ?? 0}</td>
          <td>${p.estado || ''}</td>
        </tr>
      `);
      $('#pagosBox').html(renderTable(
        ['Recolector ID', 'Finca ID', 'Corte ID', 'Monto total', 'Estado'],
        rows
      ));
    })
    .fail(() => $('#pagosBox').html('<div class="text-danger">No se pudieron cargar los pagos.</div>'));
}

function renderNotificaciones() {
  renderModuleShell('Resumen de notificaciones', 'Consulta agrupada por tipo.', '<div id="notificacionesBox">Cargando...</div>');

  $.get(API.resumenNotificaciones)
    .done(data => {
      $('#notificacionesBox').html(`<pre class="report-box mb-0">${JSON.stringify(data, null, 2)}</pre>`);
    })
    .fail(() => $('#notificacionesBox').html('<div class="text-danger">No se pudieron cargar las notificaciones.</div>'));
}

function renderAuditoria() {
  renderModuleShell('Auditoría reciente', 'Últimos movimientos registrados.', '<div id="auditoriaBox">Cargando...</div>');

  $.get(API.auditoriaReciente)
    .done(data => {
      const rows = (data || []).map(a => `
        <tr>
          <td>${a.nombre_usuario || ''}</td>
          <td>${a.accion || ''}</td>
          <td>${a.coleccion_afectada || ''}</td>
          <td>${formatDate(a.timestamp)}</td>
        </tr>
      `);
      $('#auditoriaBox').html(renderTable(
        ['Usuario', 'Acción', 'Colección', 'Fecha'],
        rows
      ));
    })
    .fail(() => $('#auditoriaBox').html('<div class="text-danger">No se pudo cargar la auditoría.</div>'));
}

function renderReportes() {
  renderModuleShell('Reportes', 'Resumen de producción desde el endpoint real.', '<div id="reportesBox">Cargando...</div>');

  $.get(API.resumenProduccion)
    .done(data => {
      $('#reportesBox').html(`<pre class="report-box mb-0">${JSON.stringify(data, null, 2)}</pre>`);
    })
    .fail(() => $('#reportesBox').html('<div class="text-danger">No se pudo cargar el reporte.</div>'));
}