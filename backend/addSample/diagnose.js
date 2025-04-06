import express from 'express';
import Diagnosis from '../models/diagnosis.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// GET all diagnoses
router.get('/', async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({});
    res.status(200).json(diagnoses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single diagnosis
router.post('/', async (req, res) => {
  try {
    const diagnosis = new Diagnosis(req.body);
    const savedDiagnosis = await diagnosis.save();
    res.status(201).json(savedDiagnosis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random diagnosis
function generateDiagnosis() {
  // Common medical diagnoses
  const diagnosisNames = [
    "Hypertension", "Type 2 Diabetes", "Asthma", "Migraine", 
    "Pneumonia", "Gastroenteritis", "Bronchitis", "Depression",
    "Anxiety Disorder", "Osteoarthritis", "Osteoporosis", "Sinusitis",
    "Urinary Tract Infection", "Iron Deficiency Anemia", "Hypothyroidism", "Gastroesophageal Reflux Disease",
    "Influenza", "Acute Bronchitis", "Eczema", "Psoriasis",
    "Allergic Rhinitis", "Hyperlipidemia", "Migraine Headache", "Fibromyalgia",
    "Irritable Bowel Syndrome", "Coronary Artery Disease", "Chronic Obstructive Pulmonary Disease",
    "Rheumatoid Arthritis", "Multiple Sclerosis", "Parkinson's Disease"
  ];
  
  // Generate unique diagnosis ID with format DIAG-XXXX
  const diagnosisId = `DIAG-${faker.string.alphanumeric(4).toUpperCase()}`;
  
  return {
    diagnosis_id: diagnosisId,
    name: diagnosisNames[Math.floor(Math.random() * diagnosisNames.length)]
  };
}

// POST generate and add dummy diagnoses
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const diagnoses = [];
    
    // Create an array of all possible diagnoses first
    const allDiagnoses = [];
    for (let i = 0; i < count; i++) {
      allDiagnoses.push(generateDiagnosis());
    }
    
    // Filter out duplicates by name to ensure uniqueness
    const uniqueDiagnoses = allDiagnoses.filter((diagnosis, index, self) =>
      index === self.findIndex((d) => d.name === diagnosis.name)
    );
    
    // Save unique diagnoses to the database
    for (const diagnosisData of uniqueDiagnoses) {
      const diagnosis = new Diagnosis(diagnosisData);
      const savedDiagnosis = await diagnosis.save();
      diagnoses.push(savedDiagnosis);
    }

    res.status(201).json({
      message: `Successfully generated ${diagnoses.length} diagnoses`,
      count: diagnoses.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all diagnoses (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await Diagnosis.deleteMany({});
    res.status(200).json({ message: 'All diagnoses deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;