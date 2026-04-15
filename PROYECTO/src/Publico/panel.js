const API = 'http://localhost:5000/api';
let currentView = 'dashboard';
let editingRecolectorId = null;
let editingFincaId = null;

$(document).ready(function () {
  loadDashboard();
});

function setActiveButton(buttonEl) {
  $('.nav-btn').removeClass('active');
  if (buttonEl) $(buttonEl).addClass('active');
}

function setHeader(title, subtitle, sectionTitle) {
  $('#pageTitle').text(title);
  $('#pageSubtitle').text(subtitle);
  $('#sectionTitle').text(sectionTitle);
}

function showMessage(message) {
  $('#alerts').html(`<div class="alert-box">${message}</div>`);
  setTimeout(() => $('#alerts').html(''), 3000);
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString('es-CR');
}

function renderTable(headers, rowsHtml) {
  if (!rowsHtml.length) {
    return `<div class="empty-box">No hay datos disponibles.</div>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rowsHtml.join('')}
        </tbody>
      </table>
    </div>
  `;
}

function reloadCurrentView() {
  switch (currentView) {
    case 'dashboard': loadDashboard(); break;
    case 'recolectores': loadRecolectores(); break;
    case 'fincas': loadFincas(); break;
    case 'pagos': loadPagos(); break;
    case 'reportes': loadReportes(); break;
  }
}

function loadStats() {
  $.get(`${API}/recolectores/activos`)
    .done(data => $('#statRecolectores').text(Array.isArray(data) ? data.length : 0))
    .fail(() => $('#statRecolectores').text('0'));

  $.get(`${API}/fincas/activas`)
    .done(data => $('#statFincas').text(Array.isArray(data) ? data.length : 0))
    .fail(() => $('#statFincas').text('0'));

  $.get(`${API}/pagos/pendientes`)
    .done(data => $('#statPagos').text(Array.isArray(data) ? data.length : 0))
    .fail(() => $('#statPagos').text('0'));

  $.get(`${API}/precios/vigente`)
    .done(data => {
      const precio = Array.isArray(data) ? data[0] : data;
      $('#statPrecio').text(precio?.valor_cajuela ?? '--');
    })
    .fail(() => $('#statPrecio').text('--'));
}

function loadDashboard(buttonEl = null) {
  currentView = 'dashboard';
  setActiveButton(buttonEl || $('.nav-btn').get(0));
  setHeader('Dashboard general', 'Resumen visual del sistema conectado a tu API.', 'Vista principal');

  loadStats();

  $('#data').html(`<div class="loading-box">Cargando resumen...</div>`);

  $.get(`${API}/reportes/resumen-produccion`)
    .done(data => {
      $('#data').html(`
        <div class="empty-box" style="margin-bottom:16px;">
          Este dashboard está conectado al backend real y mostrando el resumen de producción.
        </div>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `);
    })
    .fail(() => {
      $('#data').html(`<div class="empty-box">No se pudo cargar el resumen de producción.</div>`);
      showMessage('No se pudo consultar el dashboard.');
    });
}

function loadRecolectores(buttonEl = null) {
  currentView = 'recolectores';
  editingRecolectorId = null;
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Recolectores', 'CRUD real conectado a tu API.', 'Gestión de recolectores');

  $('#data').html(`
    <div class="form-box">
      <h3 style="margin-bottom:14px;color:#5a3825;">${editingRecolectorId ? 'Editar recolector' : 'Nuevo recolector'}</h3>
      <form id="recolectorForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Identificación</label>
            <input type="text" id="recolectorIdentificacion" required>
          </div>
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" id="recolectorNombre" required>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" id="recolectorTelefono">
          </div>
          <div class="form-group">
            <label>Correo</label>
            <input type="email" id="recolectorCorreo">
          </div>
          <div class="form-group">
            <label>Fecha de nacimiento</label>
            <input type="date" id="recolectorFechaNacimiento">
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-coffee">Guardar recolector</button>
          <button type="button" class="btn-soft" onclick="resetRecolectorForm()">Limpiar</button>
        </div>
      </form>
    </div>

    <div id="recolectoresTabla"><div class="loading-box">Cargando recolectores...</div></div>
  `);

  $('#recolectorForm').on('submit', saveRecolector);
  fetchRecolectores();
}

function fetchRecolectores() {
  $.get(`${API}/recolectores/activos`)
    .done(data => {
      console.log('Recolectores activos:', data);

      const rows = (data || []).map(r => `
        <tr>
          <td>${r.identificacion || ''}</td>
          <td>${r.nombre || ''}</td>
          <td>${r.telefono || ''}</td>
          <td>${r.correo || ''}</td>
          <td>${r.activo ? 'Sí' : 'No'}</td>
          <td class="row-actions">
            <button class="action-btn btn-edit" onclick="editRecolector('${r._id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteRecolector('${r._id}')">Eliminar</button>
          </td>
        </tr>
      `);

      $('#recolectoresTabla').html(renderTable(
        ['Identificación', 'Nombre', 'Teléfono', 'Correo', 'Activo', 'Acciones'],
        rows
      ));
    })
    .fail((xhr) => {
      console.error('Error cargando recolectores:', xhr.status, xhr.responseText);
      $('#recolectoresTabla').html(`<div class="empty-box">No se pudieron cargar los recolectores.</div>`);
      showMessage('Error consultando recolectores.');
    });
}

function saveRecolector(e) {
  e.preventDefault();

  const payload = {
    identificacion: $('#recolectorIdentificacion').val().trim(),
    nombre: $('#recolectorNombre').val().trim(),
    telefono: $('#recolectorTelefono').val().trim(),
    correo: $('#recolectorCorreo').val().trim(),
    fecha_nacimiento: $('#recolectorFechaNacimiento').val() || null,
    activo: true
  };

  const method = editingRecolectorId ? 'PUT' : 'POST';
  const url = editingRecolectorId
    ? `${API}/recolectores/${editingRecolectorId}`
    : `${API}/recolectores`;

  $.ajax({
    url,
    method,
    contentType: 'application/json',
    data: JSON.stringify(payload)
  })
    .done(() => {
      showMessage(editingRecolectorId
        ? 'Recolector actualizado correctamente.'
        : 'Recolector creado correctamente.');

      resetRecolectorForm();
      fetchRecolectores();
      loadStats();
    })
    .fail((xhr) => {
      console.error('Error guardando recolector:', xhr.status, xhr.responseText);
      showMessage('No se pudo guardar el recolector.');
    });
}

function editRecolector(id) {
  $.get(`${API}/recolectores/${id}`)
    .done(r => {
      editingRecolectorId = id;
      $('#recolectorIdentificacion').val(r.identificacion || '');
      $('#recolectorNombre').val(r.nombre || '');
      $('#recolectorTelefono').val(r.telefono || '');
      $('#recolectorCorreo').val(r.correo || '');
      $('#recolectorFechaNacimiento').val(
        r.fecha_nacimiento ? String(r.fecha_nacimiento).slice(0, 10) : ''
      );
      showMessage('Recolector cargado para edición.');
    })
    .fail((xhr) => {
      console.error('Error cargando recolector:', xhr.status, xhr.responseText);
      showMessage('No se pudo cargar el recolector.');
    });
}

function deleteRecolector(id) {
  if (!id) {
    showMessage('No se encontró el ID del recolector.');
    return;
  }

  if (!confirm('¿Deseás eliminar este recolector?')) return;

  $.ajax({
    url: `${API}/recolectores/${id}`,
    method: 'DELETE'
  })
    .done((response) => {
      console.log('Recolector eliminado:', response);
      showMessage('Recolector eliminado correctamente.');
      fetchRecolectores();
      loadStats();
    })
    .fail((xhr) => {
      console.error('Error eliminando recolector:', xhr.status, xhr.responseText);
      showMessage('No se pudo eliminar el recolector.');
    });
}

function resetRecolectorForm() {
  editingRecolectorId = null;
  $('#recolectorForm')[0].reset();
}

function fetchRecolectores() {
  $.get(`${API}/recolectores/activos`)
    .done(data => {
      const rows = (data || []).map(r => `
        <tr>
          <td>${r.identificacion || ''}</td>
          <td>${r.nombre || ''}</td>
          <td>${r.telefono || ''}</td>
          <td>${r.correo || ''}</td>
          <td>${r.activo ? 'Sí' : 'No'}</td>
          <td class="row-actions">
            <button class="action-btn btn-edit" onclick="editRecolector('${r._id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteRecolector('${r._id}')">Eliminar</button>
          </td>
        </tr>
      `);

      $('#recolectoresTabla').html(renderTable(
        ['Identificación', 'Nombre', 'Teléfono', 'Correo', 'Activo', 'Acciones'],
        rows
      ));
    })
    .fail(() => {
      $('#recolectoresTabla').html(`<div class="empty-box">No se pudieron cargar los recolectores.</div>`);
      showMessage('Error consultando recolectores.');
    });
}

function saveRecolector(e) {
  e.preventDefault();

  const payload = {
    identificacion: $('#recolectorIdentificacion').val().trim(),
    nombre: $('#recolectorNombre').val().trim(),
    telefono: $('#recolectorTelefono').val().trim(),
    correo: $('#recolectorCorreo').val().trim(),
    fecha_nacimiento: $('#recolectorFechaNacimiento').val() || null,
    activo: true
  };

  const method = editingRecolectorId ? 'PUT' : 'POST';
  const url = editingRecolectorId
    ? `${API}/recolectores/${editingRecolectorId}`
    : `${API}/recolectores`;

  $.ajax({
    url,
    method,
    contentType: 'application/json',
    data: JSON.stringify(payload)
  })
    .done(() => {
      showMessage(editingRecolectorId ? 'Recolector actualizado correctamente.' : 'Recolector creado correctamente.');
      resetRecolectorForm();
      fetchRecolectores();
      loadStats();
    })
    .fail(xhr => {
      console.error(xhr.responseText);
      showMessage('No se pudo guardar el recolector.');
    });
}

function editRecolector(id) {
  $.get(`${API}/recolectores/${id}`)
    .done(r => {
      editingRecolectorId = id;
      $('#recolectorIdentificacion').val(r.identificacion || '');
      $('#recolectorNombre').val(r.nombre || '');
      $('#recolectorTelefono').val(r.telefono || '');
      $('#recolectorCorreo').val(r.correo || '');
      $('#recolectorFechaNacimiento').val(r.fecha_nacimiento ? String(r.fecha_nacimiento).slice(0, 10) : '');
      showMessage('Recolector cargado para edición.');
    })
    .fail(() => showMessage('No se pudo cargar el recolector.'));
}

function deleteRecolector(id) {
  if (!confirm('¿Deseás eliminar este recolector?')) return;

  $.ajax({
    url: `${API}/recolectores/${id}`,
    method: 'DELETE'
  })
    .done(() => {
      showMessage('Recolector eliminado correctamente.');
      fetchRecolectores();
      loadStats();
    })
    .fail(() => showMessage('No se pudo eliminar el recolector.'));
}

function resetRecolectorForm() {
  editingRecolectorId = null;
  $('#recolectorForm')[0].reset();
}

function loadFincas(buttonEl = null) {
  currentView = 'fincas';
  editingFincaId = null;
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Fincas', 'CRUD real conectado a tu API.', 'Gestión de fincas');

  $('#data').html(`
    <div class="form-box">
      <h3 style="margin-bottom:14px;color:#5a3825;">Nueva finca</h3>
      <form id="fincaForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" id="fincaNombre" required>
          </div>
          <div class="form-group">
            <label>Provincia</label>
            <input type="text" id="fincaProvincia">
          </div>
          <div class="form-group">
            <label>Cantón</label>
            <input type="text" id="fincaCanton">
          </div>
          <div class="form-group">
            <label>Tamaño en hectáreas</label>
            <input type="number" id="fincaHectareas" step="0.01">
          </div>
          <div class="form-group">
            <label>Propietario</label>
            <input type="text" id="fincaPropietarioNombre">
          </div>
          <div class="form-group">
            <label>Teléfono propietario</label>
            <input type="text" id="fincaPropietarioTelefono">
          </div>
          <div class="form-group">
            <label>Correo propietario</label>
            <input type="email" id="fincaPropietarioCorreo">
          </div>
          <div class="form-group">
            <label>Variedades de café (separadas por coma)</label>
            <input type="text" id="fincaVariedades" placeholder="Caturra, Catuaí">
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-coffee">Guardar finca</button>
          <button type="button" class="btn-soft" onclick="resetFincaForm()">Limpiar</button>
        </div>
      </form>
    </div>

    <div id="fincasTabla"><div class="loading-box">Cargando fincas...</div></div>
  `);

  $('#fincaForm').on('submit', saveFinca);
  fetchFincas();
}

function fetchFincas() {
  $.get(`${API}/fincas/activas`)
    .done(data => {
      console.log('Fincas activas:', data);

      const rows = (data || []).map(f => `
        <tr>
          <td>${f.nombre || ''}</td>
          <td>${f.ubicacion?.provincia || ''}</td>
          <td>${f.ubicacion?.canton || ''}</td>
          <td>${f.tamano_hectareas ?? ''}</td>
          <td>${f.propietario?.nombre || ''}</td>
          <td>${f.activa ? 'Sí' : 'No'}</td>
          <td class="row-actions">
            <button class="action-btn btn-edit" onclick="editFinca('${f._id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteFinca('${f._id}')">Eliminar</button>
          </td>
        </tr>
      `);

      $('#fincasTabla').html(renderTable(
        ['Nombre', 'Provincia', 'Cantón', 'Hectáreas', 'Propietario', 'Activa', 'Acciones'],
        rows
      ));
    })
    .fail((xhr) => {
      console.error('Error cargando fincas:', xhr.status, xhr.responseText);
      $('#fincasTabla').html(`<div class="empty-box">No se pudieron cargar las fincas.</div>`);
      showMessage('Error consultando fincas.');
    });
}

function saveFinca(e) {
  e.preventDefault();

  const variedades = $('#fincaVariedades').val().trim();

  const payload = {
    nombre: $('#fincaNombre').val().trim(),
    ubicacion: {
      provincia: $('#fincaProvincia').val().trim(),
      canton: $('#fincaCanton').val().trim()
    },
    tamano_hectareas: Number($('#fincaHectareas').val()) || 0,
    propietario: {
      nombre: $('#fincaPropietarioNombre').val().trim(),
      telefono: $('#fincaPropietarioTelefono').val().trim(),
      correo: $('#fincaPropietarioCorreo').val().trim()
    },
    activa: true,
    variedades_cafe: variedades
      ? variedades.split(',').map(v => v.trim()).filter(Boolean)
      : []
  };

  const method = editingFincaId ? 'PUT' : 'POST';
  const url = editingFincaId
    ? `${API}/fincas/${editingFincaId}`
    : `${API}/fincas`;

  $.ajax({
    url,
    method,
    contentType: 'application/json',
    data: JSON.stringify(payload)
  })
    .done(() => {
      showMessage(editingFincaId
        ? 'Finca actualizada correctamente.'
        : 'Finca creada correctamente.');

      resetFincaForm();
      fetchFincas();
      loadStats();
    })
    .fail((xhr) => {
      console.error('Error guardando finca:', xhr.status, xhr.responseText);
      showMessage('No se pudo guardar la finca.');
    });
}

function editFinca(id) {
  if (!id) {
    showMessage('No se encontró el ID de la finca.');
    return;
  }

  $.get(`${API}/fincas/${id}`)
    .done(f => {
      editingFincaId = id;
      $('#fincaNombre').val(f.nombre || '');
      $('#fincaProvincia').val(f.ubicacion?.provincia || '');
      $('#fincaCanton').val(f.ubicacion?.canton || '');
      $('#fincaHectareas').val(f.tamano_hectareas ?? '');
      $('#fincaPropietarioNombre').val(f.propietario?.nombre || '');
      $('#fincaPropietarioTelefono').val(f.propietario?.telefono || '');
      $('#fincaPropietarioCorreo').val(f.propietario?.correo || '');
      $('#fincaVariedades').val(Array.isArray(f.variedades_cafe) ? f.variedades_cafe.join(', ') : '');
      showMessage('Finca cargada para edición.');
    })
    .fail((xhr) => {
      console.error('Error cargando finca:', xhr.status, xhr.responseText);
      showMessage('No se pudo cargar la finca.');
    });
}

function deleteFinca(id) {
  if (!id) {
    showMessage('No se encontró el ID de la finca.');
    return;
  }

  if (!confirm('¿Deseás eliminar esta finca?')) return;

  $.ajax({
    url: `${API}/fincas/${id}`,
    method: 'DELETE'
  })
    .done((response) => {
      console.log('Finca eliminada:', response);
      showMessage('Finca eliminada correctamente.');
      fetchFincas();
      loadStats();
    })
    .fail((xhr) => {
      console.error('Error eliminando finca:', xhr.status, xhr.responseText);
      showMessage('No se pudo eliminar la finca.');
    });
}

function resetFincaForm() {
  editingFincaId = null;
  $('#fincaForm')[0].reset();
}

function fetchFincas() {
  $.get(`${API}/fincas/activas`)
    .done(data => {
      const rows = (data || []).map(f => `
        <tr>
          <td>${f.nombre || ''}</td>
          <td>${f.ubicacion?.provincia || ''}</td>
          <td>${f.ubicacion?.canton || ''}</td>
          <td>${f.tamano_hectareas ?? ''}</td>
          <td>${f.propietario?.nombre || ''}</td>
          <td>${f.activa ? 'Sí' : 'No'}</td>
          <td class="row-actions">
            <button class="action-btn btn-edit" onclick="editFinca('${f._id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteFinca('${f._id}')">Eliminar</button>
          </td>
        </tr>
      `);

      $('#fincasTabla').html(renderTable(
        ['Nombre', 'Provincia', 'Cantón', 'Hectáreas', 'Propietario', 'Activa', 'Acciones'],
        rows
      ));
    })
    .fail(() => {
      $('#fincasTabla').html(`<div class="empty-box">No se pudieron cargar las fincas.</div>`);
      showMessage('Error consultando fincas.');
    });
}

function saveFinca(e) {
  e.preventDefault();

  const variedades = $('#fincaVariedades').val().trim();
  const payload = {
    nombre: $('#fincaNombre').val().trim(),
    ubicacion: {
      provincia: $('#fincaProvincia').val().trim(),
      canton: $('#fincaCanton').val().trim()
    },
    tamano_hectareas: Number($('#fincaHectareas').val()) || 0,
    propietario: {
      nombre: $('#fincaPropietarioNombre').val().trim(),
      telefono: $('#fincaPropietarioTelefono').val().trim(),
      correo: $('#fincaPropietarioCorreo').val().trim()
    },
    activa: true,
    variedades_cafe: variedades ? variedades.split(',').map(v => v.trim()).filter(Boolean) : []
  };

  const method = editingFincaId ? 'PUT' : 'POST';
  const url = editingFincaId
    ? `${API}/fincas/${editingFincaId}`
    : `${API}/fincas`;

  $.ajax({
    url,
    method,
    contentType: 'application/json',
    data: JSON.stringify(payload)
  })
    .done(() => {
      showMessage(editingFincaId ? 'Finca actualizada correctamente.' : 'Finca creada correctamente.');
      resetFincaForm();
      fetchFincas();
      loadStats();
    })
    .fail(xhr => {
      console.error(xhr.responseText);
      showMessage('No se pudo guardar la finca.');
    });
}

function editFinca(id) {
  $.get(`${API}/fincas/${id}`)
    .done(f => {
      editingFincaId = id;
      $('#fincaNombre').val(f.nombre || '');
      $('#fincaProvincia').val(f.ubicacion?.provincia || '');
      $('#fincaCanton').val(f.ubicacion?.canton || '');
      $('#fincaHectareas').val(f.tamano_hectareas ?? '');
      $('#fincaPropietarioNombre').val(f.propietario?.nombre || '');
      $('#fincaPropietarioTelefono').val(f.propietario?.telefono || '');
      $('#fincaPropietarioCorreo').val(f.propietario?.correo || '');
      $('#fincaVariedades').val(Array.isArray(f.variedades_cafe) ? f.variedades_cafe.join(', ') : '');
      showMessage('Finca cargada para edición.');
    })
    .fail(() => showMessage('No se pudo cargar la finca.'));
}

function deleteFinca(id) {
  if (!confirm('¿Deseás eliminar esta finca?')) return;

  $.ajax({
    url: `${API}/fincas/${id}`,
    method: 'DELETE'
  })
    .done(() => {
      showMessage('Finca eliminada correctamente.');
      fetchFincas();
      loadStats();
    })
    .fail(() => showMessage('No se pudo eliminar la finca.'));
}

function resetFincaForm() {
  editingFincaId = null;
  $('#fincaForm')[0].reset();
}

function loadPagos(buttonEl = null) {
  currentView = 'pagos';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Pagos pendientes', 'Consulta de pagos desde el backend.', 'Listado de pagos');

  $('#data').html(`<div class="loading-box">Cargando pagos...</div>`);

  $.get(`${API}/pagos/pendientes`)
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

      $('#data').html(renderTable(
        ['Recolector ID', 'Finca ID', 'Corte ID', 'Monto total', 'Estado'],
        rows
      ));
    })
    .fail(() => {
      $('#data').html(`<div class="empty-box">No se pudieron cargar los pagos.</div>`);
      showMessage('Error consultando pagos.');
    });
}

function loadReportes(buttonEl = null) {
  currentView = 'reportes';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Reportes', 'Resumen de producción cargado desde el backend.', 'Reporte general');

  $('#data').html(`<div class="loading-box">Cargando reportes...</div>`);

  $.get(`${API}/reportes/resumen-produccion`)
    .done(data => {
      $('#data').html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
    })
    .fail(() => {
      $('#data').html(`<div class="empty-box">No se pudo cargar el reporte.</div>`);
      showMessage('Error consultando reportes.');
    });
}