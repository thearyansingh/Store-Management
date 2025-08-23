// src/routes/storeRoutes.js
import express from'express';

const router = express.Router();
import { listPublicStores, getStoreDetails } from'../Controller/storeController.js';
import { submitOrUpdateRating, deleteRating } from'../Controller/ratingController.js';
import { authenticate } from'../Middleware/auth.js';
import  requireRole  from'../Middleware/role.js';

// public listing and details (userId optional query param to include my_rating)
router.get('/', listPublicStores);
router.get('/:id', getStoreDetails);

// rating endpoints require authentication (normal user role)
router.post('/:storeId/rate', authenticate, requireRole(['user']), submitOrUpdateRating);
router.delete('/:storeId/rate', authenticate, requireRole(['user']), deleteRating);

export default router
