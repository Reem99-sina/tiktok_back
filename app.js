const express = require("express");
const http = require("http");
const serverless = require("serverless-http");
const { connectdb } = require("./connect");
const userRouter = require("./users/users.router");
const postsRouter = require("./posts/posts.router");
const likesRouter = require("./likes/likes.router");
const commentsRouter = require("./comments/comment.router");
// require("./uploads/picture")
const cors=require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/picture", express.static("./uploads/picture"));
app.use("/user", userRouter);
app.use("/like", likesRouter);
app.use("/comment", commentsRouter);
app.use("/post", postsRouter);



connectdb();

// const server = http.createServer(app);

const PORT = process.env.PORT || 1200;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
// module.exports.handler = serverless(app);
