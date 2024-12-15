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
        return platos_ingredientes
            .findAll({})
            .then((platos_ingredientes) => res.status(200).send(platos_ingredientes))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        console.log(req.params.id);
        return platos_ingredientes
            .findByPk(req.params.id)
            .then((platos_ingredientes) => {
                console.log(platos_ingredientes);
                if (!platos_ingredientes) {
                    return res.status(404).send({
                        message: 'platos_ingredientes Not Found',
                    });
                }
                return res.status(200).send(platos_ingredientes);
            })
            .catch((error) =>
                res.status(400).send(error));
    },


    getIngredientesPorPlato(req, res) {
        const idPlato = req.params.id_plato;

        return platos_ingredientes.findAll({
            where: { id_plato: idPlato },
            include: [
                {
                    model: ingredientes,
                    attributes: ['id', 'nombre', 'unidad'],
                }
            ]
        })
            .then((ingredientes) => {
                if (!ingredientes.length) {
                    return res.status(404).send({ message: 'No se encontraron ingredientes para el plato especificado.' });
                }
                return res.status(200).send(ingredientes);
            })
            .catch((error) => {
                console.error("Error al obtener ingredientes por plato:", error);
                return res.status(400).send(error);
            });
    },


    addMultiple(req, res) {
        const selectedIngredients = req.body; // Suponiendo que recibes un arreglo de ingredientes desde el cuerpo de la solicitud

        // Validación: Verifica si se enviaron ingredientes
        if (!Array.isArray(selectedIngredients) || selectedIngredients.length === 0) {
            return res.status(400).send({ message: 'No se enviaron ingredientes.' });
        }

        // Usar Promise.all para insertar todos los ingredientes de forma concurrente
        const promises = selectedIngredients.map(async ingredient => {
            // Verificar si el ingrediente ya existe
            const exists = await platos_ingredientes.findOne({
                where: {
                    id_plato: ingredient.id_plato,
                    id_ingredientes: ingredient.id_ingrediente
                }
            });

            // Si no existe, crear el nuevo registro
            if (!exists) {
                return await platos_ingredientes.create({
                    cantidad: ingredient.cantidad,
                    id_plato: ingredient.id_plato,
                    id_ingredientes: ingredient.id_ingrediente, // Asegúrate de que este sea el campo correcto
                });
            } else {
                // Retornar un mensaje o simplemente ignorar
                return null; // O puedes retornar un mensaje de que ya existe
            }
        });

        Promise.all(promises)
            .then(results => {
                // Filtra los resultados nulos si deseas solo ver los nuevos registros creados
                const filteredResults = results.filter(result => result !== null);
                res.status(201).send(filteredResults); // Envía la respuesta con los ingredientes creados
            })
            .catch(error => res.status(400).send(error)); // Manejo de errores
    },

    update(req, res) {
        const { id } = req.params; // ID del plato a actualizar
        const { ingredientes, ingredientes_a_eliminar } = req.body; // Ingredientes seleccionados y a eliminar
    
        // Validar que los datos requeridos están presentes
        if (!ingredientes || !id) {
            return res.status(400).send({ message: 'Faltan datos requeridos en la solicitud.' });
        }
    
        console.log("Body recibido:", req.body); // Imprimir el body recibido para depuración
    
        // Array para las promesas de eliminación
        const deletePromises = [];
    
        // Eliminar ingredientes deseleccionados, asegurando que sean solo del plato especificado
        if (ingredientes_a_eliminar && ingredientes_a_eliminar.length > 0) {
            const deletePromise = platos_ingredientes.destroy({
                where: {
                    id_ingredientes: ingredientes_a_eliminar,
                    id_plato: id // Filtrar también por el id del plato actual
                }
            });
            deletePromises.push(deletePromise);
        }
    
        // Actualizar o crear ingredientes
        const updatePromises = ingredientes.map(ingrediente => {
            return platos_ingredientes.update(
                { cantidad: ingrediente.cantidad },
                {
                    where: { id_ingredientes: ingrediente.id_ingredientes, id_plato: id }
                }
            ).then(([updatedCount]) => {
                if (updatedCount === 0) {
                    // Crear nuevo ingrediente si no se actualizó ninguno
                    return platos_ingredientes.create({
                        id_ingredientes: ingrediente.id_ingredientes,
                        id_plato: id,
                        cantidad: ingrediente.cantidad
                    });
                }
            });
        });
    
        // Ejecutar todas las promesas de eliminación y actualización
        Promise.all([...deletePromises, ...updatePromises])
            .then(() => {
                return res.status(200).send({ message: 'Plato ingrediente actualizado correctamente.' });
            })
            .catch(err => {
                console.error("Error al actualizar o eliminar ingredientes:", err);
                return res.status(500).send({ message: 'Error al actualizar los ingredientes del plato.' });
            });
    },

    delete(req, res) {
        return platos_ingredientes
            .findByPk(req.params.id)
            .then(platos_ingredientes => {
                if (!platos_ingredientes) {
                    return res.status(400).send({
                        message: 'platos_ingredientes Not Found',
                    });
                }
                return platos_ingredientes
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {

        const id_plato = req.params.id_plato;

        const queryOptions = {
            attributes: ['id', 'cantidad'],
            include: [
                {
                    model: platos,
                    attributes: ['nombre', 'precio', 'ruta'],
                    include: [
                        {
                            model: pedidos_por_mesa,
                            attributes: ['cantidad', 'comentarios', 'fecha_hora'],
                        },
                        {
                            model: categorias_platos,
                            attributes: ['nombre_categoria']
                        }
                    ]
                },
                {
                    model: ingredientes,
                    attributes: ['id', 'nombre', 'unidad'],
                }
            ]
        };

        if (id_plato) {
            queryOptions.where = { id_plato };
        }

        return platos_ingredientes.findAll(queryOptions)
            .then((platos_ingredientes) => {
                console.log("Ingredientes encontrados:", platos_ingredientes);
                res.status(200).send(platos_ingredientes);
            })
            .catch((error) => {
                console.error("Error al buscar ingredientes:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return platos_ingredientes
            .findAll({
                attributes: ['cantidad'],
                include: [
                    {
                        model: platos,
                        attributes: ['nombre', 'precio', 'ruta'],
                        include: [
                            {
                                model: pedidos_por_mesa,
                                attributes: ['cantidad', 'comentarios', 'fecha_hora'],
                                include: [
                                    {
                                        model: inventario,
                                        attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                                        include: [
                                            {
                                                model: categorias_inventario,
                                                attributes: ['nombre']
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
                                                        attributes: ['nombre_tipo']
                                                    },
                                                    {
                                                        model: sesiones_usuarios,
                                                        attributes: ['fecha', 'hora']
                                                    }

                                                ]
                                            },
                                            {
                                                model: mesas,
                                                attributes: ['numero', 'estado']
                                            }
                                        ]
                                    },
                                    {
                                        model: facturas,
                                        attributes: ['numero', 'total', 'fecha'],
                                    }
                                ]
                            },
                            {
                                model: categorias_platos,
                                attributes: ['nombre_categoria']
                            }

                        ]
                    },
                    {
                        model: ingredientes,
                        attributes: ['nombre', 'unidad'],
                    }
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
            .then((platos_ingredientes) => res.status(200).send(platos_ingredientes))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.platos_ingredientes")
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


