<template>
  <div class="progress-dashboard">
    <!-- header -->
    <div class=" mb-5">
        <h2><i class="bi bi-graph-up me-2"></i>Progress Dashboard</h2>
      <p class="text-muted mb-0">Visualize your fitness evolution beautifully 🌿</p>
    </div>

    <!-- overview stats -->
    <div class="row g-4 mb-5">
      <div v-for="(stat, i) in statCards" :key="i" class="col-6 col-lg-3">
        <div class="glass-card stat-card p-4 text-center rounded-4 shadow-sm position-relative overflow-hidden">
          <i :class="stat.icon" class="display-5 mb-3"></i>
          <h3 class="fw-bold mb-1">{{ stat.value }}</h3>
          <p class="text-muted small mb-0">{{ stat.label }}</p>
          <div class="glow" :class="stat.glowClass"></div>
        </div>
      </div>
    </div>

    <!-- charts + activity -->
    <div class="row g-4 mb-5">
      <div class="col-lg-8">
        <div class="glass-card rounded-4 shadow-sm p-4">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-bar-chart-line text-primary me-2"></i>
            <h5 class="fw-semibold mb-0">Workout Frequency (Last 8 Weeks)</h5>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else-if="!progressData.length" class="text-center py-5 text-muted">
            <i class="bi bi-emoji-frown display-5 d-block mb-2"></i>
            No data yet — time to log a workout 💪
          </div>

          <div v-else class="progress-chart">
            <div class="d-flex align-items-end justify-content-between" style="height: 240px;">
              <div
                v-for="(week, i) in progressData.slice(0, 8)"
                :key="i"
                class="flex-fill d-flex flex-column align-items-center mx-1"
              >
                <div
                  class="bar rounded-top"
                  :style="{ height: `${(week.totalWorkouts / maxWorkouts) * 200}px` }"
                ></div>
                <small class="mt-2 text-muted fw-semibold">W{{ week.week.split('-W')[1] }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- recent activity -->
      <div class="col-lg-4">
        <div class="glass-card rounded-4 shadow-sm p-4 h-100">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-lightning-charge text-warning me-2"></i>
            <h5 class="fw-semibold mb-0">Recent Activity</h5>
          </div>

          <div v-if="!recentWorkouts.length" class="text-center py-5 text-muted">
            <i class="bi bi-calendar-check display-5 d-block mb-2"></i>
            Nothing recent yet ✨
          </div>

          <div v-else>
            <div
              v-for="workout in recentWorkouts"
              :key="workout.logId"
              class="recent-item p-3 mb-2 rounded-3"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong class="text-dark">{{ formatDate(workout.date) }}</strong><br />
                  <small class="text-muted">{{ workout.items.length }} exercises</small>
                </div>
                <span class="badge bg-gradient text-white px-3 py-2">
                  {{ Math.round(workout.totalDurationSec / 60) }} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- workout history -->
    <div class="glass-card rounded-4 shadow-sm p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-semibold mb-0">
          <i class="bi bi-journal-text me-2 text-info"></i>Workout History
        </h5>
        <button class="btn btn-outline-primary btn-sm px-3" @click="loadWorkoutLogs">
          <i class="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="!workoutLogs.length" class="text-center py-5 text-muted">
        <i class="bi bi-calendar-x display-5 d-block mb-2"></i>
        No workouts logged yet 🕊️
      </div>

      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-center mb-0">
          <thead class="table-light">
            <tr>
              <th>Date</th>
              <th>Exercises</th>
              <th>Duration</th>
              <th>Volume (lbs)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in workoutLogs" :key="log.logId">
              <td>{{ formatDate(log.date) }}</td>
              <td>{{ log.items.length }}</td>
              <td>{{ Math.round(log.totalDurationSec / 60) }} min</td>
              <td>{{ log.totalVolume }}</td>
              <td>{{ log.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
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

const totalWorkouts = computed(() =>
  progressData.value.reduce((sum, w) => sum + w.totalWorkouts, 0)
)
const totalVolume = computed(() =>
  progressData.value.reduce((sum, w) => sum + w.totalVolume, 0)
)
const totalDuration = computed(() => {
  const totalSec = progressData.value.reduce((sum, w) => sum + w.totalDurationSec, 0)
  return Math.round((totalSec / 3600) * 10) / 10
})
const averageIntensity = computed(() => {
  if (!progressData.value.length) return 0
  const avg = progressData.value.reduce((sum, w) => sum + w.averageIntensity, 0) / progressData.value.length
  return Math.round(avg * 10) / 10
})
const maxWorkouts = computed(() =>
  Math.max(...progressData.value.map(w => w.totalWorkouts), 1)
)
const recentWorkouts = computed(() => workoutLogs.value.slice(0, 5))

const statCards = computed(() => [
  { label: 'Total Workouts', value: totalWorkouts.value, icon: 'bi bi-activity text-primary', glowClass: 'primary-glow' },
  { label: 'Total Volume (lbs)', value: totalVolume.value, icon: 'bi bi-speedometer2 text-success', glowClass: 'success-glow' },
  { label: 'Total Time (hrs)', value: totalDuration.value, icon: 'bi bi-clock text-info', glowClass: 'info-glow' },
  { label: 'Avg Intensity', value: averageIntensity.value, icon: 'bi bi-fire text-warning', glowClass: 'warning-glow' },
])

onMounted(async () => {
  await loadProgressData()
  await loadWorkoutLogs()
})

const loadProgressData = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    if (user) progressData.value = await WorkoutService.getProgressSummaries(user.uid)
  } catch (err) {
    console.error('Error loading progress data:', err)
  } finally {
    loading.value = false
  }
}

const loadWorkoutLogs = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    if (user) workoutLogs.value = await WorkoutService.getUserWorkoutLogs(user.uid, 20)
  } catch (err) {
    console.error('Error loading workout logs:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (d) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
/* 🌈 Glassmorphism aesthetic */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

/* 🌿 Gradient text for title */
.gradient-text {
  background: linear-gradient(90deg, #007bff, #00c9a7, #ffd43b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 📊 Bars */
.bar {
  width: 80%;
  background: linear-gradient(180deg, #74c0fc, #228be6);
  transition: height 0.4s ease, transform 0.2s ease;
}
.bar:hover {
  transform: scaleY(1.05);
  background: linear-gradient(180deg, #4dabf7, #1c7ed6);
}

/* ✨ Recent activity */
.recent-item {
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}
.recent-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-3px);
}

/* 💫 Stat glow accents */
.glow {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  border-radius: 20px;
  filter: blur(35px);
  z-index: -1;
}
.primary-glow {
  background: radial-gradient(circle, #91c9ff 0%, transparent 70%);
}
.success-glow {
  background: radial-gradient(circle, #9ef0c4 0%, transparent 70%);
}
.info-glow {
  background: radial-gradient(circle, #aee5ff 0%, transparent 70%);
}
.warning-glow {
  background: radial-gradient(circle, #ffe49b 0%, transparent 70%);
}
</style>
