// models/patient.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const PatientInfoSchema = new Schema({
  name: String,
  age: Number,
  height: Number,
  weight: Number,
  bloodGrp: { 
    type: String, 
    enum: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"] 
  },
  address: String,
  familyHistory: String,
  bedNo: Number,
  roomNo: Number,
  other: String
}, { timestamps: true });

const VitalsSchema = new Schema({
    date: Date,
    time: String,
    bloodPressure: Number,
    bodyTemp: Number,
    pulseRate: Number,
    breathingRate: Number
  }, { timestamps: true });
  
  const PatientSchema = new Schema({
    patient_username: String,
    password: String,
    profile_pic: String,
    patient_info: PatientInfoSchema, // Embedded document
    vitals: [VitalsSchema], // Array of embedded documents
    insurance_details: { type: Schema.Types.ObjectId, ref: 'Insurance' }
  }, { timestamps: true });
  
  const Patient = mongoose.model('Patient', PatientSchema);
  export default Patient;