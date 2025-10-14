const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

// Start a workout session
exports.startWorkoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { sourceType, sourceId, routineData } = data;
  const userId = context.auth.uid;

  try {
    const sessionRef = db.collection('workout_sessions').doc();
    const sessionId = sessionRef.id;

    const sessionData = {
      sessionId,
      userId,
      sourceType, // 'generated', 'routine'
      sourceId: sourceId || null,
      startAt: new Date(),
      status: 'active',
      routineData: routineData || null,
      createdAt: new Date()
    };

    await sessionRef.set(sessionData);

    return { sessionId, ...sessionData };
  } catch (error) {
    console.error('Error starting workout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to start workout session');
  }
});

// End a workout session
exports.endWorkoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { sessionId, perceivedIntensity, mood, notes, performedExercises } = data;
  const userId = context.auth.uid;

  try {
    const sessionRef = db.collection('workout_sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Workout session not found');
    }

    const sessionData = sessionDoc.data();
    if (sessionData.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    const endAt = new Date();
    const startAt = sessionData.startAt.toDate();
    const totalTimeMinutes = Math.round((endAt - startAt) / (1000 * 60));

    // Update session
    await sessionRef.update({
      endAt,
      totalTimeMinutes,
      perceivedIntensity,
      mood,
      notes,
      status: 'completed'
    });

    // Create performed exercises if provided
    if (performedExercises && performedExercises.length > 0) {
      const batch = db.batch();
      
      performedExercises.forEach((exercise, index) => {
        const performedExerciseRef = db.collection('performed_exercises').doc();
        batch.set(performedExerciseRef, {
          performedExerciseId: performedExerciseRef.id,
          sessionId,
          exerciseId: exercise.exerciseId,
          orderIndex: index,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetRestSeconds: exercise.targetRestSeconds,
          performedSets: exercise.performedSets || []
        });
      });

      await batch.commit();
    }

    // Trigger progress tracking
    await db.collection('workout_logs').add({
      userId,
      sessionId,
      date: new Date(),
      totalTimeMinutes,
      perceivedIntensity,
      mood,
      notes,
      createdAt: new Date()
    });

    return { success: true, totalTimeMinutes };
  } catch (error) {
    console.error('Error ending workout session:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to end workout session');
  }
});

// Get workout session
exports.getWorkoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { sessionId } = data;
  const userId = context.auth.uid;

  try {
    const sessionDoc = await db.collection('workout_sessions').doc(sessionId).get();
    
    if (!sessionDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Workout session not found');
    }

    const sessionData = { sessionId: sessionDoc.id, ...sessionDoc.data() };

    if (sessionData.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Get performed exercises
    const performedExercisesSnapshot = await db
      .collection('performed_exercises')
      .where('sessionId', '==', sessionId)
      .orderBy('orderIndex', 'asc')
      .get();

    const performedExercises = performedExercisesSnapshot.docs.map(doc => ({
      performedExerciseId: doc.id,
      ...doc.data()
    }));

    sessionData.performedExercises = performedExercises;

    return sessionData;
  } catch (error) {
    console.error('Error getting workout session:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to get workout session');
  }
});

// Get user's workout sessions
exports.getUserWorkoutSessions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { limit = 20 } = data;

  try {
    const sessionsSnapshot = await db
      .collection('workout_sessions')
      .where('userId', '==', userId)
      .orderBy('startAt', 'desc')
      .limit(limit)
      .get();

    const sessions = sessionsSnapshot.docs.map(doc => ({
      sessionId: doc.id,
      ...doc.data()
    }));

    return sessions;
  } catch (error) {
    console.error('Error getting user workout sessions:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get workout sessions');
  }
});

