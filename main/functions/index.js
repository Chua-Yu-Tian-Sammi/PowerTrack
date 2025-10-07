const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Import Cloud Functions
const { generateWorkout } = require('./generateWorkout');
const { onWorkoutLogCreated } = require('./progressTracking');
const { 
  createRoutine, 
  getUserRoutines, 
  getRoutine, 
  updateRoutine, 
  deleteRoutine, 
  saveGeneratedWorkoutAsRoutine 
} = require('./routineManagement');
const { 
  startWorkoutSession, 
  endWorkoutSession, 
  getWorkoutSession, 
  getUserWorkoutSessions 
} = require('./workoutSessions');

// Export Cloud Functions
exports.generateWorkout = generateWorkout;
exports.onWorkoutLogCreated = onWorkoutLogCreated;
exports.createRoutine = createRoutine;
exports.getUserRoutines = getUserRoutines;
exports.getRoutine = getRoutine;
exports.updateRoutine = updateRoutine;
exports.deleteRoutine = deleteRoutine;
exports.saveGeneratedWorkoutAsRoutine = saveGeneratedWorkoutAsRoutine;
exports.startWorkoutSession = startWorkoutSession;
exports.endWorkoutSession = endWorkoutSession;
exports.getWorkoutSession = getWorkoutSession;
exports.getUserWorkoutSessions = getUserWorkoutSessions;

