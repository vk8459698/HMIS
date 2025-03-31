import React, { useState } from 'react';

const ManageAmbulance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  
  // Sample data - in a real application, this would come from an API
  const [ambulances, setAmbulances] = useState([
    { id: 'AMB001', vehicleNumber: 'KA01M1234', driverId: 'DRV001', status: 'Active' },
    { id: 'AMB002', vehicleNumber: 'KA01M5678', driverId: 'DRV002', status: 'Inactive' },
    { id: 'AMB003', vehicleNumber: 'KA01M9012', driverId: 'DRV003', status: 'Active' },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter ambulances based on search query - here just selecting the first match for demo
    const found = ambulances.find(amb => 
      amb.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSelectedAmbulance(found || null);
  };

  const handleAddAmbulance = () => {
    // In a real application, this would open a form or modal
    console.log('Add Ambulance clicked');
  };

  const handleMakeActive = () => {
    if (selectedAmbulance) {
      // Update selected ambulance status
      const updatedAmbulances = ambulances.map(amb => 
        amb.id === selectedAmbulance.id ? { ...amb, status: 'Active' } : amb
      );
      setAmbulances(updatedAmbulances);
      setSelectedAmbulance({ ...selectedAmbulance, status: 'Active' });
    }
  };

  const handleMakeInactive = () => {
    if (selectedAmbulance) {
      // Update selected ambulance status
      const updatedAmbulances = ambulances.map(amb => 
        amb.id === selectedAmbulance.id ? { ...amb, status: 'Inactive' } : amb
      );
      setAmbulances(updatedAmbulances);
      setSelectedAmbulance({ ...selectedAmbulance, status: 'Inactive' });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Ambulance</h2>
      
      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-gray-200 p-3 flex items-center justify-center">
            <input
              type="text"
              placeholder="Search for Ambulance by Vehicle Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded text-center"
            />
          </div>
        </form>

        {/* Ambulance Details */}
        <div className="mb-8">
          {selectedAmbulance ? (
            <ul className="list-disc pl-8 space-y-2">
              <li><strong>Ambulance ID:</strong> {selectedAmbulance.id}</li>
              <li><strong>Vehicle Number:</strong> {selectedAmbulance.vehicleNumber}</li>
              <li><strong>Driver ID:</strong> {selectedAmbulance.driverId}</li>
              <li><strong>Status:</strong> {selectedAmbulance.status}</li>
            </ul>
          ) : (
            <ul className="list-disc pl-8 space-y-2">
              <li>Ambulance ID</li>
              <li>Vehicle Number</li>
              <li>Driver ID</li>
              <li>Status (Active/Inactive)</li>
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleAddAmbulance}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
          >
            Add Ambulance
          </button>
          <button
            onClick={handleMakeActive}
            disabled={!selectedAmbulance}
            className={`bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded ${!selectedAmbulance ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Make Active
          </button>
          <button
            onClick={handleMakeInactive}
            disabled={!selectedAmbulance}
            className={`bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded ${!selectedAmbulance ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Make Inactive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAmbulance;
