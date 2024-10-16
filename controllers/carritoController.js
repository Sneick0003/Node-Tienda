exports.agregarAlCarrito = (req, res) => {
    const { producto_id, cantidad } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Error en la conexión a la base de datos: ' + err);

        // Consultar el nombre del producto
        conn.query('SELECT nombre FROM productos WHERE id = ?', [producto_id], (error, results) => {
            if (error || results.length === 0) {
                return res.status(404).send('Producto no encontrado');
            }
            const nombreProducto = results[0].nombre;

            if (!req.session.carrito) {
                req.session.carrito = [];
            }
            req.session.carrito.push({ producto_id, nombre: nombreProducto, cantidad: parseInt(cantidad, 10) });
            res.redirect('/productos/carrito');
        });
    });
};


exports.mostrarCarrito = (req, res) => {
    res.render('vender/carrito', { carrito: req.session.carrito });
};

exports.finalizarCompra = (req, res) => {
    if (!req.session.carrito || req.session.carrito.length === 0) {
        return res.send("No hay productos en el carrito.");
    }

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send('Error en la conexión a la base de datos: ' + err);
        }

        const carrito = req.session.carrito;
        const promises = carrito.map(item => {
            return new Promise((resolve, reject) => {
                conn.query('UPDATE productos SET cantidad_en_almacen = cantidad_en_almacen - ?, cantidad_vendida = cantidad_vendida + ? WHERE id = ?',
                    [item.cantidad, item.cantidad, item.producto_id], (error, results) => {
                        if (error) {
                            return reject('Error al actualizar el inventario');
                        }

                        conn.query('INSERT INTO compras (producto_id, cantidad) VALUES (?, ?)',
                            [item.producto_id, item.cantidad], (err, results) => {
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
                req.session.carrito = [];
                res.redirect('/productos/comprar');
            })
            .catch(error => {
                res.status(500).send(error);
            });
    });
};

