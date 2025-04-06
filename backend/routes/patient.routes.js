import express from 'express';

const router = express.Router();

// TODO: Add routes for patient
import { FetchPatientProfile, fetchConsultations } from '../controllers/patientController.js';

router.get('/profile/:patientId', FetchPatientProfile);
router.get('/consultations/:patientId', fetchConsultations);



export default router;
