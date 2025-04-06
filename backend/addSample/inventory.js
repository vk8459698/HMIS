import express from 'express';
import Medicine from '../models/inventory.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single medicine
router.post('/', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random medicine with inventory
function generateMedicine() {
  const dosageForms = ["tablet", "capsule", "syrup", "injection", "cream", "ointment", "other"];
  const effectiveness = ["high", "medium", "low"];
  const manufacturers = [
    "Pfizer", "Johnson & Johnson", "Novartis", "Roche", 
    "Merck", "AstraZeneca", "GlaxoSmithKline", "Sanofi"
  ];
  const suppliers = [
    "MedSupply Co.", "PharmaDirect", "HealthWholesale", 
    "MediDistributors", "GlobalMed Supply", "PharmaSource"
  ];

  // Generate 1-3 inventory items
  const inventoryItems = [];
  const inventoryCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < inventoryCount; i++) {
    const manufacturingDate = faker.date.past({ years: 2 });
    // Expiry date between 1-3 years after manufacturing
    const expiryDate = new Date(manufacturingDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 3) + 1);
    
    inventoryItems.push({
      quantity: Math.floor(Math.random() * 1000) + 50,
      batch_no: faker.string.alphanumeric(8).toUpperCase(),
      expiry_date: expiryDate,
      manufacturing_date: manufacturingDate,
      unit_price: parseFloat((Math.random() * 100 + 5).toFixed(2)),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)]
    });
  }

  return {
    med_name: faker.science.chemicalElement().name + " " + dosageForms[Math.floor(Math.random() * dosageForms.length)],
    effectiveness: effectiveness[Math.floor(Math.random() * effectiveness.length)],
    dosage_form: dosageForms[Math.floor(Math.random() * dosageForms.length)],
    manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
    available: Math.random() > 0.2, // 80% chance of being available
    inventory: inventoryItems
  };
}

// POST generate and add dummy data
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const medicines = [];

    for (let i = 0; i < count; i++) {
      const medicine = new Medicine(generateMedicine());
      const savedMedicine = await medicine.save();
      medicines.push(savedMedicine);
    }

    res.status(201).json({
      message: `Successfully generated ${medicines.length} medicines`,
      count: medicines.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all medicines (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await Medicine.deleteMany({});
    res.status(200).json({ message: 'All medicines deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;