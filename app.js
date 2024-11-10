const express = require('express');
const path = require('path');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const session = require('express-session');
const dotenv = require('dotenv');
const fs = require('fs');
const { isAuthenticated } = require('./middleware/authMiddleware');
const app = express();

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexión a la base de datos
app.use(myConnection(mysql, dbConfig, 'single'));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

// Middleware para parsear formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rutas públicas
app.use('/', require('./routes/index'));
app.use('/inicio', require('./routes/login.router'));
app.use('/productos', require('./routes/producto'));
app.use('/nosotros', require('./routes/nosotrosRouter'));
app.use('/descuentos', require('./routes/decuentoRouter'));

// Rutas protegidas
app.use('/home', isAuthenticated, require('./routes/home'));
app.use('/almacen', isAuthenticated, require('./routes/producto.router')); // Rutas con carga de imágenes
app.use('/compras', isAuthenticated, require('./routes/compras'));
app.use('/lista', isAuthenticated, require('./routes/categoria.Router'));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile('status.html', { root: path.join(__dirname, 'public/html/') });
});

// Servir manifest.json desde la raíz del proyecto
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
