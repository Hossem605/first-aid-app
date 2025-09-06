import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CaseRegistrationForm from './components/CaseRegistrationForm';
import { Case } from './types/Case';
import { addCase, updateCase } from './services/caseService';

function App() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [refreshDashboard, setRefreshDashboard] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  
  const handleAddCase = async (newCase: Case): Promise<boolean> => {
    try {
      console.log('[App] handleAddCase called', { editingCase, newCase });
      let success = false;
      if (editingCase) {
        // Update existing case
        console.log('[App] Updating existing case');
        success = await updateCase({ ...newCase, id: editingCase.id });
        console.log('[App] updateCase resolved with', success);
      } else {
        // Add new case
        console.log('[App] Adding new case');
        success = await addCase(newCase);
        console.log('[App] addCase resolved with', success);
      }

      if (!success) {
        console.warn('[App] Save returned false, staying on form');
        alert('Failed to save case. Please try again.');
        return false; // Do not navigate
      }

      console.log('[App] Navigating back to Dashboard and refreshing list');
      setShowRegistrationForm(false);
      setEditingCase(null);
      setRefreshDashboard(prev => !prev); // Toggle to trigger refresh
      return true;
    } catch (error) {
      console.error('Error saving case:', error);
      alert('Failed to save case. Please try again.');
      return false;
    }
  };

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setShowRegistrationForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showRegistrationForm ? (
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-800">
            {editingCase ? 'Edit First Aid Case' : 'First Aid Case Registration'}
          </h1>
            <button 
              onClick={() => setShowRegistrationForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </header>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <CaseRegistrationForm onSubmit={handleAddCase} initialData={editingCase} />
          </div>
        </div>
      ) : (
        <Dashboard 
          onAddNewClick={() => setShowRegistrationForm(true)} 
          onEditCase={handleEditCase}
          refreshTrigger={refreshDashboard}
        />
      )}
    </div>
  );
}

export default App;