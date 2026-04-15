// src/routes/notificacionesRoutes.js
const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionesController');

router.get('/notificaciones/resumen-tipo',              notificacionesController.resumenPorTipo);
router.get('/notificaciones/no-leidas/:usuario_id',     notificacionesController.noLeidasPorUsuario);
router.get('/notificaciones/prioridad/:prioridad',      notificacionesController.notificacionesPorPrioridad);
router.post('/notificaciones',                          notificacionesController.createNotificaciones);
router.get('/notificaciones/:id',                       notificacionesController.getNotificaciones);
router.put('/notificaciones/:id',                       notificacionesController.updateNotificaciones);
router.delete('/notificaciones/:id',                    notificacionesController.deleteNotificaciones);

module.exports = router;
