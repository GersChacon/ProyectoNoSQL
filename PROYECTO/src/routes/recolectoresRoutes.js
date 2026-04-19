const express = require('express');
const router = express.Router();
const recolectoresController = require('../controllers/recolectoresController');

router.get('/recolectores/activos', recolectoresController.recolectoresActivos);
router.get('/recolectores/multiples-fincas', recolectoresController.recolectoresMultiplesFincas);
router.get('/recolectores/nombre/:nombre', recolectoresController.recolectoresPorNombre);
router.post('/recolectores', recolectoresController.createRecolectores);
router.get('/recolectores/:id', recolectoresController.getRecolectores);
router.put('/recolectores/:id', recolectoresController.updateRecolectores);
router.delete('/recolectores/:id', recolectoresController.deleteRecolectores);

module.exports = router;