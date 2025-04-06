import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  const [diseaseData, setDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  // States for top K diseases section
  const [topKStartDate, setTopKStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Jan 1st of current year
  const [topKEndDate, setTopKEndDate] = useState(new Date());
  const [kValue, setKValue] = useState(5);
  const [topKData, setTopKData] = useState([]);
  const [viewType, setViewType] = useState("chart"); // 'chart' or 'cards'

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
  
  // Fetch top K diseases when parameters change
  useEffect(() => {
    fetchTopKDiseases();
  }, [topKStartDate, topKEndDate, kValue]);

  // Fetch list of diseases from the backend
  const fetchDiseases = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would be an API call
      // Simulating backend response based on the Diagnosis table
      setTimeout(() => {
        const diseasesData = [
          { id: "D001", name: "Influenza" },
          { id: "D002", name: "Hypertension" },
          { id: "D003", name: "Diabetes" },
          { id: "D004", name: "Asthma" },
          { id: "D005", name: "COVID-19" },
          { id: "D006", name: "Pneumonia" },
          { id: "D007", name: "Arthritis" },
          { id: "D008", name: "Depression" },
          { id: "D009", name: "Migraine" },
          { id: "D010", name: "Allergies" }
        ];
        
        setDiseases(diseasesData);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error fetching diseases:", error);
      setLoading(false);
    }
  };

  // Fetch disease trends data from backend
  const fetchDiseaseTrends = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would be an API call:
      // fetch(`/api/disease-trends?diseaseId=${selectedDisease}&startDate=${trendStartDate.toISOString()}&endDate=${trendEndDate.toISOString()}`)
      
      // Simulating backend response
      setTimeout(() => {
        // This response structure mirrors what would come from the backend
        // The backend would aggregate Consultations by disease_id and date
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

  // Fetch top K diseases from backend
  const fetchTopKDiseases = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would be an API call:
      // fetch(`/api/top-k-diseases?startDate=${topKStartDate.toISOString()}&endDate=${topKEndDate.toISOString()}&k=${kValue}`)
      
      // Simulating backend response
      setTimeout(() => {
        // This response structure mirrors what would come from the backend
        // The backend would count Consultations by diagnosis, sort, and limit to k
        const response = generateTopKDiseases(topKStartDate, topKEndDate, kValue);
        setTopKData(response);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching top K diseases:", error);
      setLoading(false);
    }
  };

  // Simulation of backend data generation for disease trends
  function generateDiseaseTrendData(diseaseId, startDate, endDate) {
    // Calculate date range for months
    const monthlyLabels = [];
    const monthlyValues = [];
    const monthlyData = {};
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthLabel = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyLabels.push(monthLabel);
      
      // Generate random value for this month (in real app, this would be from DB)
      const caseCount = Math.floor(Math.random() * 70) + 30;
      monthlyValues.push(caseCount);
      
      // Generate weekly data for this month
      const weeklyLabels = [];
      const weeklyValues = [];
      
      // Get number of weeks in the month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      const weeksInMonth = Math.ceil(lastDay / 7);
      
      for (let week = 1; week <= weeksInMonth; week++) {
        weeklyLabels.push(`Week ${week}`);
        weeklyValues.push(Math.floor(Math.random() * 20) + 5);
      }
      
      monthlyData[monthLabel] = {
        labels: weeklyLabels,
        values: weeklyValues
      };
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    }
    
    // Age distribution data
    const ageLabels = ["0-18", "19-35", "36-50", "51-65", "65+"];
    const ageValues = [
      Math.floor(Math.random() * 40) + 10,
      Math.floor(Math.random() * 40) + 20,
      Math.floor(Math.random() * 40) + 30,
      Math.floor(Math.random() * 40) + 20,
      Math.floor(Math.random() * 40) + 10
    ];
    
    return {
      disease: diseases.find(d => d.id === diseaseId),
      monthlyData: {
        labels: monthlyLabels,
        values: monthlyValues
      },
      weeklyDataByMonth: monthlyData,
      ageDistribution: {
        labels: ageLabels,
        values: ageValues
      },
      totalCases: monthlyValues.reduce((sum, val) => sum + val, 0)
    };
  }

  // Simulation of backend data generation for top K diseases
  function generateTopKDiseases(startDate, endDate, k) {
    // Available diseases to choose from
    const allDiseases = diseases.slice(0);
    const selectedDiseases = [];
    
    // Total cases is a random number to simulate what would come from DB
    const totalCases = Math.floor(Math.random() * 1000) + 500;
    let remainingPercentage = 100;
    
    // Generate random top diseases
    let maxIter = Math.min(k, allDiseases.length);
    for (let i = 0; i < maxIter; i++) {
      // Remove a random disease from the array (to avoid duplicates)
      const randomIndex = Math.floor(Math.random() * allDiseases.length);
      const disease = allDiseases.splice(randomIndex, 1)[0];
      
      // Last disease gets the remaining percentage
      let percentage;
      if (i === maxIter - 1) {
        percentage = remainingPercentage;
      } else {
        // Random percentage, weighted to be higher for earlier diseases
        percentage = Math.min(
          remainingPercentage - 1, 
          Math.floor(Math.random() * remainingPercentage / 2) + (remainingPercentage / (k * 2))
        );
      }
      
      remainingPercentage -= percentage;
      
      // Calculate case count from percentage
      const count = Math.round((percentage * totalCases) / 100);
      
      selectedDiseases.push({
        id: disease.id,
        name: disease.name,
        count: count,
        percentage: percentage
      });
    }
    
    // Sort by count in descending order
    return selectedDiseases.sort((a, b) => b.count - a.count);
  }

  // Handle bar click to show weekly trend
  const handleBarClick = (_, elements) => {
    if (elements && elements.length > 0) {
      const monthIndex = elements[0].index;
      const monthName = diseaseData.monthlyData.labels[monthIndex];
      setSelectedMonth(monthName);
      setActiveTab("weekly");
    }
  };

  // Prepare monthly chart data
  const monthlyChartData = {
    labels: diseaseData?.monthlyData.labels || [],
    datasets: [
      {
        label: `${diseases.find(d => d.id === selectedDisease)?.name || 'Disease'} Cases (Monthly)`,
        data: diseaseData?.monthlyData.values || [],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Prepare weekly chart data
  const weeklyChartData = selectedMonth ? {
    labels: diseaseData?.weeklyDataByMonth[selectedMonth]?.labels || [],
    datasets: [
      {
        label: `${diseases.find(d => d.id === selectedDisease)?.name || 'Disease'} Cases (${selectedMonth})`,
        data: diseaseData?.weeklyDataByMonth[selectedMonth]?.values || [],
        backgroundColor: "rgba(139, 92, 246, 0.5)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  } : null;

  // Prepare age distribution chart data
  const ageDistributionChartData = {
    labels: diseaseData?.ageDistribution.labels || [],
    datasets: [
      {
        label: "Age Distribution",
        data: diseaseData?.ageDistribution.values || [],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(6, 182, 212, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(124, 58, 237, 0.7)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(6, 182, 212, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(124, 58, 237, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare top K diseases chart data
  const topKChartData = {
    labels: topKData.map(item => item.name),
    datasets: [
      {
        label: "Number of Cases",
        data: topKData.map(item => item.count),
        backgroundColor: Array(kValue).fill().map((_, i) => 
          `rgba(${30 + (i * 20)}, ${100 + (i * 15)}, ${180 - (i * 15)}, 0.7)`
        ),
        borderWidth: 1,
      },
    ],
  };

  // Custom disease card component for top K diseases
  const DiseaseCard = ({ item, rank }) => {
    // Get icon for disease based on category
    const getIcon = (diseaseId) => {
      // Map disease IDs to emoji icons based on category
      const icons = {
        "D001": "🦠", // Influenza
        "D002": "❤️", // Hypertension
        "D003": "🍬", // Diabetes
        "D004": "🫁", // Asthma
        "D005": "😷", // COVID-19
        "D006": "🫁", // Pneumonia
        "D007": "🦴", // Arthritis
        "D008": "😔", // Depression
        "D009": "🤕", // Migraine
        "D010": "🤧", // Allergies
        "default": "🧬"
      };
      
      return icons[diseaseId] || icons.default;
    };
    
    return (
      <div className="relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Rank badge */}
        <div className="absolute top-0 left-0 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-br-lg font-bold z-10">
          {rank}
        </div>
        
        <div className="p-5">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">{getIcon(item.id)}</span>
            <h3 className="text-lg font-semibold">{item.name}</h3>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Cases:</span>
            <span className="font-medium">{item.count}</span>
          </div>
          
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Percentage:</span>
            <span className="font-medium">{item.percentage.toFixed(1)}%</span>
          </div>
          
          {/* Distribution bar */}
          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
            <div className="text-xs font-medium text-center text-gray-500 mb-1">
              Relative size compared to other top diseases
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
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
      
      {/* Top K Diseases Section */}
      <div>
        <h2>Top K Diseases</h2>
        
        {/* K value selector */}
        <div>
          <label>Top K Value:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={kValue}
            onChange={(e) => setKValue(parseInt(e.target.value))}
          />
          <span>{kValue}</span>
        </div>
        
        {/* Date Range Pickers */}
        <div>
          <label>Start Date:</label>
          <DatePicker selected={topKStartDate} onChange={(date) => setTopKStartDate(date)} />
          <label>End Date:</label>
          <DatePicker selected={topKEndDate} onChange={(date) => setTopKEndDate(date)} />
        </div>
        
        {/* View toggle */}
        <div>
          <button onClick={() => setViewType("chart")}>Chart View</button>
          <button onClick={() => setViewType("cards")}>Card View</button>
        </div>
        
        {/* Top K visualization */}
        {viewType === "chart" ? (
          <Bar data={topKChartData} />
        ) : (
          <div>
            {topKData.map((item, index) => (
              <DiseaseCard key={item.id} item={item} rank={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IllnessTrends;
