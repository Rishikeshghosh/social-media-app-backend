import express from "express";
import { getLoggedInUser, loginUser } from "../controller/auth.js";
import { varifyToken } from "../Middleware/authorization.js";
const router = express.Router();

router
  .post("/login", loginUser)
  .post("/getLoggedINuser/details", getLoggedInUser);

export default router;
