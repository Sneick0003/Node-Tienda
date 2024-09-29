const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // Verificar si el usuario tiene el rol de administrador para la ruta específica
        if (req.path === '/home' && !req.session.user.roles.includes('Admin')) {
            return res.status(403).send('Acceso denegado: Debes ser administrador para acceder a esta página.');
        }
        return next(); // El usuario está autenticado y autorizado
    }
    res.redirect('/login'); // Redirigir al login si el usuario no está autenticado
};

module.exports = { isAuthenticated };
