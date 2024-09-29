exports.mostrarProductos = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send('Error en la conexión a la base de datos: ' + err);
        }
        conn.query('SELECT * FROM productos WHERE cantidad_en_almacen > 0', (error, productos) => {
            if (error) {
                res.status(500).send('Error al recuperar los productos');
            } else {
                // Asegúrate de incluir el carrito en el contexto
                res.render('vender/comprar', { productos: productos, carrito: req.session.carrito || [] });
            }
        });
    });
};
