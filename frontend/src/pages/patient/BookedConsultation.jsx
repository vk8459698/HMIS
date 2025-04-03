import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import "../../styles/patient/BookedConsultations.css";

const fetchConsultationsByPatientId = async (patientId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyConsultations = [
        { consultationId: "C001", date: "2025-04-03", doctor: "Dr. Smith", location: "Room 101", details: "Checkup" },
        { consultationId: "C002", date: "2025-04-05", doctor: "Dr. Adams", location: "Room 203", details: "Follow-up" },
        { consultationId: "C003", date: "2025-04-07", doctor: "Dr. Williams", location: "Room 305", details: "Diagnosis" },
        { consultationId: "C004", date: "2025-04-10", doctor: "Dr. Brown", location: "Room 408", details: "Consultation" },
      ];
      resolve(dummyConsultations);
    }, 500);
  });
};

const BookedConsultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const navigate = useNavigate();
  const patientId = "123";

  useEffect(() => {
    const loadConsultations = async () => {
      const data = await fetchConsultationsByPatientId(patientId);
      setConsultations(data);
    };

    loadConsultations();
  }, [patientId]);

  const handleCancel = (consultationId) => {
    console.log(`Cancelling consultation with ID: ${consultationId}`);
    alert("Reschedule functionality to be implemented.");
    setConsultations((prev) => prev.filter((consult) => consult.consultationId !== consultationId));
  };

  const handleReschedule = (consult) => {
    setSelectedConsultation(consult);
  };

  const confirmReschedule = () => {
    if (selectedConsultation) {
      navigate(`/patient/reschedule-consultation/${selectedConsultation.consultationId}`);
      setSelectedConsultation(null);
    }
  };

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
              <div key={consult.consultationId} className="consultation-card">
                <span className="consult-date">{consult.date}</span>
                <span className="consult-doctor">{consult.doctor}</span>
                <span className="consult-location">{consult.location}</span>
                <button className="cancel-btn" onClick={() => handleCancel(consult.consultationId)}>Cancel</button>
                <button className="reschedule-btn" onClick={() => handleReschedule(consult)}>Reschedule</button>
              </div>
            ))
          ) : (
            <p className="no-data">No Consultations Available</p>
          )}
        </section>
      </main>

      {/* Custom Modal for Reschedule Confirmation */}
      {selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Reschedule</h3>
            <p>
              Are you sure you want to reschedule your appointment with{" "}
              <strong>{selectedConsultation.doctor}</strong> on{" "}
              <strong>{selectedConsultation.date}</strong>?
            </p>
            <div className="modal-actions">
              <button className="cancel-modal-btn" onClick={() => setSelectedConsultation(null)}>
                No, Cancel
              </button>
              <button className="confirm-modal-btn" onClick={confirmReschedule}>
                Yes, Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedConsultation;
