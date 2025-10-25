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
  
  console.log('[CloudFunction.getUserWorkoutLogs] Called by user:', userId, 'with limit:', limit);

  try {
    // Try to fetch logs - some may have 'timestamp', others may have 'date'
    // We'll fetch all user logs and sort in memory for backward compatibility
    const logsSnapshot = await db
      .collection('workout_logs')
      .where('userId', '==', userId)
      .get();

    console.log('[CloudFunction.getUserWorkoutLogs] Found', logsSnapshot.docs.length, 'logs (before sorting)');

    const logs = logsSnapshot.docs.map(doc => {
      const payload = doc.data();
      
      // Handle both 'timestamp' and 'date' fields (for backward compatibility)
      // Convert to milliseconds for proper serialization
      let timestampMs;
      if (payload.timestamp) {
        if (payload.timestamp.toDate) {
          timestampMs = payload.timestamp.toDate().getTime();
        } else if (payload.timestamp.seconds !== undefined) {
          timestampMs = payload.timestamp.seconds * 1000;
        } else if (payload.timestamp instanceof Date) {
          timestampMs = payload.timestamp.getTime();
        } else {
          timestampMs = new Date(payload.timestamp).getTime();
        }
      } else if (payload.date) {
        if (payload.date.toDate) {
          timestampMs = payload.date.toDate().getTime();
        } else if (payload.date.seconds !== undefined) {
          timestampMs = payload.date.seconds * 1000;
        } else {
          timestampMs = new Date(payload.date).getTime();
        }
      } else if (payload.createdAt) {
        if (payload.createdAt.toDate) {
          timestampMs = payload.createdAt.toDate().getTime();
        } else if (payload.createdAt.seconds !== undefined) {
          timestampMs = payload.createdAt.seconds * 1000;
        } else {
          timestampMs = new Date(payload.createdAt).getTime();
        }
      } else {
        timestampMs = Date.now(); // Fallback to now if no timestamp field
      }
      
      //  Extract the required fields for Progress Dashboard
      const log = {
        logId: doc.id,
        userId: payload.userId,
        timestamp: timestampMs, // Send as milliseconds, not Date object
        // Include original payload for backward compatibility
        ...payload
      };
      
      // Add missing fields for Progress Dashboard if they don't exist
      if (!log.workoutType) {
        log.workoutType = payload.sourceType === 'running-route' ? 'runs' : 'routine';
      }
      
      if (!log.numberOfExercises && payload.items) {
        log.numberOfExercises = payload.items.length;
      } else if (!log.numberOfExercises && payload.workoutSnapshot?.exercises) {
        log.numberOfExercises = payload.workoutSnapshot.exercises.length;
      }
      
      if (!log.durationMinutes && payload.totalTimeMinutes !== undefined) {
        log.durationMinutes = payload.totalTimeMinutes;
      }
      
      return log;
    });
    
    // Sort by timestamp (most recent first) and apply limit
    const sortedLogs = logs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));
    
    console.log('[CloudFunction.getUserWorkoutLogs] After sorting and limiting:', sortedLogs.length, 'logs');
    
    // Log sample of data being returned
    if (sortedLogs.length > 0) {
      console.log('[CloudFunction.getUserWorkoutLogs] Sample log:', {
        logId: sortedLogs[0].logId,
        workoutType: sortedLogs[0].workoutType,
        timestamp: sortedLogs[0].timestamp,
        timestampType: typeof sortedLogs[0].timestamp,
        timestampAsDate: new Date(sortedLogs[0].timestamp).toISOString(),
        numberOfExercises: sortedLogs[0].numberOfExercises,
        durationMinutes: sortedLogs[0].durationMinutes,
        distanceKm: sortedLogs[0].distanceKm
      });
      
      // Log all unique workoutType values
      const workoutTypes = [...new Set(sortedLogs.map(log => log.workoutType))];
      console.log('[CloudFunction.getUserWorkoutLogs] Unique workoutType values:', workoutTypes);
    }

    console.log('[CloudFunction.getUserWorkoutLogs] Returning', sortedLogs.length, 'logs');
    return sortedLogs;
  } catch (error) {
    console.error('[CloudFunction.getUserWorkoutLogs] Error getting user workout logs:', error);
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

// Migration function to add workoutType to old workout logs
exports.migrateWorkoutLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  console.log('[migrateWorkoutLogs] Starting migration for user:', userId);

  try {
    // Get all workout logs for this user that don't have workoutType
    const logsSnapshot = await db
      .collection('workout_logs')
      .where('userId', '==', userId)
      .get();

    let updatedCount = 0;
    const batch = db.batch();

    logsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const updates = {};
      
      // Fix timestamp field if missing
      if (!data.timestamp) {
        if (data.date) {
          updates.timestamp = data.date;
          console.log(`[migrateWorkoutLogs] Converting 'date' to 'timestamp' for log ${doc.id}`);
        } else if (data.createdAt) {
          updates.timestamp = data.createdAt;
          console.log(`[migrateWorkoutLogs] Converting 'createdAt' to 'timestamp' for log ${doc.id}`);
        }
      }
      
      // Determine workoutType if missing
      if (!data.workoutType) {
        // Check sourceType field
        if (data.sourceType === 'running-route') {
          updates.workoutType = 'runs';
        } else if (data.distanceKm !== undefined) {
          updates.workoutType = 'runs';
        } else {
          updates.workoutType = 'routine';
        }
        console.log(`[migrateWorkoutLogs] Adding workoutType='${updates.workoutType}' to log ${doc.id}`);
      }
      
      // For routine workouts, ensure required fields exist
      if ((data.workoutType === 'routine' || updates.workoutType === 'routine')) {
        // Extract numberOfExercises from items or workoutSnapshot
        if (data.numberOfExercises === undefined) {
          if (data.items && Array.isArray(data.items)) {
            updates.numberOfExercises = data.items.length;
            console.log(`[migrateWorkoutLogs] Adding numberOfExercises=${updates.numberOfExercises} from items[] to log ${doc.id}`);
          } else if (data.workoutSnapshot?.exercises) {
            updates.numberOfExercises = data.workoutSnapshot.exercises.length;
            console.log(`[migrateWorkoutLogs] Adding numberOfExercises=${updates.numberOfExercises} from workoutSnapshot to log ${doc.id}`);
          } else {
            updates.numberOfExercises = 0;
            console.log(`[migrateWorkoutLogs] Adding numberOfExercises=0 (no items found) to log ${doc.id}`);
          }
        }
        
        // Map totalTimeMinutes to durationMinutes
        if (data.durationMinutes === undefined) {
          if (data.totalTimeMinutes !== undefined) {
            updates.durationMinutes = data.totalTimeMinutes;
            console.log(`[migrateWorkoutLogs] Copying totalTimeMinutes=${updates.durationMinutes} to durationMinutes for log ${doc.id}`);
          } else {
            updates.durationMinutes = 0;
            console.log(`[migrateWorkoutLogs] Adding durationMinutes=0 to log ${doc.id}`);
          }
        }
      }
      
      // For running workouts, ensure required fields exist
      if ((data.workoutType === 'runs' || updates.workoutType === 'runs')) {
        if (data.distanceKm === undefined) {
          updates.distanceKm = 0;
          console.log(`[migrateWorkoutLogs] Adding distanceKm=0 to log ${doc.id}`);
        }
        
        if (data.durationMinutes === undefined) {
          if (data.totalTimeMinutes !== undefined) {
            updates.durationMinutes = data.totalTimeMinutes;
            console.log(`[migrateWorkoutLogs] Copying totalTimeMinutes=${updates.durationMinutes} to durationMinutes for log ${doc.id}`);
          } else {
            updates.durationMinutes = 0;
            console.log(`[migrateWorkoutLogs] Adding durationMinutes=0 to log ${doc.id}`);
          }
        }
      }
      
      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        console.log(`[migrateWorkoutLogs] Updating log ${doc.id}:`, updates);
        batch.update(doc.ref, updates);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`[migrateWorkoutLogs] Successfully updated ${updatedCount} logs`);
    } else {
      console.log('[migrateWorkoutLogs] No logs needed updating');
    }

    return { 
      success: true, 
      message: `Updated ${updatedCount} workout logs`,
      updatedCount 
    };
  } catch (error) {
    console.error('[migrateWorkoutLogs] Error migrating workout logs:', error);
    throw new functions.https.HttpsError('internal', 'Failed to migrate workout logs');
  }
});

