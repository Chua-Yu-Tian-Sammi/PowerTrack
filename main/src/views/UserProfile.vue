<template>
  <div class="user-profile">
    <!-- no profile yet -->
    <div v-if="!userProfile" class="empty-state">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card shadow-sm border-0">
            <div class="card-body text-center py-5">
              <div class="empty-icon mb-4">
                <i class="bi bi-person-circle"></i>
          </div>
              <h2 class="mb-3">Welcome to PowerTrack</h2>
              <p class="text-muted mb-4">Sign in to access your personalized fitness profile and start tracking your progress.</p>
              <div class="d-flex gap-3 justify-content-center flex-wrap">
                <button class="btn btn-primary btn-lg px-5" @click="showSignIn = true">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                </button>
                <button v-if="AuthService.getCurrentUser()" class="btn btn-outline-primary btn-lg px-5" @click="createProfileForCurrentUser">
                  <i class="bi bi-person-plus me-2"></i>Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
              </div>
            </div>
            
    <!-- show profile -->
            <div v-else>
      <!-- header with avatar and sign out -->
      <div class="profile-header mb-4">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="profile-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
              </div>
              <div class="col">
                <h2 class="mb-1 text-dark">{{ profileForm.username }}</h2>
                <p class="text-muted mb-0">
                  <i class="bi bi-envelope me-2"></i>{{ profileForm.email }}
                </p>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-outline-danger" @click="signOut">
                  <i class="bi bi-box-arrow-right me-2"></i>Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
                <!-- form on the left -->
        <div class="col-lg-8">
              <form @submit.prevent="updateProfile">
                    <!-- username and experience -->
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-person-badge me-2 text-primary"></i>Personal Information
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="username" class="form-label fw-semibold">
                      <i class="bi bi-person me-1"></i>Username
                    </label>
                    <input 
                      type="text" 
                      class="form-control form-control-lg" 
                      id="username" 
                      v-model="profileForm.username"
                      required
                      placeholder="Enter your username"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="experienceLevel" class="form-label fw-semibold">
                      <i class="bi bi-award me-1"></i>Experience Level
                    </label>
                    <select class="form-select form-select-lg" id="experienceLevel" v-model="profileForm.experienceLevel" required>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

                    <!-- height and weight -->
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-clipboard-data me-2 text-primary"></i>Body Metrics
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="heightCm" class="form-label fw-semibold">
                      <i class="bi bi-arrows-vertical me-1"></i>Height
                    </label>
                    <div class="input-group input-group-lg">
                    <input 
                      type="number" 
                      class="form-control" 
                      id="heightCm" 
                      v-model="profileForm.heightCm"
                      min="100" 
                      max="250" 
                      required
                        placeholder="175"
                    >
                      <span class="input-group-text">cm</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="weightKg" class="form-label fw-semibold">
                      <i class="bi bi-speedometer2 me-1"></i>Weight
                    </label>
                    <div class="input-group input-group-lg">
                    <input 
                      type="number" 
                      class="form-control" 
                      id="weightKg" 
                      v-model="profileForm.weightKg"
                      min="30" 
                      max="300" 
                      step="0.1" 
                      required
                        placeholder="70"
                    >
                      <span class="input-group-text">kg</span>
                    </div>
                  </div>
                </div>
                  </div>
                </div>

                    <!-- goals and workout prefs -->
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-bullseye me-2 text-primary"></i>Fitness Preferences
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="row g-3">
                  <div class="col-md-12">
                    <label for="goal" class="form-label fw-semibold">
                      <i class="bi bi-trophy me-1"></i>Primary Goal
                    </label>
                    <select class="form-select form-select-lg" id="goal" v-model="profileForm.goal" required>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="strength">Strength</option>
                      <option value="general_fitness">General Fitness</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="preferredIntensity" class="form-label fw-semibold">
                      <i class="bi bi-fire me-1"></i>Preferred Intensity
                    </label>
                    <select class="form-select form-select-lg" id="preferredIntensity" v-model="profileForm.preferredIntensity" required>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="preferredTimeMin" class="form-label fw-semibold">
                      <i class="bi bi-clock me-1"></i>Workout Duration
                    </label>
                    <div class="input-group input-group-lg">
                    <input 
                      type="number" 
                      class="form-control" 
                      id="preferredTimeMin" 
                      v-model="profileForm.preferredTimeMin"
                      min="10" 
                      max="180" 
                      required
                        placeholder="45"
                    >
                      <span class="input-group-text">min</span>
                    </div>
                  </div>
                </div>
                  </div>
                </div>

                    <!-- save changes -->
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-if="!saving" class="bi bi-check-circle me-2"></i>
                {{ saving ? 'Saving Changes...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>

                <!-- sidebar with bmi and stats -->
        <div class="col-lg-4">
                  <!-- bmi calculator -->
          <div class="card shadow-sm mb-4">
            <div class="card-header" :class="getBMIClass()">
              <h5 class="mb-0 bmi-header-text">
                <i class="bi bi-heart-pulse me-2"></i>Body Mass Index
              </h5>
            </div>
            <div class="card-body p-4 text-center">
              <div class="bmi-display mb-3">
                <div class="bmi-value">{{ calculateBMI() }}</div>
                <div class="bmi-label text-muted">BMI</div>
              </div>
              <div class="bmi-category">
                <span class="badge" :class="getBMICategoryBadge()">
                  {{ getBMICategory() }}
                </span>
              </div>
              <div class="bmi-info mt-3">
                <small class="text-muted">
                  Based on your height ({{ profileForm.heightCm }}cm) and weight ({{ profileForm.weightKg }}kg)
                </small>
          </div>
        </div>
      </div>
      
                  <!-- your current stats -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0">
                <i class="bi bi-graph-up me-2 text-primary"></i>Your Stats
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="bi bi-award"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Experience</div>
                  <div class="stat-value">{{ formatText(userProfile.experienceLevel) }}</div>
          </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="bi bi-trophy"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Fitness Goal</div>
                  <div class="stat-value">{{ formatGoal(userProfile.goal) }}</div>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Workout Time</div>
                  <div class="stat-value">{{ userProfile.preferredTimeMin }} min</div>
                </div>
              </div>
              
              <div class="stat-item mb-0">
                <div class="stat-icon">
                  <i class="bi bi-fire"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Intensity Level</div>
                  <div class="stat-value">{{ formatText(userProfile.preferredIntensity) }}</div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- login popup -->
    <div v-if="showSignIn" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sign In</h5>
            <button type="button" class="btn-close" @click="showSignIn = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="signIn">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="signInForm.email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="signInForm.password" required>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="signingIn">
                <span v-if="signingIn" class="spinner-border spinner-border-sm me-2"></span>
                {{ signingIn ? 'Signing In...' : 'Sign In' }}
              </button>
            </form>
            <div class="text-center mt-3">
              <p class="text-muted">Don't have an account? 
                <a href="#" @click="showSignUp = true; showSignIn = false">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- signup popup -->
    <div v-if="showSignUp" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sign Up</h5>
            <button type="button" class="btn-close" @click="showSignUp = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="signUp">
              <div class="mb-3">
                <label for="signupEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="signupEmail" v-model="signUpForm.email" required>
              </div>
              <div class="mb-3">
                <label for="signupPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="signupPassword" v-model="signUpForm.password" required>
              </div>
              <div class="mb-3">
                <label for="signupUsername" class="form-label">Username</label>
                <input type="text" class="form-control" id="signupUsername" v-model="signUpForm.username" required>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="signupHeight" class="form-label">Height (cm)</label>
                  <input type="number" class="form-control" id="signupHeight" v-model="signUpForm.heightCm" required>
                </div>
                <div class="col-md-6">
                  <label for="signupWeight" class="form-label">Weight (kg)</label>
                  <input type="number" class="form-control" id="signupWeight" v-model="signUpForm.weightKg" required>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="signupGoal" class="form-label">Fitness Goal</label>
                  <select class="form-select" id="signupGoal" v-model="signUpForm.goal" required>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="signupExperience" class="form-label">Experience Level</label>
                  <select class="form-select" id="signupExperience" v-model="signUpForm.experienceLevel" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="signingUp">
                <span v-if="signingUp" class="spinner-border spinner-border-sm me-2"></span>
                {{ signingUp ? 'Creating Account...' : 'Sign Up' }}
              </button>
            </form>
            <div class="text-center mt-3">
              <p class="text-muted">Already have an account? 
                <a href="#" @click="showSignIn = true; showSignUp = false">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { AuthService } from '../services/authService.js'
import { WorkoutService } from '../services/workoutService.js'

const userProfile = ref(null)
const saving = ref(false)
const signingIn = ref(false)
const signingUp = ref(false)
const showSignIn = ref(false)
const showSignUp = ref(false)

const profileForm = ref({
  username: '',
  email: '',
  experienceLevel: 'beginner',
  heightCm: 175,
  weightKg: 70,
  goal: 'general_fitness',
  preferredIntensity: 'medium',
  preferredTimeMin: 45
})

const signInForm = ref({
  email: '',
  password: ''
})

const signUpForm = ref({
  email: '',
  password: '',
  username: '',
  heightCm: 175,
  weightKg: 70,
  goal: 'general_fitness',
  experienceLevel: 'beginner',
  preferredIntensity: 'medium',
  preferredTimeMin: 45
})

onMounted(async () => {
  AuthService.onAuthStateChanged(async (user) => {
    if (user) {
      // Add a small delay to ensure profile is created in Firestore
      await new Promise(resolve => setTimeout(resolve, 500))
      await loadUserProfile()
    } else {
      userProfile.value = null
      profileForm.value = {
        username: '',
        email: '',
        experienceLevel: 'beginner',
        heightCm: 175,
        weightKg: 70,
        goal: 'general_fitness',
        preferredIntensity: 'medium',
        preferredTimeMin: 45
      }
    }
  })
  
  await loadUserProfile()
})

const loadUserProfile = async () => {
  try {
    const currentUser = AuthService.getCurrentUser()
    
    if (!currentUser) {
      userProfile.value = null
      return
    }
    
    userProfile.value = await AuthService.getCurrentUserProfile()
    
    if (userProfile.value) {
      profileForm.value = { ...userProfile.value }
    } else {
      
      userProfile.value = null
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    userProfile.value = null
  }
}

const updateProfile = async () => {
  saving.value = true
  try {
    await AuthService.updateProfile(profileForm.value)
    await loadUserProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    saving.value = false
  }
}

const signIn = async () => {
  signingIn.value = true
  try {
    await AuthService.signIn(signInForm.value.email, signInForm.value.password)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await loadUserProfile()
    showSignIn.value = false
    signInForm.value = { email: '', password: '' }
  } catch (error) {
    console.error('Error signing in:', error)
  } finally {
    signingIn.value = false
  }
}

const signUp = async () => {
  signingUp.value = true
  try {
    const userData = {
      username: signUpForm.value.username,
      experienceLevel: signUpForm.value.experienceLevel,
      heightCm: signUpForm.value.heightCm,
      weightKg: signUpForm.value.weightKg,
      goal: signUpForm.value.goal,
      preferredIntensity: signUpForm.value.preferredIntensity,
      preferredTimeMin: signUpForm.value.preferredTimeMin
    }
    
    await AuthService.signUp(signUpForm.value.email, signUpForm.value.password, userData)
    
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    
    await loadUserProfile()
    
    // Only hide signup form if profile loaded successfully
    if (userProfile.value) {
      showSignUp.value = false
      signUpForm.value = {
        email: '',
        password: '',
        username: '',
        heightCm: 175,
        weightKg: 70,
        goal: 'general_fitness',
        experienceLevel: 'beginner',
        preferredIntensity: 'medium',
        preferredTimeMin: 45
      }
    }
  } catch (error) {
    console.error('Error signing up:', error)
  } finally {
    signingUp.value = false
  }
}

const signOut = async () => {
  try {
    await AuthService.signOut()
    userProfile.value = null
    profileForm.value = {
      username: '',
      email: '',
      experienceLevel: 'beginner',
      heightCm: 175,
      weightKg: 70,
      goal: 'general_fitness',
      preferredIntensity: 'medium',
      preferredTimeMin: 45
    }
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const calculateBMI = () => {
  if (!userProfile.value) return 0
  const heightM = userProfile.value.heightCm / 100
  const bmi = userProfile.value.weightKg / (heightM * heightM)
  return Math.round(bmi * 10) / 10
}

const formatGoal = (goal) => {
  return goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatText = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const getBMICategory = () => {
  const bmi = calculateBMI()
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal Weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

const getBMIClass = () => {
  const bmi = calculateBMI()
  if (bmi < 18.5) return 'bg-info'
  if (bmi < 25) return 'bg-success'
  if (bmi < 30) return 'bg-warning'
  return 'bg-danger'
}

const getBMICategoryBadge = () => {
  const bmi = calculateBMI()
  if (bmi < 18.5) return 'bg-info'
  if (bmi < 25) return 'bg-success'
  if (bmi < 30) return 'bg-warning'
  return 'bg-danger'
}

const createProfileForCurrentUser = async () => {
  try {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      return
    }
    
    const defaultProfileData = {
      uid: currentUser.uid,
      email: currentUser.email,
      username: currentUser.email?.split('@')[0] || 'User',
      experienceLevel: 'beginner',
      heightCm: 175,
      weightKg: 70,
      goal: 'general_fitness',
      preferredIntensity: 'medium',
      preferredTimeMin: 45
    }
    
    await WorkoutService.createUserProfile(defaultProfileData)
    await loadUserProfile()
  } catch (error) {
    console.error('Error creating profile:', error)
  }
}
</script>
