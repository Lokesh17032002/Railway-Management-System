import pkg from 'pg'
import pool from "../config/db.js"

const {Pool} = pkg

const createUserTable = async() => {
  const query = `CREATE TABLE IF NOT EXISTS users(
    userId SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phoneNumber VARCHAR(255) NOT NULL,
    address TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  await pool.query(query);
}

export default createUserTable;

