<template>
  <div class="workout-generator">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-body p-3 p-md-4">
              <div class="row align-items-center">
                <div class="col-12 col-md-8">
                  <h2 class="mb-2 mb-md-1 text-dark text-break">
                    <i class="bi bi-lightning-charge me-2 text-primary"></i>Generate Your Workout
                  </h2>
                  <p class="text-muted mb-0 text-break">Create a personalized workout routine based on your preferences and fitness level</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Form -->
        <div class="col-12 col-lg-8">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 text-truncate">
                <i class="bi bi-gear me-2 text-primary"></i>Workout Preferences
              </h5>
            </div>
            <div class="card-body p-3 p-md-4">
            <form @submit.prevent="generateWorkout">
                <!-- Basic Settings -->
                <div class="row g-3 mb-4">
                  <div class="col-12 col-sm-6 col-lg-4">
                    <label for="timeMin" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-clock me-1"></i>Duration
                    </label>
                    <div class="input-group">
                  <input 
                    type="number" 
                    class="form-control" 
                    id="timeMin" 
                    v-model="workoutForm.timeMin"
                    min="10" 
                    max="120" 
                    required
                        placeholder="30"
                  >
                      <span class="input-group-text">min</span>
                    </div>
                </div>
                  <div class="col-12 col-sm-6 col-lg-4">
                    <label for="intensity" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-fire me-1"></i>Intensity
                    </label>
                  <select class="form-select" id="intensity" v-model="workoutForm.intensity" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                  <div class="col-12 col-sm-12 col-lg-4">
                    <label for="goal" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-trophy me-1"></i>Goal
                    </label>
                  <select class="form-select" id="goal" v-model="workoutForm.goal" required>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
              </div>
              
                <!-- Experience & Muscle Groups -->
                <div class="row g-3 mb-4">
                  <div class="col-12 col-md-6">
                    <label for="experienceLevel" class="form-label fw-semibold text-truncate">
                      <i class="bi bi-award me-1"></i>Experience Level
                    </label>
                    <select class="form-select" id="experienceLevel" v-model="workoutForm.experienceLevel" required>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                  </select>
                </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-semibold text-truncate">
                      <i class="bi bi-activity me-1"></i>Target Muscle Groups
                    </label>
                    <div class="muscle-groups-container">
                      <div class="row g-2">
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-chest" value="chest" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-chest">Chest</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-back" value="back" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-back">Back</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-shoulders" value="shoulders" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-shoulders">Shoulders</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-arms" value="arms" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-arms">Arms</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-legs" value="legs" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-legs">Legs</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-core" value="core" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-core">Core</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="muscle-cardio" value="cardio" v-model="workoutForm.muscleGroups">
                            <label class="form-check-label" for="muscle-cardio">Cardio</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Equipment -->
                <div class="row g-3 mb-4">
                  <div class="col-12">
                    <label class="form-label fw-semibold text-truncate">
                      <i class="bi bi-tools me-1"></i>Available Equipment
                    </label>
                    <div class="equipment-container">
                      <div class="row g-2">
                        <div class="col-6 col-sm-4 col-md-3">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="equipment-bodyweight" value="bodyweight" v-model="workoutForm.equipment">
                            <label class="form-check-label" for="equipment-bodyweight">Bodyweight</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4 col-md-3">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="equipment-dumbbells" value="dumbbells" v-model="workoutForm.equipment">
                            <label class="form-check-label" for="equipment-dumbbells">Dumbbells</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4 col-md-3">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="equipment-barbell" value="barbell" v-model="workoutForm.equipment">
                            <label class="form-check-label" for="equipment-barbell">Barbell</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4 col-md-3">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="equipment-bench" value="bench" v-model="workoutForm.equipment">
                            <label class="form-check-label" for="equipment-bench">Bench</label>
                          </div>
                        </div>
                        <div class="col-6 col-sm-4 col-md-3">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="equipment-pullup" value="pullup_bar" v-model="workoutForm.equipment">
                            <label class="form-check-label" for="equipment-pullup">Pull-up Bar</label>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

                <!-- Generate -->
                <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-if="!loading" class="bi bi-lightning-charge me-2"></i>
                    <span class="d-none d-sm-inline">{{ loading ? 'Generating Workout...' : 'Generate Workout' }}</span>
                    <span class="d-inline d-sm-none">{{ loading ? 'Generating...' : 'Generate' }}</span>
              </button>
                </div>
            </form>
          </div>
        </div>
      </div>
      
        <!-- Profile -->
        <div class="col-12 col-lg-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 text-truncate">
                <i class="bi bi-person-circle me-2 text-primary"></i>Your Profile
              </h5>
            </div>
            <div class="card-body p-3 p-md-4">
              <div v-if="userProfile">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="bi bi-award"></i>
                  </div>
                    <div class="stat-content">
                      <div class="stat-label">Experience</div>
                      <div class="stat-value text-truncate">{{ userProfile.experienceLevel === 'beginner' ? 'Beginner' : userProfile.experienceLevel === 'intermediate' ? 'Intermediate' : 'Advanced' }}</div>
                    </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="bi bi-trophy"></i>
                  </div>
                    <div class="stat-content">
                      <div class="stat-label">Fitness Goal</div>
                      <div class="stat-value text-truncate">{{ userProfile.goal === 'weight_loss' ? 'Weight Loss' : userProfile.goal === 'muscle_gain' ? 'Muscle Gain' : userProfile.goal === 'general_fitness' ? 'General Fitness' : userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1) }}</div>
                    </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="bi bi-clock-history"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Preferred Time</div>
                    <div class="stat-value">{{ userProfile.preferredTimeMin }} min</div>
                  </div>
                </div>
                
                <div class="stat-item mb-0">
                  <div class="stat-icon">
                    <i class="bi bi-fire"></i>
                  </div>
                    <div class="stat-content">
                      <div class="stat-label">Intensity Level</div>
                      <div class="stat-value text-truncate">{{ userProfile.preferredIntensity === 'low' ? 'Low' : userProfile.preferredIntensity === 'medium' ? 'Medium' : 'High' }}</div>
                    </div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <i class="bi bi-person-circle display-4 text-muted mb-3"></i>
                <p class="text-muted mb-3 text-break">Sign in to see your personalized stats</p>
                <router-link to="/profile" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-person-plus me-2"></i>Create Profile
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Workout -->
      <div v-if="generatedWorkout" class="row mt-4">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-white border-bottom">
              <div class="row align-items-center">
                <div class="col-12 col-md-8">
                  <h4 class="mb-1 text-dark text-break">
                    <i class="bi bi-check-circle me-2 text-success"></i>{{ generatedWorkout.routine.title }}
                  </h4>
                  <p class="text-muted mb-0 text-break">Your personalized workout is ready!</p>
    </div>
                <div class="col-12 col-md-4 mt-3 mt-md-0">
                  <div class="d-flex flex-column flex-sm-row gap-2">
                    <button class="btn btn-success flex-fill" @click="saveRoutine" :disabled="saving">
                      <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-if="!saving" class="bi bi-bookmark me-1"></i>
                      <span class="d-none d-sm-inline">{{ saving ? 'Saving...' : 'Save Routine' }}</span>
                      <span class="d-inline d-sm-none">{{ saving ? 'Saving...' : 'Save' }}</span>
            </button>
                    <button class="btn btn-primary flex-fill" @click="startWorkout">
                      <i class="bi bi-play-fill me-1"></i>
                      <span class="d-none d-sm-inline">Start Workout</span>
                      <span class="d-inline d-sm-none">Start</span>
            </button>
          </div>
        </div>
              </div>
            </div>
            <div class="card-body p-3 p-md-4">
              <!-- Summary -->
              <div class="row g-3 mb-4">
                <div class="col-6 col-sm-3">
                  <div class="stat-card">
                    <div class="stat-icon">
                      <i class="bi bi-clock"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ generatedWorkout.routine.totalTimeMin }}</div>
                      <div class="stat-label">Minutes</div>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="stat-card">
                    <div class="stat-icon">
                      <i class="bi bi-fire"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value text-truncate">{{ generatedWorkout.routine.intensity === 'low' ? 'Low' : generatedWorkout.routine.intensity === 'medium' ? 'Medium' : 'High' }}</div>
                      <div class="stat-label">Intensity</div>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="stat-card">
                    <div class="stat-icon">
                      <i class="bi bi-list-ul"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ generatedWorkout.routine.items.length }}</div>
                      <div class="stat-label">Exercises</div>
                    </div>
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="stat-card">
                    <div class="stat-icon">
                      <i class="bi bi-trophy"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value text-truncate">{{ generatedWorkout.routine.goal === 'weight_loss' ? 'Weight Loss' : generatedWorkout.routine.goal === 'muscle_gain' ? 'Muscle Gain' : generatedWorkout.routine.goal === 'general_fitness' ? 'General Fitness' : generatedWorkout.routine.goal.charAt(0).toUpperCase() + generatedWorkout.routine.goal.slice(1) }}</div>
                      <div class="stat-label">Goal</div>
            </div>
            </div>
            </div>
          </div>
          
              <!-- Exercises -->
              <div class="exercises-section">
                <h5 class="mb-3">
                  <i class="bi bi-list-check me-2"></i>Exercise Plan
                </h5>
          <div class="exercises-list">
                  <div 
              v-for="(item, index) in generatedWorkout.routine.items" 
              :key="index"
                    class="exercise-item mb-3"
                  >
                    <div class="card">
                      <div class="card-body p-3">
                        <div class="row align-items-center">
                          <div class="col-12 col-md-6 mb-3 mb-md-0">
                            <h6 class="mb-1 text-truncate">{{ getExerciseName(item.exerciseId) }}</h6>
                            <p class="text-muted mb-2 text-break">{{ getExerciseDescription(item.exerciseId) }}</p>
                            <div v-if="item.notes" class="mt-2">
                              <small class="text-info text-break">
                                <i class="bi bi-lightbulb me-1"></i>{{ item.notes }}
                              </small>
                            </div>
                          </div>
                          <div class="col-12 col-md-6">
                            <div class="row text-center g-2">
                              <div class="col-3">
                                <div class="fw-bold text-primary">{{ item.sets }}</div>
                                <small class="text-muted">Sets</small>
                              </div>
                              <div class="col-3">
                                <div class="fw-bold text-primary">{{ item.reps }}</div>
                                <small class="text-muted">Reps</small>
                              </div>
                              <div class="col-3">
                                <div class="fw-bold text-primary">{{ item.restTimeSec }}s</div>
                                <small class="text-muted">Rest</small>
                              </div>
                              <div class="col-3">
                                <div class="exercise-number">
                                  <span class="badge bg-primary">{{ index + 1 }}</span>
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
      </div>
    </div>

    <!-- Toast -->
    <div v-if="notification.show" class="notification-container">
      <div class="notification" :class="`notification-${notification.type}`">
        <i class="bi" :class="notification.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
        <span>{{ notification.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const userProfile = ref(null)
const generatedWorkout = ref(null)
const notification = ref({ show: false, message: '', type: 'success' })

const workoutForm = ref({
  timeMin: 30,
  intensity: 'medium',
  goal: 'general_fitness',
  experienceLevel: 'beginner',
  muscleGroups: [],
  equipment: []
})

// Load user data
const initializeForm = () => {
  if (userProfile.value) {
    workoutForm.value = {
      timeMin: userProfile.value.preferredTimeMin || 30,
      intensity: userProfile.value.preferredIntensity || 'medium',
      goal: userProfile.value.goal || 'general_fitness',
      experienceLevel: userProfile.value.experienceLevel || 'beginner',
      muscleGroups: [],
      equipment: []
    }
  }
}

// Toast messages
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

onMounted(async () => {
  userProfile.value = await AuthService.getCurrentUserProfile()
  initializeForm()
  loadDraftWorkout()
})

// Load draft workout state from localStorage
const loadDraftWorkout = () => {
  try {
    const draftKey = 'draftWorkoutState'
    const generatedKey = 'draftGeneratedWorkout'
    
    // Load draft workout form state
    const draftState = JSON.parse(localStorage.getItem(draftKey) || 'null')
    if (draftState) {
      workoutForm.value = { ...workoutForm.value, ...draftState }
    }
    
    // Load generated workout
    const generatedWorkoutData = JSON.parse(localStorage.getItem(generatedKey) || 'null')
    if (generatedWorkoutData) {
      generatedWorkout.value = generatedWorkoutData
    }
  } catch (error) {
    console.error('Error loading draft workout:', error)
  }
}

// Save draft workout state to localStorage
const saveDraftWorkout = () => {
  try {
    const draftKey = 'draftWorkoutState'
    const generatedKey = 'draftGeneratedWorkout'
    
    // Save workout form state
    localStorage.setItem(draftKey, JSON.stringify(workoutForm.value))
    
    // Save generated workout if it exists
    if (generatedWorkout.value) {
      localStorage.setItem(generatedKey, JSON.stringify(generatedWorkout.value))
    }
  } catch (error) {
    console.error('Error saving draft workout:', error)
  }
}

// Clear draft workout state
const clearDraftWorkout = () => {
  try {
    localStorage.removeItem('draftWorkoutState')
    localStorage.removeItem('draftGeneratedWorkout')
  } catch (error) {
    console.error('Error clearing draft workout:', error)
  }
}

// Watch for changes in workout form and save draft state
watch(workoutForm, () => {
  saveDraftWorkout()
}, { deep: true })

// Watch for changes in generated workout and save draft state
watch(generatedWorkout, () => {
  saveDraftWorkout()
}, { deep: true })

const generateWorkout = async () => {
  loading.value = true
  try {
    const result = await WorkoutService.generateWorkout(workoutForm.value)
    generatedWorkout.value = result
    showNotification('Workout generated successfully!', 'success')
  } catch (error) {
    console.error('Error generating workout:', error)
    showNotification('Failed to generate workout. Please try again.', 'error')
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
  
  saving.value = true
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
        restSeconds: item.restTimeSec
      }))
    }
    
    await WorkoutService.createRoutine(routineData)
    showNotification('Routine saved successfully!', 'success')
    clearDraftWorkout() // Clear draft state after successful save
  } catch (error) {
    console.error('Error saving routine:', error)
    showNotification('Failed to save routine. Please try again.', 'error')
  } finally {
    saving.value = false
  }
}

const startWorkout = () => {
  if (!generatedWorkout.value) return
  
  // Format workout data
  const workoutData = {
    title: generatedWorkout.value.routine.title,
    goal: generatedWorkout.value.routine.goal,
    estimatedTimeMinutes: generatedWorkout.value.routine.totalTimeMin,
    intendedIntensity: generatedWorkout.value.routine.intensity,
    exercises: generatedWorkout.value.routine.items.map(item => ({
      exerciseId: item.exerciseId,
      sets: item.sets,
      reps: item.reps,
      restSeconds: item.restTimeSec,
      completed: false
    }))
  }
  
  router.push({
    name: 'WorkoutTracking',
    query: {
      workoutData: JSON.stringify(workoutData),
      sourceType: 'generated',
      sourceId: generatedWorkout.value.routine.routineId
    }
  })
  
  clearDraftWorkout() // Clear draft state when starting workout
}

</script>


