const hier = ["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"];

module.exports = function checkRole(expectedRole) {
  return function (req, res, next) {
    const userRole = req.user.role;
    if (userRole !== expectedRole) return res.sendStatus(403);
    next();
  };
};
