const descuentodashController = {};

// Mostrar todas las ofertas
descuentodashController.mostrar = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).json({ message: "Error al conectar con la base de datos", error: err });
        }

        conn.query('SELECT * FROM ofertas', (error, resultados) => {
            if (error) {
                console.error('Error al mostrar las ofertas:', error);
                return res.status(500).json({ message: "Error al cargar ofertas", error });
            }

            // Procesar y formatear fechas
            const descuentos = resultados.map(oferta => ({
                ...oferta,
                fecha_inicio: oferta.fecha_inicio
                    ? new Date(oferta.fecha_inicio).toISOString().slice(0, 16)
                    : null,
                fecha_fin: oferta.fecha_fin
                    ? new Date(oferta.fecha_fin).toISOString().slice(0, 16)
                    : null
            }));

            res.render("dashboard/descuentos", { descuentos });
        });
    });
};

// Crear una nueva oferta
descuentodashController.crear = (req, res) => {
    const nuevaOferta = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).json({ message: "Error al conectar con la base de datos", error: err });
        }

        conn.query('INSERT INTO ofertas SET ?', [nuevaOferta], (error, resultados) => {
            if (error) {
                console.error('Error al crear una oferta:', error);
                return res.status(500).json({ message: "Error al crear oferta", error });
            }

            res.redirect('/ofertas/descuentos');
        });
    });
};

// Editar una oferta existente
descuentodashController.editar = (req, res) => {
    const { id } = req.params;
    const ofertaActualizada = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).json({ message: "Error al conectar con la base de datos", error: err });
        }

        conn.query('UPDATE ofertas SET ? WHERE id = ?', [ofertaActualizada, id], (error, resultados) => {
            if (error) {
                console.error('Error al editar una oferta:', error);
                return res.status(500).json({ message: "Error al editar oferta", error });
            }

            if (resultados.affectedRows === 0) {
                return res.status(404).json({ message: "No se encontró la oferta para actualizar" });
            }

            res.json({ success: true, message: "Oferta actualizada correctamente" });
        });
    });
};


// Eliminar una oferta
descuentodashController.eliminar = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).json({ success: false, message: "Error al conectar con la base de datos", error: err });
        }

        conn.query('DELETE FROM ofertas WHERE id = ?', [id], (error, resultados) => {
            if (error) {
                console.error('Error al eliminar una oferta:', error);
                return res.status(500).json({ success: false, message: "Error al eliminar oferta", error });
            }

            if (resultados.affectedRows > 0) {
                res.json({ success: true, message: "Oferta eliminada correctamente" });
            } else {
                res.status(404).json({ success: false, message: "No se encontró la oferta para eliminar" });
            }
        });
    });
};

module.exports = descuentodashController;
