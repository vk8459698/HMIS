import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Building, CreditCard, Award, Briefcase, ChevronRight } from 'lucide-react';

// Mock data functions
const fetchPharmacistDetails = (id) => {
  // In a real app, this would be an API call
  return {
    pharmacist_id: 1,
    employee_id: 101
  };
};

const fetchEmployeeDetails = (id) => {
  // In a real app, this would be an API call
  return {
    employee_id: 101,
    name: "Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    profile_pic: "/api/placeholder/150/150",
    role: "pharmacist",
    dept_id: "PHARM-01",
    phone_number: "555-123-4567",
    address: "123 Health Avenue, Medical District",
    date_of_birth: "1985-07-15",
    date_of_joining: "2018-03-10",
    gender: "female",
    salary: 85000.00,
    bank_details: 7890
  };
};

const PharmacistPage = () => {
  const [pharmacist, setPharmacist] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    // Mock fetching data
    const pharmacistData = fetchPharmacistDetails(1);
    const employeeData = fetchEmployeeDetails(pharmacistData.employee_id);
    
    setPharmacist(pharmacistData);
    setEmployee(employeeData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const InfoItem = ({ icon, label, value }) => (
    <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="flex items-center text-gray-900">
        {icon}
        <span className="ml-2">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg shadow-lg flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pharmacist Details</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors duration-200 flex items-center">
              <span>Edit Profile</span>
            </button>
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors duration-200">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-lg">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 p-6 border-b border-gray-200">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative group">
                <img 
                  src={employee.profile_pic} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full border-4 border-blue-100 object-cover transition-all duration-300 group-hover:border-blue-400"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white font-medium">Change Photo</span>
                </div>
              </div>
              <span className="mt-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
                {employee.role}
              </span>
            </div>
            
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{employee.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center bg-blue-50 p-3 rounded-lg transition-all duration-200 hover:bg-blue-100">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <span className="text-gray-900">{employee.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-blue-50 p-3 rounded-lg transition-all duration-200 hover:bg-blue-100">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <span className="text-gray-900">{employee.phone_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-4 font-medium text-center transition-colors duration-200 ${
                activeSection === 'personal' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveSection('personal')}
            >
              Personal Information
            </button>
            <button 
              className={`flex-1 py-4 font-medium text-center transition-colors duration-200 ${
                activeSection === 'employment' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveSection('employment')}
            >
              Employment Information
            </button>
          </div>
          
          {/* Personal Information */}
          <div className={activeSection === 'personal' ? 'block p-6' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem 
                icon={<User size={18} className="text-blue-600" />}
                label="Employee ID" 
                value={employee.employee_id} 
              />
              
              <InfoItem 
                icon={<Award size={18} className="text-blue-600" />}
                label="Pharmacist ID" 
                value={pharmacist.pharmacist_id} 
              />
              
              <InfoItem 
                icon={<Building size={18} className="text-blue-600" />}
                label="Department ID" 
                value={employee.dept_id} 
              />
              
              <InfoItem 
                icon={<Calendar size={18} className="text-blue-600" />}
                label="Date of Joining" 
                value={new Date(employee.date_of_joining).toLocaleDateString()} 
              />
              
              <InfoItem 
                icon={<Calendar size={18} className="text-blue-600" />}
                label="Date of Birth" 
                value={new Date(employee.date_of_birth).toLocaleDateString()} 
              />
              
              <InfoItem 
                icon={<User size={18} className="text-blue-600" />}
                label="Gender" 
                value={employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)} 
              />
              
              <div className="md:col-span-2 lg:col-span-3 transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <div className="flex items-center text-gray-900">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="ml-2">{employee.address}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Employment Information */}
          <div className={activeSection === 'employment' ? 'block p-6' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl transition-all duration-200 hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mr-4">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Salary Information</h3>
                    <p className="text-gray-500 text-sm">Annual compensation details</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">${employee.salary.toLocaleString()}</div>
                <div className="mt-4 text-sm text-gray-500">Last reviewed: January 2025</div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl transition-all duration-200 hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mr-4">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
                    <p className="text-gray-500 text-sm">Payment information</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mt-2">ID: {employee.bank_details}</div>
                <div className="mt-4 text-sm text-gray-500">Contact HR to update banking information</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          
        </div>
      </div>
    </div>
  );
};

export default PharmacistPage;