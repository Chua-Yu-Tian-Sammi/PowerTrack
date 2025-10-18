<template>
  <div class="workout-tracking">
    <!-- No workout available - prompt to generate -->
    <div v-if="!workoutData" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body text-center py-5">
            <i class="bi bi-lightning-charge display-1 text-muted mb-4"></i>
            <h3 class="mb-3">No Workout Available</h3>
            <p class="text-muted mb-4">You need to generate a workout first before you can start tracking your session.</p>
            <router-link to="/workout" class="btn btn-primary btn-lg">
              <i class="bi bi-lightning-charge me-2"></i>Generate Workout
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Workout available - show tracking interface -->
    <div v-else>
      <div class="row mb-4">
        <div class="col-12">
          <h2><i class="bi bi-stopwatch me-2"></i>Workout in Progress</h2>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4 class="mb-1">{{ workoutName }}</h4>
              <p class="text-muted mb-0">{{ workoutData?.exercises?.length || 0 }} exercises • {{ workoutData?.estimatedTimeMinutes || 45 }} min</p>
            </div>
            <div class="text-end">
              <div class="h3 mb-1" :class="isActive ? 'text-success' : 'text-muted'">
                {{ formatTime(elapsedTime) }}
              </div>
              <small class="text-muted">Elapsed Time</small>
            </div>
          </div>
        </div>
      </div>

    <!-- start/stop buttons -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center">
            <div v-if="!isActive" class="mb-3">
              <h5>Ready to start your workout?</h5>
              <p class="text-muted">Click "Start Workout" when you're ready to begin tracking your session.</p>
            </div>
            <div v-else class="mb-3">
              <h5 class="text-success">Workout in Progress!</h5>
              <p class="text-muted">Keep up the great work! Click "End Workout" when you're finished.</p>
            </div>
            
            <div class="d-flex justify-content-center gap-3">
              <button 
                v-if="!isActive" 
                class="btn btn-success btn-lg" 
                @click="startWorkout"
                :disabled="starting"
              >
                <span v-if="starting" class="spinner-border spinner-border-sm me-2"></span>
                <i class="bi bi-play-fill me-2"></i>Start Workout
              </button>
              
              <button 
                v-if="isActive" 
                class="btn btn-danger btn-lg" 
                @click="showEndWorkoutModal = true"
              >
                <i class="bi bi-stop-fill me-2"></i>End Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- what you're doing today -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Workout Exercises</h5>
          </div>
          <div class="card-body">
            <div v-if="!workoutData || !workoutData.exercises || workoutData.exercises.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-list-ul display-4"></i>
              <p class="mt-2">No exercises in this workout</p>
            </div>
            <div v-else>
              <div v-for="(exercise, index) in sortedExercises" :key="index" class="exercise-item mb-3">
                <div class="card border-0 shadow-sm">
                  <div class="card-body p-3">
                    <div class="row align-items-center">
                      <div class="col-12 col-md-6 mb-3 mb-md-0">
                        <div class="d-flex align-items-center mb-2">
                          <span class="badge bg-primary me-2">{{ index + 1 }}</span>
                          <h6 class="mb-0 text-truncate">{{ getExerciseName(exercise.exerciseId) }}</h6>
                        </div>
                        <p class="text-muted mb-2 text-break">{{ getExerciseDescription(exercise.exerciseId) }}</p>
                        <div class="d-flex gap-2">
                          <span class="badge bg-secondary text-capitalize">{{ getExerciseIntensity(exercise.exerciseId) }}</span>
                          <span class="badge bg-info text-capitalize">{{ getExerciseDifficulty(exercise.exerciseId) }}</span>
                        </div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div class="row text-center g-2">
                          <div class="col-3">
                            <div class="fw-bold text-primary">{{ exercise.sets }}</div>
                            <small class="text-muted">Sets</small>
                          </div>
                          <div class="col-3">
                            <div class="fw-bold text-primary">{{ exercise.reps }}</div>
                            <small class="text-muted">Reps</small>
                          </div>
                          <div class="col-3">
                            <div class="fw-bold text-primary">{{ exercise.restSeconds }}s</div>
                            <small class="text-muted">Rest</small>
                          </div>
                          <div class="col-3">
                            <div class="form-check">
                              <input 
                                class="form-check-input" 
                                type="checkbox" 
                                :id="`exercise-${index}`"
                                v-model="exercise.completed"
                              >
                              <label class="form-check-label" :for="`exercise-${index}`">
                                Done
                              </label>
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
    </div>

    <!-- finish workout popup -->
    <div v-if="showEndWorkoutModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">End Workout</h5>
            <button type="button" class="btn-close" @click="showEndWorkoutModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="endWorkout">
              <div class="mb-3">
                <label for="perceivedIntensity" class="form-label">How intense was this workout?</label>
                <select class="form-select" id="perceivedIntensity" v-model="endWorkoutForm.perceivedIntensity" required>
                  <option value="low">Low - Easy, light effort</option>
                  <option value="medium">Medium - Moderate effort</option>
                  <option value="high">High - Hard, challenging effort</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label for="mood" class="form-label">How do you feel after this workout?</label>
                <select class="form-select" id="mood" v-model="endWorkoutForm.mood">
                  <option value="bad">Bad - Felt terrible</option>
                  <option value="ok">OK - Felt alright</option>
                  <option value="good">Good - Felt great</option>
                  <option value="great">Great - Felt amazing</option>
                </select>
              </div>
              
              
              
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="saveAsRoutine" 
                    v-model="endWorkoutForm.saveAsRoutine"
                  >
                  <label class="form-check-label" for="saveAsRoutine">
                    Save this workout as a routine
                  </label>
                </div>
              </div>
              
              <div v-if="endWorkoutForm.saveAsRoutine" class="mb-3">
                <label for="routineTitle" class="form-label">Routine Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="routineTitle" 
                  v-model="endWorkoutForm.routineTitle"
                  placeholder="e.g., My Upper Body Workout"
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showEndWorkoutModal = false">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="endWorkout"
              :disabled="ending"
            >
              <span v-if="ending" class="spinner-border spinner-border-sm me-2"></span>
              End Workout
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { WorkoutService } from '../services/workoutService.js'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  workoutData: {
    type: Object,
    default: null
  },
  sourceType: {
    type: String,
    default: null
  },
  sourceId: {
    type: String,
    default: null
  }
})

