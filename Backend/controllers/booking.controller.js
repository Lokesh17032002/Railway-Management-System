import pool from '../config/db.js'
import { validationResult } from 'express-validator'
import createBookingTable from "../models/booking.model.js"

export const bookSeat = async(req,res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { trainId, seatsBooked } = req.body
  const userId = req.user.userId

  const client=await pool.connect()

  try {
    await createBookingTable();

    await client.query('BEGIN');

    // console.log('Booking started');
    const getTrain =  `SELECT availableSeats FROM trains WHERE trainId = $1 FOR UPDATE NOWAIT`

    const train = await client.query(getTrain, [trainId]);

    if(train.rows.length === 0){
      await client.query('ROLLBACK'); 
      client.release();
      return res.status(404).json({ message: "Train not found" })
    }

    const availableSeats= train.rows[0].availableseats;
    //console.log('Available seats:', availableSeats);

    if(seatsBooked > availableSeats){
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ message: "Not enough seats available" })
    }

    const updateSeats= `UPDATE trains SET availableSeats = availableSeats-$1 WHERE trainId = $2`;
    await pool.query(updateSeats, [seatsBooked, trainId])

    const Book = `INSERT INTO bookings (userId, trainId, seatsBooked, bookingDate, bookingStatus)
      VALUES ($1, $2, $3, NOW(), 'Confirmed')
      RETURNING bookingId, trainId, seatsBooked, bookingDate, bookingStatus;`;
    const booked = await client.query(Book, [userId, trainId, seatsBooked])

    await client.query('COMMIT')
    client.release();

    res.status(201).json({ message: "Booking successful", booking: booked.rows[0] })
  } 
  catch(error){
    await client.query('ROLLBACK');
    client.release();
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' })
  }
};

export const getBookingDetails = async(req,res) => {
  const { bookingId } = req.params;

  try{
    await createBookingTable();
    
    const findBooking = `SELECT b.*, t.trainName, t.sourceStation, t.destinationStation
      FROM bookings b
      JOIN trains t ON b.trainId = t.trainId
      WHERE b.bookingId = $1;`;
    const booking = await pool.query(findBooking, [bookingId])

    if(booking.rows.length === 0){
      return res.status(404).json({ message: "No Booking Found" })
    }

    res.status(200).json({ booking: booking.rows[0] })
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


