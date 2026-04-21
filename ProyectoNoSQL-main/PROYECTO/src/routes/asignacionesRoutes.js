// src/routes/asignacionesRoutes.js
const express = require('express');
const router = express.Router();
const asignacionesController = require('../controllers/asignacionesController');

router.get('/asignaciones/activas',                          asignacionesController.asignacionesActivas);
router.get('/asignaciones/finca/:finca_id',                  asignacionesController.asignacionesPorFinca);
router.get('/asignaciones/recolector/:recolector_id',        asignacionesController.asignacionesPorRecolector);
router.post('/asignaciones',                                 asignacionesController.createAsignaciones);
router.get('/asignaciones/:id',                              asignacionesController.getAsignaciones);
router.put('/asignaciones/:id',                              asignacionesController.updateAsignaciones);
router.delete('/asignaciones/:id',                           asignacionesController.deleteAsignaciones);

module.exports = router;
