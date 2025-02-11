import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import createAdminTable from "../models/admin.model.js"

export const registerAdmin = async(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password, phoneNumber, address, apiKey} = req.body;

  try{
    await createAdminTable();

    const getAdmin = 'SELECT * FROM admins WHERE email = $1';
    const adminExists = await pool.query(getAdmin, [email]);

    if(adminExists.rows.length > 0){
      return res.status(400).json({ message: "Admin already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertAdmin = `
      INSERT INTO admins (email, password, phoneNumber, address, apiKey, createdAt)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING adminId, email, phoneNumber, address, createdAt;
    `;
    const admin = await pool.query(insertAdmin, [email, hashedPassword, phoneNumber, address, apiKey]);

    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    const token = jwt.sign({ adminId: admin.rows[0].adminId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, admin: admin.rows[0] });
  } 
  catch(error){
    console.error('Error Stack:', error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, apiKey } = req.body;

  try{
    await createAdminTable();

    const getAdmin = 'SELECT * FROM admins WHERE email = $1';
    const adminExists = await pool.query(getAdmin, [email]);

    if(adminExists.rows.length === 0 || adminExists.rows[0].apikey !== apiKey) {
      return res.status(401).json({ message: "Invalid email, password, or API key" });
    }

    const admin = adminExists.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch){
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ adminId: admin.adminId }, process.env.JWT_SECRET,{ expiresIn:'1d' });
    res.status(200).json({token, admin});
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message:"Internal server error"});
  }
};

export const logoutAdmin = async(req, res) => {
  try{
    await createAdminTable();
      
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
  } 
  catch(error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
