import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import bodyParser from 'body-parser'
import pool from './config/db.js'
import cookieParser from 'cookie-parser';

import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import trainRoutes from "../Backend/routes/train.routes.js"
import bookingRoutes from "../Backend/routes/booking.routes.js"


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes);
app.use('/api/train', trainRoutes);
app.use('/api/booking', bookingRoutes);

(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database successfully!');
  } 
  catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
})();


app.get('/', (req, res) => {
  res.send('Welcome to the Railway Management System API!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
