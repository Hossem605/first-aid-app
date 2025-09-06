import React from 'react';
import { Case } from '../types/Case';
import { deleteCase } from '../services/caseService';

interface CaseLogTableProps {
  cases: Case[];
  onEdit?: (caseItem: Case) => void;
  onDelete?: (id: string) => void;
  onCasesChanged?: () => void;
}

const CaseLogTable: React.FC<CaseLogTableProps> = ({ cases, onEdit, onDelete, onCasesChanged }) => {
  const handleDelete = async (id: string) => {
    const success = await deleteCase(id);
    if (success) {
      if (onDelete) {
        onDelete(id);
      }
      if (onCasesChanged) {
        onCasesChanged();
      }
    } else {
      // Even if our service reported failure, refresh the list just in case the backend succeeded
      if (onCasesChanged) {
        onCasesChanged();
      }
      alert('Failed to delete the case. Please check your internet connection or try refreshing the page.');
    }
  };

  const handleEdit = (caseItem: Case) => {
    if (onEdit) {
      onEdit(caseItem);
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cases.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No cases registered yet.
        </div>
      ) : (
        cases.map((caseItem, index) => (
          <div key={caseItem.id} className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-4 hover:shadow-lg transition-shadow aspect-square flex flex-col">
            {/* Header with case number and actions */}
            <div className="flex justify-between items-start mb-3">
              <div className="bg-blue-100 text-blue-800 font-bold text-sm px-2 py-1 rounded">
                #{index + 1}
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleEdit(caseItem)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Edit case"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(caseItem.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Delete case"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Date */}
            <div className="flex items-center text-gray-600 mb-2 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
              </svg>
              {new Date(caseItem.dateOfEvent).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            
            {/* Name */}
            <div className="flex items-center text-gray-700 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-xs truncate">{caseItem.name}</span>
            </div>
            
            {/* Company */}
            <div className="flex items-center text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs truncate">{caseItem.companyType}</span>
            </div>
            
            {/* Description - flexible space */}
            <div className="flex-1 mb-2">
              <div className="bg-gray-50 p-2 rounded text-xs">
                <p className="text-gray-700 line-clamp-2">{caseItem.descriptionOfInjury}</p>
              </div>
            </div>
            
            {/* Body parts */}
            <div className="mb-2">
              <div className="flex flex-wrap gap-1">
                {caseItem.partOfInjury.slice(0, 2).map((part, partIndex) => (
                  <span key={partIndex} className="bg-blue-100 text-blue-800 text-xs font-medium px-1 py-0.5 rounded truncate">
                    {part}
                  </span>
                ))}
                {caseItem.partOfInjury.length > 2 && (
                  <span className="text-xs text-gray-500">+{caseItem.partOfInjury.length - 2}</span>
                )}
              </div>
            </div>
            
            {/* Status badges */}
            <div className="flex flex-wrap gap-1">
              {caseItem.referredToHospital && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded">
                  Hospital
                </span>
              )}
              <span className="bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded">
                Treated
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CaseLogTable;