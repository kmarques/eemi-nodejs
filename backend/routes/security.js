const { Router } = require("express");
const User = require("../models/db/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = new Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.sendStatus(401);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.sendStatus(401);
  }

  const token = jwt.sign(
    {
      // role: user.role
    },
    process.env.JWT_SECRET,
    {
      subject: user.id.toString(),
      expiresIn: "1h",
    }
  );

  res.json({ token });
});

module.exports = router;
