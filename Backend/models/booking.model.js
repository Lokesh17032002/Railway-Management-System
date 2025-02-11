import pkg from 'pg'
import pool from "../config/db.js"

const {Pool} = pkg

const createBookingTable = async() => {
  const query = `CREATE TABLE IF NOT EXISTS bookings(
    bookingId SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(userId),
    trainId INTEGER REFERENCES trains(trainId),
    seatsBooked INTEGER NOT NULL,
    bookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bookingStatus VARCHAR(50) DEFAULT 'Pending',
  )`

  await pool.query(query);
}

createBookingTable()
export default createBookingTable;

