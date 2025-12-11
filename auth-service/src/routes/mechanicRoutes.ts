import express from 'express';
import { createProfile, getAllMechanics, getMechanicProfile } from '../controllers/mechanicController';

const router = express.Router();

// Public routes
router.get('/', getAllMechanics);
router.get('/:id', getMechanicProfile);

// Protected routes
router.post('/', createProfile);

export default router;
