<template>
  <div class="progress-dashboard">
    <div class="row mb-4">
      <div class="col-12">
        <h2><i class="bi bi-graph-up me-2"></i>Progress Dashboard</h2>
        <p class="text-muted">Track your fitness journey and see your improvements</p>
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
            <!-- 8-Week Window Header -->
            <div class="row mb-2 mt-3">
              <div class="col-12">
                <h6 class="text-muted"><i class="bi bi-calendar-week me-2"></i>Last 8 Weeks</h6>
              </div>
            </div>
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
            <div v-else class="chart-container" style="height: 250px;">
              <Line :data="workoutChartData" :options="chartOptions" />
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
            <div v-else class="chart-container" style="height: 250px;">
              <Line :data="exerciseChartData" :options="chartOptions" />
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
            <div v-else class="chart-container" style="height: 250px;">
              <Line :data="durationChartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>

            <!-- Muscle Groups Heatmap - Hidden for simplified logging -->
            <!-- Future feature: Track individual exercises to show muscle group breakdown -->

            <!-- Calendar Year Header -->
            <div class="row mb-2 mt-2">
              <div class="col-12">
                <h6 class="text-muted"><i class="bi bi-calendar3 me-2"></i>{{ currentYear }}</h6>
              </div>
            </div>
            <!-- Year Charts (Workouts) -->
            <div class="row mb-4">
              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-activity me-2"></i>Workouts per Month</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasWorkoutYearData" class="text-center py-4">
                      <i class="bi bi-graph-up display-1 text-muted"></i>
                      <p class="text-muted">No workout data available yet</p>
                    </div>
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="workoutYearChartData" :options="chartOptions" :key="'workoutYear_'+currentYear" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="bi bi-list-ul me-2"></i>Exercises per Month</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasExerciseYearData" class="text-center py-4">
                      <i class="bi bi-list-ul display-1 text-muted"></i>
                      <p class="text-muted">No exercise data available yet</p>
                    </div>
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="exerciseYearChartData" :options="chartOptions" :key="'exerciseYear_'+currentYear" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0"><i class="bi bi-clock me-2"></i>Duration per Month (Minutes)</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasDurationYearData" class="text-center py-4">
                      <i class="bi bi-clock display-1 text-muted"></i>
                      <p class="text-muted">No duration data available yet</p>
                    </div>
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="durationYearChartData" :options="chartOptions" :key="'durationYear_'+currentYear" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Running Statistics Tab -->
          <div class="tab-pane fade" id="running-pane" role="tabpanel" aria-labelledby="running-tab">
            <!-- 8-Week Window Header -->
            <div class="row mb-2 mt-3">
              <div class="col-12">
                <h6 class="text-muted"><i class="bi bi-calendar-week me-2"></i>Last 8 Weeks</h6>
              </div>
            </div>
            <!-- Running Charts -->
            <div class="row mb-3">
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
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="runningRunsChartData" :options="chartOptions" />
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
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="runningDistanceChartData" :options="chartOptions" />
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
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="runningDurationChartData" :options="chartOptions" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendar Year Header -->
            <div class="row mb-2 mt-2">
              <div class="col-12">
                <h6 class="text-muted"><i class="bi bi-calendar3 me-2"></i>{{ currentYear }}</h6>
              </div>
            </div>
            <!-- Year Charts (Running) -->
            <div class="row">
              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Runs per Month</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasRunningYearRunsData" class="text-center py-4">
                      <i class="bi bi-geo-alt display-1 text-muted"></i>
                      <p class="text-muted">No running data available yet</p>
                    </div>
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="runningYearRunsChartData" :options="chartOptions" :key="'runningYearRuns_'+currentYear" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="bi bi-signpost-split me-2"></i>Distance per Month (km)</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasRunningYearDistanceData" class="text-center py-4">
                      <i class="bi bi-signpost-split display-1 text-muted"></i>
                      <p class="text-muted">No running distance data yet</p>
                    </div>
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="runningYearDistanceChartData" :options="chartOptions" :key="'runningYearDistance_'+currentYear" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Duration per Month (Minutes)</h5>
                  </div>
                  <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="!hasRunningYearDurationData" class="text-center py-4">
                      <i class="bi bi-clock-history display-1 text-muted"></i>
                      <p class="text-muted">No running duration data yet</p>
                    </div>
                    <div v-else class="chart-container" style="height: 250px;">
                      <Line :data="runningYearDurationChartData" :options="chartOptions" :key="'runningYearDuration_'+currentYear" />
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
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const loading = ref(false)
const workoutLogs = ref([])
const runningLogs = ref([])
// Removed unused refs: exercises, userProfile

