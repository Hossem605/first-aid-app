import { FirebaseService } from './FirebaseService';
import { Case } from '../types/Case';
import { DatabaseService } from './DatabaseService';

const firebaseService = FirebaseService.getInstance();
const databaseService = DatabaseService.getInstance();

export const getAllCases = async (): Promise<Case[]> => {
  // Try Firebase first
  const firebaseCases = await firebaseService.getAllCases();
  if (firebaseCases && firebaseCases.length > 0) {
    // Mirror cloud data into local storage for consistency/offline support
    try {
      databaseService.replaceAllCases(firebaseCases);
    } catch (e) {
      console.warn('[caseService] Failed to mirror Firebase cases locally:', e);
    }
    return firebaseCases;
  }
  // Fallback to local storage if Firebase returns empty or is unavailable
  try {
    const localCases = databaseService.getAllCases();
    return localCases;
  } catch (e) {
    console.error('[caseService] Fallback getAllCases failed:', e);
    return [];
  }
};

export const getCaseById = async (id: string): Promise<Case | null> => {
  // Try Firebase first
  const fb = await firebaseService.getCaseById(id);
  if (fb) return fb;
  // Fallback to local storage
  try {
    return databaseService.getCaseById(id);
  } catch (e) {
    console.error('[caseService] Fallback getCaseById failed:', e);
    return null;
  }
};

export const addCase = async (caseData: Case): Promise<boolean> => {
  // Primary: Firebase
  const savedToFirebase = await firebaseService.saveCase(caseData);
  if (savedToFirebase) {
    // Try to refresh local mirror from cloud; if not available, save locally as a temporary record
    try {
      const cloudCases = await firebaseService.getAllCases();
      if (cloudCases && cloudCases.length > 0) {
        databaseService.replaceAllCases(cloudCases);
      } else {
        const withId: Case = {
          ...caseData,
          id: caseData.id && caseData.id.trim() !== ''
            ? caseData.id
            : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        };
        databaseService.saveCase(withId);
        console.warn('[caseService] Saved case locally after Firebase add due to empty/unreadable cloud list.');
      }
    } catch (e) {
      console.warn('[caseService] Could not mirror Firebase add to local, saving locally as fallback:', e);
      const withId: Case = {
        ...caseData,
        id: caseData.id && caseData.id.trim() !== ''
          ? caseData.id
          : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      };
      databaseService.saveCase(withId);
    }
    return true;
  }

  // Fallback: Local Storage
  try {
    // Ensure we have an id when saving locally
    const withId: Case = {
      ...caseData,
      id: caseData.id && caseData.id.trim() !== ''
        ? caseData.id
        : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
    const ok = databaseService.saveCase(withId);
    if (ok) {
      console.warn('[caseService] Saved case locally due to Firebase failure. Data will not sync to cloud.');
    }
    return ok;
  } catch (e) {
    console.error('[caseService] Fallback addCase failed:', e);
    return false;
  }
};

export const updateCase = async (caseData: Case): Promise<boolean> => {
  // Try updating Firebase
  const updatedInFirebase = await firebaseService.updateCase(caseData);

  // Always try to update local to keep fallback data consistent
  let updatedLocal = false;
  try {
    updatedLocal = databaseService.updateCase(caseData);
  } catch (e) {
    console.warn('[caseService] Local update failed:', e);
  }

  // If cloud update worked, try to refresh local mirror from cloud
  if (updatedInFirebase) {
    try {
      const cloudCases = await firebaseService.getAllCases();
      if (cloudCases && cloudCases.length > 0) {
        databaseService.replaceAllCases(cloudCases);
      }
    } catch (e) {
      console.warn('[caseService] Could not refresh local mirror after cloud update:', e);
    }
  }

  if (updatedInFirebase || updatedLocal) {
    if (!updatedInFirebase) {
      console.warn('[caseService] Updated case locally due to Firebase failure. Data will not sync to cloud.');
    }
    return true;
  }

  return false;
};

export const deleteCase = async (id: string): Promise<boolean> => {
  // Try deleting in Firebase (note: deleteDoc resolves even if doc doesn't exist)
  const deletedFromFirebase = await firebaseService.deleteCase(id);

  // Always try to delete locally as well to ensure UI reflects deletion when using local fallback
  let deletedLocal = false;
  try {
    deletedLocal = databaseService.deleteCase(id);
  } catch (e) {
    console.warn('[caseService] Local delete failed:', e);
  }

  // If cloud delete worked, try to refresh local mirror from cloud
  if (deletedFromFirebase) {
    try {
      const cloudCases = await firebaseService.getAllCases();
      if (cloudCases && cloudCases.length > 0) {
        databaseService.replaceAllCases(cloudCases);
      }
    } catch (e) {
      console.warn('[caseService] Could not refresh local mirror after cloud delete:', e);
    }
  }

  if (deletedFromFirebase || deletedLocal) {
    if (!deletedFromFirebase) {
      console.warn('[caseService] Deleted case locally due to Firebase failure. Data will not sync to cloud.');
    }
    return true;
  }

  return false;
};