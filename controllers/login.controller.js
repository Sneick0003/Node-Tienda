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
                res.redirect('/inicio/login');
            } else {
                // Encriptar la contraseña antes de guardarla en la base de datos
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    if (err) throw err;

                    bcrypt.hash(contra, salt, (err, hash) => {
                        if (err) throw err;

                        const insertUserQuery = 'INSERT INTO login (nombre, email, contra) VALUES (?, ?, ?)';
                        connection.query(insertUserQuery, [nombre, email, hash], (err, results) => {
                            if (err) throw err;

                            // Obtener el ID del nuevo usuario
                            const newUserId = results.insertId;

                            // Asignar automáticamente el rol de "Comprador"
                            const rolCompradorId = 2; // Asegúrate de que este ID corresponde al de "Comprador" en tu base de datos
                            const assignRoleQuery = 'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)';
                            connection.query(assignRoleQuery, [newUserId, rolCompradorId], (err, results) => {
                                if (err) throw err;

                                req.session.message = 'Registro exitoso, por favor inicie sesión';
                                req.session.messageType = 'register';
                                res.redirect('/inicio/login');
                            });
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
                return res.redirect('/inicio/login');
            }

            // Consultar el usuario por correo
            conn.query('SELECT * FROM login WHERE email = ?', [email], async (err, results) => {
                if (err) {
                    req.session.message = 'Error en la consulta.';
                    req.session.messageType = 'login';
                    return res.redirect('/inicio/login');
                }

                if (results.length === 0) {
                    req.session.message = 'Credenciales incorrectas.';
                    req.session.messageType = 'login';
                    return res.redirect('/inicio/login');
                }

                const user = results[0];
                const match = await bcrypt.compare(contra, user.contra);

                if (!match) {
                    req.session.message = 'Credenciales incorrectas.';
                    req.session.messageType = 'login';
                    return res.redirect('/inicio/login');
                }

                // Guardar el ID del usuario en la sesión
                req.session.usuarioId = user.id;

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
                        return res.redirect('/inicio/login');
                    }

                    const roles = results.map(row => row.rol_nombre);
                    req.session.user = { id: user.id, roles };

                    // Redirigir según el rol
                    if (roles.includes('Admin')) {
                        return res.redirect('/home');
                    } else {
                        return res.redirect('/');
                    }
                });
            });
        });
    } catch (error) {
        req.session.message = 'Error al iniciar sesión.';
        req.session.messageType = 'login';
        res.redirect('/inicio/login');
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/inicio/login');
    });
};
