import express from 'express'
import {body} from 'express-validator'
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';
import { authUser } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6}).withMessage('Password Must be atleast 6 characters long'),
    body('phoneNumber').isMobilePhone().withMessage('Invalid Phone Number'),
    body('address').notEmpty().withMessage('Address cannot be empty')
], registerUser)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6}).withMessage('Password Must be atleast 6 characters long'),
], loginUser)

router.get('/logout', authUser ,logoutUser)

export default router

