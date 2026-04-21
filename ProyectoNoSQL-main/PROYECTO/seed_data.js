/**
 * SCRIPT DE DATOS DE PRUEBA — Grano de Oro
 * 
 * Cómo usarlo:
 *   1. Asegúrate de que el servidor esté corriendo (npm run dev)
 *   2. Abre una terminal nueva en la carpeta PROYECTO
 *   3. Corre: node seed_data.js
 * 
 * El script inserta datos en este orden:
 *   Roles → Usuarios → Fincas → Recolectores → Precios
 *   → Cortes → Recolecciones → Pagos
 *   → Notificaciones → Reportes
 */

const BASE = 'http://localhost:5000/api';

async function post(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`POST /${endpoint} → ${JSON.stringify(data)}`);
  console.log(`  ✓ /${endpoint} — ${data._id}`);
  return data;
}

async function seed() {
  console.log('\n========================================');
  console.log('  INSERTANDO DATOS DE PRUEBA');
  console.log('========================================\n');

  try {

    // ─── 1. ROLES ──────────────────────────────────────
    console.log('1. Roles...');
    const rolAdmin = await post('roles', {
      nombre: 'administrador',
      descripcion: 'Acceso total al sistema',
      permisos: ['ver_todo', 'crear', 'editar', 'eliminar', 'ver_pagos', 'generar_reportes'],
      activo: true
    });
    const rolSupervisor = await post('roles', {
      nombre: 'supervisor',
      descripcion: 'Supervisión de recolección y pagos',
      permisos: ['ver_recolecciones', 'ver_pagos', 'crear_recolecciones'],
      activo: true
    });
    const rolOperador = await post('roles', {
      nombre: 'operador',
      descripcion: 'Registro de recolecciones diarias',
      permisos: ['crear_recolecciones', 'ver_recolecciones'],
      activo: true
    });

    // ─── 2. USUARIOS ───────────────────────────────────
    console.log('\n2. Usuarios...');
    const usuAdmin = await post('usuarios', {
      nombre: 'Carlos Montero Arias',
      correo: 'admin@granodeoro.cr',
      contrasena_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz012345',
      rol_id: rolAdmin._id,
      activo: true,
      ultimo_acceso: new Date().toISOString(),
      preferencias: { idioma: 'es', notificaciones_email: true }
    });
    const usuSupervisor = await post('usuarios', {
      nombre: 'María Solano Pérez',
      correo: 'supervisor@granodeoro.cr',
      contrasena_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz012345',
      rol_id: rolSupervisor._id,
      activo: true,
      ultimo_acceso: new Date(Date.now() - 86400000).toISOString(),
      preferencias: { idioma: 'es', notificaciones_email: true }
    });
    const usuOperador = await post('usuarios', {
      nombre: 'Andrés Rojas Vargas',
      correo: 'operador@granodeoro.cr',
      contrasena_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz012345',
      rol_id: rolOperador._id,
      activo: true,
      ultimo_acceso: new Date(Date.now() - 172800000).toISOString(),
      preferencias: { idioma: 'es', notificaciones_email: false }
    });

    // ─── 3. FINCAS ─────────────────────────────────────
    console.log('\n3. Fincas...');
    const finca1 = await post('fincas', {
      nombre: 'Finca La Esperanza',
      ubicacion: { provincia: 'San José', canton: 'Tarrazú', coordenadas: { lat: 9.6386, lng: -73.9854 } },
      tamano_hectareas: 48.5,
      propietario: { nombre: 'Carlos Montero Arias', telefono: '8888-1111', correo: 'cmontero@gmail.com' },
      activa: true,
      variedades_cafe: ['Caturra', 'Catuaí', 'Villa Sarchí']
    });
    const finca2 = await post('fincas', {
      nombre: 'Finca El Roble',
      ubicacion: { provincia: 'Cartago', canton: 'El Guarco', coordenadas: { lat: 9.8356, lng: -83.9124 } },
      tamano_hectareas: 32.0,
      propietario: { nombre: 'Lucía Fernández Mora', telefono: '8888-2222', correo: 'lfernandez@gmail.com' },
      activa: true,
      variedades_cafe: ['Geisha', 'Typica']
    });
    const finca3 = await post('fincas', {
      nombre: 'Finca Los Pinos',
      ubicacion: { provincia: 'Heredia', canton: 'Barva', coordenadas: { lat: 10.0234, lng: -84.1098 } },
      tamano_hectareas: 21.75,
      propietario: { nombre: 'Roberto Jiménez Castro', telefono: '8888-3333', correo: 'rjimenez@gmail.com' },
      activa: true,
      variedades_cafe: ['Bourbon', 'Catuaí']
    });

    // ─── 4. RECOLECTORES ───────────────────────────────
    console.log('\n4. Recolectores...');
    const rec1 = await post('recolectores', {
      identificacion: '1-0234-0567',
      nombre: 'Juan Diego Mora Solís',
      telefono: '7777-1001',
      correo: 'jmora@gmail.com',
      fecha_nacimiento: '1985-03-15',
      activo: true,
      historial_fincas: [
        { finca_id: finca1._id, nombre_finca: 'Finca La Esperanza', temporadas: ['2022', '2023', '2024'] },
        { finca_id: finca2._id, nombre_finca: 'Finca El Roble', temporadas: ['2023'] }
      ]
    });
    const rec2 = await post('recolectores', {
      identificacion: '2-0345-0678',
      nombre: 'Ana Patricia Jiménez Vega',
      telefono: '7777-1002',
      correo: 'ajimenez@gmail.com',
      fecha_nacimiento: '1990-07-22',
      activo: true,
      historial_fincas: [
        { finca_id: finca1._id, nombre_finca: 'Finca La Esperanza', temporadas: ['2023', '2024'] }
      ]
    });
    const rec3 = await post('recolectores', {
      identificacion: '3-0456-0789',
      nombre: 'Luis Fernando Vargas Arias',
      telefono: '7777-1003',
      correo: 'lvargas@gmail.com',
      fecha_nacimiento: '1978-11-08',
      activo: true,
      historial_fincas: [
        { finca_id: finca2._id, nombre_finca: 'Finca El Roble', temporadas: ['2022', '2023', '2024'] },
        { finca_id: finca3._id, nombre_finca: 'Finca Los Pinos', temporadas: ['2024'] }
      ]
    });
    const rec4 = await post('recolectores', {
      identificacion: '4-0567-0890',
      nombre: 'María del Carmen Rojas Núñez',
      telefono: '7777-1004',
      correo: 'mrojas@gmail.com',
      fecha_nacimiento: '1995-05-30',
      activo: true,
      historial_fincas: [
        { finca_id: finca3._id, nombre_finca: 'Finca Los Pinos', temporadas: ['2024'] }
      ]
    });
    const rec5 = await post('recolectores', {
      identificacion: '5-0678-0901',
      nombre: 'Kevin Andrés Hernández Quesada',
      telefono: '7777-1005',
      correo: 'khernandez@gmail.com',
      fecha_nacimiento: '2000-01-14',
      activo: true,
      historial_fincas: [
        { finca_id: finca1._id, nombre_finca: 'Finca La Esperanza', temporadas: ['2024'] }
      ]
    });

    // ─── 5. PRECIOS ────────────────────────────────────
    console.log('\n5. Precios...');
    const precio2023 = await post('precios', {
      valor_cajuela: 2800,
      valor_cuartillo: 700,
      moneda: 'CRC',
      vigente_desde: '2023-10-01',
      vigente_hasta: '2023-12-31',
      activo: false,
      creado_por: usuAdmin._id,
      notas: 'Precio temporada 2023'
    });
    const precio2024a = await post('precios', {
      valor_cajuela: 3100,
      valor_cuartillo: 775,
      moneda: 'CRC',
      vigente_desde: '2024-09-01',
      vigente_hasta: '2024-10-31',
      activo: false,
      creado_por: usuAdmin._id,
      notas: 'Precio inicio temporada 2024'
    });
    const precioActual = await post('precios', {
      valor_cajuela: 3400,
      valor_cuartillo: 850,
      moneda: 'CRC',
      vigente_desde: '2024-11-01',
      vigente_hasta: null,
      activo: true,
      creado_por: usuAdmin._id,
      notas: 'Precio vigente noviembre 2024 en adelante'
    });

    // ─── 6. CORTES ─────────────────────────────────────
    console.log('\n6. Cortes...');
    const corte1 = await post('cortes', {
      nombre: 'Corte Principal 2024 — La Esperanza',
      finca_id: finca1._id,
      fecha_inicio: '2024-10-01',
      fecha_fin: null,
      estado: 'activo',
      total_cajuelas: 0,
      total_pagado: 0,
      notas: 'Corte principal de la temporada alta 2024'
    });
    const corte2 = await post('cortes', {
      nombre: 'Corte Principal 2024 — El Roble',
      finca_id: finca2._id,
      fecha_inicio: '2024-10-15',
      fecha_fin: null,
      estado: 'activo',
      total_cajuelas: 0,
      total_pagado: 0,
      notas: 'Temporada alta variedad Geisha'
    });
    const corte3 = await post('cortes', {
      nombre: 'Corte 2024 — Los Pinos',
      finca_id: finca3._id,
      fecha_inicio: '2024-11-01',
      fecha_fin: null,
      estado: 'activo',
      total_cajuelas: 0,
      total_pagado: 0,
      notas: 'Primer corte Finca Los Pinos'
    });
    const corteFinalizdo = await post('cortes', {
      nombre: 'Corte 2023 — La Esperanza',
      finca_id: finca1._id,
      fecha_inicio: '2023-10-01',
      fecha_fin: '2023-12-15',
      estado: 'finalizado',
      total_cajuelas: 1240,
      total_pagado: 3472000,
      notas: 'Temporada 2023 finalizada'
    });

    // ─── 7. RECOLECCIONES ──────────────────────────────
    console.log('\n8. Recolecciones...');

    const recolecciones = [
      // Juan Diego — Finca La Esperanza
      { fecha: '2024-10-05', rec: rec1, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 18, cuartillos: 2 },
      { fecha: '2024-10-07', rec: rec1, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 22, cuartillos: 1 },
      { fecha: '2024-10-10', rec: rec1, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 15, cuartillos: 3 },
      { fecha: '2024-10-14', rec: rec1, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 20, cuartillos: 0 },
      // Ana Patricia — Finca La Esperanza
      { fecha: '2024-10-05', rec: rec2, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 14, cuartillos: 2 },
      { fecha: '2024-10-08', rec: rec2, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 17, cuartillos: 1 },
      { fecha: '2024-10-12', rec: rec2, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 19, cuartillos: 0 },
      // Kevin — Finca La Esperanza
      { fecha: '2024-10-06', rec: rec5, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 12, cuartillos: 1 },
      { fecha: '2024-10-09', rec: rec5, finca: finca1, corte: corte1, precio: precioActual, cajuelas: 16, cuartillos: 2 },
      // Luis Fernando — Finca El Roble
      { fecha: '2024-10-16', rec: rec3, finca: finca2, corte: corte2, precio: precioActual, cajuelas: 25, cuartillos: 0 },
      { fecha: '2024-10-19', rec: rec3, finca: finca2, corte: corte2, precio: precioActual, cajuelas: 28, cuartillos: 1 },
      { fecha: '2024-10-22', rec: rec3, finca: finca2, corte: corte2, precio: precioActual, cajuelas: 21, cuartillos: 3 },
      // Luis Fernando — Finca Los Pinos
      { fecha: '2024-11-03', rec: rec3, finca: finca3, corte: corte3, precio: precioActual, cajuelas: 11, cuartillos: 2 },
      { fecha: '2024-11-06', rec: rec3, finca: finca3, corte: corte3, precio: precioActual, cajuelas: 13, cuartillos: 0 },
      // María del Carmen — Finca Los Pinos
      { fecha: '2024-11-03', rec: rec4, finca: finca3, corte: corte3, precio: precioActual, cajuelas: 10, cuartillos: 1 },
      { fecha: '2024-11-07', rec: rec4, finca: finca3, corte: corte3, precio: precioActual, cajuelas: 14, cuartillos: 2 },
    ];

    const recIDs = [];
    for (const r of recolecciones) {
      const pagoTotal = (r.cajuelas * r.precio.valor_cajuela) + (r.cuartillos * r.precio.valor_cuartillo);
      const doc = await post('recolecciones', {
        fecha: r.fecha,
        recolector: { id: r.rec._id, nombre: r.rec.nombre, identificacion: r.rec.identificacion },
        finca: { id: r.finca._id, nombre: r.finca.nombre },
        corte: { id: r.corte._id, nombre: r.corte.nombre },
        precio_aplicado: {
          id: r.precio._id,
          valor_cajuela: r.precio.valor_cajuela,
          valor_cuartillo: r.precio.valor_cuartillo,
          moneda: 'CRC'
        },
        cantidad_cajuelas: r.cajuelas,
        cantidad_cuartillos: r.cuartillos,
        pago_total: pagoTotal,
        pagado: false,
        registrado_por: usuOperador._id
      });
      recIDs.push({ id: doc._id, rec: r.rec, finca: r.finca, corte: r.corte, monto: pagoTotal, cajuelas: r.cajuelas });
    }

    // ─── 8. PAGOS ──────────────────────────────────────
    console.log('\n9. Pagos...');

    // Pago a Juan Diego (primeras 2 recolecciones)
    const recJuan = recIDs.filter(r => r.rec._id === rec1._id);
    await post('pagos', {
      recolector_id: rec1._id,
      corte_id: corte1._id,
      finca_id: finca1._id,
      recolecciones_ids: recJuan.slice(0, 2).map(r => r.id),
      total_cajuelas: recJuan.slice(0, 2).reduce((s, r) => s + r.cajuelas, 0),
      total_cuartillos: 3,
      monto_total: recJuan.slice(0, 2).reduce((s, r) => s + r.monto, 0),
      moneda: 'CRC',
      metodo_pago: 'transferencia',
      estado: 'completado',
      fecha_liquidacion: '2024-10-12',
      procesado_por: usuAdmin._id
    });

    // Pago a Ana Patricia (todas sus recolecciones)
    const recAna = recIDs.filter(r => r.rec._id === rec2._id);
    await post('pagos', {
      recolector_id: rec2._id,
      corte_id: corte1._id,
      finca_id: finca1._id,
      recolecciones_ids: recAna.map(r => r.id),
      total_cajuelas: recAna.reduce((s, r) => s + r.cajuelas, 0),
      total_cuartillos: 3,
      monto_total: recAna.reduce((s, r) => s + r.monto, 0),
      moneda: 'CRC',
      metodo_pago: 'efectivo',
      estado: 'completado',
      fecha_liquidacion: '2024-10-15',
      procesado_por: usuAdmin._id
    });

    // Pago pendiente a Luis Fernando (El Roble)
    const recLuis = recIDs.filter(r => r.rec._id === rec3._id && r.finca._id === finca2._id);
    await post('pagos', {
      recolector_id: rec3._id,
      corte_id: corte2._id,
      finca_id: finca2._id,
      recolecciones_ids: recLuis.map(r => r.id),
      total_cajuelas: recLuis.reduce((s, r) => s + r.cajuelas, 0),
      total_cuartillos: 4,
      monto_total: recLuis.reduce((s, r) => s + r.monto, 0),
      moneda: 'CRC',
      metodo_pago: 'transferencia',
      estado: 'pendiente',
      fecha_liquidacion: null,
      procesado_por: usuSupervisor._id
    });

    // Pago pendiente a María del Carmen
    const recMaria = recIDs.filter(r => r.rec._id === rec4._id);
    await post('pagos', {
      recolector_id: rec4._id,
      corte_id: corte3._id,
      finca_id: finca3._id,
      recolecciones_ids: recMaria.map(r => r.id),
      total_cajuelas: recMaria.reduce((s, r) => s + r.cajuelas, 0),
      total_cuartillos: 3,
      monto_total: recMaria.reduce((s, r) => s + r.monto, 0),
      moneda: 'CRC',
      metodo_pago: 'cheque',
      estado: 'pendiente',
      fecha_liquidacion: null,
      procesado_por: usuSupervisor._id
    });

    // ─── 9. NOTIFICACIONES ────────────────────────────
    console.log('\n10. Notificaciones...');
    await post('notificaciones', {
      usuario_id: usuAdmin._id,
      tipo: 'pago',
      titulo: 'Pagos pendientes por aprobar',
      mensaje: 'Hay 2 pagos pendientes de liquidación en Finca El Roble y Finca Los Pinos.',
      leida: false,
      prioridad: 'alta',
      enlace: '/pagos'
    });
    await post('notificaciones', {
      usuario_id: usuAdmin._id,
      tipo: 'produccion',
      titulo: 'Corte La Esperanza supera 80 cajuelas',
      mensaje: 'El corte principal 2024 de Finca La Esperanza ha acumulado más de 80 cajuelas en 2 semanas.',
      leida: false,
      prioridad: 'media',
      enlace: '/cortes'
    });
    await post('notificaciones', {
      usuario_id: usuSupervisor._id,
      tipo: 'sistema',
      titulo: 'Nuevo recolector registrado',
      mensaje: 'Kevin Andrés Hernández Quesada fue registrado y asignado a Finca La Esperanza.',
      leida: true,
      prioridad: 'baja',
      enlace: '/recolectores'
    });
    await post('notificaciones', {
      usuario_id: usuAdmin._id,
      tipo: 'precio',
      titulo: 'Precio actualizado para noviembre',
      mensaje: 'El precio por cajuela fue actualizado a ₡3,400 vigente desde el 1 de noviembre 2024.',
      leida: true,
      prioridad: 'alta',
      enlace: '/precios'
    });
    await post('notificaciones', {
      usuario_id: usuOperador._id,
      tipo: 'produccion',
      titulo: 'Recolección registrada correctamente',
      mensaje: 'Se registró la recolección del 7 de noviembre de María del Carmen Rojas.',
      leida: false,
      prioridad: 'baja',
      enlace: '/recolecciones'
    });

    // ─── 10. REPORTES ──────────────────────────────────
    console.log('\n11. Reportes...');
    await post('reportes', {
      tipo: 'produccion',
      titulo: 'Reporte de producción — Corte 2023 La Esperanza',
      parametros: {
        finca_id: finca1._id,
        corte_id: corteFinalizdo._id,
        fecha_desde: '2023-10-01',
        fecha_hasta: '2023-12-15'
      },
      resumen: {
        total_recolectores: 3,
        total_cajuelas: 1240,
        total_pagado: 3472000
      },
      formato: 'PDF',
      url_archivo: '/reportes/produccion-2023-la-esperanza.pdf',
      generado_por: usuAdmin._id
    });
    await post('reportes', {
      tipo: 'pagos',
      titulo: 'Reporte de pagos — Octubre 2024',
      parametros: {
        finca_id: finca1._id,
        corte_id: corte1._id,
        fecha_desde: '2024-10-01',
        fecha_hasta: '2024-10-31'
      },
      resumen: {
        total_recolectores: 2,
        total_cajuelas: 90,
        total_pagado: 306000
      },
      formato: 'XLSX',
      url_archivo: '/reportes/pagos-octubre-2024.xlsx',
      generado_por: usuAdmin._id
    });
    await post('reportes', {
      tipo: 'produccion',
      titulo: 'Reporte parcial — Finca El Roble 2024',
      parametros: {
        finca_id: finca2._id,
        corte_id: corte2._id,
        fecha_desde: '2024-10-15',
        fecha_hasta: '2024-11-01'
      },
      resumen: {
        total_recolectores: 1,
        total_cajuelas: 74,
        total_pagado: 251600
      },
      formato: 'PDF',
      url_archivo: '/reportes/produccion-el-roble-2024.pdf',
      generado_por: usuSupervisor._id
    });

    console.log('\n========================================');
    console.log('  DATOS INSERTADOS CORRECTAMENTE');
    console.log('========================================');
    console.log('\nResumen:');
    console.log('  Roles:          3');
    console.log('  Usuarios:       3');
    console.log('  Fincas:         3');
    console.log('  Recolectores:   5');
    console.log('  Precios:        3');
    console.log('  Cortes:         4 (3 activos, 1 finalizado)');
    
    console.log('  Recolecciones:  16');
    console.log('  Pagos:          4 (2 completados, 2 pendientes)');
    console.log('  Notificaciones: 5');
    console.log('  Reportes:       3');
    console.log('\nAhora podés abrir http://localhost:5000/panel.html\n');

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('Verificá que el servidor esté corriendo en http://localhost:5000\n');
    process.exit(1);
  }
}

seed();
