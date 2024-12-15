var express = require('express');
var router = express.Router();

const tipos_de_usuarioController = require('../controllers').tipos_de_usuarioController;

router.get('/', tipos_de_usuarioController.list);
router.get('/full', tipos_de_usuarioController.listFull);
router.get('/fullEnable', tipos_de_usuarioController.listEnableFull);
router.get('/sql', tipos_de_usuarioController.getSQL);
router.get('/:id', tipos_de_usuarioController.getById);
router.post('/', tipos_de_usuarioController.add);
router.put('/:id', tipos_de_usuarioController.update);
router.delete('/:id', tipos_de_usuarioController.delete);


module.exports = router;


