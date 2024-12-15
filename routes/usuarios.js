var express = require('express');
var router = express.Router();

const usuariosController = require('../controllers').usuariosController;

router.get('/', usuariosController.list);
router.get('/full', usuariosController.listFull);
router.get('/fullEnable', usuariosController.listEnableFull);
router.get('/sql', usuariosController.getSQL);
router.get('/:id', usuariosController.getById);
router.get('/login', usuariosController.login);
router.post('/', usuariosController.add);
router.put('/:id', usuariosController.update);
router.delete('/:id', usuariosController.delete);


module.exports = router;


