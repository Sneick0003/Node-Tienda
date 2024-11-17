const getProductos = (req, res) => {
  req.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: err.message });

      // Consulta a la base de datos para obtener los productos
      const query = 'SELECT nombre, cantidad_en_almacen, cantidad_vendida FROM productos LIMIT 6';
      connection.query(query, (error, results) => {
          if (error) return res.status(500).json({ error: error.message });

          // Obtener el nombre del usuario desde la sesión
          const userName = req.session.user ? req.session.user.nombre : 'Invitado';

          // Renderiza la vista 'dashboard/home' con los resultados de la consulta
          res.render('dashboard/home', { productos: results, userName });
      });
  });
};

module.exports = { getProductos };
