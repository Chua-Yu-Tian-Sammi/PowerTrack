<template>
  <div class="exercise-library">
    <div class="row mb-4">
      <div class="col-lg-8">
        <h2><i class="bi bi-book me-2"></i>Exercise Library</h2>
        <p class="text-muted">Browse and explore exercises for your workouts</p>
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

    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
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
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading exercises...</p>
    </div>

    <!-- Exercises Grid -->
    <div v-else class="row">
      <div v-for="exercise in filteredExercises" :key="exercise.exerciseId" class="col-lg-4 col-md-6 mb-4">
        <ExerciseCard 
          :exercise="exercise"
          @view-details="viewExerciseDetails"
          @add-to-routine="addToRoutine"
        />
      </div>
    </div>

    <!-- No Results -->
    <div v-if="!loading && filteredExercises.length === 0" class="text-center py-5">
      <i class="bi bi-search display-1 text-muted"></i>
      <h4 class="mt-3">No exercises found</h4>
      <p class="text-muted">Try adjusting your filters or search terms</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseCard from '../components/ExerciseCard.vue'

const loading = ref(false)
const exercises = ref([])
const searchQuery = ref('')

const filters = ref({
  muscle: '',
  equipment: '',
  intensity: '',
  difficulty: ''
})

const filteredExercises = computed(() => {
  let filtered = exercises.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(exercise => 
      exercise.name.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query) ||
      exercise.muscle.some(m => m.toLowerCase().includes(query))
    )
  }

  // Other filters
  if (filters.value.muscle) {
    filtered = filtered.filter(exercise => 
      exercise.muscle.includes(filters.value.muscle)
    )
  }

  if (filters.value.equipment) {
    filtered = filtered.filter(exercise => 
      exercise.equipment.includes(filters.value.equipment)
    )
  }

  if (filters.value.intensity) {
    filtered = filtered.filter(exercise => 
      exercise.intensity === filters.value.intensity
    )
  }

  if (filters.value.difficulty) {
    filtered = filtered.filter(exercise => 
      exercise.difficulty === filters.value.difficulty
    )
  }

  return filtered
})

onMounted(async () => {
  await loadExercises()
})

const loadExercises = async () => {
  loading.value = true
  try {
    exercises.value = await WorkoutService.getExercises()
  } catch (error) {
    console.error('Error loading exercises:', error)
    alert('Failed to load exercises. Please try again.')
  } finally {
    loading.value = false
  }
}




const viewExerciseDetails = (exercise) => {
  
  alert(`Viewing details for: ${exercise.name}\n\nDescription: ${exercise.description}\n\nInstructions:\n${exercise.instructions.join('\n')}`)
}

const addToRoutine = (exercise) => {
  
  alert(`Added ${exercise.name} to your routine!`)
}

</script>



