// src/routes/usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/usuarios/activos',                     usuariosController.usuariosActivos);
router.get('/usuarios/acceso-reciente/:dias',       usuariosController.usuariosAccesoReciente);
router.get('/usuarios/rol/:rol_id',                 usuariosController.usuariosPorRol);
router.post('/usuarios',                            usuariosController.createUsuarios);
router.get('/usuarios/:id',                         usuariosController.getUsuarios);
router.put('/usuarios/:id',                         usuariosController.updateUsuarios);
router.delete('/usuarios/:id',                      usuariosController.deleteUsuarios);

module.exports = router;
