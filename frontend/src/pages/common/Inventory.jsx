import React, { useState, useEffect } from 'react';

const Inventory = () => {
  // Dummy medicine data
  const dummyMedicineInventory = [
    { med_inv_id: 1001, med_id: 101, quantity: 250, batch_no: "A1234", expiry_date: "2025-12-31", manufacturing_date: "2024-01-15", unit_price: 0.75, supplier: "PharmSupply" },
    { med_inv_id: 1002, med_id: 102, quantity: 120, batch_no: "B5678", expiry_date: "2025-06-30", manufacturing_date: "2023-12-10", unit_price: 1.25, supplier: "MediSource" },
    { med_inv_id: 1003, med_id: 103, quantity: 500, batch_no: "C9123", expiry_date: "2026-03-15", manufacturing_date: "2024-03-05", unit_price: 0.50, supplier: "HealthDist" },
    { med_inv_id: 1004, med_id: 104, quantity: 0, batch_no: "D4567", expiry_date: "2025-08-22", manufacturing_date: "2023-10-12", unit_price: 2.00, supplier: "PharmSupply" },
    { med_inv_id: 1005, med_id: 105, quantity: 350, batch_no: "E7890", expiry_date: "2025-11-05", manufacturing_date: "2024-02-18", unit_price: 0.90, supplier: "MediSource" },
    { med_inv_id: 1006, med_id: 106, quantity: 80, batch_no: "F2345", expiry_date: "2024-07-10", manufacturing_date: "2023-09-25", unit_price: 25.50, supplier: "InsulinPlus" },
    { med_inv_id: 1007, med_id: 107, quantity: 200, batch_no: "G6789", expiry_date: "2026-01-20", manufacturing_date: "2024-01-10", unit_price: 1.80, supplier: "HealthDist" },
    { med_inv_id: 1008, med_id: 108, quantity: 150, batch_no: "H0123", expiry_date: "2025-05-15", manufacturing_date: "2023-11-25", unit_price: 3.25, supplier: "PharmSupply" },
    { med_inv_id: 1009, med_id: 109, quantity: 0, batch_no: "I4567", expiry_date: "2025-09-30", manufacturing_date: "2024-02-01", unit_price: 4.50, supplier: "MediSource" },
    { med_inv_id: 1010, med_id: 110, quantity: 100, batch_no: "J8901", expiry_date: "2024-12-05", manufacturing_date: "2023-12-28", unit_price: 2.75, supplier: "HealthDist" },
    { med_inv_id: 1011, med_id: 111, quantity: 300, batch_no: "K2345", expiry_date: "2026-02-28", manufacturing_date: "2024-03-15", unit_price: 1.15, supplier: "PharmSupply" },
    { med_inv_id: 1012, med_id: 112, quantity: 75, batch_no: "L6789", expiry_date: "2025-07-20", manufacturing_date: "2023-10-25", unit_price: 5.25, supplier: "MediSource" },
    { med_inv_id: 1013, med_id: 113, quantity: 0, batch_no: "M0123", expiry_date: "2024-10-10", manufacturing_date: "2023-11-01", unit_price: 3.50, supplier: "HealthDist" },
    { med_inv_id: 1014, med_id: 114, quantity: 225, batch_no: "N4567", expiry_date: "2025-04-25", manufacturing_date: "2024-01-05", unit_price: 0.65, supplier: "PharmSupply" },
    { med_inv_id: 1015, med_id: 115, quantity: 180, batch_no: "O8901", expiry_date: "2026-05-15", manufacturing_date: "2024-02-25", unit_price: 1.95, supplier: "MediSource" }
  ];

  // Dummy medicine data that would come from Medicine Collection
  const dummyMedicines = [
    { med_id: 101, med_name: "Amoxicillin", effectiveness: { type: "high" }, dosage_form: { type: "capsule" }, manufacturer: "PharmaCo", available: true },
    { med_id: 102, med_name: "Lisinopril", effectiveness: { type: "high" }, dosage_form: { type: "tablet" }, manufacturer: "MediLabs", available: true },
    { med_id: 103, med_name: "Ibuprofen", effectiveness: { type: "medium" }, dosage_form: { type: "tablet" }, manufacturer: "HealthPharm", available: true },
    { med_id: 104, med_name: "Azithromycin", effectiveness: { type: "high" }, dosage_form: { type: "tablet" }, manufacturer: "PharmaCo", available: false },
    { med_id: 105, med_name: "Loratadine", effectiveness: { type: "medium" }, dosage_form: { type: "tablet" }, manufacturer: "AllerCure", available: true },
    { med_id: 106, med_name: "Insulin", effectiveness: { type: "high" }, dosage_form: { type: "injection" }, manufacturer: "DiabeCare", available: true },
    { med_id: 107, med_name: "Atorvastatin", effectiveness: { type: "high" }, dosage_form: { type: "tablet" }, manufacturer: "HeartHealth", available: true },
    { med_id: 108, med_name: "Albuterol", effectiveness: { type: "high" }, dosage_form: { type: "inhaler" }, manufacturer: "RespiCare", available: true },
    { med_id: 109, med_name: "Metformin", effectiveness: { type: "medium" }, dosage_form: { type: "tablet" }, manufacturer: "DiabeCare", available: false },
    { med_id: 110, med_name: "Cetirizine", effectiveness: { type: "medium" }, dosage_form: { type: "tablet" }, manufacturer: "AllerCure", available: true },
    { med_id: 111, med_name: "Paracetamol", effectiveness: { type: "medium" }, dosage_form: { type: "tablet" }, manufacturer: "HealthPharm", available: true },
    { med_id: 112, med_name: "Omeprazole", effectiveness: { type: "high" }, dosage_form: { type: "capsule" }, manufacturer: "GastroHelp", available: true },
    { med_id: 113, med_name: "Amlodipine", effectiveness: { type: "high" }, dosage_form: { type: "tablet" }, manufacturer: "HeartHealth", available: false },
    { med_id: 114, med_name: "Aspirin", effectiveness: { type: "medium" }, dosage_form: { type: "tablet" }, manufacturer: "HealthPharm", available: true },
    { med_id: 115, med_name: "Metoprolol", effectiveness: { type: "high" }, dosage_form: { type: "tablet" }, manufacturer: "HeartHealth", available: true }
  ];

  // States for inventory management
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [combinedInventory, setCombinedInventory] = useState([]);

  // Process inventory data and combine with medicine details
  useEffect(() => {
    // Combine medicine details with inventory data
    const combined = dummyMedicineInventory.map(invItem => {
      const medicine = dummyMedicines.find(med => med.med_id === invItem.med_id);
      return {
        ...invItem,
        med_name: medicine ? medicine.med_name : 'Unknown Medicine',
        available: medicine ? medicine.available : false,
        // Calculate next availability date (dummy data - 7 days from today if quantity is 0)
        nextAvailabilityDate: invItem.quantity === 0 ? getNextAvailabilityDate() : null,
        // Calculate expired quantity (dummy logic - 10% of quantity is expired if expiry date is this year)
        expiredQuantity: new Date(invItem.expiry_date).getFullYear() === new Date().getFullYear() 
          ? Math.round(invItem.quantity * 0.1) 
          : 0
      };
    });
    setCombinedInventory(combined);
    setFilteredInventory(combined);
  }, []);

  // Helper function to generate a random next availability date
  const getNextAvailabilityDate = () => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 7); // Add 7 days
    return nextDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Filter inventory based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInventory(combinedInventory);
    } else {
      const filtered = combinedInventory.filter(item => 
        item.med_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.med_id.toString().includes(searchTerm) ||
        item.med_inv_id.toString().includes(searchTerm)
      );
      setFilteredInventory(filtered);
    }
  }, [searchTerm, combinedInventory]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative  mx-auto">
        <input
          type="text"
          placeholder="Search by medicine name or ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-md pr-10"
        />
        <svg 
          className="absolute right-3 top-3 h-5 w-5 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-3/4 mx-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Medicine Name</th>
              <th className="p-3 text-left">Available Quantity</th>
              <th className="p-3 text-left">Next Availability Date</th>
              <th className="p-3 text-left">Expired Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.med_inv_id} className="bg-gray-800 text-white rounded-md">
                <td className="p-3 rounded-l-md">{item.med_id}</td>
                <td className="p-3">{item.med_name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.nextAvailabilityDate || 'In Stock'}</td>
                <td className="p-3 rounded-r-md">{item.expiredQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;