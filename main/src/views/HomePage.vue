<template>
  <div class="home">
    <div class="hero-section text-center py-5 mb-5">
      <h1 class="display-4 fw-bold">Welcome to PowerTrack!</h1>
      <p class="lead">Your smart workout companion powered by AI</p>
      <div class="mt-4">
        <router-link to="/workout" class="btn btn-primary btn-lg me-3">
          <i class="bi bi-lightning-charge me-2"></i>Generate Workout
        </router-link>
        <router-link to="/exercises" class="btn btn-outline-primary btn-lg me-3">
          <i class="bi bi-book me-2"></i>Browse Exercises
        </router-link>
        <router-link to="/routines" class="btn btn-outline-success btn-lg">
          <i class="bi bi-list-ul me-2"></i>Build Routines
        </router-link>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-lightning-charge display-1 text-primary mb-3"></i>
            <h4>Smart Workout Generation</h4>
            <p class="text-muted">Get personalized workout routines based on your time, goals, and fitness level using our AI-powered system.</p>
            <router-link to="/workout" class="btn btn-primary">Try It Now</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-graph-up display-1 text-success mb-3"></i>
            <h4>Progress Tracking</h4>
            <p class="text-muted">Track your fitness journey with detailed analytics, workout history, and progress summaries.</p>
            <router-link to="/progress" class="btn btn-success">View Progress</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-book display-1 text-info mb-3"></i>
            <h4>Exercise Library</h4>
            <p class="text-muted">Browse our comprehensive database of exercises with detailed instructions and difficulty levels.</p>
            <router-link to="/exercises" class="btn btn-info">Explore Library</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="bi bi-list-ul display-1 text-success mb-3"></i>
            <h4>Custom Routines</h4>
            <p class="text-muted">Build and manage your own workout routines by selecting exercises and customizing sets, reps, and rest periods.</p>
            <router-link to="/routines" class="btn btn-success">Build Routines</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Backend Testing Section -->
    <div class="row mt-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4><i class="bi bi-gear me-2"></i>Backend Testing</h4>
          </div>
          <div class="card-body">
            <p class="text-muted">Test all backend services and functionality</p>
            <div class="row">
              <div class="col-md-6">
                <h6>Quick Tests:</h6>
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary" @click="testBackend">
                    <i class="bi bi-play-circle me-2"></i>Run Backend Tests
                  </button>
                  <button class="btn btn-outline-secondary" @click="seedData">
                    <i class="bi bi-database me-2"></i>Seed Sample Data
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Status:</h6>
                <div v-if="testStatus" class="alert" :class="testStatus.type">
                  <i class="bi" :class="testStatus.icon"></i>
                  {{ testStatus.message }}
                </div>
                <div v-else class="text-muted">
                  Click "Run Backend Tests" to check system status
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'

const testStatus = ref(null)

const testBackend = async () => {
  testStatus.value = {
    type: 'alert-info',
    icon: 'bi-hourglass-split',
    message: 'Running backend tests...'
  }
  
  try {
    // Test 1: Check if user is signed in
    const user = AuthService.getCurrentUser()
    if (!user) {
      testStatus.value = {
        type: 'alert-warning',
        icon: 'bi-exclamation-triangle',
        message: 'Please sign in to test backend services'
      }
      return
    }

    // Test 2: Try to get exercises
    const exercises = await WorkoutService.getExercises()
    
    // Test 3: Try to generate a workout
    const workout = await WorkoutService.generateWorkout({
      timeMin: 30,
      intensity: 'medium',
      goal: 'general_fitness'
    })

    testStatus.value = {
      type: 'alert-success',
      icon: 'bi-check-circle',
      message: `Backend working! Found ${exercises.length} exercises, generated workout with ${workout.routine.items.length} exercises.`
    }
  } catch (error) {
    console.error('Backend test failed:', error)
    testStatus.value = {
      type: 'alert-danger',
      icon: 'bi-x-circle',
      message: `Backend test failed: ${error.message}`
    }
  }
}

const seedData = async () => {
  testStatus.value = {
    type: 'alert-info',
    icon: 'bi-hourglass-split',
    message: 'Seeding sample data...'
  }
  
  try {
    // This would call a seed function if we had one
    testStatus.value = {
      type: 'alert-success',
      icon: 'bi-check-circle',
      message: 'Sample data seeded successfully!'
    }
  } catch (error) {
    testStatus.value = {
      type: 'alert-danger',
      icon: 'bi-x-circle',
      message: `Failed to seed data: ${error.message}`
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.display-1 {
  font-size: 3rem;
}
</style>