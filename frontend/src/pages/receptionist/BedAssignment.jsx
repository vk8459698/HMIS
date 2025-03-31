import React, { useState, useEffect } from 'react';

const BedAssignment = () => {
  // State to track bed status
  const [beds, setBeds] = useState({
    A1: { occupied: false, patientId: null, patientName: null },
    A2: { occupied: true, patientId: 'P1002', patientName: 'John Doe' },
    A3: { occupied: false, patientId: null, patientName: null },
    A4: { occupied: true, patientId: 'P1004', patientName: 'Jane Smith' },
    A5: { occupied: false, patientId: null, patientName: null },
    B1: { occupied: true, patientId: 'P1005', patientName: 'Robert Johnson' },
    B2: { occupied: false, patientId: null, patientName: null },
    B3: { occupied: true, patientId: 'P1008', patientName: 'Emily Davis' },
    B4: { occupied: false, patientId: null, patientName: null },
    B5: { occupied: false, patientId: null, patientName: null },
    C1: { occupied: false, patientId: null, patientName: null },
    C2: { occupied: true, patientId: 'P1012', patientName: 'Michael Brown' },
    C3: { occupied: false, patientId: null, patientName: null },
    C4: { occupied: true, patientId: 'P1015', patientName: 'Sarah Wilson' },
    C5: { occupied: true, patientId: 'P1018', patientName: 'Thomas Clark' },
    D1: { occupied: false, patientId: null, patientName: null },
    D2: { occupied: false, patientId: null, patientName: null },
    D3: { occupied: false, patientId: null, patientName: null },
    D4: { occupied: true, patientId: 'P1023', patientName: 'Lisa Garcia' },
    D5: { occupied: false, patientId: null, patientName: null },
  });

  // State for selected bed and patient assignment form
  const [selectedBed, setSelectedBed] = useState(null);
  const [patientForm, setPatientForm] = useState({
    patientId: '',
    patientName: '',
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('assign'); // 'assign' or 'discharge'

  // Load beds data from API/localStorage
  useEffect(() => {
    // This would typically be an API call
    const savedBeds = localStorage.getItem('hospitalBeds');
    if (savedBeds) {
      setBeds(JSON.parse(savedBeds));
    }
  }, []);

  // Save beds data when it changes
  useEffect(() => {
    localStorage.setItem('hospitalBeds', JSON.stringify(beds));
  }, [beds]);

  // Handle bed click
  const handleBedClick = (bedId) => {
    setSelectedBed(bedId);
    
    if (beds[bedId].occupied) {
      // If bed is occupied, show discharge modal
      setModalAction('discharge');
      setPatientForm({
        patientId: beds[bedId].patientId,
        patientName: beds[bedId].patientName,
      });
    } else {
      // If bed is empty, show assign modal
      setModalAction('assign');
      setPatientForm({
        patientId: '',
        patientName: '',
      });
    }
    
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientForm({
      ...patientForm,
      [name]: value,
    });
  };

  // Handle bed assignment
  const handleAssignBed = () => {
    if (selectedBed && patientForm.patientId && patientForm.patientName) {
      const updatedBeds = {
        ...beds,
        [selectedBed]: {
          occupied: true,
          patientId: patientForm.patientId,
          patientName: patientForm.patientName,
        },
      };
      setBeds(updatedBeds);
      setShowModal(false);
      setSelectedBed(null);
    }
  };

  // Handle patient discharge
  const handleDischargeBed = () => {
    if (selectedBed) {
      const updatedBeds = {
        ...beds,
        [selectedBed]: {
          occupied: false,
          patientId: null,
          patientName: null,
        },
      };
      setBeds(updatedBeds);
      setShowModal(false);
      setSelectedBed(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Bed Mapping</h2>
      
      {/* Bed Grid */}
      <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
        {Object.keys(beds).map((bedId) => (
          <div
            key={bedId}
            onClick={() => handleBedClick(bedId)}
            className={`
              p-4 rounded-md text-center font-medium cursor-pointer
              ${beds[bedId].occupied ? 'bg-cyan-200 hover:bg-cyan-300' : 'bg-gray-200 hover:bg-gray-300'}
              transition-colors duration-200
            `}
          >
            {bedId}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-cyan-200 mr-2"></div>
          <span>Occupied</span>
        </div>
      </div>
      
      {/* Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {modalAction === 'assign' ? 'Assign Patient to Bed' : 'Discharge Patient'} {selectedBed}
            </h3>
            
            {modalAction === 'assign' ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Patient ID:
                  </label>
                  <input
                    type="text"
                    name="patientId"
                    value={patientForm.patientId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Patient Name:
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={patientForm.patientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignBed}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p><strong>Patient ID:</strong> {patientForm.patientId}</p>
                  <p><strong>Patient Name:</strong> {patientForm.patientName}</p>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDischargeBed}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Discharge
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BedAssignment;
