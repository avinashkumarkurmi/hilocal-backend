import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { Pool } = pkg; // Extract Pool from the default export

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default is 5432
});

// Function to execute queries
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  } finally {
    client.release();
  }
};
