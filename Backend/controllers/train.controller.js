import pool from '../config/db.js';
import { validationResult } from 'express-validator';

export const addTrain = async(req,res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  const {trainNumber, trainName, sourceStation, destinationStation, totalSeats} = req.body;

  try{
    await createTrainTable()

    const getTrain = 'SELECT * FROM trains WHERE trainNumber = $1';
    const trainExists = await pool.query(getTrain, [trainNumber])

    if(trainExists.rows.length > 0){
      return res.status(400).json({ message: "Train already exists" })
    }

    const addTrain = `INSERT INTO trains (trainNumber, trainName, sourceStation, destinationStation, totalSeats, availableSeats, createdAt)
      VALUES ($1, $2, $3, $4, $5, $5, NOW())
      RETURNING trainId, trainNumber, trainName, sourceStation, destinationStation, totalSeats, availableSeats;`;

    const trainResult = await pool.query(addTrain, [
      trainNumber,
      trainName,
      sourceStation,
      destinationStation,
      totalSeats,
    ]);

    res.status(201).json({ message: "Train added successfully", train: trainResult.rows[0] })
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error'})
  }
}

export const updateTrain = async(req,res) => {
  const {trainId} = req.params;
  const {trainName, totalSeats, availableSeats} = req.body;

  try{
    await createTrainTable()

    const updateTrain = `UPDATE trains
      SET trainName = COALESCE($1, trainName), totalSeats = COALESCE($2, totalSeats), availableSeats = COALESCE($3, availableSeats)
      WHERE trainId = $4
      RETURNING trainId, trainNumber, trainName, sourceStation, destinationStation, totalSeats, availableSeats;`;

    const trainExists = await pool.query(updateTrain, [trainName, totalSeats, availableSeats, trainId]);

    if(trainExists.rows.length === 0){
      return res.status(404).json({ message: 'Train not found' });
    }

    res.status(200).json({ message: "Train updated successfully", train: trainResult.rows[0] })
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTrainsByRoute = async(req,res) => {
  const {sourceStation, destinationStation } = req.body

  try{
    await createTrainTable()

    const fetchTrainsQuery = `SELECT * FROM trains
      WHERE sourceStation = $1 AND destinationStation = $2;`;
    
    const trains = await pool.query(fetchTrainsQuery, [sourceStation, destinationStation])

    res.status(200).json({ trains: trains.rows })
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" })
  }
};

export const getSeatAvailability = async(req,res) => {
  const {trainId } = req.params

  try {
    await createTrainTable()
    
    const getSeats = 'SELECT availableSeats FROM trains WHERE trainId = $1';
    const seats = await pool.query(getSeats, [trainId])

    if(seats.rows.length === 0){
      return res.status(404).json({ message: "Seats Full" })
    }

    res.status(200).json({ availableSeats: seatResult.rows[0].availableseats })
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" })
  }
}
