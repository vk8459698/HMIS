import React, { useState, useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaVirus, FaChartLine, FaCalendarAlt, FaFilter } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(...registerables);

const IllnessTrends = () => {
  // State variables
  const [selectedDisease, setSelectedDisease] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [trendStartDate, setTrendStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Jan 1st of current year
  const [trendEndDate, setTrendEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch diseases list from backend
  useEffect(() => {
    fetchDiseases();
  }, []);

  // Fetch list of diseases from the backend
  const fetchDiseases = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const diseasesData = [
          { id: "D001", name: "Influenza" },
          { id: "D002", name: "Hypertension" },
          { id: "D003", name: "Diabetes" },
          { id: "D004", name: "Asthma" },
          { id: "D005", name: "COVID-19" },
        ];
        setDiseases(diseasesData);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching diseases:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Illness Trends Analysis</h1>
    </div>
  );
};

export default IllnessTrends;