// Chart data (8-week)
const workoutData = ref([])
const exerciseData = ref([])
const durationData = ref([])

// Chart data (calendar year)
const workoutYearData = ref([])
const exerciseYearData = ref([])
const durationYearData = ref([])

// Running routes chart data (8-week)
const runningRunsData = ref([])
const runningDurationData = ref([])
const runningDistanceData = ref([])

// Running routes chart data (calendar year)
const runningYearRunsData = ref([])
const runningYearDurationData = ref([])
const runningYearDistanceData = ref([])

// Removed unused muscleGroups logic

// Days worked out
const daysWorkedOut = ref(0)
const currentYear = new Date().getFullYear()

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

const loadedOnce = ref(false)

onMounted(async () => {
  if (loadedOnce.value) return
  loadedOnce.value = true
  await loadAllData()
})

const loadAllData = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    
    if (user) {
      await Promise.all([
        loadWorkoutLogs(),
        loadRunningLogs()
      ])
      
      calculateDaysWorkedOut()
      processChartData(workoutLogs.value)
      processRunningChartData(runningLogs.value)
      processYearChartData(workoutLogs.value)
      processRunningYearChartData(runningLogs.value)
      // Removed unused processMuscleGroups()
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const loadWorkoutLogs = async () => {
  try {
    const allLogs = await WorkoutService.getUserWorkoutLogs({ limit: 1000 })
    workoutLogs.value = allLogs.filter(log => !log.workoutType || log.workoutType === 'routine')
  } catch (error) {
    console.error('Error loading workout logs:', error)
    workoutLogs.value = []
  }
}

const loadRunningLogs = async () => {
  try {
    const allLogs = await WorkoutService.getUserWorkoutLogs({ limit: 1000 })
    runningLogs.value = allLogs.filter(log => log.workoutType === 'runs')
  } catch (error) {
    console.error('Error loading running logs:', error)
    runningLogs.value = []
  }
}

// Removed unused functions: loadExercises, loadUserProfile

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
  const weeks = []
  const now = new Date()
  
  // Calculate most recent Monday
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)
  
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
    
    weeks.push(weekData)
  }
  
  workoutData.value = weeks.map(w => ({ label: w.label, workouts: w.workouts }))
  exerciseData.value = weeks.map(w => ({ label: w.label, exercises: w.exercises }))
  durationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
}

const processYearChartData = (logs) => {
  const now = new Date()
  const year = now.getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    workouts: 0,
    exercises: 0,
    duration: 0,
  }))

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
    } catch {
      return new Date()
    }
  }

  ;(logs || []).forEach(log => {
    const d = convertTimestamp(log.timestamp)
    if (d.getFullYear() === year) {
      const m = d.getMonth()
      months[m].workouts += 1
      months[m].exercises += (log.numberOfExercises || 0)
      months[m].duration += (log.durationMinutes || 0)
    }
  })

  workoutYearData.value = months.map(m => ({ label: m.label, workouts: m.workouts }))
  exerciseYearData.value = months.map(m => ({ label: m.label, exercises: m.exercises }))
  durationYearData.value = months.map(m => ({ label: m.label, duration: m.duration }))
}

const extractRunDistanceKm = (log) => {
  return log.distanceKm || 0
}

const processRunningChartData = (logs) => {
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
    } catch {
      return new Date()
    }
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

    weeks.push(weekData)
  }

  runningRunsData.value = weeks.map(w => ({ label: w.label, runs: w.runs }))
  runningDurationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
  runningDistanceData.value = weeks.map(w => ({ label: w.label, distance: w.distance }))
}

const processRunningYearChartData = (logs) => {
  const now = new Date()
  const year = now.getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    runs: 0,
    duration: 0,
    distance: 0,
  }))

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
    } catch {
      return new Date()
    }
  }

  ;(logs || []).forEach(log => {
    const d = convertTimestamp(log.timestamp)
    if (d.getFullYear() === year) {
      const m = d.getMonth()
      months[m].runs += 1
      months[m].duration += (log.durationMinutes || 0)
      months[m].distance = Math.round((months[m].distance + (extractRunDistanceKm(log) || 0)) * 10) / 10
    }
  })

  runningYearRunsData.value = months.map(m => ({ label: m.label, runs: m.runs }))
  runningYearDurationData.value = months.map(m => ({ label: m.label, duration: m.duration }))
  runningYearDistanceData.value = months.map(m => ({ label: m.label, distance: m.distance }))
}

