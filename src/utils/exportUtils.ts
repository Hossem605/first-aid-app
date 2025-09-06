import { Case } from '../types/Case';

/**
 * Converts an array of Case objects to a CSV string
 * @param cases Array of Case objects to convert
 * @returns CSV formatted string
 */
export const convertCasesToCSV = (cases: Case[]): string => {
  if (cases.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'Serial',
    'Date',
    'Time',
    'Location of Incident',
    'Company Type',
    'Contractor Name',
    'Name',
    'Designation',
    'First Aid Case No',
    'ID No',
    'Department',
    'Part of Injury',
    'Description of Injury',
    'Referred to Hospital',
    'First Aider',
    'EHS In-Charge'
  ];

  // Create CSV header row
  let csvContent = headers.join(',') + '\n';

  // Add data rows
  cases.forEach((caseItem, index) => {
    const row = [
      index + 1,
      caseItem.dateOfEvent,
      caseItem.timeOfEvent,
      caseItem.projectName,
      caseItem.companyType,
      caseItem.companyType === 'Contractor' ? caseItem.contractorName || 'N/A' : 'N/A',
      caseItem.name,
      caseItem.designation,
      caseItem.firstAidCaseNo,
      caseItem.idNo,
      caseItem.department,
      caseItem.partOfInjury.join('; '),
      caseItem.descriptionOfInjury,
      caseItem.referredToHospital ? 'Yes' : 'No',
      caseItem.firstAider,
      caseItem.ehsInCharge
    ];

    // Escape fields that contain commas
    const escapedRow = row.map(field => {
      const stringField = String(field);
      return stringField.includes(',') ? `"${stringField}"` : stringField;
    });

    csvContent += escapedRow.join(',') + '\n';
  });

  return csvContent;
};

/**
 * Triggers a download of a CSV file containing case data
 * @param cases Array of Case objects to include in the CSV
 * @param filename Name of the file to download (without extension)
 */
export const downloadCasesCSV = (cases: Case[], filename: string = 'first-aid-cases'): void => {
  const csvContent = convertCasesToCSV(cases);
  
  if (!csvContent) {
    console.warn('No data to export');
    return;
  }

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Add link to document, trigger click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};