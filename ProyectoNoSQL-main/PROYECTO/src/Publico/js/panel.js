const API = 'http://localhost:5000/api';
let currentView = 'dashboard';
let editingRecolectorId = null;
let editingFincaId = null;
let editingPrecioId = null;
let editingCorteId = null;

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

function showMessage(message, isError = false) {
  const color = isError ? '#b94d4d' : '#556b3d';
  $('#alerts').html(`<div class="alert-box" style="border-left:4px solid ${color};color:${color};">${message}</div>`);
  setTimeout(() => $('#alerts').html(''), 3500);
}

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString('es-CR');
}

function formatMoney(value) {
  if (value == null) return '—';
  return '₡' + Number(value).toLocaleString('es-CR');
}

function renderTable(headers, rowsHtml) {
  if (!rowsHtml.length) {
    return `<div class="empty-box">No hay datos disponibles.</div>`;
  }
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rowsHtml.join('')}</tbody>
      </table>
    </div>`;
}

function reloadCurrentView() {
  switch (currentView) {
    case 'dashboard':      loadDashboard();      break;
    case 'recolectores':   loadRecolectores();   break;
    case 'fincas':         loadFincas();         break;
    case 'precios':        loadPrecios();        break;
    case 'cortes':         loadCortes();         break;
    case 'recolecciones':  loadRecolecciones();  break;
    case 'asignaciones':   loadAsignaciones();   break;
    case 'pagos':          loadPagos();          break;
    case 'notificaciones': loadNotificaciones(); break;
    case 'reportes':       loadReportes();       break;
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
      $('#statPrecio').text(precio?.valor_cajuela != null ? formatMoney(precio.valor_cajuela) : '—');
    })
    .fail(() => $('#statPrecio').text('—'));
}


function loadDashboard(buttonEl = null) {
  currentView = 'dashboard';
  setActiveButton(buttonEl || $('.nav-btn').get(0));
  setHeader('Dashboard general', 'Resumen visual del sistema conectado a tu API.', 'Resumen principal');
  loadStats();
  $('#data').html(`<div class="loading-box">Cargando resumen...</div>`);

  Promise.all([
    $.get(`${API}/cortes/resumen-produccion`).then(d => d).catch(() => []),
    $.get(`${API}/recolecciones/total-por-recolector`).then(d => d).catch(() => [])
  ]).then(([resumenCortes, topRecolectores]) => {

    const cortesRows = (resumenCortes || []).map(c => `
      <tr>
        <td>${c.estado || '—'}</td>
        <td>${c.total_cortes ?? 0}</td>
        <td>${c.total_cajuelas ?? 0}</td>
        <td>${formatMoney(c.total_pagado)}</td>
      </tr>`);

    const recolRows = (topRecolectores || []).slice(0, 5).map(r => `
      <tr>
        <td>${r.nombre || '—'}</td>
        <td>${r.total_cajuelas ?? 0}</td>
        <td>${r.total_recolecciones ?? 0}</td>
        <td>${formatMoney(r.total_pago)}</td>
      </tr>`);

    $('#data').html(`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;flex-wrap:wrap;">
        <div>
          <h4 style="color:#5a3825;margin-bottom:10px;font-size:1rem;">Producción por estado de corte</h4>
          ${renderTable(['Estado','Cortes','Cajuelas','Total pagado'], cortesRows)}
        </div>
        <div>
          <h4 style="color:#5a3825;margin-bottom:10px;font-size:1rem;">Top recolectores por cajuelas</h4>
          ${renderTable(['Nombre','Cajuelas','Recolecciones','Pago total'], recolRows)}
        </div>
      </div>
    `);
  });
}


function loadRecolectores(buttonEl = null) {
  currentView = 'recolectores';
  editingRecolectorId = null;
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Recolectores', 'Gestión de recolectores activos.', 'Gestión de recolectores');

  $('#data').html(`
    <div class="form-box">
      <h3 style="margin-bottom:14px;color:#5a3825;">Nuevo recolector</h3>
      <form id="recolectorForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Identificación *</label>
            <input type="text" id="recolectorIdentificacion" required>
          </div>
          <div class="form-group">
            <label>Nombre completo *</label>
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
      const rows = (data || []).map(r => `
        <tr>
          <td>${r.identificacion || ''}</td>
          <td>${r.nombre || ''}</td>
          <td>${r.telefono || ''}</td>
          <td>${r.correo || ''}</td>
          <td>${formatDate(r.fecha_nacimiento)}</td>
          <td class="row-actions">
            <button class="action-btn btn-edit" onclick="editRecolector('${r._id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteRecolector('${r._id}')">Eliminar</button>
          </td>
        </tr>`);
      $('#recolectoresTabla').html(renderTable(
        ['Identificación','Nombre','Teléfono','Correo','Nacimiento','Acciones'], rows
      ));
    })
    .fail(() => { $('#recolectoresTabla').html(`<div class="empty-box">No se pudieron cargar los recolectores.</div>`); });
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
  const url = editingRecolectorId ? `${API}/recolectores/${editingRecolectorId}` : `${API}/recolectores`;
  $.ajax({ url, method, contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => {
      showMessage(editingRecolectorId ? 'Recolector actualizado.' : 'Recolector creado.');
      resetRecolectorForm();
      fetchRecolectores();
      loadStats();
    })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
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
    .fail(() => showMessage('No se pudo cargar el recolector.', true));
}

