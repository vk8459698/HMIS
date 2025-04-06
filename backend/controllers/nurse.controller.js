import Patient from '../models/patient.js';

// function to search for the patient info
export const searchPatientInfo = async (req, res) => {
    try {
        const { searchQuery } = req.query;

        if (!searchQuery) {
            return res.status(400).json({ message: "Search query is required." });
        }

        let query = {};

        if (/^\d{10}$/.test(searchQuery)) {  
            query.phone_number = searchQuery;
        } 
        else if (/^\d+$/.test(searchQuery)) {
            query._id = parseInt(searchQuery);  
        } 
        else {
            query.name = { $regex: searchQuery, $options: 'i' };
        }

        const patients = await Patient.find(query).select(
            "_id name phone_number vitals patient_info.roomNo"
        );

        const result = patients.map(patient => {
            let status = "Admitted";
            if (!patient.patient_info.roomNo) status = "Discharged";

            if (patient.vitals.length > 0) {
                const latestVitals = patient.vitals[patient.vitals.length - 1];
                if (latestVitals.bloodPressure > 180 || latestVitals.bodyTemp > 104) {
                    status = "Critical";
                }
            }
            return {
                _id: patient._id,
                name: patient.name,
                phone_number: patient.phone_number,
                status,
                roomNo: patient.patient_info.roomNo || "N/A"
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
