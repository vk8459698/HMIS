import mongoose from 'mongoose';
const { Schema } = mongoose;

const DiagnosisSchema = new Schema({
  diagnosis_id: { type: String, unique: true },
  name: String
});

const Diagnosis = mongoose.model('Diagnosis', DiagnosisSchema);
export default Diagnosis;