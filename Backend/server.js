// src/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './models/index.js';
import  errorHandler  from './Middleware/errorHandler.js';
import cookieParser from "cookie-parser";

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoute.js';
import storeRoutes from './routes/storeRoutes.js';
import ownerRoutes from './routes/ownerRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
   origin: "http://localhost:5173", 
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

// Health route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

// Start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    // For development only
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
