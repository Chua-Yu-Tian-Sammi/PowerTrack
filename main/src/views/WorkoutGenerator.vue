<template>
  <div class="workout-generator">
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h3><i class="bi bi-lightning-charge me-2"></i>Generate Your Workout</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="generateWorkout">
              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="timeMin" class="form-label">Duration (minutes)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="timeMin" 
                    v-model="workoutForm.timeMin"
                    min="10" 
                    max="120" 
                    required
                  >
                </div>
                <div class="col-md-4">
                  <label for="intensity" class="form-label">Intensity</label>
                  <select class="form-select" id="intensity" v-model="workoutForm.intensity" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="goal" class="form-label">Goal</label>
                  <select class="form-select" id="goal" v-model="workoutForm.goal" required>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
              </div>
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="muscleGroups" class="form-label">Target Muscle Groups (optional)</label>
                  <select class="form-select" id="muscleGroups" v-model="workoutForm.muscleGroups" multiple>
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs</option>
                    <option value="core">Core</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="equipment" class="form-label">Available Equipment (optional)</label>
                  <select class="form-select" id="equipment" v-model="workoutForm.equipment" multiple>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="dumbbells">Dumbbells</option>
                    <option value="barbell">Barbell</option>
                    <option value="bench">Bench</option>
                    <option value="pullup_bar">Pull-up Bar</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Generating...' : 'Generate Workout' }}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5>Quick Stats</h5>
          </div>
          <div class="card-body">
            <div v-if="userProfile">
              <p><strong>Experience:</strong> {{ userProfile.experienceLevel }}</p>
              <p><strong>Goal:</strong> {{ userProfile.goal }}</p>
              <p><strong>Preferred Time:</strong> {{ userProfile.preferredTimeMin }} min</p>
            </div>
            <div v-else>
              <p class="text-muted">Sign in to see your stats</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Workout Results -->
    <div v-if="generatedWorkout" class="mt-4">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4>{{ generatedWorkout.routine.title }}</h4>
          <div>
            <button class="btn btn-success me-2" @click="saveRoutine">
              <i class="bi bi-bookmark me-1"></i>Save Routine
            </button>
            <button class="btn btn-outline-primary" @click="startWorkout">
              <i class="bi bi-play me-1"></i>Start Workout
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-3">
              <strong>Duration:</strong> {{ generatedWorkout.routine.totalTimeMin }} minutes
            </div>
            <div class="col-md-3">
              <strong>Intensity:</strong> {{ generatedWorkout.routine.intensity }}
            </div>
            <div class="col-md-3">
              <strong>Exercises:</strong> {{ generatedWorkout.routine.items.length }}
            </div>
            <div class="col-md-3">
              <strong>Goal:</strong> {{ generatedWorkout.routine.goal }}
            </div>
          </div>
          
          <div class="exercises-list">
            <h5>Exercises:</h5>
            <WorkoutStats 
              v-for="(item, index) in generatedWorkout.routine.items" 
              :key="index"
              :exercise-name="getExerciseName(item.exerciseId)"
              :exercise-description="getExerciseDescription(item.exerciseId)"
              :sets="item.sets"
              :reps="item.reps"
              :rest-time-sec="item.restTimeSec"
              :notes="item.notes"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'
import WorkoutStats from '../components/WorkoutStats.vue'

const router = useRouter()
const loading = ref(false)
const userProfile = ref(null)
const generatedWorkout = ref(null)

const workoutForm = ref({
  timeMin: 30,
  intensity: 'medium',
  goal: 'general_fitness',
  muscleGroups: [],
  equipment: []
})

onMounted(async () => {
  userProfile.value = await AuthService.getCurrentUserProfile()
})

const generateWorkout = async () => {
  loading.value = true
  try {
    const result = await WorkoutService.generateWorkout(workoutForm.value)
    generatedWorkout.value = result
  } catch (error) {
    console.error('Error generating workout:', error)
    alert('Failed to generate workout. Please try again.')
  } finally {
    loading.value = false
  }
}

const getExerciseName = (exerciseId) => {
  if (!generatedWorkout.value) return 'Unknown'
  const exercise = generatedWorkout.value.exercises.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.name : 'Unknown Exercise'
}

const getExerciseDescription = (exerciseId) => {
  if (!generatedWorkout.value) return ''
  const exercise = generatedWorkout.value.exercises.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.description : ''
}

const saveRoutine = async () => {
  if (!generatedWorkout.value) return
  
  try {
    const routineData = {
      title: generatedWorkout.value.routine.title,
      goal: generatedWorkout.value.routine.goal,
      estimatedTimeMinutes: generatedWorkout.value.routine.totalTimeMin,
      intendedIntensity: generatedWorkout.value.routine.intensity,
      exercises: generatedWorkout.value.routine.items.map(item => ({
        exerciseId: item.exerciseId,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restTimeSec,
        notes: item.notes || ''
      }))
    }
    
    // eslint-disable-next-line no-unused-vars
    const routine = await WorkoutService.createRoutine(routineData)
    alert('Routine saved successfully!')
  } catch (error) {
    console.error('Error saving routine:', error)
    alert('Failed to save routine. Please try again.')
  }
}

const startWorkout = () => {
  if (!generatedWorkout.value) return
  
  
  router.push({
    name: 'WorkoutTracking',
    query: {
      workoutData: JSON.stringify(generatedWorkout.value.routine),
      sourceType: 'generated',
      sourceId: generatedWorkout.value.genWorkoutId
    }
  })
}
</script>


