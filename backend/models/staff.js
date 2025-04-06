import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const DoctorSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' }, // THIS IS AUTOGEN BY MONGO
  doctor_id: Number, // Auto-incremented field
  department_id: { type: String, ref: 'Department' },
  specialization: String,
  qualification: String,
  experience: Number,
  room_num: Number,
  rating: Number
});

const NurseSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' },
  nurse_id: Number, // Auto-incremented field
  assigned_dept: { type: String, ref: 'Department' },
  location: { type: String, enum: ["ward", "icu", "ot", "emergency"] },
  assigned_room: { type: Schema.Types.ObjectId, ref: 'Room' },
  assigned_bed: { type: Schema.Types.ObjectId, ref: 'Bed' },
  assigned_amb: { type: Schema.Types.ObjectId, ref: 'Ambulance' }
});

const PharmacistSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

const ReceptionistSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' },
  assigned_dept: { type: String, ref: 'Department' }
});

const AdminSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

const PathologistSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' },
  lab_id: { type: Schema.Types.ObjectId, ref: 'Lab' }
});

const DriverSchema = new Schema({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

DoctorSchema.plugin(AutoIncrement, { inc_field: 'doctor_id', start_seq: 10000, increment_by: 1 });
NurseSchema.plugin(AutoIncrement, { inc_field: 'nurse_id', start_seq: 10000, increment_by: 1 });

const Doctor = mongoose.model('Doctor', DoctorSchema);
const Nurse = mongoose.model('Nurse', NurseSchema);
const Pharmacist = mongoose.model('Pharmacist', PharmacistSchema);
const Receptionist = mongoose.model('Receptionist', ReceptionistSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Pathologist = mongoose.model('Pathologist', PathologistSchema);
const Driver = mongoose.model('Driver', DriverSchema);

export { Doctor, Nurse, Pharmacist, Receptionist, Admin, Pathologist, Driver};