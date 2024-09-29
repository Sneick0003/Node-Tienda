const controller = {};

// Mostrar todos los productos
controller.mostrar = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('SELECT * FROM productos', (error, resultados) => {
            if (error) {
                console.error('Error al mostrar los productos:', error);
                res.json(error);
            } else {
                res.render("dashboard/productos", { productos: resultados });
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
                res.redirect("/productos");
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
                res.redirect("/productos");
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
                res.redirect("/productos");
            }
        });
    });
};

module.exports = controller;
