import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaVirus, FaChartLine } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(...registerables);

const IllnessTrends = () => {
  // State variables
  const [selectedDisease, setSelectedDisease] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [trendStartDate, setTrendStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Jan 1st of current year
  const [trendEndDate, setTrendEndDate] = useState(new Date());
  const [diseaseData, setDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Fetch diseases list from backend
  useEffect(() => {
    fetchDiseases();
  }, []);

  // When disease list loads, set initial selected disease
  useEffect(() => {
    if (diseases.length > 0 && !selectedDisease) {
      setSelectedDisease(diseases[0].id);
    }
  }, [diseases]);

  // Fetch disease trend data when selected disease or date range changes
  useEffect(() => {
    if (selectedDisease) {
      fetchDiseaseTrends();
    }
  }, [selectedDisease, trendStartDate, trendEndDate]);

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

  // Fetch disease trends data
  const fetchDiseaseTrends = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const response = generateDiseaseTrendData(selectedDisease, trendStartDate, trendEndDate);
        setDiseaseData(response);
        setSelectedMonth(null); // Reset selected month when new data is loaded
        setActiveTab("monthly");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching disease trends:", error);
      setLoading(false);
    }
  };

  // Generate random data for disease trends
  function generateDiseaseTrendData(diseaseId, startDate, endDate) {
    const monthlyLabels = [];
    const monthlyValues = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const monthLabel = currentDate.toLocaleString("default", { month: "short", year: "numeric" });
      monthlyLabels.push(monthLabel);
      monthlyValues.push(Math.floor(Math.random() * (100 - 30 + 1)) + 30); // Random values between 30 and 100
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      monthlyData: { labels: monthlyLabels, values: monthlyValues },
      totalCases: monthlyValues.reduce((sum, val) => sum + val, 0),
    };
  }

  // Prepare chart data for monthly trends
  const monthlyChartData = {
    labels: diseaseData?.monthlyData.labels || [],
    datasets: [
      {
        label: `${diseases.find((d) => d.id === selectedDisease)?.name || ""} Cases`,
        data: diseaseData?.monthlyData.values || [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h1>Illness Trends Analysis</h1>
      
      {/* Disease Selector */}
      <select value={selectedDisease} onChange={(e) => setSelectedDisease(e.target.value)}>
        {diseases.map((disease) => (
          <option key={disease.id} value={disease.id}>
            {disease.name}
          </option>
        ))}
      </select>

      {/* Date Range Pickers */}
      <div>
        <label>Start Date:</label>
        <DatePicker selected={trendStartDate} onChange={(date) => setTrendStartDate(date)} />
        <label>End Date:</label>
        <DatePicker selected={trendEndDate} onChange={(date) => setTrendEndDate(date)} />
      </div>

      {/* Monthly Chart */}
      <div>
        <h2>Monthly Trend</h2>
        <Bar data={monthlyChartData} />
      </div>
    </div>
  );
};

export default IllnessTrends;
