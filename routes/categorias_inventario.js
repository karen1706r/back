var express = require('express');
var router = express.Router();

const categorias_inventarioController = require('../controllers').categorias_inventarioController;

router.get('/', categorias_inventarioController.list);
router.get('/full', categorias_inventarioController.listFull);
router.get('/fullEnable', categorias_inventarioController.listEnableFull);
router.get('/sql', categorias_inventarioController.getSQL);
router.get('/:id', categorias_inventarioController.getById);
router.post('/', categorias_inventarioController.add);
router.put('/:id', categorias_inventarioController.update);
router.delete('/:id', categorias_inventarioController.delete);


module.exports = router;


