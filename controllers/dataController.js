const controller = {};

// Mostrar todos los alumnos
controller.mostrar = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) throw err;
    conn.query('SELECT * FROM alumnos', (error, resultados) => {
      if (error) {
        console.error('Error al mostrar alumnos:', error);
        res.json(error);
      } else {
        const alumnosPro = resultados.map(alumno => {
          const{ calificacion1, calificacion2, calificacion3 } = alumno;
          const promedio = (parseFloat(calificacion1)+ parseFloat(calificacion2)+ parseFloat(calificacion3)) / 3;
          return { ...alumno, promedio: promedio.toFixed(2)};
        });
        res.render("sections/tables", { data: alumnosPro });
      }
    });
  });
};

// Crear un nuevo alumno
controller.crear = (req, res) => {
  const nuevoAlumno = req.body;
  req.getConnection((err, conn) => {
    if (err) throw err;
    conn.query('INSERT INTO alumnos SET ?', [nuevoAlumno], (error, resultados) => {
      if (error) {
        console.error('Error al crear alumno:', error);
        res.json(error);
      } else {
        res.redirect("/tables");
      }
    });
  });
};

// Editar un alumno existente
controller.editar = (req, res) => {
  const { id } = req.params;
  const actualizadoAlumno = req.body;
  req.getConnection((err, conn) => {
    if (err) throw err;
    conn.query('UPDATE alumnos SET ? WHERE id = ?', [actualizadoAlumno, id], (error, resultados) => {
      if (error) {
        console.error('Error al editar alumno:', error);
        res.json(error);
      } else {
        res.redirect("/tables");
      }
    });
  });
};

// Eliminar un alumno
controller.eliminar = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    if (err) throw err;
    conn.query('DELETE FROM alumnos WHERE id = ?', [id], (error, resultados) => {
      if (error) {
        console.error('Error al eliminar alumno:', error);
        res.json(error);
      } else {
        res.redirect("/tables");
      }
    });
  });
};

module.exports = controller;
