var express = require('express');
var router = express.Router();

const facturasController = require('../controllers').facturasController;

router.get('/', facturasController.list);
router.get('/full', facturasController.listFull);
router.get('/fullEnable', facturasController.listEnableFull);
router.get('/sql', facturasController.getSQL);
router.get('/:id', facturasController.getById);
router.post('/', facturasController.add);
router.put('/:id', facturasController.update);
router.delete('/:id', facturasController.delete);


module.exports = router;


