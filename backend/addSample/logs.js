import express from 'express';
import { LoginLog, BedLog, MedicineInventoryLog, FinanceLog } from '../models/logs.js';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

const router = express.Router();

// ===== LOGIN LOG ROUTES =====

// GET all login logs
router.get('/login', async (req, res) => {
  try {
    const logs = await LoginLog.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single login log
router.post('/login', async (req, res) => {
  try {
    const log = new LoginLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random login log
function generateLoginLog() {
  const userId = faker.number.int({ min: 1000, max: 9999 });
  const task = faker.helpers.arrayElement(['login', 'logout']);
  
  // Generate a timestamp within the last 30 days
  const accessTime = faker.date.recent({ days: 30 });
  
  return {
    user_id: userId,
    access_time: accessTime,
    task: task
  };
}

// POST generate login logs
router.post('/login/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const logs = [];

    // For login logs, ensure we have pairs of login/logout for the same user
    // on the same day to create realistic data
    const userLogins = {};
    
    for (let i = 0; i < count; i++) {
      // First create login events
      const userId = faker.number.int({ min: 1000, max: 9999 });
      const accessDate = faker.date.recent({ days: 30 });
      
      // Track users who have logged in so we can create logout events for them
      if (!userLogins[userId]) {
        userLogins[userId] = [];
      }
      userLogins[userId].push(accessDate);
      
      const loginLog = new LoginLog({
        user_id: userId,
        access_time: accessDate,
        task: 'login'
      });
      
      const savedLoginLog = await loginLog.save();
      logs.push(savedLoginLog);
      
      // Create a logout event with a later timestamp (0-8 hours later)
      const logoutTime = new Date(accessDate);
      logoutTime.setHours(logoutTime.getHours() + faker.number.int({ min: 1, max: 8 }));
      
      const logoutLog = new LoginLog({
        user_id: userId,
        access_time: logoutTime,
        task: 'logout'
      });
      
      const savedLogoutLog = await logoutLog.save();
      logs.push(savedLogoutLog);
    }

    res.status(201).json({
      message: `Successfully generated ${logs.length} login logs`,
      count: logs.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all login logs
router.delete('/login/all', async (req, res) => {
  try {
    await LoginLog.deleteMany({});
    res.status(200).json({ message: 'All login logs deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== BED LOG ROUTES =====

// GET all bed logs
router.get('/bed', async (req, res) => {
  try {
    const logs = await BedLog.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single bed log
router.post('/bed', async (req, res) => {
  try {
    const log = new BedLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random bed log
function generateBedLog() {
  const bedTypes = ['private', 'general', 'semi_private'];
  const statuses = ['occupied', 'vacated'];
  
  // Generate random ObjectId for bed_id
  const bedId = new mongoose.Types.ObjectId();
  const bedType = faker.helpers.arrayElement(bedTypes);
  const status = faker.helpers.arrayElement(statuses);
  const time = faker.date.recent({ days: 60 });
  const patientId = faker.number.int({ min: 10000, max: 99999 });
  
  return {
    bed_id: bedId,
    bed_type: bedType,
    status: status,
    time: time,
    patient_id: patientId
  };
}

// POST generate bed logs
router.post('/bed/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const logs = [];
    const beds = [];
    
    // Generate random bed IDs to be reused across logs
    for (let i = 0; i < Math.max(5, count/4); i++) {
      beds.push({
        id: new mongoose.Types.ObjectId(),
        type: faker.helpers.arrayElement(['private', 'general', 'semi_private'])
      });
    }
    
    // Track bed occupancy to create realistic sequences
    const bedStatus = {};
    
    for (let i = 0; i < count; i++) {
      // Get a random bed from our generated beds
      const bed = faker.helpers.arrayElement(beds);
      
      // Initialize bed status if not already done
      if (!bedStatus[bed.id]) {
        bedStatus[bed.id] = 'vacated';
      }
      
      // Toggle status based on current state
      const newStatus = bedStatus[bed.id] === 'vacated' ? 'occupied' : 'vacated';
      bedStatus[bed.id] = newStatus;
      
      // Generate a timestamp that's more recent for each successive log
      const timestamp = faker.date.recent({ days: 30 - (i % 30) });
      
      // For occupied status, we need a patient ID
      const patientId = newStatus === 'occupied' ? faker.number.int({ min: 10000, max: 99999 }) : null;
      
      const bedLog = new BedLog({
        bed_id: bed.id,
        bed_type: bed.type,
        status: newStatus,
        time: timestamp,
        patient_id: patientId
      });
      
      const savedLog = await bedLog.save();
      logs.push(savedLog);
    }

    res.status(201).json({
      message: `Successfully generated ${logs.length} bed logs`,
      count: logs.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all bed logs
router.delete('/bed/all', async (req, res) => {
  try {
    await BedLog.deleteMany({});
    res.status(200).json({ message: 'All bed logs deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== MEDICINE INVENTORY LOG ROUTES =====

// GET all medicine inventory logs
router.get('/medicine', async (req, res) => {
  try {
    const logs = await MedicineInventoryLog.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single medicine inventory log
router.post('/medicine', async (req, res) => {
  try {
    const log = new MedicineInventoryLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random medicine inventory log
function generateMedicineInventoryLog() {
  const medId = faker.number.int({ min: 1000, max: 9999 });
  const quantity = faker.number.int({ min: 10, max: 1000 });
  const unitCost = faker.number.float({ min: 5, max: 150, precision: 0.01 });
  const totalCost = quantity * unitCost;
  const orderDate = faker.date.recent({ days: 90 });
  
  const suppliers = [
    "MedSupply Co.", "PharmaDirect", "HealthWholesale", 
    "MediDistributors", "GlobalMed Supply", "PharmaSource"
  ];
  
  const status = faker.helpers.arrayElement(['ordered', 'received', 'cancelled']);
  
  return {
    med_id: medId,
    quantity: quantity,
    total_cost: parseFloat(totalCost.toFixed(2)),
    order_date: orderDate,
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    status: status
  };
}

// POST generate medicine inventory logs
router.post('/medicine/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const logs = [];
    
    // Create a set of medicine IDs to reuse
    const medicineIds = [];
    for (let i = 0; i < Math.min(20, count/2); i++) {
      medicineIds.push(faker.number.int({ min: 1000, max: 9999 }));
    }
    
    // Create suppliers
    const suppliers = [
      "MedSupply Co.", "PharmaDirect", "HealthWholesale", 
      "MediDistributors", "GlobalMed Supply", "PharmaSource"
    ];
    
    for (let i = 0; i < count; i++) {
      const medId = faker.helpers.arrayElement(medicineIds);
      const quantity = faker.number.int({ min: 10, max: 1000 });
      const unitCost = faker.number.float({ min: 5, max: 150, precision: 0.01 });
      const totalCost = quantity * unitCost;
      
      // Older orders are more likely to be received, recent ones might be ordered
      const daysAgo = faker.number.int({ min: 1, max: 90 });
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      
      // Status probability depends on how old the order is
      let status;
      if (daysAgo > 60) {
        // Older orders are more likely received or cancelled
        status = faker.helpers.arrayElement(['received', 'received', 'received', 'cancelled']);
      } else if (daysAgo > 30) {
        // Medium-age orders are mixed
        status = faker.helpers.arrayElement(['ordered', 'received', 'received', 'cancelled']);
      } else {
        // Recent orders are more likely to be ordered
        status = faker.helpers.arrayElement(['ordered', 'ordered', 'received', 'cancelled']);
      }
      
      const log = new MedicineInventoryLog({
        med_id: medId,
        quantity: quantity,
        total_cost: parseFloat(totalCost.toFixed(2)),
        order_date: orderDate,
        supplier: faker.helpers.arrayElement(suppliers),
        status: status
      });
      
      const savedLog = await log.save();
      logs.push(savedLog);
    }

    res.status(201).json({
      message: `Successfully generated ${logs.length} medicine inventory logs`,
      count: logs.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all medicine inventory logs
router.delete('/medicine/all', async (req, res) => {
  try {
    await MedicineInventoryLog.deleteMany({});
    res.status(200).json({ message: 'All medicine inventory logs deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== FINANCE LOG ROUTES =====

// GET all finance logs
router.get('/finance', async (req, res) => {
  try {
    const logs = await FinanceLog.find({});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single finance log
router.post('/finance', async (req, res) => {
  try {
    const log = new FinanceLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random finance log
function generateFinanceLog() {
  const userId = faker.number.int({ min: 1000, max: 9999 });
  const transactionType = faker.helpers.arrayElement(['income', 'expense']);
  
  // Higher amounts for income, lower for expenses typically
  let amount;
  if (transactionType === 'income') {
    amount = faker.number.float({ min: 100, max: 5000, precision: 0.01 });
  } else {
    amount = faker.number.float({ min: 50, max: 2000, precision: 0.01 });
  }
  
  const date = faker.date.recent({ days: 90 });
  
  // Generate descriptions based on transaction type
  let description;
  if (transactionType === 'income') {
    const incomeDescriptions = [
      "Patient payment - ID#" + faker.number.int({ min: 10000, max: 99999 }),
      "Insurance reimbursement",
      "Laboratory services",
      "Radiology services",
      "Consultation fees",
      "Therapy session payment",
      "Emergency services",
      "Annual physical examination",
      "Grant funding received",
      "Donation received"
    ];
    description = faker.helpers.arrayElement(incomeDescriptions);
  } else {
    const expenseDescriptions = [
      "Staff salary payment",
      "Equipment purchase - " + faker.commerce.productName(),
      "Office supplies",
      "Medication procurement",
      "Utility bills",
      "Facility maintenance",
      "Software subscription",
      "Staff training costs",
      "Medical waste disposal",
      "Catering services"
    ];
    description = faker.helpers.arrayElement(expenseDescriptions);
  }
  
  return {
    user_id: userId,
    transaction_type: transactionType,
    amount: parseFloat(amount.toFixed(2)),
    date: date,
    description: description
  };
}

// POST generate finance logs
router.post('/finance/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const logs = [];
    
    // Create a set of user IDs (finance staff) to reuse
    const userIds = [];
    for (let i = 0; i < 5; i++) {
      userIds.push(faker.number.int({ min: 1000, max: 9999 }));
    }
    
    for (let i = 0; i < count; i++) {
      const transactionType = faker.helpers.arrayElement(['income', 'expense']);
      
      // Higher amounts for income, lower for expenses typically
      let amount;
      if (transactionType === 'income') {
        amount = faker.number.float({ min: 100, max: 5000, precision: 0.01 });
      } else {
        amount = faker.number.float({ min: 50, max: 2000, precision: 0.01 });
      }
      
      // Generate date within last 90 days, ordered from oldest to newest
      const daysAgo = 90 - Math.floor((i / count) * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Generate descriptions based on transaction type
      let description;
      if (transactionType === 'income') {
        const incomeDescriptions = [
          "Patient payment - ID#" + faker.number.int({ min: 10000, max: 99999 }),
          "Insurance reimbursement",
          "Laboratory services",
          "Radiology services",
          "Consultation fees",
          "Therapy session payment",
          "Emergency services",
          "Annual physical examination",
          "Grant funding received",
          "Donation received"
        ];
        description = faker.helpers.arrayElement(incomeDescriptions);
      } else {
        const expenseDescriptions = [
          "Staff salary payment",
          "Equipment purchase - " + faker.commerce.productName(),
          "Office supplies",
          "Medication procurement",
          "Utility bills",
          "Facility maintenance",
          "Software subscription",
          "Staff training costs",
          "Medical waste disposal",
          "Catering services"
        ];
        description = faker.helpers.arrayElement(expenseDescriptions);
      }
      
      const log = new FinanceLog({
        user_id: faker.helpers.arrayElement(userIds),
        transaction_type: transactionType,
        amount: parseFloat(amount.toFixed(2)),
        date: date,
        description: description
      });
      
      const savedLog = await log.save();
      logs.push(savedLog);
    }

    res.status(201).json({
      message: `Successfully generated ${logs.length} finance logs`,
      count: logs.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all finance logs
router.delete('/finance/all', async (req, res) => {
  try {
    await FinanceLog.deleteMany({});
    res.status(200).json({ message: 'All finance logs deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;