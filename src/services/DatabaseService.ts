import { Case } from '../types/Case';

export class DatabaseService {
  private static instance: DatabaseService;
  private readonly STORAGE_KEY = 'first_aid_cases';

  private constructor() {
    // Initialize localStorage if needed
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  // Helper methods for localStorage
  private getCases(): Case[] {
    const casesJson = localStorage.getItem(this.STORAGE_KEY) || '[]';
    return JSON.parse(casesJson);
  }
  
  private saveCases(cases: Case[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cases));
  }

  // Replace all stored cases (used to mirror Firebase data locally for consistency/offline)
  public replaceAllCases(cases: Case[]): void {
    try {
      this.saveCases(cases);
    } catch (error) {
      console.error('Failed to replace cases:', error);
    }
  }

  public saveCase(caseData: Case): boolean {
    try {
      const cases = this.getCases();
      cases.push(caseData);
      this.saveCases(cases);
      return true;
    } catch (error) {
      console.error('Failed to save case:', error);
      return false;
    }
  }

  public getAllCases(): Case[] {
    try {
      const cases = this.getCases();
      // Sort by date and time, most recent first
      return cases.sort((a, b) => {
        const dateA = new Date(`${a.dateOfEvent} ${a.timeOfEvent}`);
        const dateB = new Date(`${b.dateOfEvent} ${b.timeOfEvent}`);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Failed to get cases:', error);
      return [];
    }
  }

  public getCaseById(id: string): Case | null {
    try {
      const cases = this.getCases();
      const foundCase = cases.find(c => c.id === id);
      return foundCase || null;
    } catch (error) {
      console.error(`Failed to get case with id ${id}:`, error);
      return null;
    }
  }

  public updateCase(caseData: Case): boolean {
    try {
      const cases = this.getCases();
      const index = cases.findIndex(c => c.id === caseData.id);
      
      if (index === -1) return false;
      
      cases[index] = caseData;
      this.saveCases(cases);
      return true;
    } catch (error) {
      console.error(`Failed to update case with id ${caseData.id}:`, error);
      return false;
    }
  }

  public deleteCase(id: string): boolean {
    try {
      const cases = this.getCases();
      const filteredCases = cases.filter(c => c.id !== id);
      
      if (filteredCases.length === cases.length) return false;
      
      this.saveCases(filteredCases);
      return true;
    } catch (error) {
      console.error(`Failed to delete case with id ${id}:`, error);
      return false;
    }
  }
}

export default DatabaseService;