// src/services/workoutService.js
import { db, functions } from '@lib/firebase';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  limit as qLimit,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

function nonEmptyArray(a) {
  return Array.isArray(a) && a.length > 0;
}

async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

async function upsertUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  const payload = stripUndefined({ ...data, uid, updatedAt: serverTimestamp() });
  await setDoc(ref, payload, { merge: true });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  const payload = stripUndefined({ ...data, updatedAt: serverTimestamp() });
  await updateDoc(ref, payload);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function createWorkout(uid, workout) {
  const col = collection(db, 'users', uid, 'workouts');
  const payload = stripUndefined({ ...workout, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  const ref = await addDoc(col, payload);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

async function getExercises({ category, muscle, equipment, take } = {}) {
  const col = collection(db, 'exercises');
  const filters = [];
  if (category) filters.push(where('category', '==', category));
  if (muscle) filters.push(where('muscle', '==', muscle));
  if (nonEmptyArray(equipment)) filters.push(where('equipment', 'array-contains-any', equipment));
  const baseQ = filters.length ? query(col, ...filters) : query(col);
  const finalQ = take ? query(baseQ, qLimit(take)) : baseQ;
  const snap = await getDocs(finalQ);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getUserRoutines({ limit = 20 } = {}) {
  const fn = httpsCallable(functions, 'getUserRoutines');
  const { data } = await fn({ limit });
  return data;
}

async function createUserRoutine(routine) {
  const fn = httpsCallable(functions, 'createRoutine');
  const { data } = await fn(routine);
  return data;
}

async function updateUserRoutine(routine) {
  const fn = httpsCallable(functions, 'updateRoutine');
  const { data } = await fn(routine);
  return data;
}

async function deleteUserRoutine(routineId) {
  const fn = httpsCallable(functions, 'deleteRoutine');
  const { data } = await fn({ routineId });
  return data;
}

async function saveGeneratedWorkoutAsRoutine({ generatedWorkoutId, title }) {
  const fn = httpsCallable(functions, 'saveGeneratedWorkoutAsRoutine');
  const { data } = await fn({ generatedWorkoutId, title });
  return data;
}

async function generateWorkout(uid, params) {
  const fn = httpsCallable(functions, 'generateWorkout');
  const { data } = await fn({ uid, ...params });
  return data;
}

async function getProgressSummaries({ from, to } = {}) {
  const fn = httpsCallable(functions, 'getProgressSummaries');
  const { data } = await fn({ from, to });
  return data;
}

async function getUserWorkoutLogs({ uid, limit = 50 } = {}) {
  const fn = httpsCallable(functions, 'getUserWorkoutLogs');
  const { data } = await fn({ uid, limit });
  return data;
}

export const WorkoutService = {
  getUserProfile,
  upsertUserProfile,
  updateUserProfile,
  createWorkout,
  getExercises,
  getUserRoutines,
  createUserRoutine,
  updateUserRoutine,
  deleteUserRoutine,
  saveGeneratedWorkoutAsRoutine,
  generateWorkout,
  getProgressSummaries,
  getUserWorkoutLogs,
};

export {
  getUserProfile,
  upsertUserProfile,
  updateUserProfile,
  createWorkout,
  getExercises,
  getUserRoutines,
  createUserRoutine,
  updateUserRoutine,
  deleteUserRoutine,
  saveGeneratedWorkoutAsRoutine,
  generateWorkout,
  getProgressSummaries,
  getUserWorkoutLogs,
};

export default WorkoutService;
