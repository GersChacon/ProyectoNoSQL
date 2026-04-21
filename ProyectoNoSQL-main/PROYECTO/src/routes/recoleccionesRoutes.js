const express = require('express');
const router = express.Router();
const recoleccionesController = require('../controllers/recoleccionesController');

router.get('/recolecciones/no-pagadas',                                          recoleccionesController.recoleccionesNoPagadas);
router.get('/recolecciones/total-por-recolector',                                recoleccionesController.totalPorRecolector);
router.post('/recolecciones',                                                    recoleccionesController.createRecolecciones);
router.get('/recolecciones/:id',                                                 recoleccionesController.getRecolecciones);
router.put('/recolecciones/:id',                                                 recoleccionesController.updateRecolecciones);
router.delete('/recolecciones/:id',                                              recoleccionesController.deleteRecolecciones);

module.exports = router;
