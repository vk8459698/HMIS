import React, { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    aadharId: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    email: '',
    policyNumber: '',
    emergencyNumber: '',
    mobile: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real application, you would send this data to your API
    console.log('Submitting registration data:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({
        type: 'success',
        text: 'Patient registered successfully!'
      });
      
      // Reset form after successful submission
      setFormData({
        patientName: '',
        aadharId: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        email: '',
        policyNumber: '',
        emergencyNumber: '',
        mobile: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">New User Registration</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto">
          {/* Left Column */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Patient Name:
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                DOB:
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Blood Group:
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Policy Number:
              </label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Mobile:
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Aadhar Id:
              </label>
              <input
                type="text"
                name="aadharId"
                value={formData.aadharId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Gender:
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Emergency Number:
              </label>
              <input
                type="tel"
                name="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
