import Patient from '../models/patient.js';
import models from '../models/consultation.js';
const { Consultation } = models;

// @desc Get full patient profile
export const FetchPatientProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('insurance_details');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const fetchConsultations = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Assuming patientId is ObjectId, use patient_id field in Consultation
    const consultations = await Consultation.find({ patient_id: patientId })
      .populate('doctor_id', 'name specialization') // doctor info
      .populate('created_by', 'name role') // receptionist info
      .populate('diagnosis')
      .populate('prescription') // fetching prescriptions
      .populate('bill_id') // bill info if needed
      .sort({ booked_date_time: -1 }); // newest first

    if (!consultations.length) {
      return res.status(404).json({ message: 'No consultations found' });
    }

    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
