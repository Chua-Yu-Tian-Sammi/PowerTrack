<template>
  <div class="routine-builder">
    <div class="row mb-4">
      <div class="col-12">
        <h2><i class="bi bi-list-ul me-2"></i>Routine Builder</h2>
        <p class="text-muted">Create and manage your custom workout routines</p>
      </div>
    </div>

    <!-- Routine Form -->
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h4>{{ editingRoutine ? 'Edit Routine' : 'Create New Routine' }}</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveRoutine">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="title" class="form-label">Routine Title</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="title" 
                    v-model="routineForm.title"
                    required
                    placeholder="e.g., Upper Body Strength"
                  >
                </div>
                <div class="col-md-6">
                  <label for="goal" class="form-label">Goal</label>
                  <select class="form-select" id="goal" v-model="routineForm.goal" required>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="estimatedTime" class="form-label">Estimated Time (min)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="estimatedTime" 
                    v-model="routineForm.estimatedTimeMinutes"
                    min="10" 
                    max="180" 
                    required
                  >
                </div>
                <div class="col-md-4">
                  <label for="intensity" class="form-label">Intensity</label>
                  <select class="form-select" id="intensity" v-model="routineForm.intendedIntensity" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Total Exercises</label>
                  <div class="form-control-plaintext">{{ routineForm.exercises.length }}</div>
                </div>
              </div>

              <!-- Exercise List -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5>Exercises</h5>
                  <button type="button" class="btn btn-outline-primary" @click="showExerciseSelector = true">
                    <i class="bi bi-plus me-1"></i>Add Exercise
                  </button>
                </div>

                <div v-if="routineForm.exercises.length === 0" class="text-center py-4 text-muted">
                  <i class="bi bi-list-ul display-4"></i>
                  <p class="mt-2">No exercises added yet. Click "Add Exercise" to get started.</p>
                </div>

                <div v-else>
                  <div v-for="(exercise, index) in routineForm.exercises" :key="index" class="card mb-3">
                    <div class="card-body">
                      <div class="row align-items-center">
                        <div class="col-md-4">
                          <h6>{{ getExerciseName(exercise.exerciseId) }}</h6>
                          <small class="text-muted">{{ getExerciseDescription(exercise.exerciseId) }}</small>
                        </div>
                        <div class="col-md-2">
                          <label class="form-label">Sets</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm" 
                            v-model.number="exercise.sets"
                            min="1" 
                            max="20"
                          >
                        </div>
                        <div class="col-md-2">
                          <label class="form-label">Reps</label>
                          <input 
                            type="text" 
                            class="form-control form-control-sm" 
                            v-model="exercise.reps"
                            placeholder="8-12"
                          >
                        </div>
                        <div class="col-md-2">
                          <label class="form-label">Rest (sec)</label>
                          <input 
                            type="number" 
                            class="form-control form-control-sm" 
                            v-model.number="exercise.restSeconds"
                            min="0" 
                            max="300"
                          >
                        </div>
                        <div class="col-md-2">
                          <button 
                            type="button" 
                            class="btn btn-outline-danger btn-sm"
                            @click="removeExercise(index)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="mt-2">
                        <label class="form-label">Notes (optional)</label>
                        <input 
                          type="text" 
                          class="form-control form-control-sm" 
                          v-model="exercise.notes"
                          placeholder="e.g., Last set AMRAP"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving || routineForm.exercises.length === 0">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ saving ? 'Saving...' : (editingRoutine ? 'Update Routine' : 'Create Routine') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Routine List -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5>My Routines</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="routines.length === 0" class="text-center py-3 text-muted">
              <i class="bi bi-list-ul display-4"></i>
              <p class="mt-2">No routines yet</p>
            </div>
            <div v-else>
              <div v-for="routine in routines" :key="routine.routineId" class="routine-item mb-3">
                <div class="card">
                  <div class="card-body">
                    <h6>{{ routine.title }}</h6>
                    <p class="text-muted mb-2">{{ routine.exercises.length }} exercises • {{ routine.estimatedTimeMinutes }} min</p>
                    <div class="d-flex justify-content-between">
                      <span class="badge bg-primary">{{ routine.goal.replace('_', ' ') }}</span>
                      <span class="badge bg-secondary">{{ routine.intendedIntensity }}</span>
                    </div>
                    <div class="mt-2">
                      <button class="btn btn-outline-primary btn-sm me-1" @click="editRoutine(routine)">
                        <i class="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button class="btn btn-outline-danger btn-sm" @click="deleteRoutine(routine.routineId)">
                        <i class="bi bi-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercise Selector Modal -->
    <div v-if="showExerciseSelector" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Exercise</h5>
            <button type="button" class="btn-close" @click="showExerciseSelector = false"></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search exercises..." 
                v-model="exerciseSearch"
              >
              <button class="btn btn-outline-secondary" type="button">
                <i class="bi bi-search"></i>
              </button>
            </div>
            <div class="row">
              <div v-for="exercise in filteredExercises" :key="exercise.exerciseId" class="col-md-6 mb-3">
                <div class="card exercise-card" @click="addExerciseToRoutine(exercise)">
                  <div class="card-body">
                    <h6>{{ exercise.name }}</h6>
                    <p class="text-muted small">{{ exercise.description }}</p>
                    <div class="d-flex justify-content-between">
                      <span class="badge bg-secondary">{{ exercise.difficulty }}</span>
                      <span class="badge bg-info">{{ exercise.intensity }}</span>
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

