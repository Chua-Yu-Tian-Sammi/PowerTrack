<template>
  <div class="progress-dashboard">
    <div class="row mb-4">
      <div class="col-12">
        <h2><i class="bi bi-graph-up me-2"></i>Progress Dashboard</h2>
        <p class="text-muted">Track your fitness journey and see your improvements</p>
      </div>
    </div>

    <!-- DEBUG: Raw Data Display -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card border-warning">
          <div class="card-header bg-warning">
            <h5 class="mb-0">DEBUG: Raw Data (Remove this section once working)</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <h6>Workout Logs:</h6>
                <ul>
                  <li><strong>Total fetched:</strong> {{ workoutLogs.length }}</li>
                  <li><strong>Has data:</strong> {{ hasWorkoutData ? 'Yes' : 'No' }}</li>
                  <li v-if="workoutLogs.length > 0">
                    <strong>Sample:</strong>
                    <pre style="font-size: 10px; max-height: 100px; overflow: auto;">{{ JSON.stringify(workoutLogs[0], null, 2) }}</pre>
                  </li>
                </ul>
              </div>
              <div class="col-md-4">
                <h6>Running Logs:</h6>
                <ul>
                  <li><strong>Total fetched:</strong> {{ runningLogs.length }}</li>
                  <li><strong>Has data:</strong> {{ hasRunningRunsData ? 'Yes' : 'No' }}</li>
                </ul>
              </div>
              <div class="col-md-4">
                <h6>Processed Data:</h6>
                <ul>
                  <li><strong>Workout weeks:</strong> {{ workoutData.length }}</li>
                  <li><strong>Total workouts:</strong> {{ workoutData.reduce((sum, w) => sum + w.workouts, 0) }}</li>
                  <li><strong>Total exercises:</strong> {{ exerciseData.reduce((sum, e) => sum + e.exercises, 0) }}</li>
                  <li><strong>Total duration:</strong> {{ durationData.reduce((sum, d) => sum + d.duration, 0) }} min</li>
                  <li><strong>Max workout value:</strong> {{ maxWorkouts }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Days Worked Out -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <i class="bi bi-calendar-check display-4 text-primary"></i>
                  </div>
                  <div>
                    <h2 class="mb-1">{{ daysWorkedOut }}</h2>
                    <p class="text-muted mb-0">Days worked out</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workout Tabs -->
    <div class="row mb-4">
      <div class="col-12">
        <ul class="nav nav-tabs" id="workoutTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="workout-tab" data-bs-toggle="tab" data-bs-target="#workout-pane" type="button" role="tab" aria-controls="workout-pane" aria-selected="true">
              <i class="bi bi-lightning-charge me-2"></i>Workout Statistics
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="running-tab" data-bs-toggle="tab" data-bs-target="#running-pane" type="button" role="tab" aria-controls="running-pane" aria-selected="false">
              <i class="bi bi-geo-alt me-2"></i>Running Statistics
            </button>
          </li>
        </ul>
        <div class="tab-content" id="workoutTabsContent">
          <!-- Workout Statistics Tab -->
          <div class="tab-pane fade show active" id="workout-pane" role="tabpanel" aria-labelledby="workout-tab">
            <!-- Workout Charts -->
            <div class="row mb-3">
              <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="bi bi-activity me-2"></i>Workouts Completed</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="!hasWorkoutData" class="text-center py-4">
              <i class="bi bi-graph-up display-1 text-muted"></i>
              <p class="text-muted">No workout data available yet</p>
            </div>
            <div v-else class="chart-container">
              <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                <div v-for="(data, index) in workoutData" :key="index" 
                     class="d-flex flex-column align-items-center me-1 flex-fill">
                  <div class="bg-primary rounded-top mb-2" 
                       :style="{ height: `${(data.workouts / maxWorkouts) * 160}px` }"
                       :title="`${data.workouts} workouts`">
                  </div>
                  <small class="text-muted text-center">{{ data.label }}</small>
                </div>
              </div>
              <!-- DEBUG: Show raw numbers -->
              <div class="mt-3 p-2 bg-light border rounded">
                <small><strong>Numbers:</strong> {{ workoutData.map(d => `${d.label}: ${d.workouts}`).join(' | ') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

              <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0"><i class="bi bi-list-ul me-2"></i>Exercises Completed</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="!hasExerciseData" class="text-center py-4">
              <i class="bi bi-list-ul display-1 text-muted"></i>
              <p class="text-muted">No exercise data available yet</p>
            </div>
            <div v-else class="chart-container">
              <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                <div v-for="(data, index) in exerciseData" :key="index" 
                     class="d-flex flex-column align-items-center me-1 flex-fill">
                  <div class="bg-success rounded-top mb-2" 
                       :style="{ height: `${(data.exercises / maxExercises) * 160}px` }"
                       :title="`${data.exercises} exercises`">
                  </div>
                  <small class="text-muted text-center">{{ data.label }}</small>
                </div>
              </div>
              <!-- DEBUG: Show raw numbers -->
              <div class="mt-3 p-2 bg-light border rounded">
                <small><strong>Numbers:</strong> {{ exerciseData.map(d => `${d.label}: ${d.exercises}`).join(' | ') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

              <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header bg-info text-white">
                    <h5 class="mb-0"><i class="bi bi-clock me-2"></i>Workout Duration (Minutes)</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="!hasDurationData" class="text-center py-4">
              <i class="bi bi-clock display-1 text-muted"></i>
              <p class="text-muted">No duration data available yet</p>
            </div>
            <div v-else class="chart-container">
              <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                <div v-for="(data, index) in durationData" :key="index" 
                     class="d-flex flex-column align-items-center me-1 flex-fill">
                  <div class="bg-info rounded-top mb-2" 
                       :style="{ height: `${(data.duration / maxDuration) * 160}px` }"
                       :title="`${data.duration} minutes`">
                  </div>
                  <small class="text-muted text-center">{{ data.label }}</small>
                </div>
              </div>
              <!-- DEBUG: Show raw numbers -->
              <div class="mt-3 p-2 bg-light border rounded">
                <small><strong>Numbers:</strong> {{ durationData.map(d => `${d.label}: ${d.duration} min`).join(' | ') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

            <!-- Muscle Groups Heatmap - Hidden for simplified logging -->
            <!-- Future feature: Track individual exercises to show muscle group breakdown -->
          </div>

          <!-- Running Statistics Tab -->
          <div class="tab-pane fade" id="running-pane" role="tabpanel" aria-labelledby="running-tab">
            <!-- Running Charts -->
            <div class="row">
              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Runs Completed</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasRunningRunsData" class="text-center py-4">
                      <i class="bi bi-geo-alt display-1 text-muted"></i>
                      <p class="text-muted">No running data available yet</p>
                    </div>
                    <div v-else class="chart-container">
                      <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                        <div v-for="(data, index) in runningRunsData" :key="index" 
                             class="d-flex flex-column align-items-center me-1 flex-fill">
                          <div class="bg-primary rounded-top mb-2" 
                               :style="{ height: `${(data.runs / maxRunningRuns) * 160}px` }"
                               :title="`${data.runs} runs`">
                          </div>
                          <small class="text-muted text-center">{{ data.label }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Running Duration (Minutes)</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasRunningDurationData" class="text-center py-4">
                      <i class="bi bi-clock-history display-1 text-muted"></i>
                      <p class="text-muted">No running duration data yet</p>
                    </div>
                    <div v-else class="chart-container">
                      <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                        <div v-for="(data, index) in runningDurationData" :key="index" 
                             class="d-flex flex-column align-items-center me-1 flex-fill">
                          <div class="bg-info rounded-top mb-2" 
                               :style="{ height: `${(data.duration / maxRunningDuration) * 160}px` }"
                               :title="`${data.duration} minutes`">
                          </div>
                          <small class="text-muted text-center">{{ data.label }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="bi bi-signpost-split me-2"></i>Distance Ran (km)</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasRunningDistanceData" class="text-center py-4">
                      <i class="bi bi-signpost-split display-1 text-muted"></i>
                      <p class="text-muted">No running distance data yet</p>
                    </div>
                    <div v-else class="chart-container">
                      <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                        <div v-for="(data, index) in runningDistanceData" :key="index" 
                             class="d-flex flex-column align-items-center me-1 flex-fill">
                          <div class="bg-success rounded-top mb-2" 
                               :style="{ height: `${(data.distance / maxRunningDistance) * 160}px` }"
                               :title="`${data.distance} km`">
                          </div>
                          <small class="text-muted text-center">{{ data.label }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, toRaw } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'

const loading = ref(false)
const workoutLogs = ref([])
const runningLogs = ref([])
const exercises = ref([])
const userProfile = ref(null)

// Chart data
const workoutData = ref([])
const exerciseData = ref([])
const durationData = ref([])

// Running routes chart data
const runningRunsData = ref([])
const runningDurationData = ref([])
const runningDistanceData = ref([])

// Muscle groups
const muscleGroups = ref([])

// Days worked out
const daysWorkedOut = ref(0)

// Computed properties for chart scaling
const maxWorkouts = computed(() => {
  return Math.max(...workoutData.value.map(d => d.workouts), 1)
})

const maxExercises = computed(() => {
  return Math.max(...exerciseData.value.map(d => d.exercises), 1)
})

const maxDuration = computed(() => {
  return Math.max(...durationData.value.map(d => d.duration), 1)
})

// Check if workout data has any actual values
const hasWorkoutData = computed(() => {
  return workoutData.value.some(d => d.workouts > 0)
})

const hasExerciseData = computed(() => {
  return exerciseData.value.some(d => d.exercises > 0)
})

const hasDurationData = computed(() => {
  return durationData.value.some(d => d.duration > 0)
})

// Running scales
const maxRunningRuns = computed(() => {
  return Math.max(...runningRunsData.value.map(d => d.runs), 1)
})

const maxRunningDuration = computed(() => {
  return Math.max(...runningDurationData.value.map(d => d.duration), 1)
})

const maxRunningDistance = computed(() => {
  return Math.max(...runningDistanceData.value.map(d => d.distance), 1)
})

// Check if running data has any actual values
const hasRunningRunsData = computed(() => {
  return runningRunsData.value.some(d => d.runs > 0)
})

const hasRunningDurationData = computed(() => {
  return runningDurationData.value.some(d => d.duration > 0)
})

const hasRunningDistanceData = computed(() => {
  return runningDistanceData.value.some(d => d.distance > 0)
})

onMounted(async () => {
  await loadAllData()
})

const loadAllData = async () => {
  loading.value = true
  console.log('[ProgressDashboard] Starting loadAllData')
  try {
    const user = AuthService.getCurrentUser()
    console.log('[ProgressDashboard] Current user:', user ? { uid: user.uid, email: user.email } : 'NO USER')
    
    if (user) {
      await Promise.all([
        loadWorkoutLogs(user.uid),
        loadRunningLogs(user.uid),
        loadExercises(),
        loadUserProfile(user.uid)
      ])
      
      console.log('[ProgressDashboard] After loading all data:')
      console.log('  - Workout logs count:', workoutLogs.value.length)
      console.log('  - Running logs count:', runningLogs.value.length)
      console.log('  - Exercises count:', exercises.value.length)
      
      // Calculate days worked out from both workout and running logs
      calculateDaysWorkedOut()
      console.log('[ProgressDashboard] Days worked out:', daysWorkedOut.value)
      
      // Process chart data
      processChartData(workoutLogs.value)
      console.log('[ProgressDashboard] Processed workout chart data:', {
        workoutData: workoutData.value,
        exerciseData: exerciseData.value,
        durationData: durationData.value
      })
      
      processRunningChartData(runningLogs.value)
      console.log('[ProgressDashboard] Processed running chart data:', {
        runningRunsData: runningRunsData.value,
        runningDurationData: runningDurationData.value,
        runningDistanceData: runningDistanceData.value
      })
      
      processMuscleGroups()
    } else {
      console.warn('[ProgressDashboard] No user logged in')
    }
  } catch (error) {
    console.error('[ProgressDashboard] Error loading dashboard data:', error)
    console.error('[ProgressDashboard] Error stack:', error.stack)
  } finally {
    loading.value = false
    console.log('[ProgressDashboard] Loading complete')
  }
}

const loadWorkoutLogs = async (userId) => {
  console.log('[loadWorkoutLogs] Starting to load workout logs for user:', userId)
  try {
    const allLogs = await WorkoutService.getUserWorkoutLogs({ limit: 100 })
    console.log('[loadWorkoutLogs] Fetched ALL logs:', allLogs.length)
    console.log('[loadWorkoutLogs] First 3 logs (raw):', allLogs.slice(0, 3))
    
    // Log detailed structure of first log
    if (allLogs.length > 0) {
      console.log('[loadWorkoutLogs] DETAILED FIRST LOG STRUCTURE:', JSON.stringify(allLogs[0], null, 2))
      
      // CHECK: What fields does the dashboard need vs what's in the logs?
      console.log('[loadWorkoutLogs] FIELD CHECK FOR ALL LOGS:')
      allLogs.forEach((log, index) => {
        console.log(`  Log ${index + 1}:`, {
          hasWorkoutType: log.workoutType !== undefined,
          workoutType: log.workoutType,
          hasNumberOfExercises: log.numberOfExercises !== undefined,
          numberOfExercises: log.numberOfExercises,
          hasDurationMinutes: log.durationMinutes !== undefined,
          durationMinutes: log.durationMinutes,
          hasTimestamp: log.timestamp !== undefined,
          timestamp: log.timestamp,
          // Running-specific fields
          hasDistanceKm: log.distanceKm !== undefined,
          distanceKm: log.distanceKm,
          // Show ALL fields in the log
          allFields: Object.keys(log)
        })
      })
      
      console.log('[loadWorkoutLogs] REQUIRED FIELDS FOR DASHBOARD:')
      console.log('  For Routine Workouts:', ['workoutType', 'numberOfExercises', 'durationMinutes', 'timestamp'])
      console.log('  For Running Workouts:', ['workoutType', 'distanceKm', 'durationMinutes', 'timestamp'])
    }
    
    // Log all unique workoutType values found
    const workoutTypes = [...new Set(allLogs.map(log => log.workoutType))]
    console.log('[loadWorkoutLogs] Unique workoutType values found:', workoutTypes)
    
    // Filter for routine workouts
    // NOTE: Logs without workoutType are treated as 'routine' for backward compatibility
    workoutLogs.value = allLogs.filter(log => {
      // If workoutType is undefined or null, treat as routine (old format)
      // Otherwise, only include if workoutType === 'routine'
      return !log.workoutType || log.workoutType === 'routine'
    })
    console.log('[loadWorkoutLogs] Filtered workout logs (workoutType === "routine" or undefined):', workoutLogs.value.length)
    console.log('[loadWorkoutLogs] Workout logs sample:', workoutLogs.value.slice(0, 2))
  } catch (error) {
    console.error('[loadWorkoutLogs] Error loading workout logs:', error)
    console.error('[loadWorkoutLogs] Error stack:', error.stack)
    workoutLogs.value = []
  }
}

const loadRunningLogs = async (userId) => {
  console.log('[loadRunningLogs] Starting to load running logs for user:', userId)
  try {
    const allLogs = await WorkoutService.getUserWorkoutLogs({ limit: 100 })
    console.log('[loadRunningLogs] Fetched ALL logs:', allLogs.length)
    
    runningLogs.value = allLogs.filter(log => log.workoutType === 'runs')
    console.log('[loadRunningLogs] Filtered running logs (workoutType === "runs"):', runningLogs.value.length)
    console.log('[loadRunningLogs] Running logs sample:', runningLogs.value.slice(0, 2))
  } catch (error) {
    console.error('[loadRunningLogs] Error loading running logs:', error)
    console.error('[loadRunningLogs] Error stack:', error.stack)
    runningLogs.value = []
  }
}

const loadExercises = async () => {
  try {
    exercises.value = await WorkoutService.getExercises()
  } catch (error) {
    console.error('Error loading exercises:', error)
    exercises.value = []
  }
}

const loadUserProfile = async (userId) => {
  try {
    userProfile.value = await WorkoutService.getUserProfile(userId)
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

const calculateDaysWorkedOut = () => {
  try {
    const uniqueDays = new Set()
    
    // Convert timestamps to dates
    const convertTimestamp = (timestamp) => {
      if (!timestamp) return new Date()
      if (timestamp instanceof Date) return timestamp
      if (typeof timestamp === 'number') return new Date(timestamp)
      if (typeof timestamp === 'string') return new Date(timestamp)
      
      const unwrapped = toRaw(timestamp)
      if (typeof unwrapped === 'number') return new Date(unwrapped)
      if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
      if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
      return new Date(unwrapped)
    }
    
    workoutLogs.value.forEach(log => {
      const date = convertTimestamp(log.timestamp)
      uniqueDays.add(date.toDateString())
    })
    
    runningLogs.value.forEach(log => {
      const date = convertTimestamp(log.timestamp)
      uniqueDays.add(date.toDateString())
    })
    
    daysWorkedOut.value = uniqueDays.size
  } catch (error) {
    console.error('Error calculating days worked out:', error)
  }
}

const processChartData = (logs) => {
  console.log('[processChartData] Processing chart data for', logs?.length || 0, 'logs')
  const weeks = []
  const now = new Date()
  
  // Calculate most recent Monday
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)
  
  console.log('[processChartData] Current date:', now)
  console.log('[processChartData] Most recent Monday:', mostRecentMonday)
  
  const convertTimestamp = (timestamp) => {
    // Handle null/undefined
    if (!timestamp) {
      console.warn('Null/undefined timestamp, using current date')
      return new Date()
    }
    
    // Already a Date object
    if (timestamp instanceof Date) return timestamp
    
    // Number (milliseconds) - this is what we get from Cloud Function now
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // ISO string
    if (typeof timestamp === 'string') return new Date(timestamp)
    
    // Unwrap Vue Proxy if it's an object
    const unwrapped = toRaw(timestamp)
    
    // Firestore Timestamp with seconds property
    if (unwrapped?.seconds !== undefined) {
      return new Date(unwrapped.seconds * 1000)
    }
    
    // Firestore Timestamp with _seconds property
    if (unwrapped?._seconds !== undefined) {
      return new Date(unwrapped._seconds * 1000)
    }
    
    // Object with toDate method
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate()
    }
    
    // Last resort
    try {
      const date = new Date(unwrapped)
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp. Type:', typeof timestamp, 'Value:', timestamp)
        return new Date()
      }
      return date
    } catch (e) {
      console.error('Failed to convert timestamp:', timestamp, e)
      return new Date()
    }
  }
  
  // Log sample timestamps to understand the data format
  if (logs && logs.length > 0) {
    const samples = logs.slice(0, 3).map(log => ({
      raw: log.timestamp,
      rawType: typeof log.timestamp,
      rawToString: String(log.timestamp),
      converted: convertTimestamp(log.timestamp),
      numberOfExercises: log.numberOfExercises,
      durationMinutes: log.durationMinutes,
      isValidDate: convertTimestamp(log.timestamp) instanceof Date && !isNaN(convertTimestamp(log.timestamp))
    }))
    console.log('[processChartData] Sample log timestamps:', samples)
    
    // CRITICAL DEBUG: Show the exact structure of first log
    if (logs[0]) {
      console.log('[processChartData] FIRST LOG COMPLETE STRUCTURE:')
      console.log('  timestamp field:', logs[0].timestamp)
      console.log('  timestamp type:', typeof logs[0].timestamp)
      console.log('  timestamp constructor:', logs[0].timestamp?.constructor?.name)
      console.log('  Has seconds property:', logs[0].timestamp?.seconds)
      console.log('  Has _seconds property:', logs[0].timestamp?._seconds)
      console.log('  Stringified:', JSON.stringify(logs[0].timestamp))
      console.log('  All log fields:', Object.keys(logs[0]))
    }
    
    // Check if timestamps are within our date range
    console.log('[processChartData] Date range check:')
    console.log('  - Most recent Monday:', mostRecentMonday)
    console.log('  - 8 weeks ago:', new Date(mostRecentMonday.getTime() - (7 * 7 * 24 * 60 * 60 * 1000)))
    logs.forEach((log, idx) => {
      const logDate = convertTimestamp(log.timestamp)
      const weeksAgo = Math.floor((now - logDate) / (7 * 24 * 60 * 60 * 1000))
      console.log(`  - Log ${idx + 1}: ${logDate.toLocaleString()} (${weeksAgo} weeks ago, valid: ${!isNaN(logDate)})`)
    })
  }
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(mostRecentMonday)
    weekStart.setDate(mostRecentMonday.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const weekWorkouts = (logs || []).filter(log => {
      const logDate = convertTimestamp(log.timestamp)
      return logDate >= weekStart && logDate <= weekEnd
    })
    
    const weekLabel = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
    
    const weekData = {
      label: weekLabel,
      workouts: weekWorkouts.length,
      exercises: weekWorkouts.reduce((sum, w) => sum + (w.numberOfExercises || 0), 0),
      duration: weekWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0)
    }
    
    if (weekWorkouts.length > 0) {
      console.log(`[processChartData] Week ${weekLabel} (${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}):`, {
        workouts: weekWorkouts.length,
        exercises: weekData.exercises,
        duration: weekData.duration,
        sampleWorkouts: weekWorkouts.slice(0, 2)
      })
    }
    
    weeks.push(weekData)
  }
  
  workoutData.value = weeks.map(w => ({ label: w.label, workouts: w.workouts }))
  exerciseData.value = weeks.map(w => ({ label: w.label, exercises: w.exercises }))
  durationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
  
  console.log('[processChartData] Final processed data:', {
    totalWeeks: weeks.length,
    totalWorkouts: weeks.reduce((sum, w) => sum + w.workouts, 0),
    totalExercises: weeks.reduce((sum, w) => sum + w.exercises, 0),
    totalDuration: weeks.reduce((sum, w) => sum + w.duration, 0)
  })
}

const extractRunDistanceKm = (log) => {
  return log.distanceKm || 0
}

const processRunningChartData = (logs) => {
  console.log('[processRunningChartData] Processing running chart data for', logs?.length || 0, 'logs')
  const weeks = []
  const now = new Date()
  
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'number') return new Date(timestamp)
    if (typeof timestamp === 'string') return new Date(timestamp)
    
    const unwrapped = toRaw(timestamp)
    if (typeof unwrapped === 'number') return new Date(unwrapped)
    if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
    if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
    
    try {
      const date = new Date(unwrapped)
      if (isNaN(date.getTime())) return new Date()
      return date
    } catch (e) {
      return new Date()
    }
  }
  
  // Log sample running data
  if (logs && logs.length > 0) {
    console.log('[processRunningChartData] Sample running logs:', logs.slice(0, 2).map(log => ({
      timestamp: log.timestamp,
      durationMinutes: log.durationMinutes,
      distanceKm: log.distanceKm
    })))
  }

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(mostRecentMonday)
    weekStart.setDate(mostRecentMonday.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const weekRuns = (logs || []).filter(log => {
      const logDate = convertTimestamp(log.timestamp)
      return logDate >= weekStart && logDate <= weekEnd
    })

    const weekLabel = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })

    const weekData = {
      label: weekLabel,
      runs: weekRuns.length,
      duration: weekRuns.reduce((sum, r) => sum + (r.durationMinutes || 0), 0),
      distance: Math.round(weekRuns.reduce((sum, r) => sum + extractRunDistanceKm(r), 0) * 10) / 10
    }
    
    if (weekRuns.length > 0) {
      console.log(`[processRunningChartData] Week ${weekLabel}:`, {
        runs: weekRuns.length,
        duration: weekData.duration,
        distance: weekData.distance
      })
    }

    weeks.push(weekData)
  }

  runningRunsData.value = weeks.map(w => ({ label: w.label, runs: w.runs }))
  runningDurationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
  runningDistanceData.value = weeks.map(w => ({ label: w.label, distance: w.distance }))
  
  console.log('[processRunningChartData] Final running data:', {
    totalWeeks: weeks.length,
    totalRuns: weeks.reduce((sum, w) => sum + w.runs, 0),
    totalDuration: weeks.reduce((sum, w) => sum + w.duration, 0),
    totalDistance: weeks.reduce((sum, w) => sum + w.distance, 0)
  })
}

const processMuscleGroups = () => {
  muscleGroups.value = []
}

const getMuscleIntensityClass = (count) => {
  const maxCount = Math.max(...muscleGroups.value.map(m => m.count))
  const intensity = count / maxCount
  
  if (intensity >= 0.8) return 'bg-danger text-white'
  if (intensity >= 0.6) return 'bg-warning text-dark'
  if (intensity >= 0.4) return 'bg-info text-white'
  if (intensity >= 0.2) return 'bg-secondary text-white'
  return 'bg-light text-dark'
}
</script>

<style scoped>
.progress-dashboard {
  padding: 1rem;
}

.chart-container {
  min-height: 200px;
}

.muscle-group-item {
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.muscle-group-item:hover {
  transform: scale(1.05);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
}

.muscle-heatmap {
  min-height: 200px;
}

.card {
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  border-bottom: 1px solid var(--bs-border-color);
}

.badge {
  font-size: 0.875rem;
}

/* Enhanced muscle heatmap colors */
.muscle-group-item.bg-danger {
  background-color: #dc3545 !important;
  color: white !important;
}

.muscle-group-item.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

.muscle-group-item.bg-info {
  background-color: #0dcaf0 !important;
  color: white !important;
}

.muscle-group-item.bg-secondary {
  background-color: #6c757d !important;
  color: white !important;
}

.muscle-group-item.bg-light {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
}
</style>