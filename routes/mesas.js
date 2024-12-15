var express = require('express');
var router = express.Router();

const mesasController = require('../controllers').mesasController;

router.get('/', mesasController.list);
router.get('/full', mesasController.listFull);
router.get('/fullEnable', mesasController.listEnableFull);
router.get('/sql', mesasController.getSQL);
router.get('/:id', mesasController.getById);
router.post('/', mesasController.add);
router.put('/:id', mesasController.update);
router.delete('/:id', mesasController.delete);


module.exports = router;


