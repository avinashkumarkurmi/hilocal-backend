import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const saltRounds = parseInt(process.env.SALTS_ROUND);

export const hashPassword = async (plainPassword) => {
  try {
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    return hashed;
  } catch (error) {
    console.error("Hashing error:", error);
    throw error;
  }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Comparison error:", error);
    throw error;
  }
};

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
