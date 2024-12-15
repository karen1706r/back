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
        return inventario
            .findAll({})
            .then((inventario) => res.status(200).send(inventario))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return inventario
            .findByPk(req.params.id)
            .then((inventario) => {
                console.log(inventario);
                if (!inventario) {
                    return res.status(404).send({
                        message: 'inventario Not Found',
                    });
                }
                return res.status(200).send(inventario);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        return inventario
            .create({
                cantidad: req.body.cantidad,
                fecha_ingreso: req.body.fecha_ingreso,
                fecha_vencimiento: req.body.fecha_vencimiento,
                id_categoria: req.body.id_categoria,
                id_ingrediente: req.body.id_ingrediente

            })
            .then((inventario) => res.status(201).send(inventario))
            .catch((error) => res.status(400).send(error));
    },

    updateMultiple(req, res) {
        const ingredientes = req.body.ingredientes;
    
        // Verificar si se envía un array de ingredientes para una actualización múltiple
        if (Array.isArray(ingredientes) && ingredientes.length > 0) {
            // Actualización múltiple
            Promise.all(ingredientes.map(ingrediente => {
                return inventario.findOne({ where: { id_ingrediente: ingrediente.id } })
                    .then(inventarioItem => {
                        if (!inventarioItem) {
                            throw new Error(`Ingrediente con ID ${ingrediente.id} no encontrado.`);
                        }
    
                        // Verificar que haya suficiente cantidad
                        if (inventarioItem.cantidad < ingrediente.cantidad) {
                            throw new Error(`No hay suficiente cantidad para el ingrediente ${ingrediente.id}.`);
                        }
    
                        // Restar la cantidad necesaria
                        inventarioItem.cantidad -= ingrediente.cantidad;
                        return inventarioItem.save();  // Guardar los cambios
                    });
            }))
                .then(() => res.status(200).send({ message: 'Inventario actualizado correctamente.' }))
                .catch(error => res.status(400).send({ message: error.message }));
        } else {
            // Actualización individual
            return inventario.findByPk(req.params.id)
                .then(inventarioItem => {
                    if (!inventarioItem) {
                        return res.status(404).send({
                            message: 'Inventario no encontrado',
                        });
                    }
                    
                    // Actualizar los campos individuales
                    return inventarioItem.update({
                        cantidad: req.body.cantidad || inventarioItem.cantidad,
                        fecha_ingreso: req.body.fecha_ingreso || inventarioItem.fecha_ingreso,
                        fecha_vencimiento: req.body.fecha_vencimiento || inventarioItem.fecha_vencimiento,
                        id_categoria: req.body.id_categoria || inventarioItem.id_categoria,
                        id_ingrediente: req.body.id_ingrediente || inventarioItem.id_ingrediente
                    })
                    .then(() => res.status(200).send(inventarioItem))
                    .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        }
    },


    delete(req, res) {
        return inventario
            .findByPk(req.params.id)
            .then(inventario => {
                if (!inventario) {
                    return res.status(400).send({
                        message: 'inventario Not Found',
                    });
                }
                return inventario
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },


    fullList(req, res) {
        return pedidos_por_mesa.findAll({
            include: [
                {
                    model: platos,
    
                    include: [
                        {
                            model: platos_ingredientes,
            
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
        return inventario.findAll({
            attributes: ['cantidad'],
            include: [
                {
                    model: ingredientes,
                    attributes: ['id', 'nombre', 'unidad'],
                    include: [
                        {
                            model: platos_ingredientes,
                            attributes: ['cantidad'],
                            include: [
                                {
                                    model: platos,
                                    attributes: ['nombre', 'precio'],
                                    include: [

                                        {
                                            model: pedidos_por_mesa,
                                            attributes: ['cantidad'],

                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                },



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
            .then((inventario) => res.status(200).send(inventario))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.inventario")
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