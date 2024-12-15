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
        return facturas
            .findAll({})
            .then((facturas) => res.status(200).send(facturas))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return facturas
            .findByPk(req.params.id)
            .then((facturas) => {
                console.log(facturas);
                if (!facturas) {
                    return res.status(404).send({
                        message: 'facturas Not Found',
                    });
                }
                return res.status(200).send(facturas);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        return facturas
            .create({
                numero: req.body.numero,
                total: req.body.total,
                fecha: req.body.fecha,
                id_pedido: req.body.id_pedido

            })
            .then((facturas) => res.status(201).send(facturas))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return facturas
            .findByPk(req.params.id)
            .then(facturas => {
                if (!facturas) {
                    return res.status(404).send({
                        message: 'facturas Not Found',
                    });
                }
                return facturas
                    .update({
                        numero: req.body.numero || facturas.numero,
                        total: req.body.total || facturas.total,
                        fecha: req.body.fecha || facturas.fecha,
                        id_pedido: req.body.id_pedido || facturas.id_pedido




                    })
                    .then(() => res.status(200).send(facturas))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    

    delete(req, res) {
        return facturas
            .findByPk(req.params.id)
            .then(facturas => {
                if (!facturas) {
                    return res.status(400).send({
                        message: 'facturas Not Found',
                    });
                }
                return facturas
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return facturas.findAll({
            attributes: ['numero', 'total', 'fecha'],
            include: [
                {
                    model: inventario,
                    attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                    include: [
                        {
                            model: ingredientes,
                            attributes: ['nombre', 'unidad'],
                            include: [
                                {
                                    model: platos_ingredientes,
                                    attributes: ['cantidad']
                                }
                            ]
                        },
                        {
                            model: categorias_inventario,
                            attributes: ['nombre_categoria'],
                        },
                        {
                            model: pedidos_por_mesa,
                            attributes: ['cantidad', 'comentarios', 'fecha_hora'],
                            include: [
                                {
                                    model: platos,
                                    attributes: ['nombre', 'precio', 'ruta'],
                                    include: [
                                        {
                                            model: categorias_platos,
                                            attributes: ['nombre_categoria']
                                        }
                                    ]
                                },
                                {
                                    model: pedidos,
                                    attributes: ['fecha', 'estado_pedido'],
                                    include: [
                                        {
                                            model: usuarios,
                                            attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                                            include: [
                                                {
                                                    model: tipos_de_usuario,
                                                    attributes: ['nombre_tipo'],
                                                    include: [
                                                        {
                                                            model: sesiones_usuarios,
                                                            attributes: ['fecha', 'hora'],
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            model: mesas,
                                            attributes: ['numero', 'estado']
                                        }
                                    ]
                                },

                            ]
                        }

                    ]
                }
            ]
        })
            .then((facturas) => {
                console.log("Factura encontrada:", facturas);
                res.status(200).send(facturas);
            })
            .catch((error) => {
                console.error("Error al buscar factura:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return facturas
            .findAll({
                attributes: ['numero', 'total', 'fecha'],
                include: [
                    {
                        model: inventario,
                        attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                        include: [
                            {
                                model: ingredientes,
                                attributes: ['nombre', 'unidad'],
                                include: [
                                    {
                                        model: platos_ingredientes,
                                        attributes: ['cantidad']
                                    }
                                ]
                            },
                            {
                                model: categorias_inventario,
                                attributes: ['nombre_categoria'],
                            },
                            {
                                model: pedidos_por_mesa,
                                attributes: ['cantidad', 'comentarios', 'fecha_hora'],
                                include: [
                                    {
                                        model: platos,
                                        attributes: ['nombre', 'precio', 'ruta'],
                                        include: [
                                            {
                                                model: categorias_platos,
                                                attributes: ['nombre_categoria']
                                            }
                                        ]
                                    },
                                    {
                                        model: pedidos,
                                        attributes: ['fecha', 'estado_pedido'],
                                        include: [
                                            {
                                                model: usuarios,
                                                attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                                                include: [
                                                    {
                                                        model: tipos_de_usuario,
                                                        attributes: ['nombre_tipo'],
                                                        include: [
                                                            {
                                                                model: sesiones_usuarios,
                                                                attributes: ['fecha', 'hora'],
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                model: mesas,
                                                attributes: ['numero', 'estado']
                                            }
                                        ]
                                    },

                                ]
                            }

                        ]
                    }
                ],
                where: {
                    numero: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['numero', 'ASC']
                ]
            })
            .then((facturas) => res.status(200).send(facturas))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.facturas")
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