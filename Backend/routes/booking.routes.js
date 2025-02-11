import express from 'express'
import { body, param } from 'express-validator'
import { bookSeat, getBookingDetails } from '../controllers/booking.controller.js'
import { authUser } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/book', [
  body('trainId').isInt().withMessage('Valid train ID is required'),
  body('seatsBooked').isInt({ min: 1 }).withMessage('Number of seats must be at least 1'),
], authUser, bookSeat);

router.get('/details/:bookingId', [
  param('bookingId').isInt().withMessage('Valid booking ID is required'),
], authUser, getBookingDetails);


export default router;
