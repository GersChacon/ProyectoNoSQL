// src/routes/auditoriaRoutes.js
const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

router.get('/auditoria/usuario/:usuario_id',     auditoriaController.accionesPorUsuario);
router.get('/auditoria/coleccion/:coleccion',    auditoriaController.accionesPorColeccion);
router.get('/auditoria/reciente/:limite',        auditoriaController.auditoriaReciente);
router.post('/auditoria',                        auditoriaController.createAuditoria);
router.get('/auditoria/:id',                     auditoriaController.getAuditoria);
router.put('/auditoria/:id',                     auditoriaController.updateAuditoria);
router.delete('/auditoria/:id',                  auditoriaController.deleteAuditoria);

module.exports = router;
