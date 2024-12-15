var express = require('express');
var router = express.Router();

const platos_ingredientesController = require('../controllers').platos_ingredientesController;

router.get('/', platos_ingredientesController.list);
router.get('/full/:id_plato?', platos_ingredientesController.listFull);
router.get('/fullEnable', platos_ingredientesController.listEnableFull);
router.get('/sql', platos_ingredientesController.getSQL);
router.get('/:id', platos_ingredientesController.getById);
router.get('/:id_plato/ingredientes', platos_ingredientesController.getIngredientesPorPlato);
//router.post('/', platos_ingredientesController.add);
router.post('/multiple', platos_ingredientesController.addMultiple);
router.put('/:id', platos_ingredientesController.update);
router.delete('/:id', platos_ingredientesController.delete);


module.exports = router;


