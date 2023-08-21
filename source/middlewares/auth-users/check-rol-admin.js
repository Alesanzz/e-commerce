  export function checkRolAdmin(req, res, next) {
    if (req.session.user && req.session.user.admin === true) {
      return next();
    }
    return res.status(401).render('error-page', { msg: 'please log in AS ADMIN!' });
  }