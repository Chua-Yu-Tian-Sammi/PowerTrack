const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

exports.onWorkoutLogCreated = functions.firestore
  .document('workout_logs/{logId}')
  .onCreate(async (snap, context) => {
    const workoutLog = snap.data();
    const userId = workoutLog.userId;
    const logDate = workoutLog.date.toDate();
    
    // Calculate week identifier
    const year = logDate.getFullYear();
    const weekNumber = getWeekNumber(logDate);
    const weekId = `${year}-W${weekNumber.toString().padStart(2, '0')}`;

    try {
      // Check if progress summary already exists for this week
      const existingSummaryQuery = await db
        .collection('progress_summaries')
        .where('userId', '==', userId)
        .where('week', '==', weekId)
        .limit(1)
        .get();

      if (existingSummaryQuery.empty) {
        // Create new progress summary
        await createProgressSummary(userId, weekId, [workoutLog]);
      } else {
        // Update existing progress summary
        const summaryDoc = existingSummaryQuery.docs[0];
        await updateProgressSummary(summaryDoc.ref, workoutLog);
      }

      console.log(`Progress summary updated for user ${userId}, week ${weekId}`);
    } catch (error) {
      console.error('Error updating progress summary:', error);
    }
  });

async function createProgressSummary(userId, weekId, workoutLogs) {
  const summaryId = db.collection('progress_summaries').doc().id;
  
  const totalWorkouts = workoutLogs.length;
  const totalVolume = workoutLogs.reduce((sum, log) => sum + log.totalVolume, 0);
  const totalDurationSec = workoutLogs.reduce((sum, log) => sum + log.totalDurationSec, 0);
  
  // Calculate average intensity (simplified - could be enhanced)
  const averageIntensity = calculateAverageIntensity(workoutLogs);

  const progressSummary = {
    summaryId,
    userId,
    week: weekId,
    totalWorkouts,
    totalVolume,
    totalDurationSec,
    averageIntensity,
    createdAt: new Date()
  };

  await db.collection('progress_summaries').doc(summaryId).set(progressSummary);
}

async function updateProgressSummary(summaryRef, newWorkoutLog) {
  await db.runTransaction(async (transaction) => {
    const summaryDoc = await transaction.get(summaryRef);
    
    if (!summaryDoc.exists) {
      throw new Error('Progress summary not found');
    }

    const currentData = summaryDoc.data();
    
    const updatedSummary = {
      totalWorkouts: currentData.totalWorkouts + 1,
      totalVolume: currentData.totalVolume + newWorkoutLog.totalVolume,
      totalDurationSec: currentData.totalDurationSec + newWorkoutLog.totalDurationSec,
      
    };

    transaction.update(summaryRef, updatedSummary);
  });
}

function calculateAverageIntensity(workoutLogs) {
 
  
  if (workoutLogs.length === 0){
    return 0;
  } 
    
  
  // based on total volume and duration
  const totalVolume = workoutLogs.reduce((sum, log) => sum + log.totalVolume, 0);
  const totalDuration = workoutLogs.reduce((sum, log) => sum + log.totalDurationSec, 0);
  
  // Higher volume per minute = higher intensity
  const volumePerMinute = totalVolume / (totalDuration / 60);
  
  // Normalize to 1-10 scale 
  return Math.min(10, Math.max(1, volumePerMinute / 100));
}

function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Function to recalculate all progress summaries 
exports.recalculateProgressSummaries = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  
  try {
    // Get all workout logs for the user
    const workoutLogsSnapshot = await db
      .collection('workout_logs')
      .where('userId', '==', userId)
      .orderBy('date', 'asc')
      .get();

    const workoutLogs = workoutLogsSnapshot.docs.map(doc => doc.data());
    
    // Group by week
    const weeklyLogs = {};
    
    workoutLogs.forEach(log => {
      const logDate = log.date.toDate();
      const year = logDate.getFullYear();
      const weekNumber = getWeekNumber(logDate);
      const weekId = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
      
      if (!weeklyLogs[weekId]) {
        weeklyLogs[weekId] = [];
      }
      weeklyLogs[weekId].push(log);
    });

    // Delete existing summaries
    const existingSummaries = await db
      .collection('progress_summaries')
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    existingSummaries.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Create new summaries
    for (const [weekId, logs] of Object.entries(weeklyLogs)) {
      await createProgressSummary(userId, weekId, logs);
    }

    return { message: 'Progress summaries recalculated successfully' };
  } catch (error) {
    console.error('Error recalculating progress summaries:', error);
    throw new functions.https.HttpsError('internal', 'Failed to recalculate progress summaries');
  }
});


