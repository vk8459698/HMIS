import express from 'express';
import {
  bookConsultation,
  rescheduleConsultation
} from '../controllers/consultationController.js';

const router = express.Router();

// POST: Book a consultation
router.post('/book', bookConsultation);

// PUT: Reschedule a consultation
router.put('/reschedule/:consultationId', rescheduleConsultation);

export default router;
