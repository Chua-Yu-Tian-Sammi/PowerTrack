const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

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
      // optional fields; only persist if provided
      ...(perceivedIntensity ? { perceivedIntensity } : {}),
      ...(mood ? { mood } : {}),
      ...(notes ? { notes } : {}),
      status: 'completed'
    });

    // Log workout to database
    const isRunningRoute = sessionData.sourceType === 'running-route';
    
    if (isRunningRoute && sessionData.routineData) {
      const routineData = sessionData.routineData;
      let distanceKm = 0;
      
      if (routineData.exercises && routineData.exercises.length > 0) {
        const firstExercise = routineData.exercises[0];
        const distanceM = Number(firstExercise.distance ?? 0) || 0;
        distanceKm = distanceM / 1000;
      }
      
      await db.collection('workout_logs').add({
        userId,
        workoutType: 'runs',
        distanceKm: Math.round(distanceKm * 100) / 100,
        durationMinutes: totalTimeMinutes,
        timestamp: new Date()
      });
    } else {
      const numberOfExercises = (performedExercises || []).length;

      await db.collection('workout_logs').add({
        userId,
        workoutType: 'routine',
        numberOfExercises,
        timestamp: new Date(),
        durationMinutes: totalTimeMinutes
      });
    }

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

// Get user's workout logs (callable) - returns both regular workouts and runs
exports.getUserWorkoutLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { limit = 50 } = data || {};

  try {
    const logsSnapshot = await db
      .collection('workout_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();

    const logs = logsSnapshot.docs.map(doc => {
      const payload = doc.data();
      return {
        logId: doc.id,
        ...payload,
        timestamp: payload.timestamp.toDate()
      };
    });

    return logs;
  } catch (error) {
    console.error('Error getting user workout logs:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get workout logs');
  }
});

// Get user's running logs (callable) - now just filters workout_logs for runs
exports.getUserRunningLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { limit = 50 } = data || {};

  try {
    const logsSnapshot = await db
      .collection('workout_logs')
      .where('userId', '==', userId)
      .where('workoutType', '==', 'runs')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();

    const logs = logsSnapshot.docs.map(doc => {
      const payload = doc.data();
      return {
        logId: doc.id,
        ...payload,
        timestamp: payload.timestamp.toDate()
      };
    });

    return logs;
  } catch (error) {
    console.error('Error getting user running logs:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get running logs');
  }
});

// Get all activity logs (workouts + running) for combined stats
exports.getAllActivityLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { limit = 100 } = data || {};

  try {
    // Now everything is in workout_logs with workoutType field
    const logsSnapshot = await db
      .collection('workout_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();

    const logs = logsSnapshot.docs.map(doc => {
      const payload = doc.data();
      return {
        logId: doc.id,
        ...payload,
        timestamp: payload.timestamp.toDate()
      };
    });

    return logs;
  } catch (error) {
    console.error('Error getting all activity logs:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get activity logs');
  }
});

