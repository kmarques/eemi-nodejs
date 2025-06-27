const express = require("express");
const app = express();
const userRouter = require("./routes/users");
const securityRouter = require("./routes/security");
const articleRouter = require("./routes/articles");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use(securityRouter);
app.use(userRouter);
app.use(articleRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