const loading = ref(false)
const saving = ref(false)
const routines = ref([])
const exercises = ref([])
const showExerciseSelector = ref(false)
const exerciseSearch = ref('')
const editingRoutine = ref(null)

const routineForm = ref({
  title: '',
  goal: 'general_fitness',
  estimatedTimeMinutes: 45,
  intendedIntensity: 'medium',
  exercises: []
})

const filteredExercises = computed(() => {
  if (!exerciseSearch.value) return exercises.value
  
  const search = exerciseSearch.value.toLowerCase()
  return exercises.value.filter(exercise => 
    exercise.name.toLowerCase().includes(search) ||
    exercise.description.toLowerCase().includes(search) ||
    exercise.muscle.some(m => m.toLowerCase().includes(search))
  )
})

onMounted(async () => {
  await loadRoutines()
  await loadExercises()
})

const loadRoutines = async () => {
  loading.value = true
  try {
    routines.value = await WorkoutService.getUserRoutines()
    console.log('Loaded routines:', routines.value.length)
  } catch (error) {
    console.error('Error loading routines:', error)
    alert('Failed to load routines. Please try again.')
  } finally {
    loading.value = false
  }
}

const loadExercises = async () => {
  try {
    exercises.value = await WorkoutService.getExercises()
    console.log('Loaded exercises:', exercises.value.length)
  } catch (error) {
    console.error('Error loading exercises:', error)
  }
}

const getExerciseName = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.name : 'Unknown Exercise'
}

const getExerciseDescription = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.description : ''
}

const addExerciseToRoutine = (exercise) => {
  routineForm.value.exercises.push({
    exerciseId: exercise.exerciseId,
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    notes: ''
  })
  showExerciseSelector.value = false
  exerciseSearch.value = ''
}

const removeExercise = (index) => {
  routineForm.value.exercises.splice(index, 1)
}

const saveRoutine = async () => {
  saving.value = true
  try {
    if (editingRoutine.value) {
      await WorkoutService.updateRoutine(editingRoutine.value.routineId, routineForm.value)
      alert('Routine updated successfully!')
    } else {
      await WorkoutService.createRoutine(routineForm.value)
      alert('Routine created successfully!')
    }
    
    await loadRoutines()
    resetForm()
  } catch (error) {
    console.error('Error saving routine:', error)
    alert('Failed to save routine. Please try again.')
  } finally {
    saving.value = false
  }
}

const editRoutine = (routine) => {
  editingRoutine.value = routine
  routineForm.value = {
    title: routine.title,
    goal: routine.goal,
    estimatedTimeMinutes: routine.estimatedTimeMinutes,
    intendedIntensity: routine.intendedIntensity,
    exercises: routine.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets,
      reps: ex.reps,
      restSeconds: ex.restSeconds,
      notes: ex.notes || ''
    }))
  }
}

const deleteRoutine = async (routineId) => {
  if (!confirm('Are you sure you want to delete this routine?')) return
  
  try {
    await WorkoutService.deleteRoutine(routineId)
    alert('Routine deleted successfully!')
    await loadRoutines()
  } catch (error) {
    console.error('Error deleting routine:', error)
    alert('Failed to delete routine. Please try again.')
  }
}

const cancelEdit = () => {
  editingRoutine.value = null
  resetForm()
}

const resetForm = () => {
  routineForm.value = {
    title: '',
    goal: 'general_fitness',
    estimatedTimeMinutes: 45,
    intendedIntensity: 'medium',
    exercises: []
  }
}
</script>

<style scoped>
.routine-item .card {
  transition: transform 0.2s;
}

.routine-item .card:hover {
  transform: translateY(-2px);
}

.exercise-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.exercise-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal {
  background-color: rgba(0,0,0,0.5);
}
</style>

