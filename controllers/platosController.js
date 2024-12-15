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
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directorio donde se guardarán los archivos


module.exports = {
    list(req, res) {
        return platos
            .findAll({})
            .then((platos) => res.status(200).send(platos))
            .catch((error) => { res.status(400).send(error); });
    },

    
    getById(req, res) {
        console.log(req.params.id);
        return platos
            .findByPk(req.params.id)
            .then((platos) => {
                console.log(platos);
                if (!platos) {
                    return res.status(404).send({
                        message: 'platos Not Found',
                    });
                }
                return res.status(200).send(platos);
            })
            .catch((error) =>
                res.status(400).send(error));
    },



    add(req, res) {
        console.log("Datos recibidos para agregar:", req.body);
        console.log("Archivo recibido:", req.file);  // Verifica si se recibe el archivo
    
        // Crea un nuevo plato
        return platos
            .create({
                id_categoria: req.body.id_categoria,
                nombre: req.body.nombre,
                precio: req.body.precio,
                ruta: req.file ? req.file.path : null  // Guarda la ruta del archivo si se recibe
            })
            .then((plato) => {
                // Devuelve el nuevo plato creado con un estado 201 (Creado)
                return res.status(201).send(plato);
            })
            .catch((error) => {
                console.error('Error al agregar el plato:', error);
                return res.status(400).send(error);
            });
    },    

    update(req, res) {
        console.log("Datos recibidos para actualizar:", req.body);
        console.log("Archivo recibido:", req.file);  // Verifica si se recibe el archivo
    
        return platos
            .findByPk(req.params.id)
            .then(plato => {
                if (!plato) {
                    return res.status(404).send({
                        message: 'platos Not Found',
                    });
                }
                // Actualiza los datos del plato
                return plato
                    .update({
                        id_categoria: req.body.id_categoria || plato.id_categoria,
                        nombre: req.body.nombre || plato.nombre,
                        precio: req.body.precio || plato.precio,
                        ruta: req.file ? req.file.path : plato.ruta  // Actualiza la ruta si hay un archivo
                    })
                    .then(() => res.status(200).send(plato))
                    .catch((error) => {
                        console.error('Error al actualizar el plato:', error);
                        res.status(400).send(error);
                    });
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return platos
            .findByPk(req.params.id)
            .then(platos => {
                if (!platos) {
                    return res.status(400).send({
                        message: 'platos Not Found',
                    });
                }
                return platos
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    listFull(req, res) {
        return platos.findAll({
            attributes: ['nombre', 'precio', 'ruta'],
            include: [
                {
                    model: platos_ingredientes,
                    attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                    include: [
                        {
                            model: ingredientes,
                            attributes: ['nombre', 'unidad'],
                            include: [
                                {
                                    model: inventario,
                                    attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                                    include: [
                                        {
                                            model: categorias_inventario,
                                            attributes: ['nombre'],
                                            include: [
                                                {
                                                    model: pedidos_por_mesa,
                                                    attributes: ['cantidad', 'comentarios', 'fecha_hora'],
                                                    include: [
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
                                                        },
                                                        {
                                                            model: categorias_platos,
                                                            attributes: ['nombre']
                                                        },
                                                    ]
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
            .then((platos) => {
                console.log("Categoria encontrada:", platos);
                res.status(200).send(platos);
            })
            .catch((error) => {
                console.error("Error al buscar categoria:", error);
                res.status(400).send(error);
            });
    },


    listEnableFull(req, res) {
        return platos
            .findAll({
                attributes: ['nombre', 'precio', 'ruta'],
                include: [
                    {
                        model: platos_ingredientes,
                        attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                        include: [
                            {
                                model: ingredientes,
                                attributes: ['nombre', 'unidad'],
                                include: [
                                    {
                                        model: inventario,
                                        attributes: ['cantidad', 'fecha_ingreso', 'fecha_vencimiento'],
                                        include: [
                                            {
                                                model: categorias_inventario,
                                                attributes: ['nombre'],
                                                include: [
                                                    {
                                                        model: pedidos_por_mesa,
                                                        attributes: ['cantidad', 'comentarios', 'fecha_hora'],
                                                        include: [
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
                                                            },
                                                            {
                                                                model: categorias_platos,
                                                                attributes: ['nombre']
                                                            },
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
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
            .then((platos) => res.status(200).send(platos))
            .catch((error) => { res.status(400).send(error); });
    },

    getSQL(req, res) {
        return db.sequelize.query("SELECT * FROM public.platos")
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