import express from "express";
import {findPayrollById, getPatientCalendar,getDoctorCalendar} from "../controllers/commonPagesController.js";

const router = express.Router();

router.get("/findPayroll",findPayrollById );
router.get("/getPatientCalendar", getPatientCalendar);
router.get("/getDoctorCalendar",getDoctorCalendar );

export default router;
