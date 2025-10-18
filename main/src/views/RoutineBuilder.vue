<template>
  <div class="routine-builder">
    <div class="row mb-4">
      <div class="col-12">
        <h2><i class="bi bi-list-ul me-2"></i>Routine Builder</h2>
        <p class="text-muted">Create and manage your custom workout routines</p>
      </div>
    </div>

    <!-- create or edit routine -->
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

              <!-- exercises user is adding -->
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
                  <ExerciseForm 
                    v-for="(exercise, index) in routineForm.exercises" 
                    :key="index"
                    :exercise-name="getExerciseName(exercise.exerciseId)"
                    :exercise-description="getExerciseDescription(exercise.exerciseId)"
                    v-model:sets="exercise.sets"
                    v-model:reps="exercise.reps"
                    v-model:rest-seconds="exercise.restSeconds"
                    v-model:notes="exercise.notes"
                    @remove="removeExercise(index)"
                  />
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

      <!-- saved routines -->
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

    <!-- popup to pick exercises -->
    <ExerciseSelector 
      :show="showExerciseSelector"
      :exercises="exercises"
      @close="showExerciseSelector = false"
      @select="addExerciseToRoutine"
    />

    <!-- Toast Notification -->
    <div v-if="notification.show" class="notification-container">
      <div class="notification" :class="`notification-${notification.type}`">
        <i class="bi" :class="notification.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
        <span>{{ notification.message }}</span>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirmation.show" class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-warning me-2"></i>
              Confirm Delete
            </h5>
            <button type="button" class="btn-close" @click="cancelDeleteRoutine"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">Are you sure you want to delete this routine?</p>
            <div class="alert alert-warning mb-0">
              <strong>{{ deleteConfirmation.routineTitle }}</strong>
            </div>
            <p class="text-muted mt-2 mb-0">
              <small>This action cannot be undone.</small>
            </p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="cancelDeleteRoutine">
              <i class="bi bi-x-circle me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDeleteRoutine">
              <i class="bi bi-trash me-1"></i>Delete Routine
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseSelector from '../components/ExerciseSelector.vue'

const loading = ref(false)
const saving = ref(false)
const routines = ref([])
const exercises = ref([])
const showExerciseSelector = ref(false)
const editingRoutine = ref(null)

// Toast notification
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

// Delete confirmation state
const deleteConfirmation = ref({
  show: false,
  routineId: null,
  routineTitle: ''
})

const routineForm = ref({
  title: '',
  goal: 'general_fitness',
  estimatedTimeMinutes: 45,
  intendedIntensity: 'medium',
  exercises: []
})

onMounted(async () => {
  await loadRoutines()
  await loadExercises()
  loadDraftRoutine()
})

// Watch for changes in routine form and save draft state
watch(routineForm, () => {
  saveDraftRoutine()
}, { deep: true })

// Load draft routine state from localStorage
const loadDraftRoutine = () => {
  try {
    const draftKey = 'draftRoutineState'
    const exerciseKey = 'draftRoutineExercises'
    
    // Load draft routine form state
    const draftState = JSON.parse(localStorage.getItem(draftKey) || 'null')
    if (draftState) {
      routineForm.value = { ...routineForm.value, ...draftState }
    }
    
    // Load draft exercises from Exercise Library
    const draftExercises = JSON.parse(localStorage.getItem(exerciseKey) || '[]')
    if (draftExercises.length > 0) {
      draftExercises.forEach(draft => {
        // Check if exercise already exists to avoid duplicates
        const exists = routineForm.value.exercises.some(ex => ex.exerciseId === draft.exerciseId)
        if (!exists) {
          routineForm.value.exercises.push({
            exerciseId: draft.exerciseId,
            sets: draft.sets || 3,
            reps: draft.reps || '8-12',
            restSeconds: draft.restSeconds || 60,
            notes: draft.notes || ''
          })
        }
      })
      
      // Clear the exercise library localStorage after loading
      localStorage.removeItem(exerciseKey)
      
      showNotification(`${draftExercises.length} exercise(s) added from Exercise Library!`, 'success')
    }
    
    // Show notification if there's a draft routine
    if (draftState || draftExercises.length > 0) {
      // Silent loading - no notification needed
    }
  } catch (error) {
    console.error('Error loading draft routine:', error)
  }
}

// Save draft routine state to localStorage
const saveDraftRoutine = () => {
  try {
    const draftKey = 'draftRoutineState'
    const draftState = {
      title: routineForm.value.title,
      goal: routineForm.value.goal,
      estimatedTimeMinutes: routineForm.value.estimatedTimeMinutes,
      intendedIntensity: routineForm.value.intendedIntensity,
      exercises: routineForm.value.exercises
    }
    localStorage.setItem(draftKey, JSON.stringify(draftState))
  } catch (error) {
    console.error('Error saving draft routine:', error)
  }
}

// Clear draft routine state
const clearDraftRoutine = () => {
  try {
    localStorage.removeItem('draftRoutineState')
    localStorage.removeItem('draftRoutineExercises')
  } catch (error) {
    console.error('Error clearing draft routine:', error)
  }
}

// Toast notification function
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const loadRoutines = async () => {
  loading.value = true
  try {
    routines.value = await WorkoutService.getUserRoutines()
  } catch (error) {
    console.error('Error loading routines:', error)
    showNotification('Failed to load routines. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

const loadExercises = async () => {
  try {
    exercises.value = await WorkoutService.getExercises()
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
  saveDraftRoutine() // Save draft state
}

const removeExercise = (index) => {
  routineForm.value.exercises.splice(index, 1)
  saveDraftRoutine() // Save draft state
}

const saveRoutine = async () => {
  saving.value = true
  try {
    if (editingRoutine.value) {
      await WorkoutService.updateRoutine({
        routineId: editingRoutine.value.routineId,
        ...routineForm.value
      })
      showNotification('Routine updated successfully!', 'success')
    } else {
      await WorkoutService.createRoutine(routineForm.value)
      showNotification('Routine created successfully!', 'success')
    }
    
    await loadRoutines()
    resetForm()
    clearDraftRoutine() // Clear draft state after successful save
  } catch (error) {
    console.error('Error saving routine:', error)
    showNotification('Failed to save routine. Please try again.', 'error')
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
  const routine = routines.value.find(r => r.routineId === routineId)
  if (routine) {
    deleteConfirmation.value = {
      show: true,
      routineId: routineId,
      routineTitle: routine.title
    }
  }
}

const confirmDeleteRoutine = async () => {
  try {
    await WorkoutService.deleteRoutine(deleteConfirmation.value.routineId)
    showNotification('Routine deleted successfully!', 'success')
    await loadRoutines()
  } catch (error) {
    console.error('Error deleting routine:', error)
    showNotification('Failed to delete routine. Please try again.', 'error')
  } finally {
    deleteConfirmation.value.show = false
  }
}

const cancelDeleteRoutine = () => {
  deleteConfirmation.value.show = false
}

const cancelEdit = () => {
  editingRoutine.value = null
  resetForm()
  clearDraftRoutine() // Clear draft state when canceling
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



