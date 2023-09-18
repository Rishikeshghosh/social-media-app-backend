import express from "express";
import { varifyToken } from "../Middleware/authorization.js";
import {
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost,
  setComments,
} from "../controller/Posts.js";

const router = express.Router();

router
  .get("/", varifyToken, getFeedPosts)
  .get("/:userId/posts", varifyToken, getUserPosts)
  .patch("/comment/update", varifyToken, setComments)
  .patch("/:id/likes", varifyToken, likePost)
  .delete("/delete/:postId", varifyToken, deletePost);

export default router;
