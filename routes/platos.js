var express = require('express');
var router = express.Router();
const multer = require('multer');

const platosController = require('../controllers').platosController;
const upload = multer({ dest: 'uploads/' });

router.get('/', platosController.list);
router.get('/full', platosController.listFull);
router.get('/fullEnable', platosController.listEnableFull);
router.get('/sql', platosController.getSQL);
router.get('/:id', platosController.getById);
router.post('/', upload.single('ruta'), platosController.add);
router.put('/:id', upload.single('ruta'), platosController.update);
router.delete('/:id', platosController.delete);


module.exports = router;