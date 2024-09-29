const bcrypt = require('bcrypt');
const saltRounds = 10;


// Renderizar el formulario de login y registro
exports.renderLogin = (req, res) => {
    res.render('Login/login', { 
        message: req.session.message || '',
        messageType: req.session.messageType || ''
    });

    // Limpiar el mensaje después de mostrarlo
    req.session.message = ''; 
    req.session.messageType = ''; 
};

// Procesar el registro de usuario
exports.register = (req, res) => {
    const { nombre, email, contra } = req.body;
  
    req.getConnection((err, connection) => {
      if (err) throw err;
  
      const checkUserQuery = 'SELECT * FROM login WHERE email = ?';
      connection.query(checkUserQuery, [email], (err, results) => {
        if (err) throw err;
  
        if (results.length > 0) {
          req.session.message = 'El correo electrónico ya está registrado';
          req.session.messageType = 'register';
          res.redirect('/login');
        } else {
          // Encriptar la contraseña antes de guardarla en la base de datos
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
  
            bcrypt.hash(contra, salt, (err, hash) => {
              if (err) throw err;
  
              const insertUserQuery = 'INSERT INTO login (nombre, email, contra) VALUES (?, ?, ?)';
              connection.query(insertUserQuery, [nombre, email, hash], (err, results) => {
                if (err) throw err;
  
                req.session.message = 'Registro exitoso, por favor inicie sesión';
                req.session.messageType = 'register';
                res.redirect('/login');
              });
            });
          });
        }
      });
    });
  };
  
// Procesar el inicio de sesión
exports.login = async (req, res) => {
    const { email, contra } = req.body;

    try {
        req.getConnection(async (err, conn) => {
            if (err) {
                req.session.message = 'Error de conexión.';
                req.session.messageType = 'login';
                return res.redirect('/login');
            }

            // Consultar el usuario por correo
            conn.query('SELECT * FROM login WHERE email = ?', [email], async (err, results) => {
                if (err) {
                    req.session.message = 'Error en la consulta.';
                    req.session.messageType = 'login';
                    return res.redirect('/login');
                }

                if (results.length === 0) {
                    req.session.message = 'Credenciales incorrectas.';
                    req.session.messageType = 'login';
                    return res.redirect('/login');
                }

                const user = results[0];
                const match = await bcrypt.compare(contra, user.contra);

                if (!match) {
                    req.session.message = 'Credenciales incorrectas.';
                    req.session.messageType = 'login';
                    return res.redirect('/login');
                }

                // Obtener roles del usuario
                conn.query(`
                    SELECT roles.rol_nombre 
                    FROM usuario_roles 
                    JOIN roles ON usuario_roles.rol_id = roles.id 
                    WHERE usuario_roles.usuario_id = ?
                `, [user.id], (err, results) => {
                    if (err) {
                        req.session.message = 'Error al obtener roles.';
                        req.session.messageType = 'login';
                        return res.redirect('/login');
                    }

                    const roles = results.map(row => row.rol_nombre);
                    req.session.user = { id: user.id, roles };

                    // Redirigir según el rol
                    if (roles.includes('Admin')) {
                        // Redirigir a la vista del home si el usuario tiene rol de administrador
                        return res.redirect('/home');
                    } else {
                        // Redirigir a la vista de inicio si el usuario tiene otro rol
                        return res.redirect('/');
                    }
                });
            });
        });
    } catch (error) {
        req.session.message = 'Error al iniciar sesión.';
        req.session.messageType = 'login';
        res.redirect('/login');
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        // Redirigir al formulario de login después de cerrar sesión
        res.redirect('/');
    });
};
