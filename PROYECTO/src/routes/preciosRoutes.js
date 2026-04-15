// src/routes/preciosRoutes.js
const express = require('express');
const router = express.Router();
const preciosController = require('../controllers/preciosController');

router.get('/precios/vigente',              preciosController.precioVigente);
router.get('/precios/historial',            preciosController.historialPrecios);
router.get('/precios/promedio-cajuela',     preciosController.promedioValorCajuela);
router.post('/precios',                     preciosController.createPrecios);
router.get('/precios/:id',                  preciosController.getPrecios);
router.put('/precios/:id',                  preciosController.updatePrecios);
router.delete('/precios/:id',               preciosController.deletePrecios);

module.exports = router;
