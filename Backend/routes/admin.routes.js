import express from 'express'
import {body} from 'express-validator'

import { registerAdmin, loginAdmin, logoutAdmin } from '../controllers/admin.controller.js'
import { authAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6}).withMessage('Password Must be atleast 6 characters long'),
    body('phoneNumber').isMobilePhone().withMessage('Invalid Phone Number'),
    body('address').notEmpty().withMessage('Address cannot be empty')
], registerAdmin)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6}).withMessage('Password Must be atleast 6 characters long'),
], loginAdmin)

router.get('/logout', authAdmin,logoutAdmin)

export default router

