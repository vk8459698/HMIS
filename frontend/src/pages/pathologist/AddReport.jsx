import React, { useState } from 'react';

const AddReport = () => {
  const [patientId, setPatientId] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [fileName, setFileName] = useState('');

  // Mock function for handling form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting report with:', { patientId, selectedTest, fileName });
    // TODO: Add actual API call to submit report
  };

  // Mock function for file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="p-8 bg-white h-full">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Patient ID Input */}
        <div className="mb-8 flex items-center justify-between">
          <label htmlFor="patientId" className="text-gray-800 font-medium mr-4">
            Patient ID:
          </label>
          <div className="flex flex-1">
            <input
              type="text"
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full py-2 px-3 bg-gray-200 rounded-l-md text-gray-700"
            />
            <button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-r-md transition-colors"
            >
              ENTER
            </button>
          </div>
        </div>

        {/* Test Selection Dropdown */}
        <div className="mb-8 flex items-center justify-between">
          <label htmlFor="testSelect" className="text-gray-800 font-medium mr-4">
            Select Test
          </label>
          <select
            id="testSelect"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="flex-1 py-2 px-3 bg-gray-200 rounded-md text-gray-700 appearance-none"
          >
            <option value="">Select a test...</option>
            <option value="blood">Blood Test</option>
            <option value="urine">Urine Analysis</option>
            <option value="xray">X-Ray</option>
            <option value="mri">MRI Scan</option>
            <option value="ct">CT Scan</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-4">
            <label className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded cursor-pointer transition-colors">
              Choose File
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileSelect} 
              />
            </label>
            <button 
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Display selected filename */}
        {fileName && (
          <div className="mt-4 text-center text-gray-700">
            Selected file: {fileName}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddReport;