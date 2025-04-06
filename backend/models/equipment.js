import mongoose from 'mongoose';
import seq from 'mongoose-sequence';
const AutoIncrement = seq(mongoose);
const { Schema } = mongoose;

const EquipmentSchema = new Schema({
  _id: {type:Number,unique:true,index:true}, // Auto-incremented field
  equipment_name: String,
  owner_id: { type: String, ref: 'Department' },
  quantity: Number,
  installation_date: Date,
  last_service_date: Date,
  next_service_date: Date
}, { timestamps: true, _id: false });

EquipmentSchema.plugin(AutoIncrement, { inc_field: '_id', start_seq: 10000, increment_by: 1 });

const Equipment = mongoose.model('Equipment', EquipmentSchema);
export default Equipment;