import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "../../styles/patient/RescheduleConsultation.css";

const RescheduleConsultation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [tempDate, setTempDate] = useState(new Date());
  const navigate = useNavigate();

  const availableSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
  ];

  const handleApply = () => {
    setSelectedDate(tempDate);
  };

  const handleClear = () => {
    setTempDate(new Date());
    setSelectedSlot(""); // Ensure slot is also cleared
  };

  const handleReschedule = () => {
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }
    const confirmReschedule = window.confirm(
      `Are you sure you want to reschedule to ${selectedDate.toDateString()} at ${selectedSlot}?`
    );
    if (confirmReschedule) {
      alert(`Consultation rescheduled successfully!\nNew Date: ${selectedDate.toDateString()}\nTime: ${selectedSlot}`);
      navigate("/patient/booked-consultation");
    }
  };

  // Function to grey out dates of other months
  const getDayClassName = (date) => {
    const currentMonth = new Date(tempDate).getMonth();
    return date.getMonth() !== currentMonth ? "grey-out" : "";
  };

  return (
    <div className="reschedule-container">
      <h2 className="reschedule-title">Reschedule Consultation</h2>

      <div className="reschedule-calendar">
        <h3 className="reschedule-label">Select a new date:</h3>
        <DatePicker
          selected={tempDate}
          onChange={(date) => setTempDate(date)}
          inline
          calendarClassName="custom-calendar" // Custom class to style the calendar
        />
        <div className="calendar-buttons" style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button className="apply-button" onClick={handleApply}>Apply</button>
          <button className="clear-button" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="reschedule-slot">
        <h3 className="reschedule-label">Choose a new slot:</h3>
        <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="reschedule-dropdown">
          <option value="">Select a time slot</option>
          {availableSlots.map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      <button onClick={handleReschedule} className="reschedule-button">Reschedule Consultation</button>
    </div>
  );
};

export default RescheduleConsultation;
