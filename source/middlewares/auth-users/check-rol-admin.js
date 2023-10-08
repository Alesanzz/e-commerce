  export function checkRolAdmin(req, res, next) {
    if (req.session.user && req.session.user.admin === true) {
      return next();
    }
    return res.redirect("/users/login");
  }