import mongoose from 'mongoose';
const { Schema } = mongoose;


const AmbulanceSchema = new Schema({
  vehicle_number: String,
  driver: {type: Schema.Types.ObjectId, ref: "Driver"}, // Embedded document
  status: { type: String, enum: ["active", "inactive"] },
  nurse_id: { type: Number, ref: 'Nurse' }
});

const BedSchema = new Schema({
  bed_number: Number,
  nurse_id: { type: Number, ref: 'Nurse' },
  patient_id: { type: Number, ref: 'Patient' },
  status: { type: String, enum: ["occupied", "vacant"] }
});

const RoomSchema = new Schema({
  room_number: Number,
  room_type: { type: String, enum: ["general", "private", "semi_private"] },
  bed_count: Number,
  dept_id: { type: String, ref: 'Department' },
  beds: [BedSchema] // Embedded array of beds
});

const Ambulance = mongoose.model('Ambulance', AmbulanceSchema);
const Room = mongoose.model('Room', RoomSchema);
const Bed = mongoose.model('Bed', BedSchema);

export { Ambulance, Room, Bed };