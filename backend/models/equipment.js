import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const EquipmentSchema = new Schema({
    equipment_id: Number, // Auto-incremented field
  equipment_name: String,
  owner_id: { type: String, ref: 'Department' },
  quantity: Number,
  installation_date: Date,
  last_service_date: Date,
  next_service_date: Date
}, { timestamps: true });

EquipmentSchema.plugin(AutoIncrement, { inc_field: 'equipment_id', start_seq: 10000, increment_by: 1 });

const Equipment = mongoose.model('Equipment', EquipmentSchema);
export default Equipment;