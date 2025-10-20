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

    <!-- Running Route Display -->
    <div v-if="isRunningRoute" class="row">
      <div class="col-12">
        <!-- Map Display -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom">
            <h5 class="mb-0">
              <i class="bi bi-map me-2 text-primary"></i>Running Route Map
            </h5>
          </div>
          <div class="card-body p-0" style="margin-bottom: 20px;">
            <div v-if="mapLoading" class="d-flex align-items-center justify-content-center" style="height: 600px;">
              <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Loading your running route...</p>
              </div>
            </div>
            <div v-else-if="mapError" class="d-flex align-items-center justify-content-center" style="height: 600px;">
              <div class="text-center">
                <i class="bi bi-exclamation-triangle display-1 text-muted mb-3"></i>
                <p class="text-muted">{{ mapError }}</p>
                <button class="btn btn-outline-primary btn-sm" @click="initializeRunningMap">
                  <i class="bi bi-arrow-clockwise me-1"></i>Retry
                </button>
              </div>
            </div>
            <div v-else id="running-map" style="height: 600px; width: 100%; margin-bottom: 20px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regular Workout Exercises Display -->
    <div v-else class="row">
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { WorkoutService } from '../services/workoutService.js'
import { mapsService } from '../services/mapsService.js'
import { WorkoutStateService } from '../services/workoutStateService.js'

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

// Running route specific variables
const mapLoading = ref(false)
const mapError = ref('')

