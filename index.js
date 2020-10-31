const express = require("express");

const server = express();
const port = process.env.PORT || 4000;

const userRouter = require("./routers/usersRouter");

server.use(express.json());
server.use(userRouter);

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`** Running at http://localhost:${port}`);
});
