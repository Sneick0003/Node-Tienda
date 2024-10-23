exports.mostrarCompras = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión a la base de datos:", err);
            return res.status(500).send("Error en la conexión a la base de datos");
        }

        const query = `
            SELECT 
                l.id AS usuario_id,
                l.nombre AS usuario_nombre,
                MAX(c.fecha_compra) AS ultima_compra,
                GROUP_CONCAT(DISTINCT CONCAT(p.nombre, '|', c.cantidad) ORDER BY c.fecha_compra SEPARATOR ', ') AS productos
            FROM compras c
            JOIN productos p ON c.producto_id = p.id
            JOIN login l ON c.usuario_id = l.id
            GROUP BY l.id, l.nombre
            ORDER BY l.nombre;
        `;

        conn.query(query, (error, results) => {
            if (error) {
                console.error("Error al recuperar las compras:", error);
                return res.status(500).send("Error al recuperar las compras");
            }
            res.render("dashboard/compras", { compras: results });
        });
    });
};