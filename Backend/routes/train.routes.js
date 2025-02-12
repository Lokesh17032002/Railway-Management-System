import express from 'express'
import { body, param } from 'express-validator'
import { addTrain, updateTrain, getTrainsByRoute, getSeatAvailability } from '../controllers/train.controller.js'
import { authAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add', [
  body('trainNumber').isLength({ min: 1 }).withMessage('Train number is required'),
  body('trainName').isLength({ min: 3 }).withMessage('Train name must be at least 3 characters long'),
  body('sourceStation').notEmpty().withMessage('Source station is required'),
  body('destinationStation').notEmpty().withMessage('Destination station is required'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
], authAdmin, addTrain)

router.put('/update/:trainId', [
  param('trainId').isInt().withMessage('Valid train ID is required'),
  body('trainName').optional().isLength({ min: 3 }).withMessage('Train name must be at least 3 characters long'),
  body('totalSeats').optional().isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
  body('availableSeats').optional().isInt({ min: 0 }).withMessage('Available seats must be at least 0'),
], authAdmin, updateTrain)


router.get('/search', [
  body('sourceStation').notEmpty().withMessage('Source station is required'),
  body('destinationStation').notEmpty().withMessage('Destination station is required'),
], getTrainsByRoute)


router.get('/availability/:trainId', [
  param('trainId').isInt().withMessage('Valid train ID is required'),
], getSeatAvailability)

export default router;
