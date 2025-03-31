import React, { useState } from 'react';

const AddBills = () => {
  const [patientId, setPatientId] = useState('');
  const [services, setServices] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ patientId, services });
    // Reset form or show success message
  };

  return (
    <div className="p-6 bg-white w-full h-full">
      <h2 className="text-xl font-semibold mb-6">Add Bills</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="patientId" className="block text-sm font-medium mb-2">Patient ID:</label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="services" className="block text-sm font-medium mb-2">Services Offered:</label>
          <textarea
            id="services"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="w-full md:w-3/4 p-2 border border-gray-300 rounded bg-gray-200 h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter services details here..."
          />
        </div>

        <div className="flex justify-center md:justify-start">
          <button 
            type="submit" 
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded transition duration-200"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBills;
