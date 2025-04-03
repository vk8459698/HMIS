import React, { useState, useEffect } from "react";
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

const PreviousConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const patientId = "123"; // Example patient ID

  useEffect(() => {
    const loadConsultations = async () => {
      const data = await fetchConsultationsByPatientId(patientId);
      setConsultations(data);
    };

    loadConsultations();
  }, [patientId]);

  return (
    <div className="consultations-page">
      <main className="consultations-content">
        <header className="consultations-header">
          <h2>Patient Consultations</h2>
          <Home className="home-icon" />
        </header>
        <section className="consultations-list">
          {consultations.length > 0 ? (
            consultations.map((consult) => (
              <div key={consult.id} className="consultation-card">
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
      </main>
    </div>
  );
};

export default PreviousConsultations;
