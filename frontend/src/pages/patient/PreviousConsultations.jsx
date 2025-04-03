import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home } from "lucide-react";
import "../../styles/patient/PreviousConsultations.css";

// Dummy fetch function to simulate fetching consultations by patient ID
const fetchConsultationsByPatientId = async (patientId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyConsultations = [
        { id: 1, date: "2025-04-03", doctor: "Dr. Smith", location: "Room 101", details: "Checkup" },
        { id: 2, date: "2025-04-05", doctor: "Dr. Adams", location: "Room 203", details: "Follow-up" },
        { id: 3, date: "2025-04-07", doctor: "Dr. Williams", location: "Room 305", details: "Diagnosis" },
        { id: 4, date: "2025-04-10", doctor: "Dr. Brown", location: "Room 408", details: "Consultation" },
      ];
      resolve(dummyConsultations);
    }, 500);
  });
};

const fetchConsultationById = async (consultationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyConsultations = [
        { id: 1, date: "2025-04-03", doctor: "Dr. Smith", location: "Room 101", details: "Checkup" },
        { id: 2, date: "2025-04-05", doctor: "Dr. Adams", location: "Room 203", details: "Follow-up" },
        { id: 3, date: "2025-04-07", doctor: "Dr. Williams", location: "Room 305", details: "Diagnosis" },
        { id: 4, date: "2025-04-10", doctor: "Dr. Brown", location: "Room 408", details: "Consultation" },
      ];

      const consultation = dummyConsultations.find((c) => c.id === Number(consultationId));
      resolve(consultation || null); // Return consultation or null if not found
    }, 500);
  });
};

const PreviousConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [consultation, setConsultation] = useState(null); // Store single consultation
  const navigate = useNavigate();
  const { id } = useParams();
  const patientId = "123"; // Example patient ID

  // Load all consultations (for list view)
  useEffect(() => {
    const loadConsultations = async () => {
      const data = await fetchConsultationsByPatientId(patientId);
      setConsultations(data);
    };
    loadConsultations();
  }, [patientId]);

  // Load single consultation if ID is provided
  useEffect(() => {
    if (id) {
      const loadConsultation = async () => {
        const data = await fetchConsultationById(id);
        setConsultation(data);
      };
      loadConsultation();
    }
  }, [id]);

  const handleConsultationClick = (id) => {
    navigate(`/patient/previous-consultations/${id}`); // Redirect to the consultation details page
  };

  return (
    <div className="consultations-page">
      <main className="consultations-content">
        <header className="consultations-header">
          <h2>Patient Consultations</h2>
        </header>

        {id ? (
          consultation ? (
            /** 🟢 If an ID is present and consultation is found, show details */
            <div className="consultation-details">
              <p><strong>Date:</strong> {consultation.date}</p>
              <p><strong>Doctor:</strong> {consultation.doctor}</p>
              <p><strong>Location:</strong> {consultation.location}</p>
              <p><strong>Details:</strong> {consultation.details}</p>
              <button onClick={() => navigate("/patient/previous-consultations")} className="back-button">
                Back to Consultations
              </button>
            </div>
          ) : (
            /** 🔴 If consultation is null, show "Not Found" message */
            <p className="no-data">Consultation Not Found</p>
          )
        ) : (
          <section className="consultations-list">
            {consultations.length > 0 ? (
              consultations.map((consult) => (
                <div
                  key={consult.id}
                  className="consultation-card"
                  onClick={() => handleConsultationClick(consult.id)}
                  style={{ cursor: "pointer" }} // Makes it clear that the card is clickable
                >
                  <span className="consult-date">{consult.date}</span>
                  <span className="consult-doctor">{consult.doctor}</span>
                  <span className="consult-location">{consult.location}</span>
                  <span className="consult-details">{consult.details}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No Consultations Available</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default PreviousConsultations;
