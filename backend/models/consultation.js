import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home } from "lucide-react";
import "../../styles/patient/PreviousConsultations.css";

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
        {
          id: 1,
          patient_id: "123",
          date: "2025-04-03",
          doctor: "Dr. Smith",
          location: "Room 101",
          details: "Checkup",
          diagnosis: ["Hypertension"],
          prescription: {
            prescriptionDate: "2025-04-03",
            status: "dispensed",
            entries: [
              { medicine_id: "Med123", dosage: "2 tablets", frequency: "daily", duration: "7 days", quantity: 14, dispensed_qty: 14 }
            ]
          },
          reports: [
            { status: "completed", reportText: "Blood test normal", createdBy: "Dr. Smith", createdAt: "2025-04-03" }
          ],
          feedback: { rating: 4, comments: "Good service" }
        }
      ];

      const consultation = dummyConsultations.find((c) => c.id === Number(consultationId));
      resolve(consultation || null);
    }, 500);
  });
};

const PreviousConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [consultation, setConsultation] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const patientId = "123";

  useEffect(() => {
    const loadConsultations = async () => {
      const data = await fetchConsultationsByPatientId(patientId);
      setConsultations(data);
    };
    loadConsultations();
  }, [patientId]);

  useEffect(() => {
    if (id) {
      const loadConsultation = async () => {
        const data = await fetchConsultationById(id);
        setConsultation(data);
      };
      loadConsultation();
    }
  }, [id]);

  return (
    <div className="consultations-page">
      <main className="consultations-content">
        <header className="consultations-header">
          <h2>Patient Consultations</h2>
        </header>

        {id ? (
          consultation ? (
            <div className="consultation-details">
              <h3>Consultation Details</h3>
              <p><strong>Consultation ID:</strong> {consultation.id}</p>
              <p><strong>Patient ID:</strong> {consultation.patient_id}</p>
              <p><strong>Doctor:</strong> {consultation.doctor}</p>
              <p><strong>Date:</strong> {consultation.date}</p>
              <p><strong>Location:</strong> {consultation.location}</p>
              <p><strong>Details:</strong> {consultation.details}</p>
              
              <h3>Diagnosis</h3>
              <ul>
                {consultation.diagnosis.map((diag, index) => (
                  <li key={index}>{diag}</li>
                ))}
              </ul>

              <h3>Prescription</h3>
              <p><strong>Status:</strong> {consultation.prescription.status}</p>
              <ul>
                {consultation.prescription.entries.map((entry, index) => (
                  <li key={index}>{entry.dosage} - {entry.frequency} - {entry.duration}</li>
                ))}
              </ul>

              <h3>Reports</h3>
              {consultation.reports.map((report, index) => (
                <div key={index}>
                  <p><strong>Status:</strong> {report.status}</p>
                  <p><strong>Report:</strong> {report.reportText}</p>
                </div>
              ))}

              <h3>Feedback</h3>
              <p><strong>Rating:</strong> {consultation.feedback.rating}</p>
              <p><strong>Comments:</strong> {consultation.feedback.comments}</p>
              
              <button onClick={() => navigate("/patient/previous-consultations")} className="back-button">
                Back to Consultations
              </button>
            </div>
          ) : (
            <p className="no-data">Consultation Not Found</p>
          )
        ) : (
          <section className="consultations-list">
            {consultations.length > 0 ? (
              consultations.map((consult) => (
                <div
                  key={consult.id}
                  className="consultation-card"
                  onClick={() => navigate(`/patient/previous-consultations/${consult.id}`)}
                  style={{ cursor: "pointer" }}
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
