import pkg from 'pg'
import pool from "../config/db.js"

const {Pool} = pkg

const createTrainTable = async() => {
  const query = `CREATE TABLE IF NOT EXISTS trains(
    trainId SERIAL PRIMARY KEY,
    trainNumber VARCHAR(255) UNIQUE NOT NULL,
    trainName VARCHAR(255) NOT NULL,
    sourceStation VARCHAR(255) NOT NULL,
    destinationStation VARCHAR(255) NOT NULL,
    totalSeats INTEGER NOT NULL,
    availableSeats INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`

  await pool.query(query);
}

export default createTrainTable;

