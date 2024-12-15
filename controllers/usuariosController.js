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
        return usuarios
            .findAll({})
            .then((usuarios) => res.status(200).send(usuarios))
            .catch((error) => { res.status(400).send(error); });
    },

    login(req, res) {
        const { correo, contrasena } = req.query; // Obtiene los parámetros de consulta

        // Busca el usuario por correo
        return usuarios.findOne({
            where: {
                correo: correo,
            },
        })
            .then((usuario) => {
                if (!usuario) {
                    return res.status(401).send({ message: 'Credenciales incorrectas' });
                }

                // Aquí debes comparar la contraseña; asegúrate de usar un método seguro (hash)
                if (usuario.contrasena !== contrasena) {
                    return res.status(401).send({ message: 'Credenciales incorrectas' });
                }

                // Si las credenciales son correctas, devuelve el usuario
                return res.status(200).send({
                    id: usuario.id,
                    nombre_completo: usuario.nombre_completo,
                    // Agrega otros campos que necesites
                });
            })
            .catch((error) => {
                console.error('Error al iniciar sesión:', error);
                return res.status(500).send({ message: 'Error en el servidor' });
            });
    },


    getById(req, res) {
        console.log(req.params.id);
        return usuarios
            .findByPk(req.params.id)
            .then((usuarios) => {
                console.log(usuarios);
                if (!usuarios) {
                    return res.status(404).send({
                        message: 'usuarios Not Found',
                    });
                }
                return res.status(200).send(usuarios);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        return usuarios
            .create({
                nombre_completo: req.body.nombre_completo,
                cedula: req.body.cedula,
                contrasena: req.body.contrasena,
                correo: req.body.correo,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
                id_tipo_usuario: req.body.id_tipo_usuario,

            })
            .then((usuarios) => res.status(201).send(usuarios))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        return usuarios
            .findByPk(req.params.id)
            .then(usuarios => {
                if (!usuarios) {
                    return res.status(404).send({
                        message: 'usuarios Not Found',
                    });
                }
                return usuarios
                    .update({
                        nombre_completo: req.body.nombre_completo || usuarios.nombre_completo,
                        cedula: req.body.cedula || usuarios.cedula,
                        contrasena: req.body.contrasena || usuarios.contrasena,
                        correo: req.body.correo || usuarios.correo,
                        telefono: req.body.telefono || usuarios.telefono,
                        direccion: req.body.direccion || usuarios.direccion,
                        id_tipo_usuario: req.body.id_tipo_usuario || usuarios.id_tipo_usuario,

                    })
                    .then(() => res.status(200).send(usuarios))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return usuarios
            .findByPk(req.params.id)
            .then(usuarios => {
                if (!usuarios) {
                    return res.status(400).send({
                        message: 'usuarios Not Found',
                    });
                }
                return usuarios
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return usuarios.findAll({
            attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
            include: [
                {
                    model: sesiones_usuarios
                },
                {
                    model: tipos_de_usuario
                },

                {
                    model: pedidos,
                    include: [
                        {
                            model: mesas
                        },
                        {
                            model: pedidos_por_mesa,
                            include: [
                                {
                                    model: platos,
                                    include: [
                                        {
                                            model: categorias_platos,
                                        },
                                        {
                                            model: platos_ingredientes,
                                        },
                                    ]
                                },
                                {
                                    model: facturas,
                                },
                                {
                                    model: inventario,
                                    include: [
                                        {
                                            model: categorias_inventario,
                                        },
                                        {
                                            model: ingredientes,
                                        }
                                    ]
                                }
                            ]
                        }


                    ]
                }
            ]
        })
            .then((usuarios) => {
                console.log("Categoria encontrada:", usuarios);
                res.status(200).send(usuarios);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return usuarios
            .findAll({
                attributes: ['nombre_completo', 'cedula', 'contrasena', 'correo', 'telefono', 'direccion'],
                include: [
                    {
                        model: sesiones_usuarios,
                        
                    },
                    {
                        model: tipos_de_usuario,
                        
                    },

                    {
                        model: pedidos,
                        
                        include: [
                            {
                                model: mesas,
                                
                            },
                            {
                                model: pedidos_por_mesa,
                                
                                include: [
                                    {
                                        model: platos,
                                        
                                        include: [
                                            {
                                                model: categorias_platos,
                                                
                                            },
                                            {
                                                model: platos_ingredientes,
                                                
                                            },
                                        ]
                                    },
                                    {
                                        model: facturas,
                                        
                                    },
                                    {
                                        model: inventario,
                                        
                                        include: [
                                            {
                                                model: categorias_inventario,
                                                
                                            },
                                            {
                                                model: ingredientes,
                                                
                                            }
                                        ]
                                    }
                                ]
                            }


                        ]
                    }
                ],
                where: {
                    nombre_completo: {
                        [Sequelize.Op.not]: null
                    }
                },
                order: [
                    ['nombre_completo', 'ASC']
                ]
            })
            .then((usuarios) => res.status(200).send(usuarios))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.usuarios")
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


