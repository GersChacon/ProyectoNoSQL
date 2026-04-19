const express = require('express');
const router = express.Router();
const fincasController = require('../controllers/fincasController');

router.get('/fincas/activas', fincasController.fincasActivas);
router.get('/fincas/promedio-tamano', fincasController.promedioTamano);
router.get('/fincas/provincia/:provincia', fincasController.fincasPorProvincia);
router.post('/fincas', fincasController.createFincas);
router.get('/fincas/:id', fincasController.getFincas);
router.put('/fincas/:id', fincasController.updateFincas);
router.delete('/fincas/:id', fincasController.deleteFincas);

module.exports = router;