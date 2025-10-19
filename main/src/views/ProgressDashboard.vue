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
                    <small class="text-muted">Account created: {{ accountCreatedDate }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Charts -->
    <div class="row mb-4">
      <div class="col-lg-6 mb-4">
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

      <div class="col-lg-6 mb-4">
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

      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0"><i class="bi bi-clock me-2"></i>Duration (Minutes)</h5>
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

      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0"><i class="bi bi-fire me-2"></i>Average Intensity</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="intensityData.length === 0" class="text-center py-4">
              <i class="bi bi-fire display-1 text-muted"></i>
              <p class="text-muted">No intensity data available yet</p>
            </div>
            <div v-else class="chart-container">
              <div class="d-flex align-items-end justify-content-between" style="height: 200px;">
                <div v-for="(data, index) in intensityData" :key="index" 
                     class="d-flex flex-column align-items-center me-1 flex-fill">
                  <div class="bg-warning rounded-top mb-2" 
                       :style="{ height: `${(data.intensity / maxIntensity) * 160}px` }"
                       :title="`${data.intensity} intensity`">
                  </div>
                  <small class="text-muted text-center">{{ data.label }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Exercises and Muscle Heatmap -->
    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0"><i class="bi bi-trophy me-2"></i>Most Popular Exercises</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="topExercises.length === 0" class="text-center py-4">
              <i class="bi bi-trophy display-1 text-muted"></i>
              <p class="text-muted">No exercise data available yet</p>
            </div>
            <div v-else>
              <div v-for="(exercise, index) in topExercises" :key="exercise.exerciseId" 
                   class="d-flex align-items-center mb-3 p-3 bg-light rounded">
                <div class="me-3">
                  <span class="badge bg-primary fs-6">{{ index + 1 }}</span>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ exercise.name }}</h6>
                  <small class="text-muted">{{ exercise.count }} times completed</small>
                </div>
                <div class="text-end">
                  <span class="badge bg-secondary">{{ exercise.intensity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 mb-4">
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'

const loading = ref(false)
const workoutLogs = ref([])
const exercises = ref([])
const userProfile = ref(null)

// Chart data
const workoutData = ref([])
const exerciseData = ref([])
const durationData = ref([])
const intensityData = ref([])

// Top exercises and muscle groups
const topExercises = ref([])
const muscleGroups = ref([])

// Days worked out
const daysWorkedOut = ref(0)
const accountCreatedDate = ref('')

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

const maxIntensity = computed(() => {
  return Math.max(...intensityData.value.map(d => d.intensity), 1)
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
      
      processChartData()
      processTopExercises()
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
    if (userProfile.value && userProfile.value.createdAt) {
      accountCreatedDate.value = new Date(userProfile.value.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
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

const processChartData = () => {
  // Group data by weeks for the last 8 weeks
  const weeks = []
  const now = new Date()
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const weekWorkouts = workoutLogs.value.filter(log => {
      const logDate = new Date(log.date)
      return logDate >= weekStart && logDate <= weekEnd
    })
    
    const weekData = {
      label: `Week ${8-i}`,
      workouts: weekWorkouts.length,
      exercises: weekWorkouts.reduce((sum, w) => sum + w.items.length, 0),
      duration: Math.round(weekWorkouts.reduce((sum, w) => sum + w.totalDurationSec, 0) / 60),
      intensity: weekWorkouts.length > 0 ? 
        Math.round(weekWorkouts.reduce((sum, w) => sum + (w.perceivedIntensity || 5), 0) / weekWorkouts.length * 10) / 10 : 0
    }
    
    weeks.push(weekData)
  }
  
  workoutData.value = weeks.map(w => ({ label: w.label, workouts: w.workouts }))
  exerciseData.value = weeks.map(w => ({ label: w.label, exercises: w.exercises }))
  durationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
  intensityData.value = weeks.map(w => ({ label: w.label, intensity: w.intensity }))
}

const processTopExercises = () => {
  const exerciseCounts = {}
  
  workoutLogs.value.forEach(log => {
    log.items.forEach(item => {
      if (!exerciseCounts[item.exerciseId]) {
        exerciseCounts[item.exerciseId] = 0
      }
      exerciseCounts[item.exerciseId]++
    })
  })
  
  const exerciseStats = Object.entries(exerciseCounts)
    .map(([exerciseId, count]) => {
      const exercise = exercises.value.find(e => e.exerciseId === exerciseId)
      return {
        exerciseId,
        name: exercise ? exercise.name : 'Unknown Exercise',
        intensity: exercise ? exercise.intensity : 'Unknown',
        count
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
  
  topExercises.value = exerciseStats
}

const processMuscleGroups = () => {
  const muscleCounts = {}
  
  workoutLogs.value.forEach(log => {
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