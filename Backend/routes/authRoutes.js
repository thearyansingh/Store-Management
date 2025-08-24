// src/routes/authRoutes.js
import express from 'express'
const router = express.Router();
import { register, login, changePassword,me,logout}from '../Controller/authController.js';
import { authenticate } from '../Middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.put('/change-password', authenticate, changePassword);
router.get('/me', authenticate,me);
router.post('/logout', logout);


export default router;
