import express from "express";
import { varifyToken } from "../Middleware/authorization.js";
import {
  addRemoveFriends,
  getAllUsers,
  getUserFriends,
  getUsers,
} from "../controller/users.js";
const router = express.Router();

router
  .get("/:userId", varifyToken, getUsers)
  .get("/search/:keyword", getAllUsers)
  .get("/:userId/friends", varifyToken, getUserFriends)
  .patch("/update/:friendId", varifyToken, addRemoveFriends);

export default router;
