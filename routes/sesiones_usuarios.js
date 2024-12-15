var express = require('express');
var router = express.Router();

const sesiones_usuariosController = require('../controllers').sesiones_usuariosController;

router.get('/', sesiones_usuariosController.list);
router.get('/full', sesiones_usuariosController.listFull);
router.get('/fullEnable', sesiones_usuariosController.listEnableFull);
router.get('/sql', sesiones_usuariosController.getSQL);
//router.get('/usuarios/sesion/:id', sesiones_usuariosController.getUsuarioPorSesion);
router.get('/:id', sesiones_usuariosController.getById);
router.post('/', sesiones_usuariosController.add);
router.put('/:id', sesiones_usuariosController.update);
router.delete('/:id', sesiones_usuariosController.delete);


module.exports = router;


