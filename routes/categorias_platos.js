var express = require('express');
var router = express.Router();

const categorias_platosController = require('../controllers').categorias_platosController;

router.get('/', categorias_platosController.list);
router.get('/full', categorias_platosController.listFull);
router.get('/fullEnable', categorias_platosController.listEnableFull);
router.get('/sql', categorias_platosController.getSQL);
router.get('/:id', categorias_platosController.getById);

router.get('/:categoriaId/platos', categorias_platosController.getPlatosPorCategoria);

router.post('/', categorias_platosController.add);
router.put('/:id', categorias_platosController.update);
router.delete('/:id', categorias_platosController.delete);


module.exports = router;


