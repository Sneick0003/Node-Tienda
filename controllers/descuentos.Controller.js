const descuentosController = {}

descuentosController.descuento = (req, res) => {
    res.render('descuentos/descuentos');
}

module.exports = descuentosController;