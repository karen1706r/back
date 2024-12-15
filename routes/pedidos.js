var express = require('express');
var router = express.Router();
var db = require('../db/db');

const pedidosController = require('../controllers').pedidosController;

router.get('/', pedidosController.list);
router.get('/full', pedidosController.listFull);
router.get('/fullEnable', pedidosController.listEnableFull);
router.get('/sql', pedidosController.getSQL);
router.get('/:id', pedidosController.getById);
router.get('/mesa/:id_mesa', pedidosController.fetchPedidosByMesa);
router.post('/', pedidosController.add);
router.put('/actualizarEstado', pedidosController.actualizarEstadoPedidos);
router.put('/:id', pedidosController.update);
router.delete('/:id', pedidosController.delete);
// PUT para actualizar el estado del pedido
router.put('/ce/:id', function (req, res) {
    const pedidoId = req.params.id;
    const { estado } = req.body;

    var b = estado == "true" ? true : false;
    console.log("estado: ", b);

    // Realiza la actualización en la base de datos
    db.query('UPDATE pedidos SET estados_p = '+b+' WHERE id = '+pedidoId+';', (error, results) => {
        if (error) {
            console.error('Error al actualizar el pedido:', error);
            return res.status(500).json({ error: 'Error al actualizar el pedido' });
        }
        res.status(200).json({ message: 'Pedido actualizado exitosamente' });
    });
});



module.exports = router;


