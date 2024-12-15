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
        return categorias_inventario
            .findAll({})
            .then((categorias_inventario) => res.status(200).send(categorias_inventario))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return categorias_inventario
            .findByPk(req.params.id)
            .then((categorias_inventario) => {
                console.log(categorias_inventario);
                if (!categorias_inventario) {
                    return res.status(404).send({
                        message: 'categorias_inventario Not Found',
                    });
                }
                return res.status(200).send(categorias_inventario);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        return categorias_inventario
            .create({
                nombre_categoria: req.body.nombre_categoria,
                estado: req.body.estado
                
            })
            .then((categorias_inventario) => res.status(201).send(categorias_inventario))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return categorias_inventario
            .findByPk(req.params.id)
            .then(categorias_inventario => {
                if (!categorias_inventario) {
                    return res.status(404).send({
                        message: 'categorias_inventario Not Found',
                    });
                }
    
                // Asegúrate de que req.body.estado sea booleano
                const nuevoEstado = typeof req.body.estado === 'boolean' ? req.body.estado : categorias_inventario.estado;
    
                return categorias_inventario
                    .update({
                        nombre_categoria: req.body.nombre_categoria || categorias_inventario.nombre_categoria,
                        estado: nuevoEstado
                    })
                    .then(() => res.status(200).send(categorias_inventario))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    

    delete(req, res) {
        return categorias_inventario
            .findByPk(req.params.id)
            .then(categorias_inventario => {
                if (!categorias_inventario) {
                    return res.status(400).send({
                        message: 'categorias_inventario Not Found',
                    });
                }
                return categorias_inventario
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return categorias_inventario.findAll({
            attributes: ['nombre_categoria'],
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
                                            attributes: ['nombre_completo','cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                                            include: [
                                                {
                                                    model: tipos_de_usuario,
                                                    attributes: ['nombre_tipo']
                                                }
                                            ]
                                        },
                                        {
                                            model: mesas,
                                            attributes: ['numero','estado']
                                        }
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
            .then((categorias_inventario) => {
                console.log("Categoria encontrada:", categorias_inventario);
                res.status(200).send(categorias_inventario);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return categorias_inventario
            .findAll({
                attributes: ['nombre_categoria'],
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
                                                attributes: ['nombre_completo','cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                                                include: [
                                                    {
                                                        model: tipos_de_usuario,
                                                        attributes: ['nombre_tipo']
                                                    }
                                                ]
                                            },
                                            {
                                                model: mesas,
                                                attributes: ['numero','estado']
                                            }
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
                    nombre_categoria: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['nombre_categoria', 'ASC']
                ]
            })
            .then((categorias_inventario) => res.status(200).send(categorias_inventario))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.categorias_inventario")
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


