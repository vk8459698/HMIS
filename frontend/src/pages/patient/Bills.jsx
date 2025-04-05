import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

//dummy function to simulate real API call to backend
const fetchBillsByPatientId = async (patientId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyBills = [
        { date: "2025-04-03", bill_number: 12, total_amount: 13.50 },
        { date: "2025-04-04", bill_number: 13, total_amount: 14.50 },
        { date: "2025-04-05", bill_number: 14, total_amount: 15.0 },
        { date: "2025-04-06", bill_number: 15, total_amount: 16.0 },
      ];
      resolve(dummyBills);
    }, 500);
  });
};

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const navigate = useNavigate();
  const patientId = "123"; //dummy patient

  useEffect(() => {
    const loadBills = async () => {
      const data = await fetchBillsByPatientId(patientId);
      setBills(data);
    };

    loadBills();
  }, [patientId]);

  const handleView = (billId) => {
    console.log(`Viewing bill details for bill: ${billId}`);
    setSelectedBill(billId);
  };

  const handleBack = () => {
    setSelectedBill(null);
  };

  // Function to format amount with rupee symbol and 2 decimal places
  const formatAmount = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="w-full h-full bg-white p-20">
      <div className="max-w-4xl mx-auto">
        {selectedBill ? (
          // TODO ::
          // Empty page for bill details that will be implemented later
          <div className="bg-white rounded shadow">
            {/* Back button */}
            <div className="mb-4">
              <button 
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← Back to Bills
              </button>
            </div>
          </div>
        ) : (
          // Bills listing
          bills.map((bill, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-gray-900 text-white rounded mb-4 p-4"
            >
              <div className="w-1/4 px-2 font-bold text-center text-white/80">
                <p className="text-sm ">Date</p>
                <p className="mt-1 font-bold">{bill.date}</p>
              </div>
              <div className="w-1/4 px-2 font-bold text-center text-white/80">
                <p className="text-sm">Bill Number</p>
                <p className="mt-1">{bill.bill_number}</p>
              </div>
              <div className="w-1/4 px-2 font-bold text-center text-white/80">
                <p className="text-sm">Total Amount</p>
                <p className="mt-1">{formatAmount(bill.total_amount)}</p>
              </div>
              <div className="w-1/4 flex justify-end px-2">
                <button 
                  onClick={() => handleView(bill.bill_number)}
                  className="bg-[#4C7E75] hover:bg-teal-600 text-white py-2 px-4 rounded"
                >
                  View Status
                </button>
              </div>
            </div>
          ))
        )}
        
        {bills.length === 0 && !selectedBill && (
          <p className="text-center text-gray-500 py-8">No Bills Available</p>
        )}
      </div>
    </div>
  );
};

export default Bills;