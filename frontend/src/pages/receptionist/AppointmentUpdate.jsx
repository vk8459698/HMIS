import React, { useState, useEffect } from 'react';

const AppointmentUpdate = () => {
  const [formData, setFormData] = useState({
    appointmentId: '',
    doctorId: '',
    time: '',
    roomNo: '',
    date: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to fetch appointment details based on ID (could be used when searching for an appointment)
  const fetchAppointmentDetails = (id) => {
    setIsLoading(true);
    // Mock API call - replace with your actual API call
    setTimeout(() => {
      // Simulating data fetch
      const mockData = {
        appointmentId: id,
        doctorId: 'DOC-' + Math.floor(Math.random() * 1000),
        time: '14:30',
        roomNo: '203',
        date: '2025-04-15',
      };
      
      setFormData(mockData);
      setIsLoading(false);
    }, 500);
  };

  // Handle appointment ID change specifically to trigger data fetch
  const handleAppointmentIdChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      appointmentId: value
    });
    
    // Optional: Auto-fetch if ID is of proper length
    if (value.length >= 5) {
      fetchAppointmentDetails(value);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call - replace with your actual update API call
    setTimeout(() => {
      console.log('Updating appointment:', formData);
      setMessage({ type: 'success', text: 'Appointment updated successfully!' });
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }, 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Appointment ID:
              </label>
              <input
                type="text"
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleAppointmentIdChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Time:
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Doctor ID:
              </label>
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Room No:
              </label>
              <input
                type="text"
                name="roomNo"
                value={formData.roomNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Update Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentUpdate;
