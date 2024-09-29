const auth = {}


auth.auth = (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
};

module.exports = auth;
