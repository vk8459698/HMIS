import mongoose from 'mongoose';
const { Schema } = mongoose;

const EquipmentSchema = new Schema({
  equipment_name: String,
  owner_id: { type: String, ref: 'Department' },
  quantity: Number,
  installation_date: Date,
  last_service_date: Date,
  next_service_date: Date
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', EquipmentSchema);
export default Equipment;