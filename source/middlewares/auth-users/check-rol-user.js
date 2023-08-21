  export function checkRolUser(req, res, next) {
    if (req.session.user && req.session.user.admin === false) {
      return next();
    }
    return res.status(401).render('error-page', { msg: 'please log in AS ADMIN!' });
  }