import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { mongoDbConnection } from "./database/mongoDB.js";
import { register } from "./controller/auth.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import { varifyToken } from "./Middleware/authorization.js";
import { createPost } from "./controller/Posts.js";
import { changeProfiePic } from "./controller/users.js";

mongoDbConnection();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(express.json());
/* app.use(helmet());
//app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
); */
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, "build")));
app.use("/auth", authRouter);
app.use("/auth/users", userRouter);
app.use("/auth/posts", postsRouter);
app.post("/post", (req, res) => {
  const { email } = req.body;
  res.status(200).json(email);
});
app.post("/auth/register", register);
app.post("/auth/mainposts", varifyToken, createPost);
app.patch("/auth/change/profic/pic", varifyToken, changeProfiePic);

const PORT = dotenv.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNIG AT PORT ${PORT}`);
});
