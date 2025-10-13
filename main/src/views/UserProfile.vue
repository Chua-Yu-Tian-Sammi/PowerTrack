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
              <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-primary" @click="showSignIn = true">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Sign In
                </button>
                <button v-if="AuthService.getCurrentUser()" class="btn btn-outline-primary" @click="createProfileForCurrentUser">
                  <i class="bi bi-person-plus me-1"></i>Create Profile
                </button>
                <button v-if="AuthService.getCurrentUser()" class="btn btn-outline-secondary" @click="debugFirestore">
                  <i class="bi bi-bug me-1"></i>Debug Firestore
                </button>
              </div>
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
import { ref, onMounted} from 'vue'
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
  console.log('UserProfile component mounted')
  
  // Listen for auth state changes
  AuthService.onAuthStateChanged(async (user) => {
    console.log('Auth state changed:', user ? 'User signed in' : 'User signed out')
    if (user) {
      console.log('User signed in, loading profile...')
      await loadUserProfile()
    } else {
      console.log('User signed out, clearing profile...')
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
  console.log('Loading profile on mount...')
  await loadUserProfile()
})

const loadUserProfile = async () => {
  try {
    console.log('Loading user profile...')
    const currentUser = AuthService.getCurrentUser()
    console.log('Current user:', currentUser)
    
    if (!currentUser) {
      console.log('No current user found')
      userProfile.value = null
      return
    }
    
    userProfile.value = await AuthService.getCurrentUserProfile()
    console.log('Loaded user profile:', userProfile.value)
    
    if (userProfile.value) {
      profileForm.value = { ...userProfile.value }
      console.log('Updated profile form:', profileForm.value)
    } else {
      console.log('No user profile found in database')
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
    console.log('Attempting to sign in...')
    await AuthService.signIn(signInForm.value.email, signInForm.value.password)
    console.log('Sign in successful')
    
    // Wait a moment for auth state to update
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Loading user profile after sign in...')
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
    console.log('Starting signup process...')
    const userData = {
      username: signUpForm.value.username,
      experienceLevel: signUpForm.value.experienceLevel,
      heightCm: signUpForm.value.heightCm,
      weightKg: signUpForm.value.weightKg,
      goal: signUpForm.value.goal,
      preferredIntensity: signUpForm.value.preferredIntensity,
      preferredTimeMin: signUpForm.value.preferredTimeMin
    }
    console.log('User data for signup:', userData)
    
    await AuthService.signUp(signUpForm.value.email, signUpForm.value.password, userData)
    console.log('Signup completed successfully')
    
    // Wait a moment for the profile to be created
    console.log('Waiting for profile creation...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Load the profile
    console.log('Loading profile after signup...')
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

const createProfileForCurrentUser = async () => {
  try {
    console.log('Creating profile for current user...')
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      alert('No user signed in')
      return
    }
    
    console.log('Current user UID:', currentUser.uid)
    
    // Create a default profile for the current user
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
    
    console.log('Creating profile with data:', defaultProfileData)
    await WorkoutService.createUserProfile(defaultProfileData)
    
    console.log('Profile created successfully, reloading...')
    await loadUserProfile()
    
    alert('Profile created successfully!')
  } catch (error) {
    console.error('Error creating profile:', error)
    alert('Failed to create profile: ' + error.message)
  }
}

const debugFirestore = async () => {
  try {
    console.log('=== FIRESTORE DEBUG ===')
    const currentUser = AuthService.getCurrentUser()
    console.log('Current user UID:', currentUser?.uid)
    
    // Import Firestore functions directly
    const { collection, getDocs, doc, getDoc, addDoc } = await import('firebase/firestore')
    const { db } = await import('@lib/firebase')
    
    console.log('Firestore instance:', db)
    console.log('Firestore app:', db.app)
    
    // First, let's test if we can write to Firestore
    console.log('Testing Firestore write...')
    try {
      const testDoc = await addDoc(collection(db, 'test'), { 
        message: 'Test connection', 
        timestamp: new Date() 
      })
      console.log('✅ Firestore write test successful:', testDoc.id)
    } catch (writeError) {
      console.error('❌ Firestore write test failed:', writeError)
    }
    
    // Check all users in the collection
    console.log('Checking all users in Firestore...')
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      console.log('Total users found:', usersSnapshot.docs.length)
      
      usersSnapshot.docs.forEach((docSnapshot, index) => {
        console.log(`User ${index}:`, {
          documentId: docSnapshot.id,
          uid: docSnapshot.data().uid,
          email: docSnapshot.data().email,
          username: docSnapshot.data().username,
          fullData: docSnapshot.data()
        })
      })
    } catch (readError) {
      console.error('❌ Firestore read test failed:', readError)
    }
    
    // Try to find the specific user
    if (currentUser?.uid) {
      console.log(`Looking for specific user with UID: ${currentUser.uid}`)
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        console.log('Direct document lookup result:', {
          exists: userDoc.exists(),
          data: userDoc.exists() ? userDoc.data() : null
        })
      } catch (docError) {
        console.error('❌ Document lookup failed:', docError)
      }
    }
    
    console.log('=== END FIRESTORE DEBUG ===')
  } catch (error) {
    console.error('❌ Error debugging Firestore:', error)
  }
}
</script>


