var express = require('express');
var router = express.Router();

const pedidos_por_mesaController = require('../controllers').pedidos_por_mesaController;

router.get('/', pedidos_por_mesaController.list);
router.get('/full', pedidos_por_mesaController.fullList);
router.get('/fullEnable', pedidos_por_mesaController.listEnableFull);
router.get('/sql', pedidos_por_mesaController.getSQL);
router.get('/mesa/:idMesa', pedidos_por_mesaController.getPedidosByMesa);
router.get('/:idPedido/:idPlato', pedidos_por_mesaController.getPedidoPorMesaYPlato);
router.get('/:id', pedidos_por_mesaController.getById);
router.post('/', pedidos_por_mesaController.add);
router.put('/:id', pedidos_por_mesaController.update);
router.delete('/:id', pedidos_por_mesaController.delete);


module.exports = router;


