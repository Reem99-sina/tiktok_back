const express = require("express");
const http = require("http");

const { connectdb } = require("./connect");
const userRouter = require("./users/users.router");
const postsRouter = require("./posts/posts.router");
const likesRouter = require("./likes/likes.router");
const commentsRouter = require("./comments/comment.router");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/user", userRouter);
app.use("/like", likesRouter);
app.use("/comment", commentsRouter);
app.use("/post", postsRouter);



connectdb();

const server = http.createServer(app);

const PORT = process.env.PORT || 1200;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
