var express = require('express');
var router = express.Router();

const ingredientesController = require('../controllers').ingredientesController;

router.get('/', ingredientesController.list);
router.get('/full', ingredientesController.listFull);
router.get('/fullEnable', ingredientesController.listEnableFull);
router.get('/sql', ingredientesController.getSQL);
router.get('/:id', ingredientesController.getById);
router.post('/', ingredientesController.add);
router.put('/:id', ingredientesController.update);
router.delete('/:id', ingredientesController.delete);


module.exports = router;


