<template>
  <div class="progress-dashboard">
    <div class="row mb-4">
      <div class="col-12">
        <h2><i class="bi bi-graph-up me-2"></i>Progress Dashboard</h2>
        <p class="text-muted">Track your fitness journey and see your improvements</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ totalWorkouts }}</h4>
                <p class="mb-0">Total Workouts</p>
              </div>
              <i class="bi bi-activity display-4"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ totalVolume }}</h4>
                <p class="mb-0">Total Volume (lbs)</p>
              </div>
              <i class="bi bi-speedometer2 display-4"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ totalDuration }}</h4>
                <p class="mb-0">Total Time (hours)</p>
              </div>
              <i class="bi bi-clock display-4"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4>{{ averageIntensity }}</h4>
                <p class="mb-0">Avg Intensity</p>
              </div>
              <i class="bi bi-fire display-4"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row mb-4">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5>Workout Frequency (Last 8 Weeks)</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="progressData.length === 0" class="text-center py-4">
              <i class="bi bi-graph-up display-1 text-muted"></i>
              <p class="text-muted">No progress data available yet</p>
            </div>
            <div v-else class="progress-chart">
              <!-- Simple bar chart representation -->
              <div class="d-flex align-items-end" style="height: 200px;">
                <div v-for="(week, index) in progressData.slice(0, 8)" :key="index" 
                     class="flex-fill d-flex flex-column align-items-center me-1">
                  <div class="bg-primary rounded-top" 
                       :style="{ height: `${(week.totalWorkouts / maxWorkouts) * 180}px` }">
                  </div>
                  <small class="mt-1 text-muted">{{ week.week.split('-W')[1] }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5>Recent Activity</h5>
          </div>
          <div class="card-body">
            <div v-if="recentWorkouts.length === 0" class="text-center py-3">
              <p class="text-muted">No recent workouts</p>
            </div>
            <div v-else>
              <div v-for="workout in recentWorkouts" :key="workout.logId" class="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <strong>{{ formatDate(workout.date) }}</strong>
                  <br>
                  <small class="text-muted">{{ workout.items.length }} exercises</small>
                </div>
                <div class="text-end">
                  <span class="badge bg-primary">{{ workout.totalDurationSec / 60 }}min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workout History -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>Workout History</h5>
            <button class="btn btn-outline-primary btn-sm" @click="loadWorkoutLogs">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="workoutLogs.length === 0" class="text-center py-4">
              <i class="bi bi-calendar-x display-1 text-muted"></i>
              <p class="text-muted">No workout history yet</p>
            </div>
            <div v-else>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Exercises</th>
                      <th>Duration</th>
                      <th>Volume</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in workoutLogs" :key="log.logId">
                      <td>{{ formatDate(log.date) }}</td>
                      <td>{{ log.items.length }}</td>
                      <td>{{ Math.round(log.totalDurationSec / 60) }} min</td>
                      <td>{{ log.totalVolume }} lbs</td>
                      <td>{{ log.notes || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
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
const progressData = ref([])
const workoutLogs = ref([])

const totalWorkouts = computed(() => {
  return progressData.value.reduce((sum, week) => sum + week.totalWorkouts, 0)
})

const totalVolume = computed(() => {
  return progressData.value.reduce((sum, week) => sum + week.totalVolume, 0)
})

const totalDuration = computed(() => {
  const totalSeconds = progressData.value.reduce((sum, week) => sum + week.totalDurationSec, 0)
  return Math.round(totalSeconds / 3600 * 10) / 10
})

const averageIntensity = computed(() => {
  if (progressData.value.length === 0) return 0
  const avg = progressData.value.reduce((sum, week) => sum + week.averageIntensity, 0) / progressData.value.length
  return Math.round(avg * 10) / 10
})

const maxWorkouts = computed(() => {
  return Math.max(...progressData.value.map(week => week.totalWorkouts), 1)
})

const recentWorkouts = computed(() => {
  return workoutLogs.value.slice(0, 5)
})

onMounted(async () => {
  await loadProgressData()
  await loadWorkoutLogs()
})

const loadProgressData = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    if (user) {
      progressData.value = await WorkoutService.getProgressSummaries(user.uid)
      console.log('Loaded progress data:', progressData.value.length)
    }
  } catch (error) {
    console.error('Error loading progress data:', error)
  } finally {
    loading.value = false
  }
}

const loadWorkoutLogs = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    if (user) {
      workoutLogs.value = await WorkoutService.getUserWorkoutLogs(user.uid, 20)
      console.log('Loaded workout logs:', workoutLogs.value.length)
    }
  } catch (error) {
    console.error('Error loading workout logs:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.progress-chart {
  min-height: 200px;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.bg-primary, .bg-success, .bg-info, .bg-warning {
  background-color: var(--bs-primary) !important;
}

.bg-success {
  background-color: var(--bs-success) !important;
}

.bg-info {
  background-color: var(--bs-info) !important;
}

.bg-warning {
  background-color: var(--bs-warning) !important;
}
</style>

