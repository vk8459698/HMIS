import express from 'express';
import Patient from '../models/patient.js';
import Insurance from '../models/insurance.js';
import { faker } from '@faker-js/faker';
// import bcrypt from 'bcrypt';

const router = express.Router();

// GET all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({}).populate('insurance_details');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const patient = await Patient.findById(patientId).populate('insurance_details');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single patient
router.post('/', async (req, res) => {
  try {
    
    
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update patient data
router.put('/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    
    // Hash password if provided in update
    
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST add vitals to a patient
router.post('/:id/vitals', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.vitals.push(req.body);
    const updatedPatient = await patient.save();
    
    res.status(201).json(updatedPatient.vitals[updatedPatient.vitals.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random patient with patient_info and vitals
function generatePatient() {
  const gender = Math.random() > 0.5 ? "male" : "female";
  const firstName = gender === "male" ? faker.person.firstName("male") : faker.person.firstName("female");
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const dob = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  
  // Generate PatientInfo
  const patientInfo = {
    age: new Date().getFullYear() - dob.getFullYear(),
    height: Math.floor(Math.random() * 50) + 150, // 150-200 cm
    weight: Math.floor(Math.random() * 70) + 40, // 40-110 kg
    bloodGrp: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"][Math.floor(Math.random() * 8)],
    familyHistory: faker.helpers.arrayElement([
      "No significant history", 
      "Diabetes", 
      "Hypertension", 
      "Heart disease", 
      "Cancer",
      "Asthma",
      "Multiple conditions including diabetes and hypertension"
    ]),
    bedNo: Math.floor(Math.random() * 100) + 1,
    roomNo: Math.floor(Math.random() * 50) + 101,
    other: Math.random() > 0.7 ? faker.lorem.sentence() : ""
  };
  
  // Generate 1-5 vitals records
  const vitalsCount = Math.floor(Math.random() * 5) + 1;
  const vitals = [];
  
  for (let i = 0; i < vitalsCount; i++) {
    const vitalDate = faker.date.recent({ days: 30 });
    vitals.push({
      date: vitalDate,
      time: `${vitalDate.getHours()}:${vitalDate.getMinutes().toString().padStart(2, '0')}`,
      bloodPressure: Math.floor(Math.random() * 40) + 110, // 110-150
      bodyTemp: parseFloat((Math.random() * 2 + 36).toFixed(1)), // 36-38
      pulseRate: Math.floor(Math.random() * 40) + 60, // 60-100
      breathingRate: Math.floor(Math.random() * 8) + 12 // 12-20
    });
  }
  
  // Generate password hash
  const plainPassword = faker.internet.password({ length: 8 });
  
  return {
    patient_username: email,
    password: plainPassword, // Will be hashed before saving
    name: `${firstName} ${lastName}`,
    profile_pic: Math.random() > 0.7 ? faker.image.avatar() : "",
    phone_number: faker.phone.number("##########"), // 10 digits
    emergency_contact: faker.phone.number("##########"), // 10 digits
    email: email,
    date_of_birth: dob,
    aadhar_number: faker.string.numeric(12), // 12-digit Aadhar
    gender: gender,
    address: faker.location.streetAddress() + ", " + faker.location.city() + ", " + faker.location.state() + " - " + faker.location.zipCode(),
    patient_info: patientInfo,
    vitals: vitals,
    insurance_details: [] // Will be linked after creation
  };
}

// POST generate and add dummy patients with option to create linked insurance
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const createInsurance = req.query.createInsurance === 'true';
    const patients = [];
    
    for (let i = 0; i < count; i++) {
      const patientData = generatePatient();
      
      // Hash the password
    //   const salt = await bcrypt.genSalt(10);
    //   patientData.password = await bcrypt.hash(patientData.password, salt);
      
      const patient = new Patient(patientData);
      const savedPatient = await patient.save();
      
      // Create linked insurance if requested
      if (createInsurance) {
        const insuranceProviders = [
          "Medicare", "Blue Cross Blue Shield", "Aetna", "Cigna", 
          "UnitedHealthcare", "Humana", "Kaiser Permanente", "MetLife"
        ];
        
        const coverageTypes = [
          "Basic Health Plan", "Premium Health Plan", "Family Coverage", 
          "Individual Coverage", "Dental & Vision", "Comprehensive Plan"
        ];
        
        // Create 1-2 insurance records per patient
        const insuranceCount = Math.floor(Math.random() * 2) + 1;
        
        for (let j = 0; j < insuranceCount; j++) {
          const insuranceRecord = new Insurance({
            patient_id: savedPatient._id,
            insurance_provider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
            policy_number: parseInt(faker.string.numeric(8)),
            coverage_details: coverageTypes[Math.floor(Math.random() * coverageTypes.length)],
            policy_end_date: faker.date.future({ years: 3 }),
            verification_status: Math.random() > 0.15 // 85% chance of being verified
          });
          
          const savedInsurance = await insuranceRecord.save();
          
          // Link insurance to patient
          savedPatient.insurance_details.push(savedInsurance._id);
          await savedPatient.save();
        }
      }
      
      patients.push(savedPatient);
    }
    
    res.status(201).json({
      message: `Successfully generated ${patients.length} patients${createInsurance ? ' with insurance' : ''}`,
      count: patients.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all patients (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await Patient.deleteMany({});
    res.status(200).json({ message: 'All patients deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;