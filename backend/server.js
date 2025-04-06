import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";
import employeeRoutes from './routes/employee.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import nurseRoutes from './routes/nurse.routes.js';
import pathologistRoutes from './routes/pathologist.routes.js';
import pharmacistRoutes from './routes/pharmacy.routes.js';
import adminRoutes from './routes/admin.routes.js';
import receptionistRoutes from './routes/receptionist.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import billingRoutes from './routes/billing.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from "cookie-parser";
import publicRoutes from './routes/public.routes.js';
import addMed from './addSample/inventory.js';
import addPat from "./addSample/patient.js";
import addIns from "./addSample/insurance.js";
import addDept from "./addSample/department.js";
import addEmp from "./addSample/employee.js";
import addNoti from "./addSample/notification.js";
import addDiag from "./addSample/diagnose.js";
import addGate from "./addSample/gateway.js";
import addLogs from "./addSample/logs.js";
import addSch from "./addSample/schedule.js";
import addStaff from "./addSample/staff.js";
import addFacility from "./addSample/facility.js";
import addEquip from "./addSample/equipment.js";
import addConsultation from "./addSample/consultation.js";
import addPayroll from "./addSample/payroll.js";
import addBills from "./addSample/bills.js";

dotenv.config();

const app = express();
app.use(cookieParser()); // This enables req.cookies
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

app.get("/", (req, res) => {
    res.send("Backend is running with ES Modules");
});

app.get("/test",(req, res) => {
    res.send("Frontend Connected to Backend");
})
//routes
app.use("/api/medicines", addMed);
app.use('/api/patients', addPat);
app.use('/api/insurance',addIns);
app.use('/api/department',addDept);
app.use("/api/employee",addEmp);
app.use("/api/notification",addNoti);
app.use("/api/diagnose",addDiag);
app.use("/api/gateway",addGate);
app.use("/api/logs",addLogs);
app.use("/api/schedule",addSch);
app.use("/api/staffs",addStaff);
app.use("/api/facility",addFacility);
app.use("/api/equipments",addEquip);
app.use("/api/consultation",addConsultation);
app.use("/api/payroll",addPayroll);
app.use("/api/bill",addBills);
// app.use("/api/tests", testRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/patients', patientRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/nurses', nurseRoutes);
// app.use('/api/pathologists', pathologistRoutes);
// app.use('/api/pharmaciSst', pharmacistRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/reception', receptionistRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/billing', billingRoutes);
// app.use('/api/facility', facilityRoutes);
// app.use("/api/auth", authRoutes);
// app.use('/api/public-data', publicRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
