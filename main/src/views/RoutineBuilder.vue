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

              <!-- exercises you're adding -->
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

    <PopUpModal ref="modalRef" message="You need to be signed in to create or edit routines"/>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseSelector from '../components/ExerciseSelector.vue'
import AuthService from '@/services/authService.js'
import PopUpModal from '@/components/PopUpModal.vue'

const loading = ref(false)
const saving = ref(false)
const routines = ref([])
const exercises = ref([])
const showExerciseSelector = ref(false)
const editingRoutine = ref(null)

const user = ref(null)
const modalRef = ref(null) 

const routineForm = ref({
  title: '',
  goal: 'general_fitness',
  estimatedTimeMinutes: 45,
  intendedIntensity: 'medium',
  exercises: []
})


onMounted(() => {
  AuthService.onAuthStateChanged(async (currentUser) => {
    user.value = currentUser
    if (user.value) {
      await loadRoutines()
      await loadExercises()
    } else {
      console.log("user not login")
      modalRef.value.show() 
  }
  })
})

const loadRoutines = async () => {
  loading.value = true
  try {
    routines.value = await WorkoutService.getUserRoutines()
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
}

const removeExercise = (index) => {
  routineForm.value.exercises.splice(index, 1)
}

const saveRoutine = async () => {
  saving.value = true
  try {
    if (editingRoutine.value) {
      await WorkoutService.updateRoutine({
        routineId: editingRoutine.value.routineId,
        ...routineForm.value
      })
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



