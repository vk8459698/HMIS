import express from 'express';
import { searchEquipment, searchPatientInfoAndTest } from '../controllers/pathologist.controller.js';

const router = express.Router();

router.get('/searchBy', searchEquipment);
router.get('/searchById', searchPatientInfoAndTest);

export default router;