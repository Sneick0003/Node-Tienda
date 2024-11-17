const productosController = {};

// Agregar productos al carrito
productosController.agregarAlCarrito = (req, res) => {
    const { producto_id, cantidad } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en la conexión a la base de datos: ' + err);

        conn.query('SELECT nombre, imagen FROM productos WHERE id = ?', [producto_id], (error, results) => {
            if (error || results.length === 0) {
                return res.status(404).send('Producto no encontrado');
            }
            const { nombre: nombreProducto, imagen } = results[0];

            if (!req.session.carrito) {
                req.session.carrito = [];
            }

            const existingItemIndex = req.session.carrito.findIndex(item => item.producto_id === producto_id);
            if (existingItemIndex !== -1) {
                req.session.carrito[existingItemIndex].cantidad += parseInt(cantidad, 10);
            } else {
                req.session.carrito.push({
                    producto_id,
                    nombre: nombreProducto,
                    imagen,
                    cantidad: parseInt(cantidad, 10)
                });
            }

            res.redirect('/productos/comprar');
        });
    });
};


// Mostrar productos disponibles y contenido del carrito en la misma vista
productosController.mostrarProductos = (req, res) => {
    const categoriaId = req.query.categoria; // Lee el ID de la categoría de los parámetros de consulta
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send('Error en la conexión a la base de datos: ' + err);
        }

        // Consulta SQL para obtener todas las categorías
        conn.query('SELECT * FROM categorias', (error, categorias) => {
            if (error) {
                return res.status(500).send('Error al recuperar las categorías');
            }

            // Consulta SQL para obtener productos, filtrando por categoria_id si está especificada
            let query = 'SELECT * FROM productos WHERE cantidad_en_almacen > 0';
            const params = [];

            if (categoriaId) {
                query += ' AND categoria_id = ?';
                params.push(categoriaId);
            }

            conn.query(query, params, (error, productos) => {
                if (error) {
                    res.status(500).send('Error al recuperar los productos');
                } else {
                    // Renderizar la vista con productos filtrados, carrito, y categorías
                    res.render('vender/comprar', { 
                        productos: productos, 
                        carrito: req.session.carrito || [], 
                        categorias: categorias, 
                        categoriaSeleccionada: categoriaId 
                    });
                }
            });
        });
    });
};


// Finalizar la compra
productosController.finalizarCompra = (req, res) => {
    if (!req.session.carrito || !Array.isArray(req.session.carrito) || req.session.carrito.length === 0) {
        return res.send("No hay productos en el carrito.");
    }
    if (!req.session.usuarioId) {
        return res.status(403).send("Usuario no identificado.");
    }

    const usuarioId = req.session.usuarioId;

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send('Error en la conexión a la base de datos: ' + err);
        }

        conn.beginTransaction(err => {
            if (err) {
                return res.status(500).send('Error al iniciar la transacción');
            }

            const carrito = req.session.carrito; // Ya es un arreglo

            const promises = carrito.map(item => {
                return new Promise((resolve, reject) => {
                    conn.query('UPDATE productos SET cantidad_en_almacen = cantidad_en_almacen - ?, cantidad_vendida = cantidad_vendida + ? WHERE id = ?',
                        [item.cantidad, item.cantidad, item.producto_id], (error) => {
                            if (error) {
                                return reject('Error al actualizar el inventario');
                            }

                            conn.query('INSERT INTO compras (producto_id, cantidad, usuario_id) VALUES (?, ?, ?)',
                                [item.producto_id, item.cantidad, usuarioId], (err) => {
                                    if (err) {
                                        return reject('Error al registrar la compra');
                                    }
                                    resolve();
                                });
                        });
                });
            });

            Promise.all(promises)
                .then(() => {
                    conn.commit(err => {
                        if (err) {
                            conn.rollback(() => {
                                res.status(500).send('Error al finalizar la transacción');
                            });
                        } else {
                            req.session.carrito = []; // Limpiar el carrito después de la compra
                            res.redirect('/productos/comprar');
                        }
                    });
                })
                .catch(error => {
                    conn.rollback(() => {
                        res.status(500).send(error);
                    });
                });
        });
    });
};


module.exports = productosController;
