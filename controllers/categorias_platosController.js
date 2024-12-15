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
        return categorias_platos
            .findAll({})
            .then((categorias_platos) => res.status(200).send(categorias_platos))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return categorias_platos
            .findByPk(req.params.id)
            .then((categorias_platos) => {
                console.log(categorias_platos);
                if (!categorias_platos) {
                    return res.status(404).send({
                        message: 'categorias_platos Not Found',
                    });
                }
                return res.status(200).send(categorias_platos);
            })
            .catch((error) =>
                res.status(400).send(error));
    },

    


    // Obtener platos por categoría
getPlatosPorCategoria(req, res) {
    const categoriaId = req.params.categoriaId; // Asegúrate de que 'categoriaId' coincida con el nombre del parámetro en la URL
    
    return platos
        .findAll({
            where: {
                id_categoria: categoriaId
            },
            attributes: ['id', 'nombre', 'precio', 'ruta'], // Incluye solo los campos necesarios
            include: [
                {
                    model: categorias_platos, // Incluye la información de la categoría si lo deseas
                    attributes: ['nombre_categoria']
                }
            ]
        })
        .then(platos => {
            if (platos.length === 0) {
                return res.status(404).send({ message: 'No hay platos en esta categoría' });
            }
            return res.status(200).send(platos);
        })
        .catch(error => res.status(400).send(error));
},


    add(req, res) {
        return categorias_platos
            .create({
                nombre_categoria: req.body.nombre_categoria,
                estado: req.body.estado,

            })
            .then((categorias_platos) => res.status(201).send(categorias_platos))
            .catch((error) => res.status(400).send(error));
    },

    update(req, res) {
        console.log('ID recibido:', req.params.id); // Verifica que el ID esté correcto
        return categorias_platos
            .findByPk(req.params.id)
            .then(categorias_platos => {
                if (!categorias_platos) {
                    return res.status(404).send({
                        message: 'categorias_platos Not Found',
                    });
                }
                return categorias_platos
                    .update({
                        nombre_categoria: req.body.nombre_categoria || categorias_platos.nombre_categoria,
                        estado: req.body.estado !== undefined ? req.body.estado : categorias_platos.estado // Asegúrate de que el estado se actualice
                    })
                    .then(() => res.status(200).send(categorias_platos))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    

    delete(req, res) {
        return categorias_platos
            .findByPk(req.params.id)
            .then(categorias_platos => {
                if (!categorias_platos) {
                    return res.status(400).send({
                        message: 'categorias_platos Not Found',
                    });
                }
                return categorias_platos
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return categorias_platos.findAll({
            attributes: ['nombre_categoria','estado'],
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
                            model: pedidos_por_mesa,
                            
                            include: [
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
                                            
                                        }
                                    ]
                                },
                                {
                                    model: facturas,
                                    
                                }
                            ]
                        }

                    ]
                }
            ]
        })
            .then((categorias_platos) => {
                console.log("Categoria encontrada:", categorias_platos);
                res.status(200).send(categorias_platos);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return categorias_platos
            .findAll({
                attributes: ['nombre_categoria','estado'],
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
            .then((categorias_platos) => res.status(200).send(categorias_platos))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.categorias_platos")
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