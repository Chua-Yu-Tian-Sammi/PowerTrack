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
            <div v-else-if="workoutData.length === 0" class="text-center py-4">
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
            <div v-else-if="exerciseData.length === 0" class="text-center py-4">
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
            <div v-else-if="durationData.length === 0" class="text-center py-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>

            <!-- Muscle Groups Heatmap -->
    <div class="row">
              <div class="col-12">
        <div class="card h-100">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0"><i class="bi bi-heart-pulse me-2"></i>Muscle Groups Trained</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="muscleGroups.length === 0" class="text-center py-4">
              <i class="bi bi-heart-pulse display-1 text-muted"></i>
              <p class="text-muted">No muscle group data available yet</p>
            </div>
            <div v-else class="muscle-heatmap">
              <div class="row g-2">
                <div v-for="muscle in muscleGroups" :key="muscle.name" 
                     class="col-6 col-md-4">
                  <div class="muscle-group-item p-2 rounded text-center border"
                       :class="getMuscleIntensityClass(muscle.count)"
                       :title="`${muscle.name}: ${muscle.count} exercises`">
                    <div class="fw-bold">{{ muscle.name }}</div>
                    <small>{{ muscle.count }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                    <div v-else-if="runningRunsData.length === 0" class="text-center py-4">
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
                    <div v-else-if="runningDurationData.length === 0" class="text-center py-4">
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
                    <div v-else-if="runningDistanceData.length === 0" class="text-center py-4">
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
import { ref, onMounted, computed } from 'vue'
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

onMounted(async () => {
  await loadAllData()
})

const loadAllData = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    if (user) {
      await Promise.all([
        loadWorkoutLogs(user.uid),
        loadExercises(),
        loadUserProfile(user.uid),
        calculateDaysWorkedOut()
      ])
      
      // Split logs into workout vs running
      const allLogs = workoutLogs.value || []
      const isRun = (log) => (log.sourceType === 'running-route')
      runningLogs.value = allLogs.filter(isRun)
      const workoutOnlyLogs = allLogs.filter(l => !isRun(l))

      processChartData(workoutOnlyLogs)
      processRunningChartData(runningLogs.value)
      processMuscleGroups()
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const loadWorkoutLogs = async (userId) => {
  try {
    workoutLogs.value = await WorkoutService.getUserWorkoutLogs({ uid: userId, limit: 100 })
  } catch (error) {
    console.error('Error loading workout logs:', error)
    workoutLogs.value = []
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

const calculateDaysWorkedOut = async () => {
  try {
    // Get all workout logs and count unique days
    const uniqueDays = new Set()
    workoutLogs.value.forEach(log => {
      const date = new Date(log.date)
      const dateString = date.toDateString()
      uniqueDays.add(dateString)
    })
    daysWorkedOut.value = uniqueDays.size
  } catch (error) {
    console.error('Error calculating days worked out:', error)
  }
}

const processChartData = (logs) => {
  // Group data by weeks for the last 8 weeks (Monday to Sunday)
  const weeks = []
  const now = new Date()
  
  // Find the most recent Monday
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1 // Sunday = 0, Monday = 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(mostRecentMonday)
    weekStart.setDate(mostRecentMonday.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const weekWorkouts = (logs || []).filter(log => {
      const logDate = new Date(log.date)
      return logDate >= weekStart && logDate <= weekEnd
    })
    
    // Format date as "Sep 1" style
    const weekLabel = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
    
    const weekData = {
      label: weekLabel,
      workouts: weekWorkouts.length,
      exercises: weekWorkouts.reduce((sum, w) => sum + w.items.length, 0),
      duration: Math.round(weekWorkouts.reduce((sum, w) => sum + w.totalDurationSec, 0) / 60)
    }
    
    weeks.push(weekData)
  }
  
  workoutData.value = weeks.map(w => ({ label: w.label, workouts: w.workouts }))
  exerciseData.value = weeks.map(w => ({ label: w.label, exercises: w.exercises }))
  durationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
}

const extractRunDistanceKm = (log) => {
  // Try multiple places for distance in order of preference
  // 1) Direct route field
  if (log.route && typeof log.route.distance === 'number') return Math.round(log.route.distance * 10) / 10
  if (log.route && typeof log.route.distanceKm === 'number') return Math.round(log.route.distanceKm * 10) / 10
  
  // 2) Workout snapshot exercises first item distance
  const snap = log.workoutSnapshot || log.workout || {}
  const ex = Array.isArray(snap.exercises) ? snap.exercises[0] : null
  if (ex && typeof ex.distance === 'number') return Math.round(ex.distance * 10) / 10
  
  // 3) Snapshot metadata
  if (snap.distanceKm && typeof snap.distanceKm === 'number') return Math.round(snap.distanceKm * 10) / 10
  if (snap.distance && typeof snap.distance === 'number') return Math.round(snap.distance * 10) / 10
  
  // 4) Log metadata
  if (log.distanceKm && typeof log.distanceKm === 'number') return Math.round(log.distanceKm * 10) / 10
  if (log.distance && typeof log.distance === 'number') return Math.round(log.distance * 10) / 10
  
  return 0
}

const processRunningChartData = (logs) => {
  const weeks = []
  const now = new Date()
  
  // Find the most recent Monday
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1 // Sunday = 0, Monday = 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(mostRecentMonday)
    weekStart.setDate(mostRecentMonday.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const weekRuns = (logs || []).filter(log => {
      const logDate = new Date(log.date)
      return logDate >= weekStart && logDate <= weekEnd
    })

    // Format date as "Sep 1" style
    const weekLabel = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })

    const weekData = {
      label: weekLabel,
      runs: weekRuns.length,
      duration: Math.round(weekRuns.reduce((sum, r) => sum + (r.totalDurationSec || 0), 0) / 60),
      distance: Math.round(weekRuns.reduce((sum, r) => sum + extractRunDistanceKm(r), 0) * 10) / 10
    }

    weeks.push(weekData)
  }

  runningRunsData.value = weeks.map(w => ({ label: w.label, runs: w.runs }))
  runningDurationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
  runningDistanceData.value = weeks.map(w => ({ label: w.label, distance: w.distance }))
}

const processMuscleGroups = () => {
  const muscleCounts = {}
  
  workoutLogs.value.filter(l => l.sourceType !== 'running-route').forEach(log => {
    log.items.forEach(item => {
      const exercise = exercises.value.find(e => e.exerciseId === item.exerciseId)
      if (exercise && exercise.muscleGroups) {
        exercise.muscleGroups.forEach(muscle => {
          if (!muscleCounts[muscle]) {
            muscleCounts[muscle] = 0
          }
          muscleCounts[muscle]++
        })
      }
    })
  })
  
  muscleGroups.value = Object.entries(muscleCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
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