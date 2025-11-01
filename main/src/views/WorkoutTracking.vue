<template>
  <div class="workout-tracking-apple">
    <!-- No workout available -->
    <div v-if="!workoutData" class="tracking-container">
      <div class="empty-state-card">
        <div class="empty-state-icon">
          <i class="bi bi-lightning-charge"></i>
        </div>
        <h3>No Workout Available</h3>
        <p>You need to generate a workout first before you can start tracking your session.</p>
        <router-link to="/workout" class="start-button" style="text-decoration: none;">
          Generate Workout
        </router-link>
      </div>
    </div>

    <!-- Workout available -->
    <div v-else class="tracking-container">
      <!-- Workout Header -->
      <Transition name="fade" appear>
        <div class="workout-header-card">
          <!-- Title -->
          <div class="mb-3">
            <h1 class="workout-title">{{ workoutName }}</h1>
          </div>
          
          <!-- Progress Bar -->
          <div 
            class="progress-bar-container" 
            :class="{ 'progress-bar-clickable': isRunningRoute && isActive }"
            @click="handleProgressBarClick"
            :title="isRunningRoute && isActive ? 'Click to set distance completed' : ''"
            style="margin-bottom: 0.75rem;"
          >
            <div 
              class="progress-bar-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>

          <!-- Distance and Timer (inline) -->
          <div class="d-flex align-items-center justify-content-between">
            <!-- Running Route: Distance Input -->
            <div v-if="isRunningRoute && isActive" style="display: flex; align-items: center; gap: 0.5rem;">
              <input
                type="number"
                v-model.number="trackedDistance"
                min="0"
                :max="runningRouteData?.distance || 0"
                step="0.01"
                style="width: 100px; padding: 0.375rem 0.5rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 0.5rem; background: #f3f3f5; font-size: 0.875rem;"
              />
              <span style="font-size: 0.875rem; opacity: 0.6;">km / {{ formatDistance(runningRouteData?.distance || 0) }}</span>
            </div>
            
            <!-- Regular Workout: Exercise Count -->
            <div v-else-if="!isRunningRoute" style="font-size: 0.875rem; opacity: 0.6;">
              {{ completedExercisesCount }} of {{ totalExercisesCount }} completed
            </div>
            
            <!-- Timer and Pause Button (always shown when active) -->
            <div v-if="isActive" class="d-flex align-items-center gap-2 timer-container">
              <div class="text-end">
                <div class="workout-timer" style="font-size: 1.5rem;">{{ formatTime(elapsedTime) }}</div>
                <div class="workout-timer-label">ELAPSED</div>
              </div>
              <button
                v-if="!isPaused"
                class="play-button"
                style="width: 2rem; height: 2rem; font-size: 0.875rem; background: rgba(0,0,0,0.1);"
                @click="pauseWorkout"
                title="Pause"
              >
                <i class="bi bi-pause-fill"></i>
              </button>
              <button
                v-else
                class="play-button"
                style="width: 2rem; height: 2rem; font-size: 0.875rem; background: #22c55e;"
                @click="resumeWorkout"
                title="Resume"
              >
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Start/End Workout Card -->
      <Transition name="fade" appear>
        <div class="start-workout-card">
          <div v-if="!isActive">
            <h5>Ready to start your {{ isRunningRoute ? 'run' : 'workout' }}?</h5>
            <p>Click "Start {{ isRunningRoute ? 'Run' : 'Workout' }}" when you're ready to begin tracking your session.</p>
              <button 
              class="start-button" 
                @click="startWorkout"
                :disabled="starting"
              >
              <span v-if="starting" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-play-fill"></i>
              Start {{ isRunningRoute ? 'Run' : 'Workout' }}
              </button>
          </div>
          <div v-else>
            <h5 style="color: #22c55e;">{{ isRunningRoute ? 'Run' : 'Workout' }} in Progress!</h5>
            <p>Keep up the great work! Click "End {{ isRunningRoute ? 'Run' : 'Workout' }}" when you're finished.</p>
              <button 
              class="end-button" 
                @click="showEndWorkoutModal = true"
              >
              <i class="bi bi-stop-fill"></i>
              End {{ isRunningRoute ? 'Run' : 'Workout' }}
              </button>
          </div>
        </div>
      </Transition>

      <!-- Running Route Map -->
      <Transition name="fade" appear v-if="isRunningRoute">
        <div class="map-card">
          <div class="map-header">
            <h5><i class="bi bi-map me-2"></i>Running Route Map</h5>
          </div>
          <div style="padding: 0;">
            <div v-if="mapLoading" class="d-flex align-items-center justify-content-center" style="height: 600px; background: #f8f9fa;">
              <div class="text-center">
                <div class="spinner-border mb-3" style="color: #030213;" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p style="opacity: 0.6; margin: 0;">Loading your running route...</p>
              </div>
            </div>
            <div v-else-if="mapError" class="d-flex align-items-center justify-content-center" style="height: 600px; background: #f8f9fa;">
              <div class="text-center">
                <i class="bi bi-exclamation-triangle" style="font-size: 3rem; opacity: 0.3; display: block; margin-bottom: 1rem;"></i>
                <p style="opacity: 0.6; margin-bottom: 1rem;">{{ mapError }}</p>
                <button class="start-button" style="background: #030213; padding: 0 1.5rem; height: 2.5rem;" @click="initializeRunningMap">
                  <i class="bi bi-arrow-clockwise"></i>
                  Retry
                </button>
              </div>
            </div>
            <div v-else id="running-map" style="height: 600px; width: 100%;"></div>
          </div>
        </div>
      </Transition>

      <!-- Exercise List -->
      <div v-if="!isRunningRoute">
        <TransitionGroup name="list" tag="div">
          <div 
            v-for="(exercise, index) in sortedExercises" 
            :key="exercise.exerciseId"
            class="exercise-item"
            :class="{ completed: exercise.completed }"
          >
            <div 
              class="exercise-checkbox"
              :class="{ checked: exercise.completed }"
              @click.stop="toggleExercise(index)"
            >
              <i v-if="exercise.completed" class="bi bi-check" style="font-size: 1.125rem; font-weight: bold;"></i>
            </div>
            
            <div class="d-flex align-items-center flex-grow-1" style="min-width: 0;">
              <span class="exercise-number">{{ index + 1 }}</span>
              <div 
                class="exercise-name"
                :class="{ completed: exercise.completed }"
              >
                {{ getExerciseName(exercise.exerciseId) }}
                            </div>
                          </div>

            <div class="exercise-stats">
              <div class="exercise-stat">
                <div class="exercise-stat-value">{{ exercise.sets }}</div>
                <div class="exercise-stat-label">SETS</div>
                        </div>
              <div class="exercise-stat">
                <div class="exercise-stat-value">{{ exercise.reps }}</div>
                <div class="exercise-stat-label">REPS</div>
                      </div>
              <div class="exercise-stat">
                <div class="exercise-stat-value">{{ exercise.restSeconds }}s</div>
                <div class="exercise-stat-label">REST</div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- End Workout Modal (for regular workouts) -->
    <Transition name="fade">
      <div v-if="showEndWorkoutModal && !isRunningRoute" class="user-profile-apple">
        <div class="apple-modal-backdrop" @click.self="showEndWorkoutModal = false">
          <div class="apple-modal">
            <div class="apple-modal-header">
              <h5 class="apple-modal-title">End Workout</h5>
              <button class="apple-modal-close" @click="showEndWorkoutModal = false">
                <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
              </button>
          </div>
            <div class="apple-modal-body">
              <div style="background: rgba(0, 123, 255, 0.08); border-left: 3px solid #007bff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: #030213;">Workout Summary</div>
                <div style="font-size: 0.875rem; opacity: 0.7;">
                  {{ workoutName }} • {{ formatTime(elapsedTime) }} • {{ completedExercisesCount }}/{{ totalExercisesCount }} exercises completed
              </div>
            </div>

              <div class="form-group mb-3">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <input 
                    type="checkbox" 
                    id="endSaveAsRoutine" 
                    v-model="saveAsRoutine"
                    style="width: 1.25rem; height: 1.25rem; cursor: pointer;"
                  >
                  <label for="endSaveAsRoutine" style="margin: 0; cursor: pointer; user-select: none;">
                Save this workout as a routine
              </label>
            </div>
                <div v-if="saveAsRoutine">
                  <label class="apple-label">Routine Title</label>
                  <input 
                    type="text" 
                    class="apple-input" 
                    v-model="routineTitle" 
                    placeholder="e.g., My Upper Body Workout"
                  >
            </div>
          </div>

              <div style="display: flex; gap: 0.75rem;">
                <button 
                  type="button" 
                  class="apple-input" 
                  style="flex: 1; height: 3rem; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; font-weight: 500;"
                  @click="showEndWorkoutModal = false"
                >
              Cancel
            </button>
            <button 
              type="button" 
                  class="apple-input"
                  style="flex: 1; height: 3rem; background: #ef4444; color: white; cursor: pointer; font-weight: 500; border: none;"
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
    </Transition>

    <!-- End Run Modal (for running routes) -->
    <Transition name="fade">
      <div v-if="showEndWorkoutModal && isRunningRoute" class="user-profile-apple">
        <div class="apple-modal-backdrop" @click.self="showEndWorkoutModal = false">
          <div class="apple-modal">
            <div class="apple-modal-header">
              <h5 class="apple-modal-title">End Run</h5>
              <button class="apple-modal-close" @click="showEndWorkoutModal = false">
                <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
              </button>
            </div>
            <div class="apple-modal-body">
              <div style="background: rgba(0, 123, 255, 0.08); border-left: 3px solid #007bff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: #030213;">Run Summary</div>
                <div style="font-size: 0.875rem; opacity: 0.7;">
                  {{ formatDistance(trackedDistance) }} • {{ formatTime(elapsedTime) }}
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem;">
                <button 
                  type="button" 
                  class="apple-input" 
                  style="flex: 1; height: 3rem; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; font-weight: 500;"
                  @click="showEndWorkoutModal = false"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  class="apple-input"
                  style="flex: 1; height: 3rem; background: #ef4444; color: white; cursor: pointer; font-weight: 500; border: none;"
                  @click="endWorkout"
                  :disabled="ending"
                >
                  <span v-if="ending" class="spinner-border spinner-border-sm me-2"></span>
                  End Run
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
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
const isPaused = ref(false)
const starting = ref(false)
const ending = ref(false)
const sessionId = ref(null)
const startTime = ref(null)
const resumeTime = ref(null) // Time when resumed (for pause/resume)
const pausedElapsedTime = ref(0) // Accumulated elapsed time when paused
const elapsedTime = ref(0)
const showEndWorkoutModal = ref(false)
const exercises = ref([])
const localExercises = ref([])
const trackedDistance = ref(0) // Distance tracked for running routes

