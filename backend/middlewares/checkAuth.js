const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function checkAuth(req, res, next) {
  const authorizationHeader =
    req.headers["Authorization"] ?? req.headers["authorization"];

  if (!authorizationHeader) return res.sendStatus(401);

  const [type, token] = authorizationHeader.split(/\s+/);

  if (type !== "Bearer") return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user) return res.sendStatus(401);

    req.user = user;
    console.log(`Connected as ${user.id}`);
    next();
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
};
