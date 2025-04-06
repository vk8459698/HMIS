import express from "express";
import pathologistController from "../controllers/pathologist.controller.js";

const router = express.Router();

// Route to check if the patient has an active consultation
router.get("/consultations/:patientId", pathologistController.getConsultationByPatientId);

// Route to upload a medical test report
router.post("/reports", pathologistController.uploadReport);

export default router;