// Running route specific variables
const mapLoading = ref(false)
const mapError = ref('')

// grab workout from props, url, or localStorage
const workoutData = computed(() => {
  if (props.workoutData) {
    return props.workoutData
  }
  
  if (route.query.workoutData) {
    try {
      const parsed = JSON.parse(route.query.workoutData)
      return parsed
    } catch (error) {
      console.error('Error parsing workout data:', error)
    }
  }
  
  if (!route.query.workoutData) {
    const savedData = WorkoutStateService.getCurrentWorkoutData()
    if (savedData.workoutData) {
      return savedData.workoutData
    }
  }
  
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
  if (props.sourceType) return props.sourceType
  if (route.query.sourceType) return route.query.sourceType
  if (!route.query.sourceType && !route.query.workoutData) {
    const savedData = WorkoutStateService.getCurrentWorkoutData()
    if (savedData.sourceType) return savedData.sourceType
  }
  return 'custom'
})

const sourceId = computed(() => {
  return props.sourceId || route.query.sourceId || null
})

const isRunningRoute = computed(() => {
  return sourceType.value === 'running-route'
})

const runningRouteData = computed(() => {
  if (!isRunningRoute.value) return {}
  
  if (route.query.routeData) {
    try {
      return JSON.parse(route.query.routeData)
    } catch (error) {
      console.error('Error parsing route data:', error)
    }
  }
  
  const savedData = WorkoutStateService.getCurrentWorkoutData()
  if (savedData.routeData) {
    return savedData.routeData
  }
  
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

const sortedExercises = computed(() => {
  if (!localExercises.value || localExercises.value.length === 0) return []
  
  return [...localExercises.value].sort((a, b) => {
    const exerciseA = exercises.value.find(ex => ex.exerciseId === a.exerciseId)
    const exerciseB = exercises.value.find(ex => ex.exerciseId === b.exerciseId)
    
    if (!exerciseA || !exerciseB) return 0
    
    const intensityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
    const difficultyOrder = { 'advanced': 3, 'intermediate': 2, 'beginner': 1 }
    
    const intensityDiff = intensityOrder[exerciseB.intensity] - intensityOrder[exerciseA.intensity]
    if (intensityDiff !== 0) return intensityDiff
    
    const difficultyDiff = difficultyOrder[exerciseB.difficulty] - difficultyOrder[exerciseA.difficulty]
    if (difficultyDiff !== 0) return difficultyDiff
    
    return exerciseA.name.localeCompare(exerciseB.name)
  })
})

const formatDistance = (distance) => {
  if (!distance && distance !== 0) return '0 km'
  if (distance >= 1) {
    return `${distance.toFixed(2)} km`
  } else {
    return `${Math.round(distance * 1000)} m`
  }
}

// Watch trackedDistance to ensure it doesn't exceed max distance
watch(trackedDistance, (newValue) => {
  if (isRunningRoute.value && runningRouteData.value.distance) {
    const maxDistance = runningRouteData.value.distance
    if (newValue > maxDistance) {
      trackedDistance.value = maxDistance
    } else if (newValue < 0) {
      trackedDistance.value = 0
    }
  }
})

const workoutName = computed(() => {
  if (isRunningRoute.value && runningRouteData.value.distance) {
    const distance = runningRouteData.value.distance
    return `${formatDistance(distance)} Route`
  }
  
  if (!workoutData.value) return 'Custom Workout'
  
  if (workoutData.value.title === 'Generated Workout') {
    return 'Generated Workout'
  }
  
  if (sourceType.value === 'routine' && workoutData.value.title) {
    return workoutData.value.title
  }
  
  return workoutData.value.title || 'Custom Workout'
})

const completedExercisesCount = computed(() => {
  if (!localExercises.value) return 0
  return localExercises.value.filter(exercise => exercise.completed).length
})

const totalExercisesCount = computed(() => {
  return localExercises.value?.length || 0
})

const progressPercentage = computed(() => {
  if (isRunningRoute.value) {
    const targetDistance = runningRouteData.value.distance || 1
    return Math.min((trackedDistance.value / targetDistance) * 100, 100)
  }
  if (totalExercisesCount.value === 0) return 0
  return (completedExercisesCount.value / totalExercisesCount.value) * 100
})

const saveAsRoutine = ref(false)
const routineTitle = ref('')

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

const toggleExercise = (index) => {
  // Get the exercise from sortedExercises
  const sortedExercise = sortedExercises.value[index]
  if (!sortedExercise) return
  
  // Find the actual exercise in localExercises and toggle it
  const actualExercise = localExercises.value.find(ex => ex.exerciseId === sortedExercise.exerciseId)
  if (actualExercise) {
    actualExercise.completed = !actualExercise.completed
  }
}

const handleProgressBarClick = (event) => {
  if (!isRunningRoute.value || !isActive.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
  
  const targetDistance = runningRouteData.value.distance || 1
  const calculatedDistance = percentage * targetDistance
  trackedDistance.value = Math.round(calculatedDistance * 100) / 100
}

const initializeRunningMap = async () => {
  if (!isRunningRoute.value) return
  
  mapLoading.value = true
  mapError.value = ''
  
  try {
    await mapsService.loadGoogleMaps()
    
    const routeData = runningRouteData.value
    
    const route = {
      coordinates: routeData.coordinates || {
        start: { lat: 40.7128, lng: -74.0060 },
        waypoints: [
          { lat: 40.7589, lng: -73.9851 }
        ]
      },
      distance: routeData.distance,
      routeType: routeData.routeType,
      description: routeData.description
    }
    
    const mapElement = document.getElementById('running-map')
    if (mapElement && mapElement.offsetParent !== null) {
      mapsService.initializeMapWithRoute(mapElement, route)
    } else {
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
    WorkoutStateService.clearActiveWorkout()
    
    sessionId.value = null
    isActive.value = false
    startTime.value = null
    elapsedTime.value = 0
    
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
    
    isPaused.value = false
    pausedElapsedTime.value = 0
    resumeTime.value = new Date()
    
    WorkoutStateService.saveWorkoutData(workoutData.value, sourceType.value, runningRouteData.value, trackedDistance.value)
    WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value, isPaused.value, pausedElapsedTime.value, resumeTime.value)
    
    timer = setInterval(() => {
      if (resumeTime.value && !isPaused.value) {
        elapsedTime.value = pausedElapsedTime.value + Math.floor((new Date() - resumeTime.value) / 1000)
        WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value, isPaused.value, pausedElapsedTime.value, resumeTime.value)
        // Also save tracked distance periodically
        if (isRunningRoute.value) {
          WorkoutStateService.saveWorkoutData(workoutData.value, sourceType.value, runningRouteData.value, trackedDistance.value)
        }
      }
    }, 1000)
    
  } catch (error) {
    console.error('Error starting workout:', error)
    sessionId.value = null
    isActive.value = false
    startTime.value = null
    elapsedTime.value = 0
  } finally {
    starting.value = false
  }
}

const pauseWorkout = () => {
  if (!isActive.value || isPaused.value) return
  
  isPaused.value = true
  pausedElapsedTime.value = elapsedTime.value
  resumeTime.value = null
  WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value, isPaused.value, pausedElapsedTime.value, resumeTime.value)
}

const resumeWorkout = () => {
  if (!isActive.value || !isPaused.value) return
  
  isPaused.value = false
  resumeTime.value = new Date()
  WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value, isPaused.value, pausedElapsedTime.value, resumeTime.value)
}

