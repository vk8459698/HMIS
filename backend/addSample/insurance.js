import express from 'express';
import Insurance from '../models/insurance.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// GET all insurance records
router.get('/', async (req, res) => {
  try {
    const insuranceRecords = await Insurance.find({});
    res.status(200).json(insuranceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET insurance by patient_id
router.get('/patient/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const insuranceRecords = await Insurance.find({ patient_id: patientId });
    
    if (insuranceRecords.length === 0) {
      return res.status(404).json({ message: 'No insurance records found for this patient' });
    }
    
    res.status(200).json(insuranceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single insurance record
router.post('/', async (req, res) => {
  try {
    const insurance = new Insurance(req.body);
    const savedInsurance = await insurance.save();
    res.status(201).json(savedInsurance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random insurance record
function generateInsurance(startPatientId = 1000, endPatientId = 2000) {
  const insuranceProviders = [
    "Medicare", "Blue Cross Blue Shield", "Aetna", "Cigna", 
    "UnitedHealthcare", "Humana", "Kaiser Permanente", "MetLife",
    "Nationwide Health", "Liberty Health"
  ];
  
  const coverageTypes = [
    "Basic Health Plan", "Premium Health Plan", "Family Coverage", 
    "Individual Coverage", "Dental & Vision", "Comprehensive Plan",
    "Emergency Only", "Basic + Medication", "Senior Plan", "Student Plan"
  ];
  
  // Generate a random patient ID within the specified range
  const patientId = Math.floor(Math.random() * (endPatientId - startPatientId + 1)) + startPatientId;
  
  // Generate policy end date (6 months to 3 years from now)
  const policyEndDate = faker.date.future({ years: 3 });
  
  return {
    patient_id: patientId,
    insurance_provider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
    policy_number: parseInt(faker.string.numeric(8)),
    coverage_details: coverageTypes[Math.floor(Math.random() * coverageTypes.length)],
    policy_end_date: policyEndDate,
    verification_status: Math.random() > 0.15 // 85% chance of being verified
  };
}

// POST generate and add dummy insurance data
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const startPatientId = parseInt(req.query.startId) || 1000;
    const endPatientId = parseInt(req.query.endId) || 2000;
    const insuranceRecords = [];

    for (let i = 0; i < count; i++) {
      const insurance = new Insurance(generateInsurance(startPatientId, endPatientId));
      const savedInsurance = await insurance.save();
      insuranceRecords.push(savedInsurance);
    }

    res.status(201).json({
      message: `Successfully generated ${insuranceRecords.length} insurance records`,
      count: insuranceRecords.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all insurance records (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await Insurance.deleteMany({});
    res.status(200).json({ message: 'All insurance records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;