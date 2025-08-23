// src/routes/adminRoutes.js
import express from'express';
const router = express.Router();
import { createUser, listUsers, getUser, createStore, listStores, adminDashboard } from'../Controller/adminController.js';

import {authenticate} from '../Middleware/auth.js'
import requireRole from '../Middleware/role.js';

// All admin routes require authenticated admin role
router.use(authenticate);
router.use(requireRole(['admin']));

router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUser);

router.post('/stores', createStore);
router.get('/stores', listStores);

router.get('/dashboard', adminDashboard);

export default router;
