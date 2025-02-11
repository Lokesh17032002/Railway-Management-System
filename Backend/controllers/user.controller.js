import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const registerUser = async(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password, phoneNumber, address} = req.body;

  try{
    const getUser = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(getUser, [email]);

    if(userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser = `
      INSERT INTO users (email, password, phoneNumber, address, createdAt)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING userId, email, phoneNumber, address, createdAt;`;

    const user = await pool.query(insertUser, [email, hashedPassword, phoneNumber, address]);

    const token = jwt.sign({ userId: user.rows[0].userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: user.rows[0] });
  } 
  catch(error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try{
    const getUser = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(getUser, [email]);

    if(userExists.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, user });
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async(req, res) => {
  try{
    res.clearCookie('token');
    res.status(200).json({ message:"Logged out successfully" });
  } 
  catch(error){
    console.error(error.message);
    res.status(500).json({ message:"Internal server error" });
  }
};
