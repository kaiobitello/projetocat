export const eAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1) {
      return next()
    }
  
    req.flash("error_msg", "Você precisa ser administrador.")
    res.redirect("/")
  }
  