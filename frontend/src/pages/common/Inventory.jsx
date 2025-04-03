import React, { useState, useEffect } from "react";

const Inventory = () => {
  // State to store inventory records
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [search, setSearch] = useState("");

  // Dummy data to simulate API response, in real it will come from API
  useEffect(() => {
    const dummyData = [
      { mid: "M001", name: "Paracetamol 650mg Extended Release Tablets", availableQty: 120, nextAvailable: "2025-04-10", expiredQty: 5 },
      { mid: "M002", name: "Ibuprofen Oral Suspension 100mg/5ml", availableQty: 80, nextAvailable: "2025-04-15", expiredQty: 3 },
      { mid: "M003", name: "Amoxicillin & Clavulanic Acid Tablets", availableQty: 50, nextAvailable: "2025-04-18", expiredQty: 2 },
      { mid: "M004", name: "Cough Syrup with Dextromethorphan", availableQty: 30, nextAvailable: "2025-04-20", expiredQty: 1 },
      { mid: "M005", name: "Paracetamol 500mg Fast Release", availableQty: 150, nextAvailable: "2025-05-01", expiredQty: 6 },
      { mid: "M006", name: "Paracetamol + Caffeine 325mg", availableQty: 95, nextAvailable: "2025-05-05", expiredQty: 4 },
      { mid: "M007", name: "Paracetamol Oral Solution 120mg/5ml", availableQty: 60, nextAvailable: "2025-05-10", expiredQty: 2 },
      { mid: "M008", name: "Ibuprofen 200mg Coated Tablets", availableQty: 200, nextAvailable: "2025-04-25", expiredQty: 3 },
      { mid: "M009", name: "Ibuprofen + Paracetamol Dual Action", availableQty: 110, nextAvailable: "2025-04-28", expiredQty: 2 },
      { mid: "M010", name: "Ibuprofen Topical Gel 5%", availableQty: 75, nextAvailable: "2025-05-02", expiredQty: 1 },
      { mid: "M011", name: "Amoxicillin 500mg Capsules", availableQty: 90, nextAvailable: "2025-04-22", expiredQty: 3 },
      { mid: "M012", name: "Amoxicillin + Clavulanate Suspension", availableQty: 70, nextAvailable: "2025-04-30", expiredQty: 2 }
    ];
    setRecords(dummyData);
    setFilteredRecords(dummyData);
  }, []);

  // Search function
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);
    const filtered = records.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.mid.toLowerCase().includes(query)
    );
    setFilteredRecords(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Medicine ID or Name..."
        value={search}
        onChange={handleSearch}
        className="bg-gray-200 text-black px-4 py-2 rounded-md w-full mb-4 text-center font-semibold"
      />

      {/* Inventory List View */}
      <div className="space-y-4">
        {filteredRecords.map((item) => (
          <div 
            key={item.mid} 
            className="bg-gray-900 text-white p-3 rounded-md flex justify-between items-center"
          >
            {/* Inventory Details */}
            <div className="flex w-full space-x-4">
              <span className="w-20 truncate">{item.mid}</span>
              
              {/* Medicine Name with Tooltip */}
              <div className="w-64 truncate" title={item.name}>
                {item.name}
              </div>
              
              <span className="w-28 text-center">Available: {item.availableQty}</span>
              <span className="w-32 text-center">Next: {item.nextAvailable}</span>
              <span className="w-28 text-center text-red-400">Expired: {item.expiredQty}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
