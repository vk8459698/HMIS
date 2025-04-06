import express from 'express';
import Employee from '../models/employee.js';
import { faker } from '@faker-js/faker';


const router = express.Router();

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({}).populate('dept_id');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET employees by role
router.get('/role/:role', async (req, res) => {
  try {
    const role = req.params.role;
    const validRoles = ["doctor", "nurse", "pharmacist", "receptionist", "admin", "pathologist", "driver"];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    const employees = await Employee.find({ role: role }).populate('dept_id');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);
    const employee = await Employee.findById(employeeId).populate('dept_id');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single employee
router.post('/', async (req, res) => {
  try {
    
    
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update employee data
router.put('/:id', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);
    
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random employee with bank details
function generateEmployee(deptIds = []) {
  const roles = ["doctor", "nurse", "pharmacist", "receptionist", "admin", "pathologist", "driver"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  
  const gender = Math.random() > 0.5 ? "male" : "female";
  const firstName = gender === "male" ? faker.person.firstName("male") : faker.person.firstName("female");
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  
  // Date of birth (25-65 years old)
  const dob = faker.date.birthdate({ min: 25, max: 65, mode: 'age' });
  
  // Date of joining (between 0-20 years ago)
  const yearsWorking = Math.floor(Math.random() * 20);
  const doj = new Date();
  doj.setFullYear(doj.getFullYear() - yearsWorking);
  doj.setMonth(Math.floor(Math.random() * 12));
  doj.setDate(Math.floor(Math.random() * 28) + 1);
  
  // Generate salary based on role
  let baseSalary;
  switch (role) {
    case "doctor":
      baseSalary = 100000;
      break;
    case "admin":
      baseSalary = 70000;
      break;
    case "pathologist":
      baseSalary = 80000;
      break;
    case "pharmacist":
      baseSalary = 60000;
      break;
    case "nurse":
      baseSalary = 50000;
      break;
    case "receptionist":
      baseSalary = 40000;
      break;
    case "driver":
      baseSalary = 30000;
      break;
    default:
      baseSalary = 45000;
  }
  
  // Add variance to salary
  const salary = Math.floor(baseSalary * (0.8 + Math.random() * 0.4));
  
  // Bank details
  const bankDetails = {
    bank_name: faker.helpers.arrayElement([
      "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", 
      "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Yes Bank"
    ]),
    account_number: parseInt(faker.string.numeric(10)),
    ifsc_code: faker.helpers.arrayElement(["SBIN", "HDFC", "ICIC", "UTIB", "PUNB", "BARB", "CNRB", "YESB"]) + 
               faker.string.numeric(7),
    branch_name: faker.location.city()
  };
  
  // Assign department if available
  let dept_id = null;
  if (deptIds.length > 0) {
    dept_id = deptIds[Math.floor(Math.random() * deptIds.length)];
  }
  
  // Generate password hash
  const plainPassword = faker.internet.password({ length: 8 });
  
  return {
    name: `${firstName} ${lastName}`,
    email: email,
    password: plainPassword, // Will be hashed before saving
    profile_pic: Math.random() > 0.7 ? faker.image.avatar() : "",
    role: role,
    dept_id: dept_id,
    phone_number: faker.phone.number("##########"), // 10 digits
    address: faker.location.streetAddress() + ", " + faker.location.city() + ", " + faker.location.state() + " - " + faker.location.zipCode(),
    date_of_birth: dob,
    date_of_joining: doj,
    gender: gender,
    salary: salary,
    bank_details: bankDetails
  };
}

// POST generate and add dummy employees
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const deptIds = req.body.departmentIds || [];
    const employees = [];
    
    for (let i = 0; i < count; i++) {
      const employeeData = generateEmployee(deptIds);
      
      const employee = new Employee(employeeData);
      const savedEmployee = await employee.save();
      employees.push(savedEmployee);
    }
    
    res.status(201).json({
      message: `Successfully generated ${employees.length} employees`,
      count: employees.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all employees (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await Employee.deleteMany({});
    res.status(200).json({ message: 'All employees deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;