const isActive = ref(false)
const starting = ref(false)
const ending = ref(false)
const sessionId = ref(null)
const startTime = ref(null)
const elapsedTime = ref(0)
const showEndWorkoutModal = ref(false)
const exercises = ref([])

// grab workout from props, url, or localStorage
const workoutData = computed(() => {
  // First check props
  if (props.workoutData) return props.workoutData
  
  // Then check URL query
  if (route.query.workoutData) {
    try {
      return JSON.parse(route.query.workoutData)
    } catch (error) {
      console.error('Error parsing workout data:', error)
    }
  }
  
  // Finally check localStorage for draft workout
  try {
    const draftWorkout = localStorage.getItem('draftGeneratedWorkout')
    if (draftWorkout) {
      const parsed = JSON.parse(draftWorkout)
      if (parsed && parsed.routine) {
        return {
          title: parsed.routine.title,
          goal: parsed.routine.goal,
          estimatedTimeMinutes: parsed.routine.totalTimeMin,
          intendedIntensity: parsed.routine.intensity,
          exercises: parsed.routine.items.map(item => ({
            exerciseId: item.exerciseId,
            sets: item.sets,
            reps: item.reps,
            restSeconds: item.restTimeSec,
            completed: false
          }))
        }
      }
    }
  } catch (error) {
    console.error('Error loading draft workout:', error)
  }
  
  return null
})

const sourceType = computed(() => {
  return props.sourceType || route.query.sourceType || 'custom'
})

const sourceId = computed(() => {
  return props.sourceId || route.query.sourceId || null
})