function deleteRecolector(id) {
  if (!confirm('¿Eliminar este recolector?')) return;
  $.ajax({ url: `${API}/recolectores/${id}`, method: 'DELETE' })
    .done(() => { showMessage('Recolector eliminado.'); fetchRecolectores(); loadStats(); })
    .fail(() => showMessage('No se pudo eliminar.', true));
}

function resetRecolectorForm() {
  editingRecolectorId = null;
  $('#recolectorForm')[0].reset();
}


function loadFincas(buttonEl = null) {
  currentView = 'fincas';
  editingFincaId = null;
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Fincas', 'Gestión de fincas cafetaleras.', 'Gestión de fincas');

  $('#data').html(`
    <div class="form-box">
      <h3 style="margin-bottom:14px;color:#5a3825;">Nueva finca</h3>
      <form id="fincaForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre *</label>
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
            <label>Hectáreas</label>
            <input type="number" id="fincaHectareas" step="0.01" min="0">
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
      const rows = (data || []).map(f => `
        <tr>
          <td>${f.nombre || ''}</td>
          <td>${f.ubicacion?.provincia || ''}</td>
          <td>${f.ubicacion?.canton || ''}</td>
          <td>${f.tamano_hectareas ?? '—'}</td>
          <td>${f.propietario?.nombre || ''}</td>
          <td>${(f.variedades_cafe || []).join(', ') || '—'}</td>
          <td class="row-actions">
            <button class="action-btn btn-edit" onclick="editFinca('${f._id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteFinca('${f._id}')">Eliminar</button>
          </td>
        </tr>`);
      $('#fincasTabla').html(renderTable(
        ['Nombre','Provincia','Cantón','Hectáreas','Propietario','Variedades','Acciones'], rows
      ));
    })
    .fail(() => $('#fincasTabla').html(`<div class="empty-box">No se pudieron cargar las fincas.</div>`));
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
  const url = editingFincaId ? `${API}/fincas/${editingFincaId}` : `${API}/fincas`;
  $.ajax({ url, method, contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => { showMessage(editingFincaId ? 'Finca actualizada.' : 'Finca creada.'); resetFincaForm(); fetchFincas(); loadStats(); })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
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
    .fail(() => showMessage('No se pudo cargar la finca.', true));
}

function deleteFinca(id) {
  if (!confirm('¿Eliminar esta finca?')) return;
  $.ajax({ url: `${API}/fincas/${id}`, method: 'DELETE' })
    .done(() => { showMessage('Finca eliminada.'); fetchFincas(); loadStats(); })
    .fail(() => showMessage('No se pudo eliminar.', true));
}

function resetFincaForm() {
  editingFincaId = null;
  $('#fincaForm')[0].reset();
}


function loadPrecios(buttonEl = null) {
  currentView = 'precios';
  editingPrecioId = null;
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Precios', 'Gestión de precios por cajuela.', 'Historial de precios');

  $('#data').html(`
    <div class="form-box">
      <h3 style="margin-bottom:14px;color:#5a3825;">Nuevo precio</h3>
      <form id="precioForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Valor cajuela (₡) *</label>
            <input type="number" id="precioValorCajuela" step="0.01" min="0" required>
          </div>
          <div class="form-group">
            <label>Valor cuartillo (₡) *</label>
            <input type="number" id="precioValorCuartillo" step="0.01" min="0" required>
          </div>
          <div class="form-group">
            <label>Moneda</label>
            <input type="text" id="precioMoneda" value="CRC">
          </div>
          <div class="form-group">
            <label>Vigente desde *</label>
            <input type="date" id="precioVigentDesde" required>
          </div>
          <div class="form-group">
            <label>Vigente hasta</label>
            <input type="date" id="precioVigenteHasta">
          </div>
          <div class="form-group">
            <label>Notas</label>
            <input type="text" id="precioNotas">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-coffee">Guardar precio</button>
          <button type="button" class="btn-soft" onclick="resetPrecioForm()">Limpiar</button>
        </div>
      </form>
    </div>
    <div id="preciosTabla"><div class="loading-box">Cargando precios...</div></div>
  `);

  $('#precioForm').on('submit', savePrecio);
  fetchPrecios();
}

function fetchPrecios() {
  $.get(`${API}/precios/historial`)
    .done(data => {
      const rows = (data || []).map(p => `
        <tr>
          <td>${formatMoney(p.valor_cajuela)}</td>
          <td>${formatMoney(p.valor_cuartillo)}</td>
          <td>${p.moneda || 'CRC'}</td>
          <td>${formatDate(p.vigente_desde)}</td>
          <td>${formatDate(p.vigente_hasta)}</td>
          <td><span style="color:${p.activo ? '#556b3d' : '#b94d4d'};font-weight:700;">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
        </tr>`);
      $('#preciosTabla').html(renderTable(
        ['Cajuela','Cuartillo','Moneda','Vigente desde','Vigente hasta','Estado'], rows
      ));
    })
    .fail(() => $('#preciosTabla').html(`<div class="empty-box">No se pudieron cargar los precios.</div>`));
}

function savePrecio(e) {
  e.preventDefault();
  const payload = {
    valor_cajuela: Number($('#precioValorCajuela').val()),
    valor_cuartillo: Number($('#precioValorCuartillo').val()),
    moneda: $('#precioMoneda').val().trim() || 'CRC',
    vigente_desde: $('#precioVigentDesde').val(),
    vigente_hasta: $('#precioVigenteHasta').val() || null,
    activo: true,
    notas: $('#precioNotas').val().trim()
  };
  const method = editingPrecioId ? 'PUT' : 'POST';
  const url = editingPrecioId ? `${API}/precios/${editingPrecioId}` : `${API}/precios`;
  $.ajax({ url, method, contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => { showMessage(editingPrecioId ? 'Precio actualizado.' : 'Precio creado.'); resetPrecioForm(); fetchPrecios(); loadStats(); })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
}

function resetPrecioForm() {
  editingPrecioId = null;
  $('#precioForm')[0].reset();
  $('#precioMoneda').val('CRC');
}


function loadCortes(buttonEl = null) {
  currentView = 'cortes';
  editingCorteId = null;
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Cortes', 'Gestión de cortes de cosecha.', 'Gestión de cortes');

  $('#data').html(`<div class="loading-box">Cargando formulario...</div>`);

  $.get(`${API}/fincas/activas`)
    .done(fincas => {
      const fincaOptions = (fincas || []).map(f => `<option value="${f._id}">${f.nombre}</option>`).join('');

      $('#data').html(`
        <div class="form-box">
          <h3 style="margin-bottom:14px;color:#5a3825;">Nuevo corte</h3>
          <form id="corteForm">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre del corte *</label>
                <input type="text" id="corteNombre" required>
              </div>
              <div class="form-group">
                <label>Finca *</label>
                <select id="corteFincaId" required style="width:100%;border:1px solid #dcc7b4;border-radius:14px;padding:12px;font-family:'Poppins',sans-serif;background:white;">
                  <option value="">-- Seleccionar finca --</option>
                  ${fincaOptions}
                </select>
              </div>
              <div class="form-group">
                <label>Fecha inicio *</label>
                <input type="date" id="corteFechaInicio" required>
              </div>
              <div class="form-group">
                <label>Fecha fin</label>
                <input type="date" id="corteFechaFin">
              </div>
              <div class="form-group">
                <label>Estado</label>
                <select id="corteEstado" style="width:100%;border:1px solid #dcc7b4;border-radius:14px;padding:12px;font-family:'Poppins',sans-serif;background:white;">
                  <option value="activo">Activo</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div class="form-group">
                <label>Notas</label>
                <input type="text" id="corteNotas">
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-coffee">Guardar corte</button>
              <button type="button" class="btn-soft" onclick="resetCorteForm()">Limpiar</button>
            </div>
          </form>
        </div>
        <div id="cortesTabla"><div class="loading-box">Cargando cortes...</div></div>
      `);

      $('#corteForm').on('submit', saveCorte);
      fetchCortes();
    })
    .fail(() => $('#data').html(`<div class="empty-box">No se pudieron cargar las fincas para el formulario.</div>`));
}

function fetchCortes() {
  $.get(`${API}/cortes/activos`)
    .done(data => {
      const rows = (data || []).map(c => `
        <tr>
          <td>${c.nombre || ''}</td>
          <td>${c.finca_nombre || '—'}</td>
          <td>${formatDate(c.fecha_inicio)}</td>
          <td>${formatDate(c.fecha_fin)}</td>
          <td>${c.total_cajuelas ?? 0}</td>
          <td>${formatMoney(c.total_pagado)}</td>
          <td><span style="color:${c.estado === 'activo' ? '#556b3d' : '#b94d4d'};font-weight:700;">${c.estado}</span></td>
        </tr>`);
      $('#cortesTabla').html(renderTable(
        ['Nombre','Finca','Inicio','Fin','Cajuelas','Total pagado','Estado'], rows
      ));
    })
    .fail(() => $('#cortesTabla').html(`<div class="empty-box">No se pudieron cargar los cortes.</div>`));
}

function saveCorte(e) {
  e.preventDefault();
  const payload = {
    nombre: $('#corteNombre').val().trim(),
    finca_id: $('#corteFincaId').val(),
    fecha_inicio: $('#corteFechaInicio').val(),
    fecha_fin: $('#corteFechaFin').val() || null,
    estado: $('#corteEstado').val(),
    notas: $('#corteNotas').val().trim()
  };
  const method = editingCorteId ? 'PUT' : 'POST';
  const url = editingCorteId ? `${API}/cortes/${editingCorteId}` : `${API}/cortes`;
  $.ajax({ url, method, contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => { showMessage(editingCorteId ? 'Corte actualizado.' : 'Corte creado.'); resetCorteForm(); fetchCortes(); })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
}

function resetCorteForm() {
  editingCorteId = null;
  $('#corteForm')[0].reset();
}


function loadRecolecciones(buttonEl = null) {
  currentView = 'recolecciones';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Recolecciones', 'Registro de recolecciones diarias.', 'Gestión de recolecciones');

  $('#data').html(`<div class="loading-box">Cargando formulario...</div>`);

  Promise.all([
    $.get(`${API}/recolectores/activos`).then(d => d).catch(() => []),
    $.get(`${API}/fincas/activas`).then(d => d).catch(() => []),
    $.get(`${API}/cortes/activos`).then(d => d).catch(() => []),
    $.get(`${API}/precios/vigente`).then(d => d).catch(() => [])
  ]).then(([recolectores, fincas, cortes, precios]) => {
    const precioVigente = Array.isArray(precios) ? precios[0] : precios;

    const recOpts = (recolectores || []).map(r => `<option value="${r._id}" data-nombre="${r.nombre}" data-id="${r.identificacion}">${r.nombre}</option>`).join('');
    const fincaOpts = (fincas || []).map(f => `<option value="${f._id}" data-nombre="${f.nombre}">${f.nombre}</option>`).join('');
    const corteOpts = (cortes || []).map(c => `<option value="${c._id}" data-nombre="${c.nombre || c.corte_nombre || ''}">${c.nombre || c.corte_nombre || c._id}</option>`).join('');

    const selectStyle = `style="width:100%;border:1px solid #dcc7b4;border-radius:14px;padding:12px;font-family:'Poppins',sans-serif;background:white;"`;

    $('#data').html(`
      <div class="form-box">
        <h3 style="margin-bottom:14px;color:#5a3825;">Nueva recolección</h3>
        <form id="recoleccionForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Recolector *</label>
              <select id="recRecolector" required ${selectStyle}>
                <option value="">-- Seleccionar --</option>${recOpts}
              </select>
            </div>
            <div class="form-group">
              <label>Finca *</label>
              <select id="recFinca" required ${selectStyle}>
                <option value="">-- Seleccionar --</option>${fincaOpts}
              </select>
            </div>
            <div class="form-group">
              <label>Corte *</label>
              <select id="recCorte" required ${selectStyle}>
                <option value="">-- Seleccionar --</option>${corteOpts}
              </select>
            </div>
            <div class="form-group">
              <label>Fecha *</label>
              <input type="date" id="recFecha" required>
            </div>
            <div class="form-group">
              <label>Cajuelas *</label>
              <input type="number" id="recCajuelas" min="0" step="0.5" required oninput="calcularPagoTotal()">
            </div>
            <div class="form-group">
              <label>Cuartillos</label>
              <input type="number" id="recCuartillos" min="0" step="1" value="0" oninput="calcularPagoTotal()">
            </div>
            <div class="form-group">
              <label>Precio cajuela (₡)</label>
              <input type="number" id="recPrecioCajuela" step="0.01" value="${precioVigente?.valor_cajuela ?? ''}" oninput="calcularPagoTotal()">
            </div>
            <div class="form-group">
              <label>Precio cuartillo (₡)</label>
              <input type="number" id="recPrecioCuartillo" step="0.01" value="${precioVigente?.valor_cuartillo ?? ''}" oninput="calcularPagoTotal()">
            </div>
            <div class="form-group">
              <label>Pago total (₡) — calculado</label>
              <input type="number" id="recPagoTotal" step="0.01" min="0" required readonly style="background:#f5ece3;">
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-coffee">Registrar recolección</button>
            <button type="button" class="btn-soft" onclick="resetRecoleccionForm()">Limpiar</button>
          </div>
        </form>
      </div>
      <div id="recoleccionesTabla"><div class="loading-box">Cargando recolecciones...</div></div>
    `);

    $('#recoleccionForm').on('submit', saveRecoleccion);
    fetchRecolecciones();
  });
}

function calcularPagoTotal() {
  const cajuelas = parseFloat($('#recCajuelas').val()) || 0;
  const cuartillos = parseFloat($('#recCuartillos').val()) || 0;
  const precioCajuela = parseFloat($('#recPrecioCajuela').val()) || 0;
  const precioCuartillo = parseFloat($('#recPrecioCuartillo').val()) || 0;
  const total = (cajuelas * precioCajuela) + (cuartillos * precioCuartillo);
  $('#recPagoTotal').val(total.toFixed(2));
}

function fetchRecolecciones() {
  $.get(`${API}/recolecciones/no-pagadas`)
    .done(data => {
      const rows = (data || []).map(r => `
        <tr>
          <td>${formatDate(r.fecha)}</td>
          <td>${r.recolector_nombre || '—'}</td>
          <td>${r.finca_nombre || '—'}</td>
          <td>${r.cantidad_cajuelas ?? 0}</td>
          <td>${r.cantidad_cuartillos ?? 0}</td>
          <td>${formatMoney(r.pago_total)}</td>
          <td><span style="color:#b94d4d;font-weight:700;">Pendiente</span></td>
        </tr>`);
      $('#recoleccionesTabla').html(renderTable(
        ['Fecha','Recolector','Finca','Cajuelas','Cuartillos','Pago total','Estado'], rows
      ));
    })
    .fail(() => $('#recoleccionesTabla').html(`<div class="empty-box">No se pudieron cargar las recolecciones.</div>`));
}

function saveRecoleccion(e) {
  e.preventDefault();
  const recolectorSel = $('#recRecolector option:selected');
  const fincaSel = $('#recFinca option:selected');
  const corteSel = $('#recCorte option:selected');

  const precioCajuela = parseFloat($('#recPrecioCajuela').val()) || 0;
  const precioCuartillo = parseFloat($('#recPrecioCuartillo').val()) || 0;

  const payload = {
    fecha: $('#recFecha').val(),
    recolector: {
      id: recolectorSel.val(),
      nombre: recolectorSel.data('nombre'),
      identificacion: recolectorSel.data('id')
    },
    finca: {
      id: fincaSel.val(),
      nombre: fincaSel.data('nombre')
    },
    corte: {
      id: corteSel.val(),
      nombre: corteSel.data('nombre')
    },
    precio_aplicado: {
      valor_cajuela: precioCajuela,
      valor_cuartillo: precioCuartillo,
      moneda: 'CRC'
    },
    cantidad_cajuelas: parseFloat($('#recCajuelas').val()) || 0,
    cantidad_cuartillos: parseInt($('#recCuartillos').val()) || 0,
    pago_total: parseFloat($('#recPagoTotal').val()) || 0,
    pagado: false
  };

  $.ajax({ url: `${API}/recolecciones`, method: 'POST', contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => { showMessage('Recolección registrada.'); resetRecoleccionForm(); fetchRecolecciones(); })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
}

function resetRecoleccionForm() {
  $('#recoleccionForm')[0].reset();
  $('#recPagoTotal').val('');
}


function loadAsignaciones(buttonEl = null) {
  currentView = 'asignaciones';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Asignaciones', 'Asignación de recolectores a fincas y cortes.', 'Gestión de asignaciones');

  $('#data').html(`<div class="loading-box">Cargando formulario...</div>`);

  Promise.all([
    $.get(`${API}/recolectores/activos`).then(d => d).catch(() => []),
    $.get(`${API}/fincas/activas`).then(d => d).catch(() => []),
    $.get(`${API}/cortes/activos`).then(d => d).catch(() => [])
  ]).then(([recolectores, fincas, cortes]) => {
    const selectStyle = `style="width:100%;border:1px solid #dcc7b4;border-radius:14px;padding:12px;font-family:'Poppins',sans-serif;background:white;"`;
    const recOpts = (recolectores || []).map(r => `<option value="${r._id}">${r.nombre}</option>`).join('');
    const fincaOpts = (fincas || []).map(f => `<option value="${f._id}">${f.nombre}</option>`).join('');
    const corteOpts = (cortes || []).map(c => `<option value="${c._id}">${c.nombre || c.corte_nombre || c._id}</option>`).join('');

    $('#data').html(`
      <div class="form-box">
        <h3 style="margin-bottom:14px;color:#5a3825;">Nueva asignación</h3>
        <form id="asignacionForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Recolector *</label>
              <select id="asigRecolector" required ${selectStyle}>
                <option value="">-- Seleccionar --</option>${recOpts}
              </select>
            </div>
            <div class="form-group">
              <label>Finca *</label>
              <select id="asigFinca" required ${selectStyle}>
                <option value="">-- Seleccionar --</option>${fincaOpts}
              </select>
            </div>
            <div class="form-group">
              <label>Corte *</label>
              <select id="asigCorte" required ${selectStyle}>
                <option value="">-- Seleccionar --</option>${corteOpts}
              </select>
            </div>
            <div class="form-group">
              <label>Fecha inicio *</label>
              <input type="date" id="asigFechaInicio" required>
            </div>
            <div class="form-group">
              <label>Fecha fin</label>
              <input type="date" id="asigFechaFin">
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-coffee">Crear asignación</button>
            <button type="button" class="btn-soft" onclick="resetAsignacionForm()">Limpiar</button>
          </div>
        </form>
      </div>
      <div id="asignacionesTabla"><div class="loading-box">Cargando asignaciones...</div></div>
    `);

    $('#asignacionForm').on('submit', saveAsignacion);
    fetchAsignaciones();
  });
}

function fetchAsignaciones() {
  $.get(`${API}/asignaciones/activas`)
    .done(data => {
      const rows = (data || []).map(a => `
        <tr>
          <td>${a.recolector_nombre || '—'}</td>
          <td>${a.finca_nombre || '—'}</td>
          <td>${a.corte_nombre || '—'}</td>
          <td>${formatDate(a.fecha_inicio)}</td>
          <td><span style="color:#556b3d;font-weight:700;">Activa</span></td>
        </tr>`);
      $('#asignacionesTabla').html(renderTable(
        ['Recolector','Finca','Corte','Fecha inicio','Estado'], rows
      ));
    })
    .fail(() => $('#asignacionesTabla').html(`<div class="empty-box">No se pudieron cargar las asignaciones.</div>`));
}

function saveAsignacion(e) {
  e.preventDefault();

  const payload = {
    recolector_id: $('#asigRecolector').val(),
    finca_id: $('#asigFinca').val(),
    corte_id: $('#asigCorte').val(),
    fecha_inicio: $('#asigFechaInicio').val(),
    fecha_fin: $('#asigFechaFin').val() || null,
    activa: true,
    registrado_por: $('#asigRecolector').val() // placeholder: mismo ID del recolector
  };

  $.ajax({ url: `${API}/asignaciones`, method: 'POST', contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => { showMessage('Asignación creada.'); resetAsignacionForm(); fetchAsignaciones(); })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
}

function resetAsignacionForm() {
  $('#asignacionForm')[0].reset();
}


function loadPagos(buttonEl = null) {
  currentView = 'pagos';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Pagos', 'Consulta y registro de pagos.', 'Gestión de pagos');

  $('#data').html(`<div class="loading-box">Cargando pagos...</div>`);

  Promise.all([
    $.get(`${API}/pagos/pendientes`).then(d => d).catch(() => []),
    $.get(`${API}/recolectores/activos`).then(d => d).catch(() => []),
    $.get(`${API}/fincas/activas`).then(d => d).catch(() => []),
    $.get(`${API}/cortes/activos`).then(d => d).catch(() => [])
  ]).then(([pagos, recolectores, fincas, cortes]) => {
    const recMap = {};
    (recolectores || []).forEach(r => recMap[r._id] = r.nombre);
    const fincaMap = {};
    (fincas || []).forEach(f => fincaMap[f._id] = f.nombre);
    const corteMap = {};
    (cortes || []).forEach(c => corteMap[c._id] = c.nombre || c.corte_nombre || c._id);

    const selectStyle = `style="width:100%;border:1px solid #dcc7b4;border-radius:14px;padding:12px;font-family:'Poppins',sans-serif;background:white;"`;
    const recOpts = (recolectores || []).map(r => `<option value="${r._id}">${r.nombre}</option>`).join('');
    const fincaOpts = (fincas || []).map(f => `<option value="${f._id}">${f.nombre}</option>`).join('');
    const corteOpts = (cortes || []).map(c => `<option value="${c._id}">${c.nombre || c.corte_nombre || c._id}</option>`).join('');

    const rows = (pagos || []).map(p => `
      <tr>
        <td>${recMap[p.recolector_id] || p.recolector_nombre || p.recolector_id || '—'}</td>
        <td>${fincaMap[p.finca_id] || p.finca_id || '—'}</td>
        <td>${corteMap[p.corte_id] || p.corte_id || '—'}</td>
        <td>${p.total_cajuelas ?? 0}</td>
        <td>${formatMoney(p.monto_total)}</td>
        <td>${p.metodo_pago || '—'}</td>
        <td><span style="color:#b94d4d;font-weight:700;">${p.estado}</span></td>
      </tr>`);

    $('#data').html(`
      <div class="form-box">
        <h3 style="margin-bottom:14px;color:#5a3825;">Registrar pago</h3>
        <form id="pagoForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Recolector *</label>
              <select id="pagoRecolector" required ${selectStyle}><option value="">-- Seleccionar --</option>${recOpts}</select>
            </div>
            <div class="form-group">
              <label>Finca *</label>
              <select id="pagoFinca" required ${selectStyle}><option value="">-- Seleccionar --</option>${fincaOpts}</select>
            </div>
            <div class="form-group">
              <label>Corte *</label>
              <select id="pagoCorte" required ${selectStyle}><option value="">-- Seleccionar --</option>${corteOpts}</select>
            </div>
            <div class="form-group">
              <label>Total cajuelas *</label>
              <input type="number" id="pagoTotalCajuelas" min="0" step="0.5" required>
            </div>
            <div class="form-group">
              <label>Total cuartillos</label>
              <input type="number" id="pagoTotalCuartillos" min="0" value="0">
            </div>
            <div class="form-group">
              <label>Monto total (₡) *</label>
              <input type="number" id="pagoMonto" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Método de pago *</label>
              <select id="pagoMetodo" required ${selectStyle}>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-coffee">Registrar pago</button>
          </div>
        </form>
      </div>
      <h4 style="color:#5a3825;margin-bottom:10px;">Pagos pendientes</h4>
      ${renderTable(['Recolector','Finca','Corte','Cajuelas','Monto','Método','Estado'], rows)}
    `);

    $('#pagoForm').on('submit', savePago);
  });
}

function savePago(e) {
  e.preventDefault();
  const payload = {
    recolector_id: $('#pagoRecolector').val(),
    finca_id: $('#pagoFinca').val(),
    corte_id: $('#pagoCorte').val(),
    total_cajuelas: parseFloat($('#pagoTotalCajuelas').val()) || 0,
    total_cuartillos: parseInt($('#pagoTotalCuartillos').val()) || 0,
    monto_total: parseFloat($('#pagoMonto').val()) || 0,
    metodo_pago: $('#pagoMetodo').val(),
    estado: 'pendiente'
  };
  $.ajax({ url: `${API}/pagos`, method: 'POST', contentType: 'application/json', data: JSON.stringify(payload) })
    .done(() => { showMessage('Pago registrado.'); loadPagos(); loadStats(); })
    .fail(xhr => showMessage('Error: ' + (JSON.parse(xhr.responseText)?.error || 'No se pudo guardar.'), true));
}


function loadNotificaciones(buttonEl = null) {
  currentView = 'notificaciones';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Notificaciones', 'Resumen de notificaciones del sistema.', 'Notificaciones');

  $('#data').html(`<div class="loading-box">Cargando notificaciones...</div>`);

  Promise.all([
    $.get(`${API}/notificaciones/resumen-tipo`).then(d => d).catch(() => []),
    $.get(`${API}/notificaciones/prioridad/alta`).then(d => d).catch(() => [])
  ]).then(([resumen, alta]) => {
    const resumenRows = (resumen || []).map(n => `
      <tr>
        <td>${n.tipo || '—'}</td>
        <td>${n.total ?? 0}</td>
        <td>${n.leidas ?? 0}</td>
        <td>${n.no_leidas ?? 0}</td>
      </tr>`);

    const altaRows = (alta || []).map(n => `
      <tr>
        <td>${n.titulo || '—'}</td>
        <td>${n.mensaje || '—'}</td>
        <td>${formatDate(n.fecha_creacion)}</td>
        <td><span style="color:${n.leida ? '#556b3d' : '#b94d4d'};font-weight:700;">${n.leida ? 'Leída' : 'No leída'}</span></td>
      </tr>`);

    $('#data').html(`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
        <div>
          <h4 style="color:#5a3825;margin-bottom:10px;">Resumen por tipo</h4>
          ${renderTable(['Tipo','Total','Leídas','No leídas'], resumenRows)}
        </div>
        <div>
          <h4 style="color:#5a3825;margin-bottom:10px;">Prioridad alta</h4>
          ${renderTable(['Título','Mensaje','Fecha','Estado'], altaRows)}
        </div>
      </div>
    `);
  });
}


function loadReportes(buttonEl = null) {
  currentView = 'reportes';
  if (buttonEl) setActiveButton(buttonEl);
  setHeader('Reportes', 'Resúmenes y estadísticas del sistema.', 'Reportes de producción');

  $('#data').html(`<div class="loading-box">Cargando reportes...</div>`);

  Promise.all([
    $.get(`${API}/reportes/resumen-produccion`).then(d => d).catch(() => []),
    $.get(`${API}/cortes/resumen-produccion`).then(d => d).catch(() => []),
    $.get(`${API}/precios/promedio-cajuela`).then(d => d).catch(() => []),
    $.get(`${API}/fincas/promedio-tamano`).then(d => d).catch(() => [])
  ]).then(([reportes, cortes, precioPromedio, fincaStats]) => {

    const reporteRows = (reportes || []).map(r => `
      <tr>
        <td>${r.tipo || '—'}</td>
        <td>${r.total_reportes ?? 0}</td>
        <td>${r.total_cajuelas ?? 0}</td>
        <td>${formatMoney(r.total_pagado)}</td>
      </tr>`);

    const corteRows = (cortes || []).map(c => `
      <tr>
        <td>${c.estado || '—'}</td>
        <td>${c.total_cortes ?? 0}</td>
        <td>${c.total_cajuelas ?? 0}</td>
        <td>${formatMoney(c.total_pagado)}</td>
      </tr>`);

    const pp = Array.isArray(precioPromedio) ? precioPromedio[0] : precioPromedio;
    const fs = Array.isArray(fincaStats) ? fincaStats[0] : fincaStats;

    $('#data').html(`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px;">
        <div style="background:#fff8f1;border:1px solid #ecd8c3;border-radius:18px;padding:16px;">
          <h4 style="color:#5a3825;margin-bottom:8px;">Estadísticas de precios</h4>
          <p><strong>Promedio cajuela:</strong> ${formatMoney(pp?.promedio_cajuela)}</p>
          <p><strong>Máximo:</strong> ${formatMoney(pp?.max_cajuela)}</p>
          <p><strong>Mínimo:</strong> ${formatMoney(pp?.min_cajuela)}</p>
          <p><strong>Registros:</strong> ${pp?.total_registros ?? 0}</p>
        </div>
        <div style="background:#fff8f1;border:1px solid #ecd8c3;border-radius:18px;padding:16px;">
          <h4 style="color:#5a3825;margin-bottom:8px;">Estadísticas de fincas</h4>
          <p><strong>Total fincas activas:</strong> ${fs?.total_fincas ?? 0}</p>
          <p><strong>Promedio hectáreas:</strong> ${fs?.promedio_hectareas ?? '—'}</p>
          <p><strong>Máximo:</strong> ${fs?.max_hectareas ?? '—'} ha</p>
          <p><strong>Mínimo:</strong> ${fs?.min_hectareas ?? '—'} ha</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
        <div>
          <h4 style="color:#5a3825;margin-bottom:10px;">Producción por corte</h4>
          ${renderTable(['Estado','Cortes','Cajuelas','Total pagado'], corteRows)}
        </div>
        <div>
          <h4 style="color:#5a3825;margin-bottom:10px;">Resumen de reportes</h4>
          ${renderTable(['Tipo','Reportes','Cajuelas','Total pagado'], reporteRows)}
        </div>
      </div>
    `);
  });
}