// Removed unused muscle group helpers

// Chart.js data and options
const workoutChartData = computed(() => ({
  labels: workoutData.value.map(d => d.label),
  datasets: [{
    label: 'Workouts',
    data: workoutData.value.map(d => d.workouts),
    borderColor: '#0d6efd',
    backgroundColor: 'rgba(13, 110, 253, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

// Year charts - workouts
const hasWorkoutYearData = computed(() => workoutYearData.value.some(d => d.workouts > 0))
const hasExerciseYearData = computed(() => exerciseYearData.value.some(d => d.exercises > 0))
const hasDurationYearData = computed(() => durationYearData.value.some(d => d.duration > 0))

const workoutYearChartData = computed(() => ({
  labels: workoutYearData.value.map(d => d.label),
  datasets: [{
    label: 'Workouts',
    data: workoutYearData.value.map(d => d.workouts),
    borderColor: '#0d6efd',
    backgroundColor: 'rgba(13, 110, 253, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}))

const exerciseYearChartData = computed(() => ({
  labels: exerciseYearData.value.map(d => d.label),
  datasets: [{
    label: 'Exercises',
    data: exerciseYearData.value.map(d => d.exercises),
    borderColor: '#198754',
    backgroundColor: 'rgba(25, 135, 84, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}))

const durationYearChartData = computed(() => ({
  labels: durationYearData.value.map(d => d.label),
  datasets: [{
    label: 'Minutes',
    data: durationYearData.value.map(d => d.duration),
    borderColor: '#0dcaf0',
    backgroundColor: 'rgba(13, 202, 240, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}))

const exerciseChartData = computed(() => ({
  labels: exerciseData.value.map(d => d.label),
  datasets: [{
    label: 'Exercises',
    data: exerciseData.value.map(d => d.exercises),
    borderColor: '#198754',
    backgroundColor: 'rgba(25, 135, 84, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

const durationChartData = computed(() => ({
  labels: durationData.value.map(d => d.label),
  datasets: [{
    label: 'Minutes',
    data: durationData.value.map(d => d.duration),
    borderColor: '#0dcaf0',
    backgroundColor: 'rgba(13, 202, 240, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

const runningRunsChartData = computed(() => ({
  labels: runningRunsData.value.map(d => d.label),
  datasets: [{
    label: 'Runs',
    data: runningRunsData.value.map(d => d.runs),
    borderColor: '#0d6efd',
    backgroundColor: 'rgba(13, 110, 253, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

const runningDurationChartData = computed(() => ({
  labels: runningDurationData.value.map(d => d.label),
  datasets: [{
    label: 'Minutes',
    data: runningDurationData.value.map(d => d.duration),
    borderColor: '#0dcaf0',
    backgroundColor: 'rgba(13, 202, 240, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

const runningDistanceChartData = computed(() => ({
  labels: runningDistanceData.value.map(d => d.label),
  datasets: [{
    label: 'Kilometers',
    data: runningDistanceData.value.map(d => d.distance),
    borderColor: '#198754',
    backgroundColor: 'rgba(25, 135, 84, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

// Year charts - running
const hasRunningYearRunsData = computed(() => runningYearRunsData.value.some(d => d.runs > 0))
const hasRunningYearDurationData = computed(() => runningYearDurationData.value.some(d => d.duration > 0))
const hasRunningYearDistanceData = computed(() => runningYearDistanceData.value.some(d => d.distance > 0))

const runningYearRunsChartData = computed(() => ({
  labels: runningYearRunsData.value.map(d => d.label),
  datasets: [{
    label: 'Runs',
    data: runningYearRunsData.value.map(d => d.runs),
    borderColor: '#0d6efd',
    backgroundColor: 'rgba(13, 110, 253, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}))

const runningYearDurationChartData = computed(() => ({
  labels: runningYearDurationData.value.map(d => d.label),
  datasets: [{
    label: 'Minutes',
    data: runningYearDurationData.value.map(d => d.duration),
    borderColor: '#0dcaf0',
    backgroundColor: 'rgba(13, 202, 240, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}))

const runningYearDistanceChartData = computed(() => ({
  labels: runningYearDistanceData.value.map(d => d.label),
  datasets: [{
    label: 'Kilometers',
    data: runningYearDistanceData.value.map(d => d.distance),
    borderColor: '#198754',
    backgroundColor: 'rgba(25, 135, 84, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}
</script>

<style scoped>
.progress-dashboard {
  padding: 1rem;
}

.chart-container {
  position: relative;
  padding: 1rem 0.5rem;
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