// Computed property for sorted exercises (most intensive/difficult first)
const sortedExercises = computed(() => {
  if (!workoutData.value || !workoutData.value.exercises) return []
  
  return [...workoutData.value.exercises].sort((a, b) => {
    // Get exercise details for intensity and difficulty comparison
    const exerciseA = exercises.value.find(ex => ex.exerciseId === a.exerciseId)
    const exerciseB = exercises.value.find(ex => ex.exerciseId === b.exerciseId)
    
    if (!exerciseA || !exerciseB) return 0
    
    // Define intensity order (high > medium > low)
    const intensityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
    const difficultyOrder = { 'advanced': 3, 'intermediate': 2, 'beginner': 1 }
    
    // First sort by intensity (descending)
    const intensityDiff = intensityOrder[exerciseB.intensity] - intensityOrder[exerciseA.intensity]
    if (intensityDiff !== 0) return intensityDiff
    
    // Then sort by difficulty (descending)
    const difficultyDiff = difficultyOrder[exerciseB.difficulty] - difficultyOrder[exerciseA.difficulty]
    if (difficultyDiff !== 0) return difficultyDiff
    
    // Finally sort by exercise name for consistency
    return exerciseA.name.localeCompare(exerciseB.name)
  })
})

// Computed property for workout name
const workoutName = computed(() => {
  if (!workoutData.value) return 'Custom Workout'
  
  // If the workout title is "Generated Workout", always show that
  if (workoutData.value.title === 'Generated Workout') {
    return 'Generated Workout'
  }
  
  // For routine-based workouts, show the routine name
  if (sourceType.value === 'routine' && workoutData.value.title) {
    return workoutData.value.title
  }
  
  // Fallback to workout title or default
  return workoutData.value.title || 'Custom Workout'
})

const endWorkoutForm = ref({
  perceivedIntensity: 'medium',
  mood: 'good',
  saveAsRoutine: false,
  routineTitle: ''
})

let timer = null

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const getExerciseName = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.name : 'Unknown Exercise'
}

const getExerciseDescription = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.description : ''
}

const getExerciseIntensity = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.intensity : 'Unknown'
}

const getExerciseDifficulty = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.difficulty : 'Unknown'
}

const startWorkout = async () => {
  starting.value = true
  try {
    const session = await WorkoutService.startWorkoutSession(
      sourceType.value, 
      sourceId.value, 
      workoutData.value
    )
    
    sessionId.value = session.sessionId
    isActive.value = true
    startTime.value = new Date()
    
    // start counting time
    timer = setInterval(() => {
      if (startTime.value) {
        elapsedTime.value = Math.floor((new Date() - startTime.value) / 1000)
      }
    }, 1000)
    
  } catch (error) {
    console.error('Error starting workout:', error)
    // You could add a toast notification here
  } finally {
    starting.value = false
  }
}

const endWorkout = async () => {
  ending.value = true
  try {
    // stop counting
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    
    // get exercise data ready
    const performedExercises = workoutData.value?.exercises?.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      targetSets: exercise.sets,
      targetReps: exercise.reps,
      targetRestSeconds: exercise.restSeconds,
      performedSets: []
    })) || []
    
    // finish the session
    await WorkoutService.endWorkoutSession(
      sessionId.value,
      endWorkoutForm.value.perceivedIntensity,
      endWorkoutForm.value.mood,
      '',
      performedExercises
    )
    
    // save it if they want to
    if (endWorkoutForm.value.saveAsRoutine) {
      const routineData = {
        title: endWorkoutForm.value.routineTitle || workoutData.value?.title || 'Custom Workout',
        goal: workoutData.value?.goal || 'general_fitness',
        estimatedTimeMinutes: workoutData.value?.estimatedTimeMinutes || 45,
        intendedIntensity: workoutData.value?.intendedIntensity || 'medium',
        exercises: workoutData.value?.exercises?.map(exercise => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds
        })) || []
      }
      
      await WorkoutService.createRoutine(routineData)
    }
    
    // go to progress page
    router.push('/progress')
  } catch (error) {
    console.error('Error ending workout:', error)
    // You could add a toast notification here
  } finally {
    ending.value = false
    showEndWorkoutModal.value = false
  }
}

const loadExercises = async () => {
  try {
    exercises.value = await WorkoutService.getExercises()
  } catch (error) {
    console.error('Error loading exercises:', error)
  }
}

onMounted(() => {
  loadExercises()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>


