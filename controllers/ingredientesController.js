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
        return ingredientes
            .findAll({})
            .then((ingredientes) => res.status(200).send(ingredientes))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return ingredientes
            .findByPk(req.params.id)
            .then((ingredientes) => {
                console.log(ingredientes);
                if (!ingredientes) {
                    return res.status(404).send({
                        message: 'ingredientes Not Found',
                    });
                }
                return res.status(200).send(ingredientes);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        return ingredientes
            .create({
                nombre: req.body.nombre,
                unidad: req.body.unidad

            })
            .then((ingredientes) => res.status(201).send(ingredientes))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return ingredientes
            .findByPk(req.params.id)
            .then(ingredientes => {
                if (!ingredientes) {
                    return res.status(404).send({
                        message: 'ingredientes Not Found',
                    });
                }
                return ingredientes
                    .update({
                        nombre: req.body.nombre|| ingredientes.nombre,
                        unidad: req.body.unidad|| ingredientes.unidad

                        
                        

                    })
                    .then(() => res.status(200).send(ingredientes))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return ingredientes
            .findByPk(req.params.id)
            .then(ingredientes => {
                if (!ingredientes) {
                    return res.status(400).send({
                        message: 'ingredientes Not Found',
                    });
                }
                return ingredientes
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },


    listFull(req, res) {
        return ingredientes.findAll({
            attributes: ['nombre', 'unidad'],
            include: [
                {
                    model: inventario,
                    attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                    include: [
                        
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
                                        },
                                        {
                                            model: platos_ingredientes,
                                            attributes: ['cantidad']
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
                                            attributes: ['numero','estado']
                                        }
                                    ]
                                },
                                {
                                    model: facturas,
                                    attributes: ['numero', 'total', 'fecha'],
                                },
                                {
                                    model: categorias_inventario,
                                    attributes: ['nombre_categoria'],
                                }
                            ]
                        }

                    ]
                }
            ]
        })
            .then((ingredientess) => {
                console.log("Categoria encontrada:", ingredientess);
                res.status(200).send(ingredientess);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return ingredientes.findAll({
            attributes: ['nombre', 'unidad'],
            include: [
                {
                    model: inventario,
                    attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                    include: [
                        
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
                                        },
                                        {
                                            model: platos_ingredientes,
                                            attributes: ['cantidad']
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
                                            attributes: ['numero','estado']
                                        }
                                    ]
                                },
                                {
                                    model: facturas,
                                    attributes: ['numero', 'total', 'fecha'],
                                },
                                {
                                    model: categorias_inventario,
                                    attributes: ['nombre_categoria'],
                                }
                            ]
                        }

                    ]
                }
            
        
                ],
                where: {
                    nombre: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['nombre', 'ASC']
                ]
            })
            .then((ingredientes) => res.status(200).send(ingredientes))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.ingredientes")
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