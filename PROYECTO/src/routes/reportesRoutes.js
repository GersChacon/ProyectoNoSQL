// src/routes/reportesRoutes.js
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

router.get('/reportes/resumen-produccion',      reportesController.resumenGeneralProduccion);
router.get('/reportes/recientes/:limite',       reportesController.reportesRecientes);
router.get('/reportes/tipo/:tipo',              reportesController.reportesPorTipo);
router.post('/reportes',                        reportesController.createReportes);
router.get('/reportes/:id',                     reportesController.getReportes);
router.put('/reportes/:id',                     reportesController.updateReportes);
router.delete('/reportes/:id',                  reportesController.deleteReportes);

module.exports = router;
