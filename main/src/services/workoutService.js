import { httpsCallable } from 'firebase/functions';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { functions, db } from '@lib/firebase';

// Cloud Functions
const generateWorkoutFunction = httpsCallable(functions, 'generateWorkout');
const createRoutineFunction = httpsCallable(functions, 'createRoutine');
const getUserRoutinesFunction = httpsCallable(functions, 'getUserRoutines');
const getRoutineFunction = httpsCallable(functions, 'getRoutine');
const updateRoutineFunction = httpsCallable(functions, 'updateRoutine');
const deleteRoutineFunction = httpsCallable(functions, 'deleteRoutine');
const saveGeneratedWorkoutAsRoutineFunction = httpsCallable(functions, 'saveGeneratedWorkoutAsRoutine');
const startWorkoutSessionFunction = httpsCallable(functions, 'startWorkoutSession');
const endWorkoutSessionFunction = httpsCallable(functions, 'endWorkoutSession');
const getWorkoutSessionFunction = httpsCallable(functions, 'getWorkoutSession');
const getUserWorkoutSessionsFunction = httpsCallable(functions, 'getUserWorkoutSessions');

export class WorkoutService {
  // Generate a personalized workout
  static async generateWorkout(request) {
    try {
      const result = await generateWorkoutFunction(request);
      return result.data;
    } catch (error) {
      console.error('Error generating workout:', error);
      throw error;
    }
  }

  // User Management
  static async createUserProfile(userData) {
    try {
      console.log('Creating user profile:', userData)
      // Use the user's UID as the document ID
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('User profile created successfully')
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(uid, updates) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async getUserProfile(uid) {
    try {
      console.log('Getting user profile for UID:', uid)
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      console.log('User document exists:', userDoc.exists())
      
      if (!userDoc.exists()) {
        console.log('No user document found')
        return null;
      }
      
      const userData = { uid: userDoc.id, ...userDoc.data() }
      console.log('User data retrieved:', userData)
      return userData;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Exercise Management
  static async getExercises() {
    try {
      const snapshot = await getDocs(collection(db, 'exercises'));
      return snapshot.docs.map(doc => ({ exerciseId: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting exercises:', error);
      throw error;
    }
  }

  static async getExerciseById(exerciseId) {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'exercises'), where('exerciseId', '==', exerciseId))
      );
      
      if (snapshot.empty) {
        return null;
      }
      
      const exerciseDoc = snapshot.docs[0];
      return { exerciseId: exerciseDoc.id, ...exerciseDoc.data() };
    } catch (error) {
      console.error('Error getting exercise:', error);
      throw error;
    }
  }


  // Workout Logging
  static async logWorkout(workoutLog) {
    try {
      const docRef = await addDoc(collection(db, 'workout_logs'), workoutLog);
      return docRef.id;
    } catch (error) {
      console.error('Error logging workout:', error);
      throw error;
    }
  }

  static async getUserWorkoutLogs(userId, limit) {
    try {
      let workoutQuery = query(
        collection(db, 'workout_logs'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      if (limit) {
        // Note: Firestore doesn't support limit() with orderBy() in web client
        // This would need to be handled differently in production
        workoutQuery = query(workoutQuery);
      }
      
      const snapshot = await getDocs(workoutQuery);
      const logs = snapshot.docs.map(doc => ({ logId: doc.id, ...doc.data() }));
      
      return limit ? logs.slice(0, limit) : logs;
    } catch (error) {
      console.error('Error getting workout logs:', error);
      throw error;
    }
  }

  // Progress Tracking
  static async getProgressSummaries(userId) {
    try {
      const progressQuery = query(
        collection(db, 'progress_summaries'),
        where('userId', '==', userId),
        orderBy('week', 'desc')
      );
      const snapshot = await getDocs(progressQuery);
      
      return snapshot.docs.map(doc => ({ summaryId: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting progress summaries:', error);
      throw error;
    }
  }

  // Routine Management
  static async createRoutine(routineData) {
    try {
      console.log('Creating routine:', routineData);
      const result = await createRoutineFunction(routineData);
      console.log('Routine created successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  }

  static async getUserRoutines(limit = 20) {
    try {
      console.log('Getting user routines, limit:', limit);
      const result = await getUserRoutinesFunction({ limit });
      console.log('User routines retrieved:', result.data.length);
      return result.data;
    } catch (error) {
      console.error('Error getting user routines:', error);
      throw error;
    }
  }

  static async getRoutine(routineId) {
    try {
      console.log('Getting routine:', routineId);
      const result = await getRoutineFunction({ routineId });
      console.log('Routine retrieved:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error getting routine:', error);
      throw error;
    }
  }

  static async updateRoutine(routineId, routineData) {
    try {
      console.log('Updating routine:', routineId, routineData);
      const result = await updateRoutineFunction({ routineId, ...routineData });
      console.log('Routine updated successfully');
      return result.data;
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  }

  static async deleteRoutine(routineId) {
    try {
      console.log('Deleting routine:', routineId);
      const result = await deleteRoutineFunction({ routineId });
      console.log('Routine deleted successfully');
      return result.data;
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  }

  static async saveGeneratedWorkoutAsRoutine(generatedWorkoutId, title) {
    try {
      console.log('Saving generated workout as routine:', generatedWorkoutId, title);
      const result = await saveGeneratedWorkoutAsRoutineFunction({ 
        generatedWorkoutId, 
        title 
      });
      console.log('Generated workout saved as routine:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error saving generated workout as routine:', error);
      throw error;
    }
  }

  // Workout Session Management
  static async startWorkoutSession(sourceType, sourceId, routineData = null) {
    try {
      console.log('Starting workout session:', sourceType, sourceId);
      const result = await startWorkoutSessionFunction({ 
        sourceType, 
        sourceId, 
        routineData 
      });
      console.log('Workout session started:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error starting workout session:', error);
      throw error;
    }
  }

  static async endWorkoutSession(sessionId, perceivedIntensity, mood, notes, performedExercises = []) {
    try {
      console.log('Ending workout session:', sessionId);
      const result = await endWorkoutSessionFunction({ 
        sessionId, 
        perceivedIntensity, 
        mood, 
        notes, 
        performedExercises 
      });
      console.log('Workout session ended:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error ending workout session:', error);
      throw error;
    }
  }

  static async getWorkoutSession(sessionId) {
    try {
      console.log('Getting workout session:', sessionId);
      const result = await getWorkoutSessionFunction({ sessionId });
      console.log('Workout session retrieved:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error getting workout session:', error);
      throw error;
    }
  }

  static async getUserWorkoutSessions(limit = 20) {
    try {
      console.log('Getting user workout sessions, limit:', limit);
      const result = await getUserWorkoutSessionsFunction({ limit });
      console.log('User workout sessions retrieved:', result.data.length);
      return result.data;
    } catch (error) {
      console.error('Error getting user workout sessions:', error);
      throw error;
    }
  }

  // Utility Methods
  static calculateWorkoutVolume(items) {
    return items.reduce((total, item) => {
      const weight = item.weight || 0;
      return total + (item.sets * item.reps * weight);
    }, 0);
  }

  static calculateWorkoutDuration(items) {
    return items.reduce((total, item) => {
      const exerciseTime = item.sets * 30; // Assume 30 seconds per set
      const restTime = (item.sets - 1) * item.restTimeSec;
      return total + exerciseTime + restTime;
    }, 0);
  }
}

