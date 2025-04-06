import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const BankDetailsSchema = new Schema({
  bank_name: String,
  account_number: Number,
  ifsc_code: String,
  branch_name: String
});

const EmployeeSchema = new Schema({
  employee_id_incr :Number,
  name: String,
  email: { type: String, unique: true },
  password: String,
  profile_pic: String,
  role: { 
    type: String, 
    enum: ["doctor", "nurse", "pharmacist", "receptionist", "admin", "pathologist", "driver"] 
  },
  dept_id: { type: String, ref: 'Department' },
  phone_number: String,
  address: String,
  date_of_birth: Date,
  date_of_joining: Date,
  gender: { type: String, enum: ["male", "female"] },
  salary: Number,
  bank_details: BankDetailsSchema, // Embedded document
}, { timestamps: true });

EmployeeSchema.plugin(AutoIncrement, { inc_field: 'employee_id', start_seq: 10000, increment_by: 1 });

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;