const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/roles/activos',                    rolesController.rolesActivos);
router.get('/roles/resumen-permisos',           rolesController.resumenPermisos);
router.get('/roles/permiso/:permiso',           rolesController.rolesPorPermiso);
router.post('/roles',                           rolesController.createRoles);
router.get('/roles/:id',                        rolesController.getRoles);
router.put('/roles/:id',                        rolesController.updateRoles);
router.delete('/roles/:id',                     rolesController.deleteRoles);

module.exports = router;
