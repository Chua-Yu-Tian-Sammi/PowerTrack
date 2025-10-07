<template>
  <div class="user-profile">
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h3><i class="bi bi-person-circle me-2"></i>User Profile</h3>
          </div>
          <div class="card-body">
            <div v-if="!userProfile" class="text-center py-4">
              <i class="bi bi-person-x display-1 text-muted"></i>
              <h4 class="mt-3">No Profile Found</h4>
              <p class="text-muted">Please sign in to view your profile</p>
              <button class="btn btn-primary" @click="showSignIn = true">
                <i class="bi bi-box-arrow-in-right me-1"></i>Sign In
              </button>
            </div>
            
            <div v-else>
              <form @submit.prevent="updateProfile">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="username" class="form-label">Username</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="username" 
                      v-model="profileForm.username"
                      required
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="profileForm.email"
                      disabled
                    >
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="experienceLevel" class="form-label">Experience Level</label>
                    <select class="form-select" id="experienceLevel" v-model="profileForm.experienceLevel" required>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label for="heightCm" class="form-label">Height (cm)</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="heightCm" 
                      v-model="profileForm.heightCm"
                      min="100" 
                      max="250" 
                      required
                    >
                  </div>
                  <div class="col-md-4">
                    <label for="weightKg" class="form-label">Weight (kg)</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="weightKg" 
                      v-model="profileForm.weightKg"
                      min="30" 
                      max="300" 
                      step="0.1" 
                      required
                    >
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="goal" class="form-label">Fitness Goal</label>
                    <select class="form-select" id="goal" v-model="profileForm.goal" required>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="strength">Strength</option>
                      <option value="general_fitness">General Fitness</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label for="preferredIntensity" class="form-label">Preferred Intensity</label>
                    <select class="form-select" id="preferredIntensity" v-model="profileForm.preferredIntensity" required>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label for="preferredTimeMin" class="form-label">Preferred Time (min)</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="preferredTimeMin" 
                      v-model="profileForm.preferredTimeMin"
                      min="10" 
                      max="180" 
                      required
                    >
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="submit" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button type="button" class="btn btn-outline-danger" @click="signOut">
                    <i class="bi bi-box-arrow-right me-1"></i>Sign Out
                  </button>
                </div>
              </form>
            </div>
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
              <div class="mb-3">
                <strong>BMI:</strong> {{ calculateBMI() }}
              </div>
              <div class="mb-3">
                <strong>Experience:</strong> {{ userProfile.experienceLevel }}
              </div>
              <div class="mb-3">
                <strong>Goal:</strong> {{ formatGoal(userProfile.goal) }}
              </div>
              <div class="mb-3">
                <strong>Preferred Time:</strong> {{ userProfile.preferredTimeMin }} min
              </div>
              <div class="mb-3">
                <strong>Intensity:</strong> {{ userProfile.preferredIntensity }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign In Modal -->
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

    <!-- Sign Up Modal -->
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
import { ref, onMounted, watch } from 'vue'
import { AuthService } from '../services/authService.js'

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
  // Listen for auth state changes
  AuthService.onAuthStateChanged(async (user) => {
    console.log('Auth state changed:', user?.uid)
    if (user) {
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
  
  // Also try to load profile on mount
  await loadUserProfile()
})

const loadUserProfile = async () => {
  try {
    console.log('Loading user profile...')
    const currentUser = AuthService.getCurrentUser()
    console.log('Current user:', currentUser?.uid)
    
    userProfile.value = await AuthService.getCurrentUserProfile()
    console.log('Loaded profile:', userProfile.value)
    
    if (userProfile.value) {
      profileForm.value = { ...userProfile.value }
      console.log('Profile form updated:', profileForm.value)
    } else {
      console.log('No profile found')
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

const updateProfile = async () => {
  saving.value = true
  try {
    await AuthService.updateProfile(profileForm.value)
    await loadUserProfile()
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    saving.value = false
  }
}

const signIn = async () => {
  signingIn.value = true
  try {
    const user = await AuthService.signIn(signInForm.value.email, signInForm.value.password)
    console.log('User signed in:', user.uid)
    
    // Wait a moment for auth state to update
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await loadUserProfile()
    showSignIn.value = false
    signInForm.value = { email: '', password: '' }
    
    alert('Signed in successfully!')
  } catch (error) {
    console.error('Error signing in:', error)
    alert('Failed to sign in. Please check your credentials.')
  } finally {
    signingIn.value = false
  }
}

const signUp = async () => {
  signingUp.value = true
  try {
    const user = await AuthService.signUp(signUpForm.value.email, signUpForm.value.password, {
      username: signUpForm.value.username,
      experienceLevel: signUpForm.value.experienceLevel,
      heightCm: signUpForm.value.heightCm,
      weightKg: signUpForm.value.weightKg,
      goal: signUpForm.value.goal,
      preferredIntensity: signUpForm.value.preferredIntensity,
      preferredTimeMin: signUpForm.value.preferredTimeMin
    })
    
    console.log('User signed up:', user.uid)
    
    // Wait a moment for the profile to be created
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Load the profile
    await loadUserProfile()
    
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
    
    alert('Account created successfully!')
  } catch (error) {
    console.error('Error signing up:', error)
    alert('Failed to create account. Please try again.')
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
</script>

<style scoped>
.modal {
  background-color: rgba(0,0,0,0.5);
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
