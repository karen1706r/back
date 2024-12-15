var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Importa el middleware de CORS

// Importar rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categorias_inventarioRouter = require('./routes/categorias_inventario');
var categorias_platosRouter = require('./routes/categorias_platos');
var facturasRouter = require('./routes/facturas');
var ingredientesRouter = require('./routes/ingredientes');
var inventarioRouter = require('./routes/inventario');
var platosRouter = require('./routes/platos');
var mesasRouter = require('./routes/mesas');
var pedidos_por_mesaRouter = require('./routes/pedidos_por_mesa');
var pedidosRouter = require('./routes/pedidos');
var platos_ingredientesRouter = require('./routes/platos_ingredientes');
var sesiones_usuariosRouter = require('./routes/sesiones_usuarios');
var tipos_de_usuarioRouter = require('./routes/tipos_de_usuario');
var usuariosRouter = require('./routes/usuarios');
var enviarFacturaCorreoRouter = require('./routes/enviarFacturaCorreo');
var predictRoutes = require('./routes/predictRoutes'); // Importa el enrutador de predicción

var app = express();

// Configura CORS
app.use(cors({
  origin: 'http://localhost:4200', // Permite solicitudes desde este origen
}));

// Configuración del motor de vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categorias_inventario', categorias_inventarioRouter);
app.use('/categorias_platos', categorias_platosRouter);
app.use('/facturas', facturasRouter);
app.use('/ingredientes', ingredientesRouter);
app.use('/inventario', inventarioRouter);
app.use('/platos', platosRouter);
app.use('/mesas', mesasRouter);
app.use('/pedidos_por_mesa', pedidos_por_mesaRouter);
app.use('/pedidos', pedidosRouter);
app.use('/platos_ingredientes', platos_ingredientesRouter);
app.use('/sesiones_usuarios', sesiones_usuariosRouter);
app.use('/tipos_de_usuario', tipos_de_usuarioRouter);
app.use('/usuarios', usuariosRouter);
app.use('/enviarFacturaCorreo', enviarFacturaCorreoRouter);
app.use('/api', predictRoutes); // Usa la ruta de predicción bajo el prefijo /api

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Exportar la aplicación
module.exports = app;
