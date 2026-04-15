<<<<<<< HEAD
=======
// src/routes/recolectoresRoutes.js
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
const express = require('express');
const router = express.Router();
const recolectoresController = require('../controllers/recolectoresController');

<<<<<<< HEAD
router.get('/recolectores/activos', recolectoresController.recolectoresActivos);
router.get('/recolectores/multiples-fincas', recolectoresController.recolectoresMultiplesFincas);
router.get('/recolectores/nombre/:nombre', recolectoresController.recolectoresPorNombre);
router.post('/recolectores', recolectoresController.createRecolectores);
router.get('/recolectores/:id', recolectoresController.getRecolectores);
router.put('/recolectores/:id', recolectoresController.updateRecolectores);
router.delete('/recolectores/:id', recolectoresController.deleteRecolectores);

module.exports = router;
=======
router.get('/recolectores/activos',                  recolectoresController.recolectoresActivos);
router.get('/recolectores/multiples-fincas',         recolectoresController.recolectoresMultiplesFincas);
router.get('/recolectores/nombre/:nombre',           recolectoresController.recolectoresPorNombre);
router.post('/recolectores',                         recolectoresController.createRecolectores);
router.get('/recolectores/:id',                      recolectoresController.getRecolectores);
router.put('/recolectores/:id',                      recolectoresController.updateRecolectores);
router.delete('/recolectores/:id',                   recolectoresController.deleteRecolectores);

module.exports = router;
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
