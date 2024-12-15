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
        return mesas
            .findAll({})
            .then((mesas) => res.status(200).send(mesas))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return mesas
            .findByPk(req.params.id)
            .then((mesas) => {
                console.log(mesas);
                if (!mesas) {
                    return res.status(404).send({
                        message: 'mesas Not Found',
                    });
                }
                return res.status(200).send(mesas);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        const numeroMesa = req.body.numero; // Obtener el número de mesa del cuerpo de la solicitud
    
        // Verificar si el número de mesa ya existe
        mesas.findOne({ where: { numero: numeroMesa } })
            .then((existingMesa) => {
                if (existingMesa) {
                    // Si existe una mesa con ese número, devolver un error
                    return res.status(400).send({ message: 'El número de mesa ya existe.' });
                }
                
                // Si no existe, crear la nueva mesa
                return mesas.create({
                    numero: req.body.numero,
                    estado: req.body.estado
                })
                .then((newMesa) => res.status(201).send(newMesa))
                .catch((error) => res.status(400).send(error));
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({ error: 'Error al verificar la existencia de la mesa.' });
            });
    },
    

    update(req, res) {
        return mesas
            .findByPk(req.params.id)
            .then(mesas => {
                if (!mesas) {
                    return res.status(404).send({
                        message: 'mesas Not Found',
                    });
                }
                return mesas
                    .update({
                        numero: req.body.numero || mesas.numero,
                        estado: typeof req.body.estado === 'boolean' ? req.body.estado : mesas.estado
                    })
                    .then(() => res.status(200).send(mesas))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));

    },

    delete(req, res) {
        return mesas
            .findByPk(req.params.id)
            .then(mesas => {
                if (!mesas) {
                    return res.status(400).send({
                        message: 'mesas Not Found',
                    });
                }
                return mesas
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return mesas.findAll({
            attributes: ['numero', 'estado'],
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

                                    ]
                                },
                                {
                                    model: facturas,
                                    attributes: ['numero', 'total', 'fecha'],
                                }
                            ]
                        }

                    ]
                }
            ]
        })
            .then((mesass) => {
                console.log("Categoria encontrada:", mesass);
                res.status(200).send(mesass);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return mesas.findAll({
            attributes: ['numero', 'estado'],
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

                                    ]
                                },
                                {
                                    model: facturas,
                                    attributes: ['numero', 'total', 'fecha'],
                                }
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
            .then((mesas) => res.status(200).send(mesas))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.mesas")
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