// grab workout from props, url, or localStorage
const workoutData = computed(() => {
  // First check props
  if (props.workoutData) {
    return props.workoutData
  }
  
  // Then check URL query
  if (route.query.workoutData) {
    try {
      const parsed = JSON.parse(route.query.workoutData)
      return parsed
    } catch (error) {
      console.error('Error parsing workout data:', error)
    }
  }
  
  // Check state service for saved workout data ONLY if no URL data is provided
  // This prevents restoring old workout data when starting a new workout
  if (!route.query.workoutData) {
    const savedData = WorkoutStateService.getCurrentWorkoutData()
    if (savedData.workoutData) {
      return savedData.workoutData
    }
  }
  
  // Finally check localStorage for draft workout
  try {
    const draftWorkout = localStorage.getItem('draftGeneratedWorkout')
    if (draftWorkout) {
      const parsed = JSON.parse(draftWorkout)
      if (parsed && parsed.routine) {
        const workoutData = {
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
        return workoutData
      }
    }
  } catch (error) {
    console.error('Error loading draft workout:', error)
  }
  
  return null
})

const sourceType = computed(() => {
  // First check props
  if (props.sourceType) return props.sourceType
  
  // Then check URL query
  if (route.query.sourceType) return route.query.sourceType
  
  // Finally check saved state ONLY if no URL data is provided
  if (!route.query.sourceType && !route.query.workoutData) {
    const savedData = WorkoutStateService.getCurrentWorkoutData()
    if (savedData.sourceType) return savedData.sourceType
  }
  
  return 'custom'
})

const sourceId = computed(() => {
  return props.sourceId || route.query.sourceId || null
})

// Check if this is a running route workout
const isRunningRoute = computed(() => {
  return sourceType.value === 'running-route'
})

// Extract running route data from workout data or URL query
const runningRouteData = computed(() => {
  if (!isRunningRoute.value) return {}
  
  // First try to get route data from URL query
  if (route.query.routeData) {
    try {
      return JSON.parse(route.query.routeData)
    } catch (error) {
      console.error('Error parsing route data:', error)
    }
  }
  
  // Check state service for saved route data
  const savedData = WorkoutStateService.getCurrentWorkoutData()
  if (savedData.routeData) {
    return savedData.routeData
  }
  
  // Fallback to extracting from workout data
  if (workoutData.value) {
    const exercise = workoutData.value.exercises?.[0]
    if (exercise) {
      return {
        distance: exercise.distance,
        routeType: exercise.routeType,
        description: exercise.description,
        estimatedTime: exercise.duration,
        startLocation: 'Route Start Location'
      }
    }
  }
  
  return {}
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


const initializeRunningMap = async () => {
  if (!isRunningRoute.value) return
  
  mapLoading.value = true
  mapError.value = ''
  
  try {
    // Load Google Maps API if not already loaded
    await mapsService.loadGoogleMaps()
    
    // Get route data
    const routeData = runningRouteData.value
    
    // Use actual coordinates if available, otherwise use default coordinates
    const route = {
      coordinates: routeData.coordinates || {
        start: { lat: 40.7128, lng: -74.0060 }, // Default to NYC coordinates
        waypoints: [
          { lat: 40.7589, lng: -73.9851 }
        ]
      },
      distance: routeData.distance,
      routeType: routeData.routeType,
      description: routeData.description
    }
    
    // Initialize map with route
    const mapElement = document.getElementById('running-map')
    if (mapElement && mapElement.offsetParent !== null) {
      mapsService.initializeMapWithRoute(mapElement, route)
    } else {
      // Wait a bit and try again if element is not ready
      setTimeout(() => {
        const retryElement = document.getElementById('running-map')
        if (retryElement) {
          mapsService.initializeMapWithRoute(retryElement, route)
        }
      }, 500)
    }
  } catch (error) {
    console.error('Error initializing running map:', error)
    mapError.value = 'Unable to load the running route map. Please check your internet connection.'
  } finally {
    mapLoading.value = false
  }
}

const startWorkout = async () => {
  starting.value = true
  try {
    // Clear any existing session state before starting new workout
    // This ensures each workout is treated as separate, even if identical
    WorkoutStateService.clearActiveWorkout()
    
    // Reset session variables to ensure clean state
    sessionId.value = null
    isActive.value = false
    startTime.value = null
    elapsedTime.value = 0
    
    // Stop any existing timer
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    
    const session = await WorkoutService.startWorkoutSession(
      sourceType.value, 
      sourceId.value, 
      workoutData.value
    )
    
    sessionId.value = session.sessionId
    isActive.value = true
    startTime.value = new Date()
    
    // Save workout data and active session data when workout starts
    WorkoutStateService.saveWorkoutData(workoutData.value, sourceType.value, runningRouteData.value)
    WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value)
    
    // start counting time
    timer = setInterval(() => {
      if (startTime.value) {
        elapsedTime.value = Math.floor((new Date() - startTime.value) / 1000)
        // Update saved session data periodically
        WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value)
      }
    }, 1000)
    
  } catch (error) {
    console.error('Error starting workout:', error)
    // Reset state on error
    sessionId.value = null
    isActive.value = false
    startTime.value = null
    elapsedTime.value = 0
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
    
    // Clear ALL workout state when workout is completed
    // This ensures the next identical workout is treated as separate
    WorkoutStateService.clearActiveWorkout()
    
    // Reset all local state variables
    sessionId.value = null
    isActive.value = false
    startTime.value = null
    elapsedTime.value = 0
    
    // Reset form
    endWorkoutForm.value = {
      perceivedIntensity: 'medium',
      mood: 'good',
      saveAsRoutine: false,
      routineTitle: ''
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

const restoreActiveSession = () => {
  try {
    const activeSessionData = WorkoutStateService.getActiveWorkoutData()
    if (activeSessionData && activeSessionData.isActive && activeSessionData.sessionId) {
      // Check if session is not too old (e.g., more than 24 hours)
      const sessionStartTime = new Date(activeSessionData.startTime)
      const now = new Date()
      const hoursSinceStart = (now - sessionStartTime) / (1000 * 60 * 60)
      
      if (hoursSinceStart > 24) {
        // Session is too old, clear it
        console.log('Session too old, clearing state')
        WorkoutStateService.clearActiveWorkout()
        resetSessionState()
        return
      }
      
      // Only restore if the session is actually active and has a valid sessionId
      sessionId.value = activeSessionData.sessionId
      isActive.value = activeSessionData.isActive
      startTime.value = sessionStartTime
      
      // Calculate elapsed time correctly - just the time since the original start time
      elapsedTime.value = Math.floor((now - sessionStartTime) / 1000)
      
      // Restart the timer
      timer = setInterval(() => {
        if (startTime.value) {
          elapsedTime.value = Math.floor((new Date() - startTime.value) / 1000)
        }
      }, 1000)
    } else {
      // If no active session or session is not active, reset all session-related values
      resetSessionState()
    }
  } catch (error) {
    console.error('Error restoring active session:', error)
    // Reset values on error
    resetSessionState()
  }
}

const resetSessionState = () => {
  sessionId.value = null
  isActive.value = false
  startTime.value = null
  elapsedTime.value = 0
  
  // Clear any existing timer
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  loadExercises()
  
  // Restore active session if it exists
  restoreActiveSession()
  
  // Initialize running map if this is a running route
  if (isRunningRoute.value) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      initializeRunningMap()
    }, 100)
  }
})

// Watch for running route changes to initialize map
watch(isRunningRoute, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      initializeRunningMap()
    }, 100)
  }
})

// Save workout state when navigating away
onUnmounted(() => {
  // Clear any existing timer
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  // Save active session state if workout is active
  if (isActive.value && sessionId.value && startTime.value) {
    // Save both session data and workout data when navigating away from active workout
    WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value)
    if (workoutData.value) {
      WorkoutStateService.saveWorkoutData(workoutData.value, sourceType.value, runningRouteData.value)
    }
  }
})

// Watch for workout data changes and save to state only when starting a workout
watch([workoutData, sourceType, runningRouteData], ([newWorkoutData, newSourceType, newRouteData]) => {
  // Only save workout data when we have an active workout session
  if (newWorkoutData && newSourceType && isActive.value) {
    WorkoutStateService.saveWorkoutData(newWorkoutData, newSourceType, newRouteData)
  }
}, { deep: true })
</script>


