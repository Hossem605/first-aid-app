export interface Case {
  id: string;
  projectName: string; // This will be used for location of incident
  date: string;
  companyType: 'NOMAC' | 'EPC' | 'Contractor' | 'Other';
  contractorName?: string; // Optional field for contractor name
  name: string;
  designation: string;
  firstAidCaseNo: string;
  idNo: string;
  dateOfEvent: string;
  timeOfEvent: string;
  department: string;
  partOfInjury: string[];
  descriptionOfInjury: string;
  referredToHospital: boolean;
  firstAider: string;
  injuredPersonSignature: string;
  ehsInCharge: string;
}