import React, { useState, useEffect } from 'react';
import CaseLogTable from '../components/CaseLogTable';
import { Case } from '../types/Case';
import { getAllCases } from '../services/caseService';
import './dashboard.css';

interface DashboardProps {
  onAddNewClick: () => void;
  onEditCase?: (caseItem: Case) => void;
  refreshTrigger?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddNewClick, onEditCase, refreshTrigger }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    loadCases();
  }, [refreshTrigger]);

  const handleEditCase = (caseItem: Case) => {
    if (onEditCase) {
      onEditCase(caseItem);
    }
  };
  
  const handleCasesChanged = () => {
    loadCases();
  };

  const loadCases = async () => {
    try {
      const allCases = await getAllCases();
      setCases(allCases);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const handleExportCSV = () => {
    // Convert cases to CSV format
    const headers = [
      'Serial',
      'Date/Time',
      'Name of Injured',
      'Company',
      'ID No.',
      'Nature of Injury',
      'First Aid Treatment',
      'Referred to Hospital',
      'Causes'
    ];

    const csvContent = [
      headers.join(','),
      ...cases.map(c => [
        c.id,
        `${c.dateOfEvent} ${c.timeOfEvent}`,
        c.name,
        c.companyType === 'Contractor' ? `${c.companyType} - ${c.contractorName || 'N/A'}` : c.companyType,
        c.idNo,
        c.partOfInjury.join(', '),
        c.descriptionOfInjury,
        c.referredToHospital ? 'Yes' : 'No',
        c.descriptionOfInjury // Using description as causes for now
      ].join(','))
    ].join('\n');

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `first-aid-cases-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.idNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? c.dateOfEvent === filterDate : true;
    const matchesDepartment = filterDepartment ? c.department.toLowerCase().includes(filterDepartment.toLowerCase()) : true;
    
    return matchesSearch && matchesDate && matchesDepartment;
  });

  // Statistics
  const totalCases = cases.length;
  const hospitalReferrals = cases.filter(c => c.referredToHospital).length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCases = cases.filter(c => {
    const caseDate = new Date(c.dateOfEvent);
    return caseDate >= sevenDaysAgo;
  }).length;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient base */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1000px 600px at 20% 10%, rgba(186,230,253,0.6), transparent 60%), ' +
            'radial-gradient(800px 500px at 80% 30%, rgba(252,231,243,0.55), transparent 55%), ' +
            'linear-gradient(135deg, #f8fbff 0%, #eef7ff 35%, #f2f9ff 100%)'
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 -z-10 pointer-events-none" />

      {/* Soft animated blobs */}
      <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-cyan-300/30 rounded-full blur-3xl animate-blob -z-10" />
      <div className="absolute -bottom-40 -left-44 w-[30rem] h-[30rem] bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-sky-400/30 rounded-full blur-3xl animate-blob animation-delay-2000 -z-10" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-blue-800 drop-shadow-sm">First Aid Case Dashboard</h1>
          </div>
          <button 
            onClick={onAddNewClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center shadow-md hover:shadow-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 floating-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Case
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 text-center ring-1 ring-blue-100/60 hover:shadow-xl transition">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 floating-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cases</h3>
            <p className="text-3xl font-bold text-blue-600">{totalCases}</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 text-center ring-1 ring-red-100/60 hover:shadow-xl transition">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 floating-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Hospital Referrals</h3>
            <p className="text-3xl font-bold text-red-600">{hospitalReferrals}</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 text-center ring-1 ring-green-100/60 hover:shadow-xl transition">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 floating-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent (7 days)</h3>
            <p className="text-3xl font-bold text-green-600">{recentCases}</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-xl shadow-xl ring-1 ring-blue-100/60 p-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Case Log</h2>
            
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <input
                type="text"
                placeholder="Search by name or ID"
                className="border rounded px-3 py-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <input
                type="date"
                className="border rounded px-3 py-1"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              
              <input
                type="text"
                placeholder="Filter by department"
                className="border rounded px-3 py-1"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              />
              
              <button 
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 shadow-sm"
              >
                Export CSV
              </button>
            </div>
          </div>
          
          <CaseLogTable 
            cases={filteredCases} 
            onEdit={handleEditCase}
            onCasesChanged={handleCasesChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;