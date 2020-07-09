module.exports = {
    // verifica si el usuario esta logeado
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next(); // que continue con el siguiente codigo en la ruta 
        } //si no esta logeado
        return res.redirect('/signin');
    },

    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    }
};