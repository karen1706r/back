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
        return sesiones_usuarios
            .findAll({})
            .then((sesiones_usuarios) => res.status(200).send(sesiones_usuarios))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return sesiones_usuarios
            .findByPk(req.params.id)
            .then((sesiones_usuarios) => {
                console.log(sesiones_usuarios);
                if (!sesiones_usuarios) {
                    return res.status(404).send({
                        message: 'sesiones_usuarios Not Found',
                    });
                }
                return res.status(200).send(sesiones_usuarios);
            })
            .catch((error) =>
                res.status(400).send(error));
    },


    // getSesionById(req, res) {
    //     const idSesion = req.params.id;
    
    //     return sesiones_usuarios.findOne({
    //         where: { id: idSesion }
    //     })
    //     .then((sesion) => {
    //         if (!sesion) {
    //             return res.status(404).send({
    //                 message: 'Sesión no encontrada',
    //             });
    //         }
    //         return res.status(200).send(sesion); // Solo devuelve la sesión, que incluye id_usuario
    //     })
    //     .catch((error) => {
    //         console.error('Error al buscar la sesión:', error);
    //         return res.status(500).send({ message: 'Error en el servidor' });
    //     });
    // },
    
    


    add(req, res) {
        return sesiones_usuarios
            .create({

                hora: req.body.hora,
                id_usuario: req.body.id_usuario,


            })
            .then((sesiones_usuarios) => res.status(201).send(sesiones_usuarios))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return sesiones_usuarios
            .findByPk(req.params.id)
            .then(sesiones_usuarios => {
                if (!sesiones_usuarios) {
                    return res.status(404).send({
                        message: 'sesiones_usuarios Not Found',
                    });
                }
                return sesiones_usuarios
                    .update({
                        hora: req.body.hora || sesiones_usuarios.hora,
                        id_usuario: req.body.id_usuario || sesiones_usuarios.id_usuario,

                    })
                    .then(() => res.status(200).send(sesiones_usuarios))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return sesiones_usuarios
            .findByPk(req.params.id)
            .then(sesiones_usuarios => {
                if (!sesiones_usuarios) {
                    return res.status(400).send({
                        message: 'sesiones_usuarios Not Found',
                    });
                }
                return sesiones_usuarios
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return sesiones_usuarios.findAll({
            attributes: ['hora'],
            include: [
                {
                    model: usuarios,
                    attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                    include: [
                        {
                            model: tipos_de_usuario,
                            attributes: ['nombre_tipo']
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
                                                    attributes: ['nombre', 'unidad']
                                                }
                                            ]
                                        }
                                    ]
                                }


                            ]
                        },

                    ]
                }
            ]
        })
            .then((sesiones_usuarios) => {
                console.log("Categoria encontrada:", sesiones_usuarios);
                res.status(200).send(sesiones_usuarios);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return sesiones_usuarios
            .findAll({
                attributes: ['hora'],
                include: [
                    {
                        model: usuarios,
                        attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                        include: [
                            {
                                model: tipos_de_usuario,
                                attributes: ['nombre_tipo']
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
                                                        attributes: ['nombre', 'unidad']
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
                    nombre_categoria: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['fecha', 'ASC']
                ]
            })
            .then((sesiones_usuarios) => res.status(200).send(sesiones_usuarios))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.sesiones_usuarios")
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


