import mongoose from 'mongoose';
const { Schema } = mongoose;

const MedicineSchema = new Schema({
  med_name: String,
  effectiveness: { type: String, enum: ["high", "medium", "low"] },
  dosage_form: { 
    type: String, 
    enum: ["tablet", "capsule", "syrup", "injection", "cream", "ointment", "other"] 
  },
  manufacturer: String,
  available: Boolean,
  inventory: [{
    quantity: Number,
    batch_no: String,
    expiry_date: Date,
    manufacturing_date: Date,
    unit_price: Number,
    supplier: String
  }] // Embedded inventory array
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', MedicineSchema);
export default Medicine;