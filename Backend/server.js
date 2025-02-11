import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import bodyParser from 'body-parser';
// import adminRoutes from './routes/admin.routes.js';
// import userRoutes from './routes/user.routes.js';
import pool from './config/db.js';


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());


// app.use('/api/admin', adminRoutes);
// app.use('/api/user', userRoutes);


(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database successfully!');
  } catch (error) {
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
