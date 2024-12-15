const categorias_inventario = require('../models').categorias_inventario_model;
const categorias_platos = require('../models').categorias_platos_model;
const facturas = require('../models').facturas_model;
const ingredientes = require('../models').ingredientes_model;
const inventario = require('../models').inventario_model;
const mesas = require('../models').mesas_model;
const pedidos_por_mesa = require('../models').pedidos_por_mesa_model;
const pedidos = require('../models').pedidos_model;
const platos_ingredientes = require('../models').platos_ingredientes_model;
const platos = require('../models').platos_model;
const sesiones_usuarios = require('../models').sesiones_usuarios_model;
const tipos_de_usuario = require('../models').tipos_de_usuario_model;
const usuarios = require('../models').usuarios_model;

const moment = require('moment-timezone');//


const { Sequelize, Op } = require("sequelize");
const db = require('../models');


module.exports = {
    list(req, res) {
        return pedidos_por_mesa
            .findAll({})
            .then((pedidos_por_mesa) => res.status(200).send(pedidos_por_mesa))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return pedidos_por_mesa
            .findByPk(req.params.id)
            .then((pedidos_por_mesa) => {
                console.log(pedidos_por_mesa);
                if (!pedidos_por_mesa) {
                    return res.status(404).send({
                        message: 'pedidos_por_mesa Not Found',
                    });
                }
                return res.status(200).send(pedidos_por_mesa);
            })
            .catch((error) =>
                res.status(400).send(error));
    },


    getPedidoPorMesaYPlato(req, res) {
        const { idPedido, idPlato } = req.params;

        return pedidos_por_mesa.findOne({
            where: {
                id_pedido: idPedido,
                id_plato: idPlato
            },
            include: [
                {
                    model: pedidos,
                    attributes: ['estado_pedido'] // Incluimos solo el estado del pedido
                }
            ]
        })
            .then(pedido => {
                if (!pedido) {
                    return res.status(404).send({
                        message: 'Pedido por mesa no encontrado para el id_pedido y id_plato proporcionados',
                    });
                }
                res.status(200).send(pedido);
            })
            .catch(error => {
                console.error('Error al obtener pedido por mesa y plato:', error);
                res.status(400).send(error);
            });
    },



    getPedidosByMesa(req, res) {
        const idMesa = req.params.idMesa;

        console.log('Obteniendo pedidos para idMesa:', idMesa);

        return pedidos_por_mesa.findAll({
            include: [
                {
                    model: pedidos,
                    where: { id_mesa: idMesa }, // Filtrar por id de mesa
                    attributes: [] // No necesitamos atributos adicionales del pedido, solo el filtro
                },
                {
                    model: platos,
                    attributes: ['nombre'], // Traer el nombre del plato
                    include: [
                        {
                            model: categorias_platos,
                            attributes: ['nombre_categoria'] // Traer el nombre de la categoría
                        }
                    ]
                }
            ],
            attributes: ['id_pedido', 'id_plato', 'id_categoria', 'cantidad', 'comentarios', 'fecha_hora'] // Seleccionamos solo los campos necesarios
        })
            .then(pedidos => {
                console.log('Pedidos encontrados:', JSON.stringify(pedidos, null, 2)); // Ver estructura completa
                res.status(200).send(pedidos); // Enviar los pedidos al front-end
            })
            .catch(error => {
                console.error('Error al obtener los pedidos por mesa:', error);
                res.status(400).send({ error: error.message });
            });
    },



    add(req, res) {

        return pedidos_por_mesa
            .create({
                cantidad: req.body.cantidad,
                comentarios: req.body.comentarios,
                fecha_hora: req.body.fecha_hora,
                id_pedido: req.body.id_pedido,
                id_plato: req.body.id_plato,
                id_categoria: req.body.id_categoria,
                id_inventario: req.body.id_inventario

            })
            .then((pedidos_por_mesa) => res.status(201).send(pedidos_por_mesa))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return pedidos_por_mesa
            .findByPk(req.params.id)
            .then(pedidos_por_mesa => {
                if (!pedidos_por_mesa) {
                    return res.status(404).send({
                        message: 'pedidos_por_mesa Not Found',
                    });
                }
                return pedidos_por_mesa
                    .update({
                        cantidad: req.body.cantidad || pedidos_por_mesa.cantidad,
                        comentarios: req.body.comentarios || pedidos_por_mesa.comentarios,
                        fecha_hora: req.body.fecha_hora || pedidos_por_mesa.fecha_hora,
                        id_pedido: req.body.id_pedido || pedidos_por_mesa.id_pedido,
                        id_plato: req.body.id_plato || pedidos_por_mesa.id_plato,
                        id_categoria: req.body.id_categoria || pedidos_por_mesa.id_categoria,
                        id_inventario: req.body.id_inventario || pedidos_por_mesa.id_inventario

                    })
                    .then(() => res.status(200).send(pedidos_por_mesa))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return pedidos_por_mesa
            .findByPk(req.params.id)
            .then(pedidos_por_mesa => {
                if (!pedidos_por_mesa) {
                    return res.status(400).send({
                        message: 'pedidos_por_mesa Not Found',
                    });
                }
                return pedidos_por_mesa
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    fullList(req, res) {
        return pedidos_por_mesa.findAll({
            attributes: ['id_plato', 'cantidad'], // Obtener la cantidad de pedidos por mesa
            include: [
                {
                    model: platos,
                    attributes: ['id', 'nombre', 'precio'],
                    include: [
                        {
                            model: platos_ingredientes,
                            attributes: ['id_plato', 'cantidad', 'id_ingredientes'],
                            include: [
                                {
                                    model: ingredientes,
                                    include: [
                                        {
                                            model: inventario,
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })
            .then((resultados) => {
                console.log("Resultados encontrados:", JSON.stringify(resultados, null, 2));
                res.status(200).send(resultados);
            })
            .catch((error) => {
                console.error("Error al buscar pedidos:", error);
                res.status(400).send(error);
            });
    },



    listEnableFull(req, res) {
        return pedidos_por_mesa.findAll({
            attributes: ['cantidad', 'comentarios', 'fecha_hora'],
            include: [
                {
                    model: inventario,

                    include: [
                        {
                            model: ingredientes,

                            include: [
                                {
                                    model: platos_ingredientes,

                                }
                            ]
                        },
                        {
                            model: categorias_inventario,

                        },
                        {

                            model: platos,

                            include: [
                                {
                                    model: categorias_platos,

                                }
                            ]
                        },
                        {
                            model: pedidos,

                            include: [
                                {
                                    model: usuarios,

                                    include: [
                                        {
                                            model: tipos_de_usuario,

                                            include: [
                                                {
                                                    model: sesiones_usuarios,

                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    model: mesas,

                                },

                                {
                                    model: facturas,

                                }
                            ]
                        }

                    ]
                }
            ],
            where: {
                cantidad: {
                    [Sequelize.Op.not]: null
                }
            },
            order: [
                ['cantidad', 'ASC']
            ]
        })
            .then((pedidos_por_mesa) => res.status(200).send(pedidos_por_mesa))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.pedidos_por_mesa")
            .then((result) => {
                console.log(result);
                if (!result) {
                    return res.status(404).send({
                        message: 'result Not Found',
                    });
                }
                return res.status(200).send(result[0]);
            })
            .catch((error) =>
                res.status(400).send(error));
    },

};

