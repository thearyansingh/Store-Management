// src/routes/ownerRoutes.js
import express from 'express'
const router = express.Router();
import{ getOwnerStores, getStoreRatings } from'../Controller/ownerController.js';
import { authenticate } from'../Middleware/auth.js';
import requireRole  from'../Middleware/role.js';

router.use(authenticate);
router.use(requireRole(['owner']));

router.get('/stores', getOwnerStores);
router.get('/stores/:storeId/ratings', getStoreRatings);
export default router
