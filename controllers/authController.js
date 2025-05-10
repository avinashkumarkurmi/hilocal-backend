import jwt from "jsonwebtoken";
import { query } from "../db/db.js"; // PG client
import dotenv from "dotenv";
import { hashPassword, comparePassword } from "../index.js";

dotenv.config();
const SECRET = process.env.JWT_SECRET;
const defaultProfileUrl =
  "https://res.cloudinary.com/dhwjmtd9z/image/upload/v1746857729/profile_vpdz6m.jpg";

export const signup = async (req, res) => {
  const { userName, email, password, bio } = req.body;

  const userExists = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userExists.length)
    return res.status(400).json({ message: "User already exists" });

  const hash = await hashPassword(password);
  const newUser = await query(
    "INSERT INTO users (username, email, password, bio, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [userName, email, hash, bio, defaultProfileUrl]
  );

  const token = jwt.sign({ userId: newUser[0].id }, SECRET, {
    expiresIn: "7d",
  });
  console.log(token, "token");

  res.json({ token, dataFromDb: newUser });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await query("SELECT id FROM users WHERE email = $1", [email]);
  const hashPassword = await query(
    "SELECT password FROM users WHERE email = $1",
    [email]
  );

  if (!user.length || !comparePassword(password, hashPassword[0].password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user[0].id }, SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, dataFromDb: user });
};

export const checkToken = async (req, res) => {
  const userId = req.user.userId;
  const user = await query("select id from users where id = $1", [userId]);
  const token = jwt.sign({ userId: user[0].id }, SECRET, { expiresIn: "7d" });
  res.json({ token, dataFromDb: user });
};
