import express from 'express';
import { fetchAppointments, updateAppointments } from '../controllers/doctor.controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// TODO: Add routes for doctor

router.get('/appointments', authenticateUser, fetchAppointments);
router.put('/appointments', authenticateUser, updateAppointments);

export default router;
