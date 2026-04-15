<<<<<<< HEAD
=======
// src/routes/fincasRoutes.js
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
const express = require('express');
const router = express.Router();
const fincasController = require('../controllers/fincasController');

<<<<<<< HEAD
router.get('/fincas/activas', fincasController.fincasActivas);
router.get('/fincas/promedio-tamano', fincasController.promedioTamano);
router.get('/fincas/provincia/:provincia', fincasController.fincasPorProvincia);
router.post('/fincas', fincasController.createFincas);
router.get('/fincas/:id', fincasController.getFincas);
router.put('/fincas/:id', fincasController.updateFincas);
router.delete('/fincas/:id', fincasController.deleteFincas);

module.exports = router;
=======
router.get('/fincas/activas',                   fincasController.fincasActivas);
router.get('/fincas/promedio-tamano',           fincasController.promedioTamano);
router.get('/fincas/provincia/:provincia',      fincasController.fincasPorProvincia);
router.post('/fincas',                          fincasController.createFincas);
router.get('/fincas/:id',                       fincasController.getFincas);
router.put('/fincas/:id',                       fincasController.updateFincas);
router.delete('/fincas/:id',                    fincasController.deleteFincas);

module.exports = router;
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
