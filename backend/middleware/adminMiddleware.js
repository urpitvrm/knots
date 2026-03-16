const { authRequired, adminOnly } = require('./auth');

function requireAdmin(req, res, next) {
  return authRequired(req, res, (err) => {
    if (err) return next(err);
    return adminOnly(req, res, next);
  });
}

module.exports = {
  authRequired,
  adminOnly,
  requireAdmin
};

