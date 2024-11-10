const controller = {};

// Mostrar todos los productos y categorías
controller.mostrar = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en el servidor: ' + err.message);
        
        // Consultar productos
        conn.query('SELECT * FROM productos', (error, productos) => {
            if (error) {
                console.error('Error al mostrar los productos:', error);
                return res.status(400).json(error);
            }
            
            // Consultar categorías
            conn.query('SELECT * FROM categorias', (error, categorias) => {
                if (error) {
                    console.error('Error al mostrar las categorías:', error);
                    return res.status(400).json(error);
                }
                
                // Renderizar la vista y pasar productos y categorías
                res.render("dashboard/productos", { productos: productos, categorias: categorias });
            });
        });
    });
};


// Crear un producto nuevo
controller.crear = (req, res) => {
    const { nombre, descripcion, precio, cantidad_en_almacen, categoria_id } = req.body;

    // Verifica que se haya subido una imagen
    if (!req.file) {
        return res.status(400).send("No se ha subido ninguna imagen.");
    }

    const imagen = req.file.filename; // Solo guarda el nombre del archivo

    const nuevoProducto = { 
        nombre, 
        descripcion, 
        precio, 
        cantidad_en_almacen, 
        cantidad_vendida: 0, 
        categoria_id, 
        imagen
    };

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en el servidor: ' + err.message);
        conn.query('INSERT INTO productos SET ?', nuevoProducto, (error, resultados) => {
            if (error) {
                console.error('Error al crear un producto:', error);
                res.status(400).json(error);
            } else {
                res.redirect("/almacen/productos");
            }
        });
    });
};

// Editar un producto
controller.editar = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_en_almacen, categoria_id } = req.body;

    // Crea el objeto con los datos que se actualizarán
    let actualizadoProducto = { nombre, descripcion, precio, cantidad_en_almacen, categoria_id };

    // Si hay una nueva imagen, actualiza también el campo de la imagen
    if (req.file) {
        actualizadoProducto.imagen = req.file.filename;
    }

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en el servidor: ' + err.message);
        conn.query('UPDATE productos SET ? WHERE id = ?', [actualizadoProducto, id], (error, resultados) => {
            if (error) {
                console.error('Error al editar un producto:', error);
                res.status(400).json(error);
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
        if (err) return res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });

        conn.query('DELETE FROM productos WHERE id = ?', [id], (error, resultados) => {
            if (error) {
                console.error('Error al eliminar un producto:', error);
                return res.status(400).json({ success: false, message: 'Error al eliminar el producto.' });
            }

            if (resultados.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }

            // Si el producto se eliminó correctamente, responde con éxito
            res.json({ success: true, message: 'Producto eliminado correctamente.' });
        });
    });
};


module.exports = controller;
