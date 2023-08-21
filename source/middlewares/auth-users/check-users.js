export function checkUser(req, res, next) {
  if (req.session.user && req.session.user.email) {
    return next();
  }
  return res.redirect("/users/login");
}
