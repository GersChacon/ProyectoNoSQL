const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

router.get('/pagos/pendientes',                     pagosController.pagosPendientes);
router.get('/pagos/recolector/:recolector_id',      pagosController.pagosPorRecolector);
router.get('/pagos/corte/:corte_id/total',          pagosController.totalPagadoPorCorte);
router.post('/pagos',                               pagosController.createPagos);
router.get('/pagos/:id',                            pagosController.getPagos);
router.put('/pagos/:id',                            pagosController.updatePagos);
router.delete('/pagos/:id',                         pagosController.deletePagos);

module.exports = router;
