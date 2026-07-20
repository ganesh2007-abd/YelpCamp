module.exports.storereturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        // console.log(req.path,req.originalUrl)
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next()
}