const endWorkout = async () => {
  ending.value = true
  try {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    
    let performedExercises = []
    let distance = undefined
    
    if (isRunningRoute.value) {
      // For running routes, use tracked distance
      distance = trackedDistance.value
    } else {
      // For regular workouts, use exercise completion
      performedExercises = localExercises.value.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      targetSets: exercise.sets || 0,
      targetReps: exercise.reps || 0,
      targetRestSeconds: exercise.restSeconds || 0,
      performedSets: []
      }))
    }

    await WorkoutService.endWorkoutSession(
      sessionId.value,
      undefined,
      distance,
      '',
      performedExercises
    )

    if (saveAsRoutine.value) {
      const routineData = {
        title: routineTitle.value || workoutData.value?.title || 'Custom Workout',
        goal: workoutData.value?.goal || 'general_fitness',
        estimatedTimeMinutes: workoutData.value?.estimatedTimeMinutes || 45,
        intendedIntensity: workoutData.value?.intendedIntensity || 'medium',
        exercises: localExercises.value.map(exercise => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds
        }))
      }
      await WorkoutService.createRoutine(routineData)
    }

    WorkoutStateService.clearActiveWorkout()
    sessionId.value = null
    isActive.value = false
    startTime.value = null
    elapsedTime.value = 0
    
    router.push('/progress')
  } catch (error) {
    console.error('Error ending workout:', error)
    alert('Failed to save workout.')
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
    const workoutData = WorkoutStateService.getCurrentWorkoutData()
    
    if (activeSessionData && activeSessionData.isActive && activeSessionData.sessionId) {
      const sessionStartTime = new Date(activeSessionData.startTime)
      const now = new Date()
      const hoursSinceStart = (now - sessionStartTime) / (1000 * 60 * 60)
      
      if (hoursSinceStart > 24) {
        console.log('Session too old, clearing state')
        WorkoutStateService.clearActiveWorkout()
        resetSessionState()
        return
      }
      
      sessionId.value = activeSessionData.sessionId
      isActive.value = activeSessionData.isActive
      startTime.value = sessionStartTime
      
      // Restore pause state
      isPaused.value = activeSessionData.isPaused || false
      pausedElapsedTime.value = activeSessionData.pausedElapsedTime || 0
      resumeTime.value = activeSessionData.resumeTime ? new Date(activeSessionData.resumeTime) : null
      
      // Restore tracked distance
      if (workoutData && workoutData.trackedDistance !== undefined) {
        trackedDistance.value = workoutData.trackedDistance
      }
      
      // Calculate elapsed time based on pause state
      if (isPaused.value) {
        elapsedTime.value = pausedElapsedTime.value
      } else if (resumeTime.value) {
        elapsedTime.value = pausedElapsedTime.value + Math.floor((now - resumeTime.value) / 1000)
      } else {
        elapsedTime.value = Math.floor((now - sessionStartTime) / 1000)
        pausedElapsedTime.value = 0
        resumeTime.value = now
      }
      
      timer = setInterval(() => {
        if (resumeTime.value && !isPaused.value) {
          elapsedTime.value = pausedElapsedTime.value + Math.floor((new Date() - resumeTime.value) / 1000)
        }
      }, 1000)
    } else {
      resetSessionState()
    }
  } catch (error) {
    console.error('Error restoring active session:', error)
    resetSessionState()
  }
}

