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
        return tipos_de_usuario
            .findAll({})
            .then((tipos_de_usuario) => res.status(200).send(tipos_de_usuario))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return tipos_de_usuario
            .findByPk(req.params.id)
            .then((tipos_de_usuario) => {
                console.log(tipos_de_usuario);
                if (!tipos_de_usuario) {
                    return res.status(404).send({
                        message: 'tipos_de_usuario Not Found',
                    });
                }
                return res.status(200).send(tipos_de_usuario);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        return tipos_de_usuario
            .create({
                nombre_tipo: req.body.nombre_tipo

            })
            .then((tipos_de_usuario) => res.status(201).send(tipos_de_usuario))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return tipos_de_usuario
            .findByPk(req.params.id)
            .then(tipos_de_usuario => {
                if (!tipos_de_usuario) {
                    return res.status(404).send({
                        message: 'tipos_de_usuario Not Found',
                    });
                }
                return tipos_de_usuario
                    .update({
                        nombre_tipo: req.body.nombre_tipo || tipos_de_usuario.nombre_tipo
                        
                        

                    })
                    .then(() => res.status(200).send(tipos_de_usuario))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return tipos_de_usuario
            .findByPk(req.params.id)
            .then(tipos_de_usuario => {
                if (!tipos_de_usuario) {
                    return res.status(400).send({
                        message: 'tipos_de_usuario Not Found',
                    });
                }
                return tipos_de_usuario
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return tipos_de_usuario.findAll({
            attributes: ['nombre_tipo'],
            include: [
                {
                    model: usuarios,
                    attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                    include: [
                        {
                            model: sesiones_usuarios,
                            attributes: ['fecha', 'hora']
                        },

                        {
                            model: pedidos,
                            attributes: ['fecha', 'estado_pedido'],
                            include: [
                                {
                                    model: mesas,
                                    attributes: ['numero', 'estado']
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
                                                },
                                                {
                                                    model: platos_ingredientes,
                                                    attributes: ['cantidad']
                                                },
                                            ]
                                        },
                                        {
                                            model: facturas,
                                            attributes: ['numero', 'total', 'fecha'],
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
                                                    attributes: ['nombre' , 'unidad']
                                                }
                                            ]
                                        }
                                    ]
                                }
                                

                            ]
                        }

                    ]
                }
            ]
        })
            .then((tipos_de_usuario) => {
                console.log("Categoria encontrada:", tipos_de_usuario);
                res.status(200).send(tipos_de_usuario);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return tipos_de_usuario
            .findAll({
                attributes: ['nombre_tipo'],
                include: [
                    {
                        model: usuarios,
                        attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                        include: [
                            {
                                model: sesiones_usuarios,
                                attributes: ['fecha', 'hora']
                            },
    
                            {
                                model: pedidos,
                                attributes: ['fecha', 'estado_pedido'],
                                include: [
                                    {
                                        model: mesas,
                                        attributes: ['numero', 'estado']
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
                                                    },
                                                    {
                                                        model: platos_ingredientes,
                                                        attributes: ['cantidad']
                                                    },
                                                ]
                                            },
                                            {
                                                model: facturas,
                                                attributes: ['numero', 'total', 'fecha'],
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
                                                        attributes: ['nombre' , 'unidad']
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                    
    
                                ]
                            },
    
                        ]
                    }
                ],
                where: {
                    nombre_tipo: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['nombre_tipo', 'ASC']
                ]
            })
            .then((tipos_de_usuario) => res.status(200).send(tipos_de_usuario))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.tipos_de_usuario")
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


