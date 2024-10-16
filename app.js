const express = require('express');
const path = require('path');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const session = require('express-session');
const dotenv = require('dotenv');
const { isAuthenticated } = require('./middleware/authMiddleware');
const app = express();

// Cargar variables de entorno
dotenv.config();

// Configuración para la base de datos
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
  cookie: { maxAge: 600000 } // Configura según tus necesidades
}));

// Middleware para parsear formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas públicas
app.use('/', require('./routes/index')); // Ruta para la vista raíz

app.use('/inicio', require('./routes/login.router')); // Ruta para la Vista login
app.use('/productos', require('./routes/producto'));// ruta para comprar productos 


// Rutas protegidas
app.use('/home', isAuthenticated, require('./routes/home')); // Ruta para después de iniciar sesión (protegida)
app.use('/almacen', isAuthenticated, require('./routes/producto.router')); // Ruta del CRUD de productos (protegida)
app.use('/compras', isAuthenticated, require('./routes/compras'));// ruta para ver las compras



// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile('status.html', { root: path.join(__dirname, 'public/html/') });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
