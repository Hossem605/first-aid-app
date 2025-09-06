import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Case } from '../types/Case';

export class FirebaseService {
  private static instance: FirebaseService;
  private readonly COLLECTION_NAME = 'cases';

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public async saveCase(caseData: Case): Promise<boolean> {
    try {
      const casesRef = collection(db, this.COLLECTION_NAME);
      // Remove the id field when saving, let Firebase auto-generate it
      const { id, ...dataToSave } = caseData;
      console.log('[FirebaseService] saveCase -> adding doc', dataToSave);
      const result = await addDoc(casesRef, dataToSave);
      console.log('[FirebaseService] saveCase -> added doc with id', result.id);
      return true;
    } catch (error) {
      console.error('[FirebaseService] Failed to save case:', error);
      return false;
    }
  }

  public async getAllCases(): Promise<Case[]> {
    try {
      console.log('[FirebaseService] getAllCases -> fetching all documents');
      const casesRef = collection(db, this.COLLECTION_NAME);
      // Fetch without composite orderBy to avoid missing index; sort client-side
      const querySnapshot = await getDocs(casesRef);
      console.log('[FirebaseService] getAllCases -> received snapshot with size', querySnapshot.size);
      
      const cases: Case[] = [];
      querySnapshot.forEach((docSnap) => {
        cases.push({ id: docSnap.id, ...docSnap.data() } as Case);
      });
      console.log('[FirebaseService] getAllCases -> mapped cases count', cases.length);
      
      // Sort by date and time (most recent first)
      cases.sort((a, b) => {
        const aDT = new Date(`${a.dateOfEvent} ${a.timeOfEvent}`).getTime();
        const bDT = new Date(`${b.dateOfEvent} ${b.timeOfEvent}`).getTime();
        return bDT - aDT;
      });
      
      return cases;
    } catch (error) {
      console.error('[FirebaseService] Failed to get cases:', error);
      return [];
    }
  }

  public async getCaseById(id: string): Promise<Case | null> {
    try {
      const caseRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(caseRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Case;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`[FirebaseService] Failed to get case with id ${id}:`, error);
      return null;
    }
  }

  public async updateCase(caseData: Case): Promise<boolean> {
    try {
      if (!caseData.id) return false;
      
      const caseRef = doc(db, this.COLLECTION_NAME, caseData.id);
      const { id, ...updateData } = caseData;
      console.log('[FirebaseService] updateCase -> updating doc', caseData.id, updateData);
      await updateDoc(caseRef, updateData);
      console.log('[FirebaseService] updateCase -> update complete');
      return true;
    } catch (error) {
      console.error(`[FirebaseService] Failed to update case with id ${caseData.id}:`, error);
      return false;
    }
  }

  public async deleteCase(id: string): Promise<boolean> {
    try {
      const caseRef = doc(db, this.COLLECTION_NAME, id);
      console.log('[FirebaseService] deleteCase -> deleting doc', id);
      await deleteDoc(caseRef);
      console.log('[FirebaseService] deleteCase -> delete complete');
      return true;
    } catch (error) {
      console.error(`[FirebaseService] Failed to delete case with id ${id}:`, error);
      return false;
    }
  }
}