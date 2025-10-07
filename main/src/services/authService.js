import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@lib/firebase';
import { WorkoutService } from './workoutService.js';

export class AuthService {
  // Sign up with email and password
  static async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await WorkoutService.createUserProfile({
        uid: user.uid,
        email: user.email,
        username: userData.username,
        experienceLevel: userData.experienceLevel,
        heightCm: userData.heightCm,
        weightKg: userData.weightKg,
        goal: userData.goal,
        preferredIntensity: userData.preferredIntensity,
        preferredTimeMin: userData.preferredTimeMin
      });

      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user profile from Firestore
  static async getCurrentUserProfile() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return null;
    }

    try {
      return await WorkoutService.getUserProfile(currentUser.uid);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user profile
  static async updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      await WorkoutService.updateUserProfile(currentUser.uid, updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