const resetSessionState = () => {
  sessionId.value = null
  isActive.value = false
  isPaused.value = false
  startTime.value = null
  resumeTime.value = null
  pausedElapsedTime.value = 0
  elapsedTime.value = 0
  
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Watch for workoutData changes and sync to localExercises
watch(workoutData, (newData) => {
  if (newData && newData.exercises) {
    // Create a deep copy with completed property
    localExercises.value = newData.exercises.map(ex => ({
      ...ex,
      completed: ex.completed || false
    }))
  } else {
    localExercises.value = []
  }
}, { immediate: true, deep: true })

onMounted(() => {
  loadExercises()
  restoreActiveSession()
  
  if (isRunningRoute.value) {
    setTimeout(() => {
      initializeRunningMap()
    }, 100)
  }
})

watch(isRunningRoute, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      initializeRunningMap()
    }, 100)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  if (isActive.value && sessionId.value && startTime.value) {
    WorkoutStateService.saveActiveSession(sessionId.value, startTime.value, isActive.value, elapsedTime.value, isPaused.value, pausedElapsedTime.value, resumeTime.value)
    if (workoutData.value) {
      const updatedWorkoutData = {
        ...workoutData.value,
        exercises: localExercises.value.length > 0 ? localExercises.value : workoutData.value.exercises
      }
      WorkoutStateService.saveWorkoutData(updatedWorkoutData, sourceType.value, runningRouteData.value, trackedDistance.value)
    }
  }
})

// Watch for local exercise changes and sync to state
watch(localExercises, () => {
  if (workoutData.value && isActive.value) {
    const updatedWorkoutData = {
      ...workoutData.value,
      exercises: localExercises.value
    }
    WorkoutStateService.saveWorkoutData(updatedWorkoutData, sourceType.value, runningRouteData.value, trackedDistance.value)
  }
}, { deep: true })

// Watch for trackedDistance changes and save to state
watch(trackedDistance, (newValue) => {
  if (isRunningRoute.value && isActive.value && workoutData.value) {
    WorkoutStateService.saveWorkoutData(workoutData.value, sourceType.value, runningRouteData.value, newValue)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
