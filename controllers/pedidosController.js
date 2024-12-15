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

const { Sequelize, Op } = require("sequelize");
const db = require('../models');


module.exports = {
    list(req, res) {
        return pedidos
            .findAll({})
            .then((pedidos) => res.status(200).send(pedidos))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return pedidos
            .findByPk(req.params.id)
            .then((pedidos) => {
                console.log(pedidos);
                if (!pedidos) {
                    return res.status(404).send({
                        message: 'pedidos Not Found',
                    });
                }
                return res.status(200).send(pedidos);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        const fechaActual = new Date();
        return pedidos
            .create({
                id_mesa: req.body.id_mesa,
                id_usuario: req.body.id_usuario,
                fecha: fechaActual,
                estado_pedido: req.body.estado_pedido,
                estados_p: req.body.estados_p,

            })
            .then((pedidos) => res.status(201).send(pedidos))
            .catch((error) => res.status(400).send(error));
    },


    async fetchPedidosByMesa(req, res) {
        const { id_mesa } = req.params; // `id_mesa` recibido desde los parámetros de la ruta

        try {
            const result = await pedidos.findAll({
                where: {
                    id_mesa, // Usa el `id_mesa` recibido como parámetro
                    estado_pedido: true
                },
                include: [
                    {
                        model: pedidos_por_mesa,
                        include: [
                            {
                                model: platos
                            }
                        ]
                    }
                ]
            });

            return res.status(200).send(result);
        } catch (error) {
            console.error("Error fetching pedidos:", error);
            return res.status(400).send(error);
        }
    },

    actualizarEstadoPedidos(req, res) {
        const { pedidosIds, estado_pedido } = req.body;

        return pedidos
            .update(
                { estado_pedido: estado_pedido }, // Asegúrate de que está actualizando `estado_pedido`
                { where: { id: pedidosIds } } // Aplica la condición a los IDs proporcionados
            )
            .then(() => res.status(200).send({ message: 'Estado de pedidos actualizado correctamente' }))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return pedidos
            .findByPk(req.params.id)
            .then(pedidos => {
                if (!pedidos) {
                    return res.status(404).send({
                        message: 'Pedido no encontrado',
                    });
                }
                return pedidos
                    .update({
                        id_mesa: req.body.id_mesa !== undefined ? req.body.id_mesa : pedidos.id_mesa,
                        id_usuario: req.body.id_usuario !== undefined ? req.body.id_usuario : pedidos.id_usuario,
                        fecha: req.body.fecha !== undefined ? req.body.fecha : pedidos.fecha,
                        estado_pedido: req.body.estado_pedido !== undefined ? req.body.estado_pedido : pedidos.estado_pedido,
                        estados_p: req.body.estados_p !== undefined ? req.body.estados_p : pedidos.estados_p,
                    })
                    .then(() => res.status(200).send(pedidos))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },



    delete(req, res) {
        return pedidos
            .findByPk(req.params.id)
            .then(pedidos => {
                if (!pedidos) {
                    return res.status(400).send({
                        message: 'pedidos Not Found',
                    });
                }
                return pedidos
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return pedidos.findAll({
            include: [
                {
                    model: pedidos_por_mesa,
                    include: [
                        {
                            model: facturas,
                        },
                        {
                            model: platos,
                            include: [
                                {
                                    model: platos_ingredientes,
                                }
                            ]
                        },
                        {
                            model: pedidos,
                        },
                        {
                            model: categorias_platos,
                        },
                        {
                            model: inventario,
                            include: [
                                {
                                    model: categorias_inventario,
                                },
                                {
                                    model: ingredientes,
                                },
                            ]
                        }

                    ]
                },
                {
                    model: mesas,
                },
                {
                    model: usuarios,
                    include: [
                        {
                            model: sesiones_usuarios,
                        },
                        {
                            model: tipos_de_usuario,
                        },
                    ]
                }
            ]
        })
            .then((pedidos) => {
                console.log("Categoria encontrada:", pedidos);
                res.status(200).send(pedidos);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return pedidos
            .findAll({
                attributes: ['id', 'fecha', 'estado_pedido'],
                include: [
                    {
                        model: pedidos_por_mesa,
                        attributes: ['id', 'cantidad', 'comentarios', 'fecha'],
                        include: [
                            {
                                model: facturas,
                                attributes: ['numero', 'total', 'fecha'],
                            },
                            {
                                model: platos,
                                attributes: ['nombre', 'precio', 'ruta'],
                                include: [
                                    {
                                        model: platos_ingredientes,
                                        attributes: ['cantidad']
                                    }
                                ]
                            },
                            {
                                model: pedidos,
                                attributes: ['fecha', 'estado_pedido'],
                            },
                            {
                                model: categorias_platos,
                                attributes: ['nombre'],
                            },
                            {
                                model: inventario,
                                attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                                include: [
                                    {
                                        model: categorias_inventario,
                                        attributes: ['nombre']
                                    },
                                    {
                                        model: ingredientes,
                                        attributes: ['nombre', 'unidad']
                                    },
                                ]
                            }

                        ]
                    },
                    {
                        model: mesas,
                        attributes: ['numero', 'estado']
                    },
                    {
                        model: usuarios,
                        attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                        include: [
                            {
                                model: sesiones_usuarios,
                                attributes: ['fecha', 'hora']
                            },
                            {
                                model: tipos_de_usuario,
                                attributes: ['nombre']
                            },
                        ]
                    }
                ],
                where: {
                    id: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['id', 'ASC']
                ]
            })
            .then((pedidos) => res.status(200).send(pedidos))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.pedidos")
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


