const controller = {};

// Mostrar todos los productos con sus categorías para la vista
controller.mostrar = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('SELECT * FROM categorias', (errorCategorias, categorias) => {
            if (errorCategorias) {
                console.error('Error al cargar categorías:', errorCategorias);
                res.json(errorCategorias);
            } else {
                conn.query('SELECT productos.*, categorias.nombre as categoria_nombre FROM productos LEFT JOIN categorias ON productos.categoria_id = categorias.id', (errorProductos, productos) => {
                    if (errorProductos) {
                        console.error('Error al mostrar los productos:', errorProductos);
                        res.json(errorProductos);
                    } else {
                        res.render("dashboard/productos", { productos, categorias });
                    }
                });
            }
        });
    });
};

// Renderizar el formulario de creación con categorías disponibles
controller.renderCrear = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('SELECT * FROM categorias', (error, categorias) => {
            if (error) {
                console.error('Error al cargar categorías:', error);
                res.json(error);
            } else {
                res.render("dashboard/addProducto", { categorias });
            }
        });
    });
};

// Crear un producto nuevo
controller.crear = (req, res) => {
    const nuevoProducto = req.body;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('INSERT INTO productos SET ?', [nuevoProducto], (error, resultados) => {
            if (error) {
                console.error('Error al crear un producto:', error);
                res.json(error);
            } else {
                res.redirect("/almacen/productos");
            }
        });
    });
};

// Renderizar el formulario de edición con categorías
controller.renderEditar = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('SELECT * FROM productos WHERE id = ?', [id], (errorProducto, productos) => {
            if (errorProducto) {
                console.error('Error al cargar el producto:', errorProducto);
                res.json(errorProducto);
            } else {
                conn.query('SELECT * FROM categorias', (errorCategorias, categorias) => {
                    if (errorCategorias) {
                        console.error('Error al cargar categorías:', errorCategorias);
                        res.json(errorCategorias);
                    } else {
                        res.render("dashboard/editProducto", { producto: productos[0], categorias });
                    }
                });
            }
        });
    });
};

// Editar un producto
controller.editar = (req, res) => {
    const { id } = req.params;
    const actualizadoProducto = req.body;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('UPDATE productos SET ? WHERE id = ?', [actualizadoProducto, id], (error, resultados) => {
            if (error) {
                console.error('Error al editar un producto:', error);
                res.json(error);
            } else {
                res.redirect("/almacen/productos");
            }
        });
    });
};

// Eliminar un producto
controller.eliminar = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('DELETE FROM productos WHERE id = ?', [id], (error, resultados) => {
            if (error) {
                console.error('Error al eliminar un producto:', error);
                res.json(error);
            } else {
                res.redirect("/almacen/productos");
            }
        });
    });
};

module.exports = controller;
