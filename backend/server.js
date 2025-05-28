const express = require("express");
const app = express();
const userRouter = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use(userRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
