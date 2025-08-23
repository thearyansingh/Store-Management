// src/routes/authRoutes.js
import express from 'express'
const router = express.Router();
import { register, login, changePassword }from '../Controller/authController.js';
import { authenticate } from '../Middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.put('/change-password', authenticate, changePassword);

export default router;
