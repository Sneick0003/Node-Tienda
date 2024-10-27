const path = require('path');
const multer = require('multer');

// Configuración de Multer para la carga de archivos
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads/productos'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const controller = {};

// Mostrar todos los productos con sus categorías para la vista
controller.mostrar = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).json({ message: "Error en la conexión de base de datos", error: err });
        }
        conn.query('SELECT * FROM categorias', (errorCategorias, categorias) => {
            if (errorCategorias) {
                console.error('Error al cargar categorías:', errorCategorias);
                return res.status(500).json({ message: "Error al cargar categorías", error: errorCategorias });
            }
            conn.query('SELECT productos.*, categorias.nombre as categoria_nombre FROM productos LEFT JOIN categorias ON productos.categoria_id = categorias.id', (errorProductos, productos) => {
                if (errorProductos) {
                    console.error('Error al mostrar los productos:', errorProductos);
                    return res.status(500).json({ message: "Error al mostrar productos", error: errorProductos });
                }
                // Asegúrate de que productos y categorias están definidos, incluso si están vacíos
                res.render("dashboard/productos", { productos: productos || [], categorias: categorias || [] });
            });
        });
    });
};


// Renderizar el formulario de creación con categorías disponibles
controller.renderCrear = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).json({ message: "Error en la conexión de base de datos", error: err });
            return;
        }
        conn.query('SELECT * FROM categorias', (error, categorias) => {
            if (error) {
                console.error('Error al cargar categorías:', error);
                res.status(500).json({ message: "Error al cargar categorías", error });
                return;
            }
            res.render("dashboard/addProducto", { categorias });
        });
    });
};

// Crear un nuevo producto
controller.crear = [upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, cantidad_en_almacen, categoria_id } = req.body;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).json({ message: "Error en la conexión de base de datos", error: err });
            return;
        }

        conn.query('INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, categoria_id) VALUES (?, ?, ?, ?, ?)', [nombre, descripcion, precio, cantidad_en_almacen, categoria_id], (error, results) => {
            if (error) {
                console.error('Error al crear un producto:', error);
                res.status(500).json({ message: "Error al crear el producto", error });
                return;
            }

            // Si se subió una imagen, inserta su ruta en la tabla 'imagenes'
            if (req.file) {
                const imagenUrl = req.file.path;
                const productoId = results.insertId; // ID del producto recién creado
                conn.query('INSERT INTO imagenes (producto_id, url_imagen, descripcion) VALUES (?, ?, ?)', [productoId, imagenUrl, 'Imagen del producto'], (imgError) => {
                    if (imgError) {
                        console.error('Error al guardar la imagen del producto:', imgError);
                        res.status(500).json({ message: "Error al guardar imagen del producto", error: imgError });
                        return;
                    }
                    res.redirect("/almacen/productos");
                });
            } else {
                res.redirect("/almacen/productos");
            }
        });
    });
}];

// Renderizar el formulario de edición con categorías
controller.renderEditar = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).json({ message: "Error en la conexión de base de datos", error: err });
            return;
        }
        conn.query('SELECT * FROM productos WHERE id = ?', [id], (errorProducto, producto) => {
            if (errorProducto) {
                console.error('Error al cargar el producto:', errorProducto);
                res.status(500).json({ message: "Error al cargar el producto", error: errorProducto });
                return;
            }
            conn.query('SELECT * FROM categorias', (errorCategorias, categorias) => {
                if (errorCategorias) {
                    console.error('Error al cargar categorías:', errorCategorias);
                    res.status(500).json({ message: "Error al cargar categorías", error: errorCategorias });
                    return;
                }
                res.render("dashboard/editProducto", { producto: producto[0], categorias });
            });
        });
    });
};

// Editar un producto existente
controller.editar = [upload.single('imagen'), (req, res) => {
    const { id, nombre, descripcion, precio, cantidad_en_almacen, categoria_id } = req.body;
    const imagenActual = req.body.imagenActual; // Asumimos que hay un campo oculto en el formulario que mantiene la imagen actual si no se sube una nueva
    const imagen = req.file ? req.file.path : imagenActual;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).json({ message: "Error en la conexión de base de datos", error: err });
            return;
        }

        conn.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad_en_almacen = ?, categoria_id = ?, imagen = ? WHERE id = ?', [nombre, descripcion, precio, cantidad_en_almacen, categoria_id, imagen, id], (error, results) => {
            if (error) {
                console.error('Error al editar un producto:', error);
                res.status(500).json({ message: "Error al editar el producto", error });
                return;
            }
            res.redirect("/almacen/productos");
        });
    });
}];

// Eliminar un producto
controller.eliminar = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).json({ message: "Error en la conexión de base de datos", error: err });
            return;
        }
        conn.query('DELETE FROM productos WHERE id = ?', [id], (error, resultados) => {
            if (error) {
                console.error('Error al eliminar un producto:', error);
                res.status(500).json({ message: "Error al eliminar el producto", error });
                return;
            }
            res.redirect("/almacen/productos");
        });
    });
};

module.exports = controller;
