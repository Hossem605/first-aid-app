import React, { useState, useEffect, useRef } from 'react';
import { Case } from '../types/Case';

interface CaseRegistrationFormProps {
  onSubmit: (caseData: Case) => boolean | Promise<boolean>;
  initialData?: Case | null;
}

const CaseRegistrationForm: React.FC<CaseRegistrationFormProps> = ({ onSubmit, initialData }) => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<Omit<Case, 'id'>>({ 
    projectName: '',
    date: new Date().toISOString().split('T')[0],
    companyType: 'NOMAC',
    contractorName: '',
    name: '',
    designation: '',
    firstAidCaseNo: '', // User can enter any value
    idNo: '',
    dateOfEvent: new Date().toISOString().split('T')[0],
    timeOfEvent: new Date().toTimeString().split(' ')[0].slice(0, 5),
    department: '',
    partOfInjury: [],
    descriptionOfInjury: '',
    referredToHospital: false,
    firstAider: '',
    injuredPersonSignature: '',
    ehsInCharge: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // If initialData changes, update the form
    if (initialData) {
      setFormData({
        projectName: initialData.projectName || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        companyType: initialData.companyType || 'NOMAC',
        contractorName: initialData.contractorName || '',
        name: initialData.name || '',
        designation: initialData.designation || '',
        firstAidCaseNo: initialData.firstAidCaseNo || '',
        idNo: initialData.idNo || '',
        dateOfEvent: initialData.dateOfEvent || '',
        timeOfEvent: initialData.timeOfEvent || '',
        department: initialData.department || '',
        partOfInjury: initialData.partOfInjury || [],
        descriptionOfInjury: initialData.descriptionOfInjury || '',
        referredToHospital: initialData.referredToHospital || false,
        firstAider: initialData.firstAider || '',
        injuredPersonSignature: initialData.injuredPersonSignature || '',
        ehsInCharge: initialData.ehsInCharge || ''
      });
    }
  }, [initialData]);

  const injuryParts = [
    'Head', 'Arm', 'Leg', 'Internal', 'Fracture', 'Sprain/Strain', 
    'Eyes', 'Wrist', 'Ankle', 'Skin', 'Burn/Scald', 'Poisoning', 
    'Face', 'Hand', 'Foot', 'Lungs', 'Cut/Bruise', 'Foreign body', 
    'Neck', 'Finger', 'Toe', 'Groin', 'Inhalation', 'Electric Shock', 
    'Shoulder', 'Back', 'Torso', 'Multiple', 'Abrasion', 'Others'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleInjuryPartChange = (part: string) => {
    setFormData(prev => {
      const currentParts = [...prev.partOfInjury];
      if (currentParts.includes(part)) {
        return { ...prev, partOfInjury: currentParts.filter(p => p !== part) };
      } else {
        return { ...prev, partOfInjury: [...currentParts, part] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CaseRegistrationForm] handleSubmit triggered');

    // Ensure required fields are visible and reported if missing
    if (formRef.current && !formRef.current.checkValidity()) {
      console.log('[CaseRegistrationForm] Form invalid -> showing validity messages');
      formRef.current.reportValidity();
      return;
    }

    // Create case without ID - Firebase will auto-generate it
    const newCase: Case = {
      ...formData,
      id: '' // Firebase will auto-generate the ID
    };
    console.log('[CaseRegistrationForm] Submitting case to parent onSubmit', newCase);

    try {
      setSubmitting(true);
      const success = await Promise.resolve(onSubmit(newCase));
      console.log('[CaseRegistrationForm] onSubmit promise resolved with', success);
      if (!success) {
        console.warn('[CaseRegistrationForm] Save unsuccessful, keeping form data intact');
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error('[CaseRegistrationForm] onSubmit threw error', err);
      alert('Failed to submit the case. Please try again.');
      setSubmitting(false);
      return;
    }

    // Reset form after successful submission
    setFormData({
      projectName: '',
      date: new Date().toISOString().split('T')[0],
      companyType: 'NOMAC',
      contractorName: '',
      name: '',
      designation: '',
      firstAidCaseNo: '',
      idNo: '',
      dateOfEvent: new Date().toISOString().split('T')[0],
      timeOfEvent: new Date().toTimeString().split(' ')[0].slice(0, 5),
      department: '',
      partOfInjury: [],
      descriptionOfInjury: '',
      referredToHospital: false,
      firstAider: '',
      injuredPersonSignature: '',
      ehsInCharge: ''
    });
    setSubmitting(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location of the incident */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location of the incident *</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Company Type */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
          <div className="flex flex-wrap space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="nomac"
                name="companyType"
                checked={formData.companyType === 'NOMAC'}
                onChange={() => setFormData(prev => ({ ...prev, companyType: 'NOMAC' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="nomac" className="ml-2 block text-sm text-gray-700">NOMAC</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="epc"
                name="companyType"
                checked={formData.companyType === 'EPC'}
                onChange={() => setFormData(prev => ({ ...prev, companyType: 'EPC' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="epc" className="ml-2 block text-sm text-gray-700">EPC</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="contractor"
                name="companyType"
                checked={formData.companyType === 'Contractor'}
                onChange={() => setFormData(prev => ({ ...prev, companyType: 'Contractor' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="contractor" className="ml-2 block text-sm text-gray-700">Contractor</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="other"
                name="companyType"
                checked={formData.companyType === 'Other'}
                onChange={() => setFormData(prev => ({ ...prev, companyType: 'Other' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="other" className="ml-2 block text-sm text-gray-700">Other</label>
            </div>
          </div>
        </div>
        
        {/* Contractor Name section - shown for all company types */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Contractor Name {formData.companyType !== 'Contractor' && '(Optional)'}</label>
          <input
            type="text"
            name="contractorName"
            value={formData.contractorName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter contractor name"
            required={formData.companyType === 'Contractor'}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* First Aid Case No. */}
        <div>
          <label className="block text-sm font-medium text-gray-700">First Aid Case No.</label>
          <input
            type="text"
            name="firstAidCaseNo"
            value={formData.firstAidCaseNo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter case number"
          />
        </div>

        {/* ID No. */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID No.</label>
          <input
            type="text"
            name="idNo"
            value={formData.idNo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date of Event */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Event</label>
          <input
            type="date"
            name="dateOfEvent"
            value={formData.dateOfEvent}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Time of Event */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Time of Event</label>
          <input
            type="time"
            name="timeOfEvent"
            value={formData.timeOfEvent}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Part of Injury */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Part of Injury</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {injuryParts.map(part => (
            <div key={part} className="flex items-center">
              <input
                type="checkbox"
                id={`injury-${part}`}
                checked={formData.partOfInjury.includes(part)}
                onChange={() => handleInjuryPartChange(part)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`injury-${part}`} className="ml-2 block text-sm text-gray-700">{part}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Description of Injury */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description of Injury</label>
        <textarea
          name="descriptionOfInjury"
          value={formData.descriptionOfInjury}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Referred to Hospital */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Referred to Hospital</label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="referred-yes"
              name="referredToHospital"
              checked={formData.referredToHospital}
              onChange={() => setFormData(prev => ({ ...prev, referredToHospital: true }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="referred-yes" className="ml-2 block text-sm text-gray-700">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="referred-no"
              name="referredToHospital"
              checked={!formData.referredToHospital}
              onChange={() => setFormData(prev => ({ ...prev, referredToHospital: false }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="referred-no" className="ml-2 block text-sm text-gray-700">No</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Aider */}
        <div>
          <label className="block text-sm font-medium text-gray-700">First Aider</label>
          <input
            type="text"
            name="firstAider"
            value={formData.firstAider}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Injured Person Signature */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Injured Person Signature</label>
          <input
            type="text"
            name="injuredPersonSignature"
            value={formData.injuredPersonSignature}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* EHS In-charge */}
        <div>
          <label className="block text-sm font-medium text-gray-700">EHS In-charge</label>
          <input
            type="text"
            name="ehsInCharge"
            value={formData.ehsInCharge}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-white ${submitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
        >
          {submitting ? 'Submitting...' : 'Submit Case'}
        </button>
      </div>
    </form>
  );
};

export default CaseRegistrationForm;