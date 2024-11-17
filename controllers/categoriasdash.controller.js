const categoriasController = {}

categoriasController.mostrar = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('SELECT * FROM categorias', (error, resultados) => {
            if (error) {
                console.error('Error al mostrar las categorias:', error);
                res.status(500).json({ message: "Error al cargar categorías", error });
            } else {
                res.render("dashboard/categorias", { categorias: resultados });
            }
        });
    });
};

categoriasController.crear = (req, res) => {
    const nuevaCategoria = req.body;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('INSERT INTO categorias SET ?', [nuevaCategoria], (error, resultados) => {
            if (error) {
                console.error('Error al crear una categoria:', error);
                res.status(500).json({ message: "Error al crear categoría", error });
            } else {
                res.json({ message: "Categoría creada correctamente", id: resultados.insertId });
            }
        });
    });
};

categoriasController.editar = (req, res) => {
    const { id } = req.params;
    const actualizadoCategoria = req.body;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('UPDATE categorias SET ? WHERE id = ?', [actualizadoCategoria, id], (error, resultados) => {
            if (error) {
                console.error('Error al editar una categoria:', error);
                res.status(500).json({ message: "Error al editar categoría", error });
            } else {
                res.json({ message: "Categoría actualizada correctamente" });
            }
        });
    });
};

categoriasController.eliminar = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query('DELETE FROM categorias WHERE id = ?', [id], (error, resultados) => {
            if (error) {
                console.error('Error al eliminar una categoria:', error);
                res.status(500).json({ message: "Error al eliminar categoría", error });
            } else {
                res.json({ message: "Categoría eliminada correctamente" });
            }
        });
    });
};

module.exports = categoriasController;
