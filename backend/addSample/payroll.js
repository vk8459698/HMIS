import express from 'express';
import Payroll from '../models/payroll.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// GET all payroll records
router.get('/', async (req, res) => {
  try {
    const payrolls = await Payroll.find({}).populate('employee_id');
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET payroll by ID
router.get('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employee_id');
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET payroll records by employee ID
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee_id: req.params.employeeId })
      .sort({ month_year: -1 })
      .populate('employee_id');
      
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET payroll records by month and year
router.get('/date/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // JavaScript months are 0-indexed
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const payrolls = await Payroll.find({
      month_year: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('employee_id');
    
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET payroll summary by payment status
router.get('/status/:status', async (req, res) => {
  try {
    const validStatuses = ["paid", "pending", "partially_paid"];
    const status = req.params.status.toLowerCase();
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: paid, pending, partially_paid' 
      });
    }
    
    const payrolls = await Payroll.find({ payment_status: status }).populate('employee_id');
    
    // Calculate total amount for this status
    const totalAmount = payrolls.reduce((sum, record) => sum + record.net_salary, 0);
    
    res.status(200).json({
      status,
      count: payrolls.length,
      totalAmount,
      records: payrolls
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new payroll record
router.post('/', async (req, res) => {
  try {
    // Calculate net salary if not provided
    if (!req.body.net_salary && req.body.basic_salary) {
      const allowance = req.body.allowance || 0;
      const deduction = req.body.deduction || 0;
      req.body.net_salary = req.body.basic_salary + allowance - deduction;
    }
    
    // Set generation date to now if not provided
    if (!req.body.generation_date) {
      req.body.generation_date = new Date();
    }
    
    const payroll = new Payroll(req.body);
    const savedPayroll = await payroll.save();
    res.status(201).json(savedPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update payroll record
router.put('/:id', async (req, res) => {
  try {
    // Recalculate net salary if relevant fields are updated
    if ((req.body.basic_salary || req.body.allowance || req.body.deduction) && !req.body.net_salary) {
      const payroll = await Payroll.findById(req.params.id);
      
      const basic_salary = req.body.basic_salary !== undefined ? 
        req.body.basic_salary : payroll.basic_salary;
        
      const allowance = req.body.allowance !== undefined ? 
        req.body.allowance : payroll.allowance;
        
      const deduction = req.body.deduction !== undefined ? 
        req.body.deduction : payroll.deduction;
        
      req.body.net_salary = basic_salary + allowance - deduction;
    }
    
    const updatedPayroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedPayroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    res.status(200).json(updatedPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update payment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { payment_status } = req.body;
    const validStatuses = ["paid", "pending", "partially_paid"];
    
    if (!payment_status || !validStatuses.includes(payment_status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: paid, pending, partially_paid' 
      });
    }
    
    const updatedPayroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { payment_status },
      { new: true }
    );
    
    if (!updatedPayroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    res.status(200).json(updatedPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE payroll record
router.delete('/:id', async (req, res) => {
  try {
    const deletedPayroll = await Payroll.findByIdAndDelete(req.params.id);
    
    if (!deletedPayroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    res.status(200).json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to generate a random payroll record
function generatePayroll(employeeId) {
  const basic_salary = faker.number.int({ min: 30000, max: 100000 });
  const allowance = faker.number.int({ min: 5000, max: 20000 });
  const deduction = faker.number.int({ min: 2000, max: 10000 });
  const net_salary = basic_salary + allowance - deduction;
  
  // Generate a random date within the last 12 months
  const today = new Date();
  const monthsAgo = faker.number.int({ min: 0, max: 11 });
  const payrollDate = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
  
  return {
    employee_id: employeeId,
    basic_salary,
    allowance,
    deduction,
    net_salary,
    month_year: payrollDate,
    payment_status: faker.helpers.arrayElement(['paid', 'pending', 'partially_paid']),
    payment_proof: faker.system.filePath(),
    generation_date: new Date()
  };
}

// POST generate dummy payroll data for employees
router.post('/generate', async (req, res) => {
  try {
    const { employeeIds, months } = req.body;
    
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'Valid employeeIds array is required' });
    }
    
    const monthsToGenerate = months || 1;
    const payrolls = [];
    
    for (const employeeId of employeeIds) {
      // Generate the specified number of monthly payroll records for each employee
      for (let i = 0; i < monthsToGenerate; i++) {
        const payrollData = generatePayroll(employeeId);
        
        // Adjust the month based on the iteration
        const payrollDate = new Date();
        payrollDate.setMonth(payrollDate.getMonth() - i);
        payrollDate.setDate(1); // First day of the month
        payrollData.month_year = payrollDate;
        
        const payroll = new Payroll(payrollData);
        const savedPayroll = await payroll.save();
        payrolls.push(savedPayroll);
      }
    }
    
    res.status(201).json({
      message: `Successfully generated ${payrolls.length} payroll records`,
      count: payrolls.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET payroll statistics
router.get('/stats/summary', async (req, res) => {
  try {
    // Get total payroll amount by status
    const statusSummary = await Payroll.aggregate([
      {
        $group: {
          _id: '$payment_status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$net_salary' }
        }
      }
    ]);
    
    // Get monthly payroll totals for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    
    const monthlyTotals = await Payroll.aggregate([
      {
        $match: {
          month_year: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$month_year' },
          totalAmount: { $sum: '$net_salary' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    
    // Format the monthly data into month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const formattedMonthlyData = monthlyTotals.map(item => ({
      month: monthNames[item._id - 1],
      totalAmount: item.totalAmount,
      count: item.count
    }));
    
    // Calculate overall statistics
    const overallStats = await Payroll.aggregate([
      {
        $group: {
          _id: null,
          totalPayroll: { $sum: '$net_salary' },
          avgSalary: { $avg: '$net_salary' },
          maxSalary: { $max: '$net_salary' },
          minSalary: { $min: '$net_salary' },
          totalRecords: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      byStatus: statusSummary,
      monthlyTotals: formattedMonthlyData,
      overall: overallStats.length > 0 ? {
        totalPayroll: overallStats[0].totalPayroll,
        averageSalary: overallStats[0].avgSalary,
        highestSalary: overallStats[0].maxSalary,
        lowestSalary: overallStats[0].minSalary,
        totalRecords: overallStats[0].totalRecords
      } : {
        totalPayroll: 0,
        averageSalary: 0,
        highestSalary: 0,
        lowestSalary: 0,
        totalRecords: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;