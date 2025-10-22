<template>
  <div class="exercise-library">
    <div class="row align-items-center mb-4">
      <div class="col-lg-8 mb-3 mb-lg-0">
        <h2 class="mb-1"><i class="bi bi-book me-2"></i>Exercise Library</h2>
        <p class="text-muted mb-0">Browse and explore exercises for your workouts</p>
      </div>
      <div class="col-lg-4">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search exercises..." 
            v-model="searchQuery"
            @input="filterExercises"
          >
          <button class="btn btn-outline-secondary" type="button">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- filter options -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body p-4">
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Muscle Group</label>
                <select class="form-select" v-model="filters.muscle" @change="filterExercises">
                  <option value="">All</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="legs">Legs</option>
                  <option value="core">Core</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Equipment</label>
                <select class="form-select" v-model="filters.equipment" @change="filterExercises">
                  <option value="">All</option>
                  <option value="bodyweight">Bodyweight</option>
                  <option value="dumbbells">Dumbbells</option>
                  <option value="barbell">Barbell</option>
                  <option value="bench">Bench</option>
                  <option value="pullup_bar">Pull-up Bar</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Intensity</label>
                <select class="form-select" v-model="filters.intensity" @change="filterExercises">
                  <option v-for="intensity in INTENSITIES" :key="intensity.value" :value="intensity.value">
                    {{ intensity.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Difficulty</label>
                <select class="form-select" v-model="filters.difficulty" @change="filterExercises">
                  <option value="">All</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- loading spinner -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading exercises...</p>
    </div>

    

    <!-- exercise cards -->
    <div v-if="!loading" class="row g-4">
      <div v-for="exercise in filteredExercises" :key="exercise.exerciseId" class="col-lg-4 col-md-6">
        <ExerciseCard 
          :exercise="exercise"
          @addToRoutine="addToRoutine"
        />
      </div>
    </div>

    <!-- nothing found -->
    <div v-if="!loading && filteredExercises.length === 0" class="text-center py-5">
      <i class="bi bi-search display-1 text-muted"></i>
      <h4 class="mt-3">No exercises found</h4>
      <p class="text-muted">Try adjusting your filters or search terms</p>
    </div>
  </div>

  <!-- Toast Notification -->
  <div v-if="notification.show" class="notification-container">
    <div class="notification" :class="`notification-${notification.type}`">
      <i class="bi" :class="notification.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseCard from '../components/ExerciseCard.vue'

const loading = ref(false)
const exercises = ref([])
const searchQuery = ref('')
// no additional loading state needed for images; placeholders are synchronous

// Toast notification
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const INTENSITIES = [
  { value: '',        label: 'All' },
  { value: 'low',     label: 'Low 🔥 ' },
  { value: 'medium',  label: 'Medium 🔥🔥' },
  { value: 'high',    label: 'High 🔥🔥🔥' }
]

const filters = reactive({
  muscle: '',
  equipment: '',
  intensity: '',
  difficulty: ''
})

const filteredExercises = computed(() => {
  let filtered = exercises.value

  // filter by search text
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(exercise => 
      exercise.name.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query) ||
      exercise.muscle.some(m => m.toLowerCase().includes(query))
    )
  }

  // apply other filters
  if (filters.muscle) {
    filtered = filtered.filter(exercise => 
      exercise.muscle.includes(filters.muscle)
    )
  }

  if (filters.equipment) {
    filtered = filtered.filter(exercise => 
      exercise.equipment.includes(filters.equipment)
    )
  }

  if (filters.intensity) {
    filtered = filtered.filter(exercise => 
      exercise.intensity === filters.intensity
    )
  }

  if (filters.difficulty) {
    filtered = filtered.filter(exercise => 
      exercise.difficulty === filters.difficulty
    )
  }

  return filtered
})

onMounted(async () => {
  await loadExercises()
})

// Toast notification function
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const loadExercises = async () => {
  loading.value = true
  try {
    const fetchedExercises = await WorkoutService.getExercises()
    exercises.value = fetchedExercises
  } catch (error) {
    console.error('Error loading exercises:', error)
  } finally {
    loading.value = false
  }
}

// No async image loading needed




const addToRoutine = (exercise) => {
  try {
    const key = 'draftRoutineExercises'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const exists = existing.some(e => e.exerciseId === exercise.exerciseId)
    if (!exists) {
      const drafted = {
        exerciseId: exercise.exerciseId,
        sets: 3,
        reps: '8-12',
        restSeconds: 60
      }
      existing.push(drafted)
      localStorage.setItem(key, JSON.stringify(existing))
      showNotification(`${exercise.name} added to routine!`, 'success')
    } else {
      showNotification(`${exercise.name} is already in your routine`, 'error')
    }
  } catch (error) {
    console.error('Error adding exercise to draft routine:', error)
    showNotification('Failed to add exercise to routine', 'error')
  }
}


</script>



