// src/routes/cortesRoutes.js
const express = require('express');
const router = express.Router();
const cortesController = require('../controllers/cortesController');

router.get('/cortes/activos',               cortesController.cortesActivos);
router.get('/cortes/resumen-produccion',    cortesController.resumenProduccion);
router.get('/cortes/finca/:finca_id',       cortesController.cortesPorFinca);
router.post('/cortes',                      cortesController.createCortes);
router.get('/cortes/:id',                   cortesController.getCortes);
router.put('/cortes/:id',                   cortesController.updateCortes);
router.delete('/cortes/:id',                cortesController.deleteCortes);

module.exports = router;
