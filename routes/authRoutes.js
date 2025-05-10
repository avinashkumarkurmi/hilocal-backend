import express, { Router } from "express";
import jwt from "jsonwebtoken";
import { login, signup, checkToken } from "../controllers/authController.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);
  try {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.sendStatus(403);
  }
};

router.post("/login", login);
router.post("/signup", signup);
router.get("/checkToken", authMiddleware, checkToken);

// router.get("/checkToken", authMiddleware, async (req, res) => {
//   res.sendStatus(202);
// });

export default router;
