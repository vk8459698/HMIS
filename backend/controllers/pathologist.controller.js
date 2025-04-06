import Equipment from '../models/equipment.js';
import { Consultation } from '../models/consultation.js';
import Patient from '../models/patient.js';

export const searchEquipment = async(req, res) => {
    try {
        const { searchBy } = req.query;

        if (!searchBy) {
            return res.status(400).json({ message: "Search query is required." });
        }
        
        let searchFilter = {};

        if (!isNaN(searchBy)) {
            searchFilter = { _id: Number(searchBy) };
        } else {
            searchFilter = {
                equipment_name: { $regex: searchBy, $options: 'i' }
            };
        }

        const equipmentDetails = await Equipment.find(searchFilter).select(
            'equipment_name last_service_date quantity'
        );

        res.status(200).json(equipmentDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
}

export const searchPatientInfoAndTest = async (req, res) => {
    try {
        const { searchById } = req.query;
        
        if (!searchById) {
            return res.status(400).json({ message: "Search query is required." });
        }

        // if the given id is not a valid numeric id
        if (isNaN(searchById)) {
            return res.status(400).json({ message: "Invalid patient ID format." });
        }

        const patientDetails = await Patient.findOne({ _id : Number(searchById) }).select(
            'name patient_info.age patient_info.bloodgroup phone_number'
        );

        if (!patientDetails) {
            return res.status(404).json({ message: "Patient not found." });
        }

        // we pick the most recent consultations for the patient
        const consultation = await Consultation.findOne({ patient_id: Number(searchById) })
            .sort({ actual_start_datetime: -1 });

        if (!consultation) {
            return res.status(404).json({ message: "No consultations found for this patient." });
        }

        // getting the test that was recommended in the consultation and it's status
        const tests = consultation.reports.map(report => ({
            title: report.title,
            status: report.status
        }));

        res.status(200).json({
            patient: patientDetails,
            tests
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}